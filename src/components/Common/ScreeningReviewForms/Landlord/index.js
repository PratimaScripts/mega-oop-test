import React, { useState } from "react";
import get from "lodash/get";
import ProfileInfoSection from "../ProfileInfoSection";
import { useQuery } from "@apollo/react-hooks";

import PersonaQueries from "../../../../config/queries/personas";
import ScreeningQuery from "../../../../config/queries/screening";
import Notification from "../../../../config/Notification";
import PersonaProfile from "../Personas/Landlord";
import { withRouter } from "react-router-dom";
import "../styles.scss";
import AdminQueries from "config/queries/admin";

const ScreeningReview = props => {
  const [isAnyFieldOpen, setOpenFields] = useState([]);
  let isOriginCorrect = localStorage.getItem("isOriginCorrect");
  const [propertiesToVerify, setVerifiableProperties] = useState([]);

  const setCheckedProperties = properties => {
    setVerifiableProperties(properties);
  };

  const { data: accrediationsList, loading } = useQuery(
    AdminQueries.fetchAccreditation
  );

  const createScreeningOrder = async data => {
    let createOrder = await props.client.mutate({
      mutation: ScreeningQuery.createScreeningOrder,
      variables: { type: "Self", invite: [], propertiesId: propertiesToVerify }
    });

    if (get(createOrder, "data.createInvitation.success")) {
      Notification(
        "success",
        "Screening Order Placed!",
        "We will get back to you around 2 days"
      );
      localStorage.removeItem("isOriginCorrect");

      window.location.href = `/landlord/screening`;
    } else {
      Notification(
        "error",
        "An Error Occured",
        get(createOrder, "data.createInvitation.message")
      );
    }
  };

  const setOpenFieldsMain = test => {
    let data = isAnyFieldOpen;
    data.push(test);
    setOpenFields(data);
  };

  switch (isOriginCorrect) {
    case "true":
      return (
        <>
          <div className="main__container_about">
            <ProfileInfoSection
              setCheckedProperties={setCheckedProperties}
              setOpenFields={setOpenFieldsMain}
              {...props}
            />

            <PersonaProfile
              accreditationsDropdownData={loading
                ? []
                : get(
                  accrediationsList,
                  "data.getAccreditation.data.accreditations"
                )}
              setOpenFields={setOpenFieldsMain}
              createScreeningOrder={createScreeningOrder}
              PersonaQueries={PersonaQueries}
              {...props}
            />
          </div>
        </>
      );

    case "false":
      props.history.push("/landlord/screening");
      break;

    default:
      return <p>Loading...</p>;
  }
};

export default withRouter(ScreeningReview);
