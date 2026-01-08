import React, { useState } from "react";
import get from "lodash/get";
import ProfileInfoSection from "../ProfileInfoSection";
import { useQuery } from "@apollo/react-hooks";
import PersonaQueries from "../../../../config/queries/personas";
import PersonaProfile from "../Personas/ServicePro";
import ScreeningQuery from "../../../../config/queries/screening";
import Notification from "../../../../config/Notification";
import AdminQueries from "config/queries/admin";
import { Steps, Button, message } from "antd";
import "./styles.scss";

const { Step } = Steps;

const ScreeningReview = (props) => {
  const [current, setCurrent] = useState(0);

  const onChange = (current) => {
    setCurrent(current);
  };

  let isOriginCorrect = localStorage.getItem("isOriginCorrect");
  const [AccreditationData, setAccreditationData] = useState([]);

  useQuery(AdminQueries.fetchAccreditation, {
    onCompleted: ({ accrediationsList }) =>
      setAccreditationData(
        get(accrediationsList, "data.getAccreditation.data.accreditations")
      ),
  });
  const createScreeningOrder = async (data) => {
    let createOrder = await props.client.mutate({
      mutation: ScreeningQuery.createScreeningOrder,
      variables: { type: "Self", invite: [], propertiesId: [] },
    });

    if (get(createOrder, "data.createInvitation.success")) {
      Notification(
        "success",
        "Screening Order Placed!",
        "We will get back to you around 2 days"
      );
      localStorage.removeItem("isOriginCorrect");
      window.location.href = `/servicepro/dashboard`;
    } else {
      Notification(
        "error",
        "An Error Occured",
        get(createOrder, "data.createInvitation.message")
      );
    }
  };

  const steps = [
    {
      title: "About You",
      description: "Profile Infos",
      content: <ProfileInfoSection {...props} />,
    },
    {
      title: "Social Connect",
      description: "Social Connect Form",
      content: (
        <PersonaProfile
          createScreeningOrder={createScreeningOrder}
          accreditationsDropdownData={AccreditationData}
          PersonaQueries={PersonaQueries}
          {...props}
        />
      ),
    },
    {
      title: "Bank Account",
      description: "Bank Account Form",
      content: (
        <PersonaProfile
          createScreeningOrder={createScreeningOrder}
          accreditationsDropdownData={AccreditationData}
          PersonaQueries={PersonaQueries}
          {...props}
        />
      ),
    },
    {
      title: "Persona Profile",
      description: "Persona Profile Form",
      content: (
        <PersonaProfile
          createScreeningOrder={createScreeningOrder}
          accreditationsDropdownData={AccreditationData}
          PersonaQueries={PersonaQueries}
          {...props}
        />
      ),
    },
    {
      title: "Document",
      description: "Document Form",
      content: (
        <PersonaProfile
          createScreeningOrder={createScreeningOrder}
          accreditationsDropdownData={AccreditationData}
          PersonaQueries={PersonaQueries}
          {...props}
        />
      ),
    },
  ];

  switch (isOriginCorrect) {
    case "true":
      return (
        <>
          <h4 className="screening__heading">
            Review your detail and update required info
          </h4>
          <p className="screening__subheading">
            You have provided following info as part of registration, however it
            is important for you to review those detail and make any correction
            as this is final opportunity and later changes are not allowed when
            referencing in under-process. These information will be verified
            through external 3rd party agencies and credit bureau (such as; land
            registry, Equifax, Experian, TransUnion)
          </p>

          <div className="row col-12 mt-3">
            <div className="col-3">
              <Steps current={current} onChange={onChange} direction="vertical">
                {steps.map((item) => (
                  <Step
                    key={item.title}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </Steps>
            </div>

            <div className="col-9">
              <div className="steps-content">{steps[current].content}</div>
              {/* {steps.map((item) => (
                <div
                  className={`steps-content ${
                    item.step !== current + 1 && "hidden"
                  }`}
                >
                  {item.content}
                </div>
              ))} */}
            </div>
          </div>

          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => setCurrent((current) => current + 1)}
              >
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )}
            {current > 0 && (
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => setCurrent((current) => current - 1)}
              >
                Previous
              </Button>
            )}
          </div>

          {/* <ProfileInfoSection {...props} />

          <PersonaProfile
            createScreeningOrder={createScreeningOrder}
            accreditationsDropdownData={AccreditationData}
            PersonaQueries={PersonaQueries}
            {...props}
          /> */}
        </>
      );

    case "false":
      props.history.push("/servicepro/screening");
      break;

    default:
      props.history.push("/servicepro/screening");
  }
};

export default ScreeningReview;
