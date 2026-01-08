/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NProgress from "nprogress";
import {
  Steps,
  // Button, message
} from "antd";

import Profession from "./ServicePersonaSteps/Profession";
import Accredition from "./ServicePersonaSteps/Accredition";
import Documents from "./ServicePersonaSteps/Documents";
import OtherInformation from "./ServicePersonaSteps/OtherInformation";
import ReferencesContacts from "./ServicePersonaSteps/ReferenceContacts";
import { withRouter } from "react-router-dom";
import showNotification from "config/Notification";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import LandlordPersonaSchema from "config/FormSchemas/LandlordPersona";
import PersonaQueries from "config/queries/personas";
import isEmpty from "lodash/isEmpty";

// import PropertyQueries from "config/queries/property";

import get from "lodash/get";
import "./styles.scss";
import { LoadingOutlined } from "@ant-design/icons";
const { Step } = Steps;

const ServiceProPersona = (props) => {
  // const { dispatch: interfaceDispatch } = useContext(InterfaceContext)

  // const visitedTabs = useRef([0]);
  const [accrediations, setAccrediations] = useState({
    accrediations: [
      {
        organization: "",
        documentNumber: "",
        validTillDate: new Date(),
      },
    ],
  });
  const [serviceOrSkillTags, setServiceOrSkillTags] = useState([]);
  const [professionFromData, setProfressionFormData] = useState({
    companyName: "",
    UTR: "",
    startDate: new Date(),
    VAT: "",
  });
  const [referenceContacts, setReferenceContacts] = useState({
    referenceContacts: [
      { contactName: "", email: "", phoneNumber: "", countryCode: "" },
    ],
  });
  const [initialOtherInformationData, setInitialOtherInformationData] =
    useState({
      otherInformation: [{ providerName: "", validTillDate: new Date() }],
    });
  const [supportingDocuments, setSupportingDocuments] = useState({
    supportingDocuments: [{ documentNumber: "", documentUrl: "" }],
  });
  const [tabHeader, setTabHeader] = useState("Professional Info");

  const professionRef = useRef();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchServiceProPersonaQuery();

    //eslint-disable-next-line
  }, []);

  const [updateProfessionMutation] = useMutation(
    PersonaQueries.ServiceProPersona,
    {
      onCompleted: ({ updateServiceProviderPersonaInformation }) => {
        if (updateServiceProviderPersonaInformation.success) {
          showNotification("success", "Professional Persona updated");
          // props.setActiveTab(1)
        } else {
          showNotification(
            "error",
            "Failed to update Professional Persona updated",
            updateServiceProviderPersonaInformation.message ||
              "Something went wrong"
          );
        }
        NProgress.done();
      },
      onError: (error) => {
        NProgress.done();
        showNotification(
          "error",
          "Not able to update persona settings",
          "Reload the page and Try again"
        );
      },
    }
  );

  const updateProfessionData = async (data) => {
    NProgress.start();
    const variables = {
      profession: professionFromData,
      serviceOrSkillTags: serviceOrSkillTags,
      accreditation: accrediations.accrediations,
      referenceContacts: referenceContacts.referenceContacts,
      otherInformation: initialOtherInformationData.otherInformation,
      ...supportingDocuments,
      ...data,
    };

    await updateProfessionMutation({ variables });
  };

  const [fetchServiceProPersonaQuery, { loading }] = useLazyQuery(
    PersonaQueries.fetchServiceProPersona,
    {
      onCompleted: ({ getServiceProviderPersonaInformation }) => {
        if (
          !isEmpty(getServiceProviderPersonaInformation) &&
          get(getServiceProviderPersonaInformation, "success", false)
        ) {
          let personaData = get(getServiceProviderPersonaInformation, "data");
          updatePersonaData(personaData);
        }
      },
    }
  );

  const updatePersonaData = async (personaData) => {
    !isEmpty(personaData.profession) &&
      setProfressionFormData(personaData.profession);
    !isEmpty(personaData.accreditation) &&
      setAccrediations({ accrediations: personaData.accreditation });
    !isEmpty(personaData.supportingDocuments) &&
      setSupportingDocuments({
        supportingDocuments: personaData.supportingDocuments,
      });
    !isEmpty(personaData.referenceContacts) &&
      setReferenceContacts({
        referenceContacts: personaData.referenceContacts,
      });
    !isEmpty(personaData.otherInformation) &&
      setInitialOtherInformationData({
        otherInformation: personaData.otherInformation,
      });
    !isEmpty(personaData.serviceOrSkillTags) &&
      setServiceOrSkillTags(personaData.serviceOrSkillTags);
  };

  const onTabChange = (current) => {
    if (
      !professionFromData.profession ||
      serviceOrSkillTags.length === 0 ||
      !professionFromData.businessType
    ) {
      showNotification(
        "info",
        "Please provide required info at this step first",
        ""
      );
    } else {
      setActiveTab(current);
      setTabHeader(steps[current].title);
    }
  };

  const steps = [
    {
      title: "Profession",
      content: (
        <Profession
          onTabChange={onTabChange}
          activeTab={activeTab}
          loading={loading}
          professionRef={professionRef}
          saveProfessionData={setProfressionFormData}
          ProfessionFormData={professionFromData}
          LandlordPersonaSchema={LandlordPersonaSchema}
          // accountSetting={this.props.accountSetting}
          serviceOrSkillTags={serviceOrSkillTags}
          updateSkillTags={setServiceOrSkillTags}
          updateProfessionData={updateProfessionData}
        />
      ),
    },
    {
      title: "Accreditations",
      content: (
        <Accredition
          onTabChange={onTabChange}
          activeTab={activeTab}
          setAccrediationData={setAccrediations}
          accrediations={accrediations}
          LandlordPersonaSchema={LandlordPersonaSchema}
          updateProfessionData={updateProfessionData}
        />
      ),
    },
    {
      title: "References",
      content: (
        <ReferencesContacts
          referenceContacts={referenceContacts}
          setReferencesContacts={setReferenceContacts}
          updateProfessionData={updateProfessionData}
          onTabChange={onTabChange}
          activeTab={activeTab}
          setTabHeader={setTabHeader}
        />
      ),
    },
    {
      title: "Documents",
      content: (
        <Documents
          setSupportingDocuments={setSupportingDocuments}
          updateProfessionData={updateProfessionData}
          onTabChange={onTabChange}
          supportingDocuments={supportingDocuments}
          activeTab={activeTab}
          LandlordPersonaSchema={LandlordPersonaSchema}
        />
      ),
    },
    {
      title: "Other Information",
      content: (
        <OtherInformation
          initialOtherInformationData={initialOtherInformationData}
          setOtherInformation={setInitialOtherInformationData}
          updateProfessionData={updateProfessionData}
          onTabChange={onTabChange}
          activeTab={activeTab}
          setTabHeader={setTabHeader}
        />
      ),
    },
  ];

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="property__wrapper addTask--wrapper">
            <p className="property-selected__title">
              Persona Settings {`> ${tabHeader}`}
            </p>

            <Steps current={activeTab} onChange={onTabChange}>
              {steps.map((item) => (
                <Step
                  key={item.title}
                  title={loading ? <LoadingOutlined /> : item.title}
                />
              ))}
            </Steps>
            <div className="steps-content">{steps[activeTab].content}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(ServiceProPersona);
