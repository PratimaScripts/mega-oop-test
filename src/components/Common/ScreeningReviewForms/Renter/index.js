import React, { useState } from "react";
import get from "lodash/get";
import { useQuery } from "@apollo/react-hooks";

import ProfileInfoSection from "../ProfileInfoSection";
import PersonaQueries from "../../../../config/queries/personas";
import ScreeningQuery from "../../../../config/queries/screening";
import Notification from "../../../../config/Notification";
import PersonaProfile from "../Personas/Renter";
import { withRouter } from "react-router-dom";
import "../styles.scss";
import AdminQueries from "config/queries/admin";

const ScreeningReview = props => {
  let isOriginCorrect = localStorage.getItem("isOriginCorrect");
  const [AccreditationData, setAccreditationData] = useState([]);
  useQuery(
    AdminQueries.fetchAccreditation, {
    onCompleted: ({ accrediationsList }) => setAccreditationData(get(
      accrediationsList,
      "data.getAccreditation.data.accreditations"
    ))
  }
  );

  const createScreeningOrder = async data => {
    let createOrder = await props.client.mutate({
      mutation: ScreeningQuery.createScreeningOrder,
      variables: { type: "Self", invite: [], propertiesId: [] }
    });

    if (get(createOrder, "data.createInvitation.success")) {
      Notification(
        "success",
        "Screening Order Placed!",
        "We will get back to you around 2 days"
      );
      localStorage.removeItem("isOriginCorrect");

      window.location.href = "/renter/screening";
    } else {
      Notification(
        "error",
        "An Error Occured",
        get(createOrder, "data.createInvitation.message")
      );
    }
  };

  switch (isOriginCorrect) {
    case "true":
      return (
        <>
          <div className="main__container_about">
            <ProfileInfoSection {...props} />

            <PersonaProfile
              accreditationsDropdownData={AccreditationData}
              createScreeningOrder={createScreeningOrder}
              PersonaQueries={PersonaQueries}
              {...props}
            />
          </div>
        </>
      );

    case "false":
      props.history.push("/renter/screening");
      break;

    default:
      return <p>Loading...</p>;
  }
};

export default withRouter(ScreeningReview);
