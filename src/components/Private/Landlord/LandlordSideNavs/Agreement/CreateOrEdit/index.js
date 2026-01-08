import React, { useEffect, useState } from "react";
import { message, Spin, Typography, Modal as AntdModal } from "antd";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import { useLazyQuery, useMutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import {
  agreementTypeValidation,
  renterTransactionValidation,
} from "../validators";

import "./styles.scss";
import AgreementType from "./AgreementType";
import GeneralInfo from "./GeneralInfo";
import Transaction from "./Transaction";
import AdditionalInfo from "./AdditionalInfo";
import Signatories from "./Signatories";
import {
  createAgreement,
  editAgreement,
  getAgreementId,
} from "config/queries/agreement";
import Upload from "./Upload";
import { useHistory, useLocation } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import AgreementPDF from "../PDF";
import showNotification from "config/Notification";
import styled from "styled-components";
import { PaymentTypeEnum } from "constants/payment";

const Modal = styled(AntdModal)`
  top: 0px !important;
  height: 100vh;
  width: auto !important;

  .ant-modal-content {
    height: 100vh;
    margin: 0;
  }
  .ant-modal-body {
    height: calc(100vh - 60px);
  }
`;

export const TitleContentWrapper = ({ children, title }) => (
  <div className="col-12 col-md-4 ">
    <Typography.Title className="title">{title}</Typography.Title>
    {children}
  </div>
);

const CreateOrEditAgreement = (props) => {
  const history = useHistory();
  const location = useLocation();

  const [modalURL, setModalURL] = useState(null);

  useEffect(() => {
    if (location?.state?.propertyId) {
      setGeneralInfo({ ...generalInfo, propertyId: location.state.propertyId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const [generalInfo, setGeneralInfo] = useState({
    occupation: {
      adults: 0,
      kids: 0,
      pets: 0,
      occupantNames: [],
    },
    duration: {
      start: new Date(),
      end: new Date(),
      leaveOpen: false,
    },
    contacts: [],
    propertyId: "",
    agreementType: "",
    templateType: "",
  });

  const [transaction, setTransaction] = useState({
    hasAutoRecurring: false,
    rate: "",
    paymentScheduleType: "",
    paymentMethod: PaymentTypeEnum.MANUAL,
    paymentStartDate: new Date(),
    invoiceAdvanceDays: "",
    deposit: {
      hasSecurityDeposit: true,
      amount: "",
      type: "",
    },
    information: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    exclusions: "",
    additionalInfo: "",
  });

  const [guarantors, setGuarantors] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [documentUrl, setDocumentUrl] = useState("");
  const [mongoID, setMongoID] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [getByIdQuery, { loading: getLoading }] = useLazyQuery(getAgreementId, {
    onCompleted: (data) => {
      if (data) {
        const agreement = data.getAgreementById;
        setMongoID(agreement._id);
        setGeneralInfo({
          agreementType: agreement.agreementType,
          contacts: agreement.contactId,
          duration: agreement.duration,
          occupation: agreement.occupation,
          propertyId: agreement.propertyId._id,
          status: agreement.status,
          templateType: agreement.templateType,
        });
        setTransaction({
          deposit: agreement.renterTransaction.deposit,
          hasAutoRecurring: agreement.renterTransaction.hasAutoRecurring,
          information: agreement.renterTransaction.information,
          invoiceAdvanceDays: agreement.renterTransaction.invoiceAdvanceDays,
          paymentStartDate: agreement.renterTransaction.paymentStartDate,
          paymentScheduleType: agreement.renterTransaction.paymentScheduleType,
          paymentMethod: agreement.renterTransaction.paymentMethod,
          rate: agreement.renterTransaction.rate,
        });
        setAdditionalInfo({
          additionalInfo: agreement.additionalInfo,
          exclusions: agreement.exclusions,
        });
        setGuarantors(agreement.guarantors || []);
        setDocumentUrl(agreement.documentUrl);
      }
    },
  });

  const [
    executionCreateMutation,
    { loading: createLoading, error: createError },
  ] = useMutation(createAgreement, {
    onCompleted: async (data) => {
      if (data && data.createAgreement) {
        showNotification(
          "success",
          "Success",
          "Your agreement created successfully!"
        );
        if (showPreview) {
          await previewPdf(data.createAgreement);
        } else {
          return history.push("/landlord/agreement");
        }
      }
    },
  });

  const [executeEditMutation, { loading: editLoading, error: editError }] =
    useMutation(editAgreement, {
      onCompleted: async (data) => {
        if (data && data.updateAgreement) {
          message.success(
            "success",
            "Success",
            "Your agreement updated successfully!"
          );
          if (showPreview) {
            await previewPdf(data.updateAgreement);
          } else {
            return history.push("/landlord/agreement");
          }
        }
      },
    });

  useEffect(() => {
    editError &&
      editError.graphQLErrors &&
      editError.graphQLErrors.map((error) =>
        showNotification("error", "An error occurred!", error.message)
      );
  }, [editError]);

  useEffect(() => {
    createError &&
      createError.graphQLErrors &&
      createError.graphQLErrors.map((error) =>
        showNotification("error", "An error occurred!", error.message)
      );
  }, [createError]);

  useEffect(() => {
    if (location.pathname === "/landlord/agreement/edit") {
      const id = location?.state?.id;
      getByIdQuery({ variables: { agreementId: id } });
    }
    return () => { };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const loading = createLoading || getLoading || editLoading;

  const handleGeneralInfoChange = (data) => {
    setGeneralInfo({ ...generalInfo, ...data });
    setCurrentTab(2);
  };

  const handleTransactionChange = (data) => {
    setTransaction({ ...transaction, ...data });
    setCurrentTab(3);
  };

  const handleAdditionalInfoOnChange = (key, value) =>
    setAdditionalInfo({ ...additionalInfo, [key]: value });

  const handleNextTab = () => {
    if (currentTab < 4 && currentTab >= 0) setCurrentTab(currentTab + 1);
  };

  const handleBackTab = () => {
    if (currentTab <= 4 && currentTab > 0) setCurrentTab(currentTab - 1);
  };

  const handleSubmitAgreementType = ({ agreementType, templateType }) => {
    setGeneralInfo({ ...generalInfo, agreementType, templateType });
    setCurrentTab(1);
  };

  const handleSubmit = async (obj) => {
    try {
      setShowPreview(obj?.preview);
      const variables = {
        propertyId: generalInfo.propertyId,
        contactId: generalInfo.contacts,
        duration: {
          start: generalInfo.duration.start,
          end: generalInfo.duration.end,
          leaveOpen: generalInfo.duration.leaveOpen,
        },
        occupation: {
          ...generalInfo.occupation,
          adults: Number(generalInfo.occupation.adults),
          kids: Number(generalInfo.occupation.kids),
          pets: Number(generalInfo.occupation.pets),
        },
        agreementType: generalInfo.agreementType,
        renterTransaction: transaction,
        exclusions: additionalInfo.exclusions,
        additionalInfo: additionalInfo.additionalInfo,
        guarantors,
        documentUrl,
        sendForSign: obj?.sendForSign ? true : false,
      };
      if (generalInfo.agreementType === "template") {
        variables.templateType = generalInfo.templateType;
      }

      if (mongoID) {
        variables.agreementId = mongoID;
        executeEditMutation({ variables });
      } else {
        executionCreateMutation({ variables });
      }
    } catch (error) {
      showNotification("error", "An error occurred!", error.message);
    }
  };

  const previewPdf = async (data) => {
    try {
      if (data?.documentUrl) {
        // window.open(data.documentUrl, "_blank").focus();
        setModalURL(data.documentUrl);
      } else {
        const blob = await pdf(<AgreementPDF agreement={data} />).toBlob();
        const file = new Blob([blob], { type: "application/pdf" });
        // console.log(file);
        // window.open(window.URL.createObjectURL(file), "_blank");
        setModalURL(window.URL.createObjectURL(file));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleTab = async (value) => {
    try {
      if (currentTab === 0) {
        const variables = {
          agreementType: generalInfo.agreementType,
        };
        if (generalInfo.agreementType === "template") {
          variables.templateType = generalInfo.templateType;
        }

        await agreementTypeValidation.validate(variables);
      }
      if (currentTab === 1) {
        if (!parseInt(generalInfo.occupation.adults)) {
          throw new Error("There should be at least one adult!");
        }

        if (!generalInfo.propertyId) {
          throw new Error("Property required!");
        }

        if (!generalInfo.contacts.length) {
          throw new Error("Minimum one contact required!");
        }

        if (
          !generalInfo.duration.leaveOpen &&
          generalInfo.duration.start === generalInfo.duration.end
        ) {
          throw new Error("Agreement starting and ending must be different!");
        }
      }
      if (currentTab === 2) {
        const variables = {};
        variables.deposit = {};

        variables.hasAutoRecurring = transaction.hasAutoRecurring
          ? true
          : false;
        variables.rate = transaction.rate;
        variables.paymentScheduleType = transaction.paymentScheduleType;
        variables.information = transaction.information;
        variables.deposit.hasSecurityDeposit = transaction.deposit
          .hasSecurityDeposit
          ? true
          : false;

        if (transaction.hasAutoRecurring) {
          variables.paymentStartDate = transaction.paymentStartDate;
          variables.invoiceAdvanceDays = transaction.invoiceAdvanceDays;
        }

        if (transaction.deposit.hasSecurityDeposit) {
          variables.deposit = transaction.deposit;
        }

        await renterTransactionValidation.validate(variables);
      }

      setCurrentTab(value);
    } catch (error) {
      showNotification("error", "Validation Error", error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="new__agreement__wrapper">
          <Spin tip="Loading..." spinning={loading}>
            <Tabs
              selectedIndex={currentTab}
              onSelect={(value) => handleTab(value)}
            >
              <TabList>
                <Tab>Agreement type</Tab>
                <Tab>General Info</Tab>
                <Tab>Rental Transaction</Tab>
                <Tab>
                  {generalInfo.agreementType === "template"
                    ? "Additional Info"
                    : "Upload document"}
                </Tab>
                {generalInfo.agreementType === "template" && (
                  <Tab>Signatories</Tab>
                )}
              </TabList>

              <TabPanel>
                <AgreementType
                  agreementType={generalInfo.agreementType}
                  templateType={generalInfo.templateType}
                  onNext={handleSubmitAgreementType}
                />
              </TabPanel>
              <TabPanel>
                <GeneralInfo
                  generalInfo={generalInfo}
                  onGeneralDataChange={handleGeneralInfoChange}
                  onBack={handleBackTab}
                />
              </TabPanel>
              <TabPanel>
                <Transaction
                  transaction={transaction}
                  onTransactionChange={handleTransactionChange}
                  onBack={handleBackTab}
                />
              </TabPanel>
              <TabPanel>
                {generalInfo.agreementType === "template" ? (
                  <AdditionalInfo
                    additionalInfo={additionalInfo}
                    onAdditionalInfoChange={handleAdditionalInfoOnChange}
                    onNext={handleNextTab}
                    onSubmit={handleSubmit}
                    agreementType={generalInfo.agreementType}
                    onBack={handleBackTab}
                  />
                ) : (
                  <Upload
                    documentUrl={documentUrl}
                    onDocumentUrlChange={setDocumentUrl}
                    onSubmit={handleSubmit}
                    onBack={handleBackTab}
                  />
                )}
              </TabPanel>

              {generalInfo.agreementType === "template" && (
                <TabPanel>
                  <Signatories
                    onSubmit={handleSubmit}
                    contacts={generalInfo.contacts}
                    guarantors={guarantors}
                    onGuarantorsChange={setGuarantors}
                    agreementType={generalInfo.agreementType}
                    onBack={handleBackTab}
                  />
                </TabPanel>
              )}
            </Tabs>
          </Spin>
        </div>
      </div>
      {modalURL && (
        <Modal
          title="Agreement Detail"
          visible={modalURL}
          closable
          destroyOnClose={() => setModalURL(null)}
          onCancel={() => setModalURL(null)}
          footer={null}
        >
          <iframe
            id="agreement"
            title="agreement"
            style={{ height: "100%", width: "100%", margin: "auto" }}
            src={modalURL}
          />
        </Modal>
      )}
    </div>
  );
};

export default withRouter(CreateOrEditAgreement);
