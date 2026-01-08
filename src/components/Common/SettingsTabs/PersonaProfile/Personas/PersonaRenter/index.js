/* eslint-disable array-callback-return */
import React from "react";
import ProfessionFormSection from "./IncomeFormSection";
import DynamicFieldSet from "../DynamicFieldSet";
import OtherInformation from "./OtherInformation";
import LandlordAgentReference from "./LandlordAgentReference";
import LandlordPersonaSchema from "../../../../../../config/FormSchemas/LandlordPersona";
import RightToRent from "./RightToRent";
// import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import Axios from "axios";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import showMessage from "../../../../../../config/ShowLoadingMessage";
import showNotification from "../../../../../../config/Notification";
import ScreeningPaymentModal from "../../../../../../config/PaymentModals/ScreeningSelf";
import { message, Steps, Tooltip } from "antd";
import cookie from "react-cookies";
const { Step } = Steps;

class RenterPersona extends React.Component {
  isFormSubmitting = "VerifyLater";
  isSaving = 0;
  constructor(props) {
    super(props);

    this.state = {
      verifyNowMode: false,
      showNotification: true,
      isPaymentTime: false,
      submitDocData: false,
      openCollapse: {
        collapse1: true,
        collapse2: false,
        collapse3: false,
        collapse4: false,
        collapse5: false,
        isIncomplete: false,
      },
      landLordOrAgentReference: {
        isSameAddress: false,
        landlordName: "", // Landlord/Agent's Full Name
        landlordContactNumber: "", // Landlord/Agent's Contact Number
        landlordEmail: "", //Landlord/Agent's Email
        rentPerMonth: "",
        rentalStartDate: new Date(),
        durationInMonth: "1",
      },
      rightToRent: {
        swissPassport: false,
        swissNationalID: false,
        documentCertifyingPermanentResidence: false,
        permanentResidentCard: false,
        biometricResidencePermit: false,
        passportOrTravelDocument: false,
        immigrationStatusDocument: false,
        registrationAsBritishCitizen: false,
        passportEndorsed: false,
        biometricImmigrationDocument: false,
        nationalResidentCard: false,
        endorsementFromHomeOffice: false,
      },
      otherInformation: {
        noOfAdult: "",
        noOfChild: "",
        noOfPets: "",
        noOfCars: "",
        moveInDate: new Date(),
        smoking: false,
        incomeSupport: false,
        disability: false,
      },
      income: {
        startDate: new Date(),
        endDate: new Date(),
        salary: {
          amount: 0,
        },
        hoursPerWeek: 40,
        workdaysPerWeek: 5,
      },
      isSubmitting: false,
      supportingDocuments: {
        supportingDocuments: [
          { documentNumber: "", docRaw: [], documentUrl: "" },
        ],
      },
      activeTab: 0,
    };
  }

  componentDidMount() {
    // let initData = get(this.props, "contextData.personaData.renter", {});
    // if (!isEmpty(initData)) {
    //   this.updatePersonaData(initData);
    // }

    // if (isEmpty(initData)) {
    this.fetchRenterPersona();
    // }
  }

  fetchRenterPersona = async () => {
    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    const fetchRenterPersonas = await this.props.client.query({
      query: PersonaQueries.fetchRenterPersona,
    });

    if (
      !isEmpty(fetchRenterPersonas.data.getRenterPersonaInformation) &&
      get(fetchRenterPersonas, "data.getRenterPersonaInformation.success")
    ) {
      let personaData = get(
        fetchRenterPersonas,
        "data.getRenterPersonaInformation.data"
      );

      await this.updatePersonaData(personaData);

      // contextData.endLoading();
    }
  };

  updatePersonaData = async (personaData) => {
    let income = personaData.income;
    if (income.hoursPerWeek === 0) income.hoursPerWeek = 40;
    if (income.workdaysPerWeek === 0) income.workdaysPerWeek = 5;

    let obj = { ...personaData };

    if (isEmpty(personaData.supportingDocuments)) {
      obj.supportingDocuments = this.state.supportingDocuments;
    } else {
      personaData.supportingDocuments.map((p, i) => {
        p["docRaw"] = [];
      });
      obj.supportingDocuments = {
        supportingDocuments: personaData.supportingDocuments,
      };
    }

    this.setState(obj);
    this.forceUpdate();
  };

  toggleCollapse = (key) => {
    let openCollapseData = this.state.openCollapse;
    Object.keys(openCollapseData).map((colKey, i) => {
      if (colKey === key) {
        openCollapseData[colKey] = !openCollapseData[colKey];
      } else {
        openCollapseData[colKey] = false;
      }
    });

    this.setState({ openCollapse: openCollapseData });
    this.forceUpdate();
  };

  saveProfessionData = (income) => {
    this.setState({ income, activeTab: 1 });
    this.toggleCollapse("collapse2");
  };

  updateRTAData = (event, id) => {
    let initialData = this.state.rightToRent;

    initialData[id] = !initialData[id];

    this.setState({ rightToRent: initialData });
  };

  saveLandlordAgentReference = (landLordOrAgentReference) => {
    this.setState({ landLordOrAgentReference, activeTab: 2 });
    this.toggleCollapse("collapse3");
  };

  saveOtherInformation = (otherInformation) => {
    this.setState({ otherInformation, activeTab: 3 });
    this.toggleCollapse("collapse4");
  };

  // setSupportingDocuments = supportingDocuments => {
  //   this.setState({ supportingDocuments });
  // };

  setSupportingDocuments = (supportingDocuments) => {
    // console.log(supportingDocuments)
    supportingDocuments["empty"] = false;
    this.setState({ supportingDocuments, submitDocData: false });
    this.savePersonaRenter();
  };

  saveSupportingDocuments = () => {
    this.setState({ submitDocData: true, isSubmitting: true });
    this.forceUpdate();
  };

  // getBase64 = file => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // };

  savePersonaRenter = async () => {
    this.isSaving = this.isSaving + 1;

    const {
      otherInformation,
      income,
      supportingDocuments,
      rightToRent,
      landLordOrAgentReference,
    } = this.state;

    landLordOrAgentReference.isSameAddress = get(
      landLordOrAgentReference,
      "isSameAddress",
      false
    );

    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    this.setState({ isSubmitting: true });
    let uploadSupportingDocuments;
    let uploadableFiles = get(supportingDocuments, "supportingDocuments");

    let finalDocAr = [];

    if (!isEmpty(uploadableFiles)) {
      if (this.isSaving !== 1) {
        showMessage("Uploading Documents...");
        this.isSaving = 1;
      }

      uploadSupportingDocuments = uploadableFiles.map(async (file, i) => {
        if (file.docRaw && !isEmpty(file.docRaw)) {
          let toUpload = file.docRaw[file.docRaw.length - 1];
          // let getB64File = await this.getBase64(toUpload);

          var formData = new FormData();
          formData.append("file", toUpload);
          formData.append("filename", toUpload.name);
          // for what purpose the file is uploaded to the server.
          formData.append("uploadType", "Persona Document");

          let uploadedFile = await Axios.post(
            `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
            formData,
            {
              headers: {
                authorization: await cookie.load(
                  process.env.REACT_APP_AUTH_TOKEN
                ),
              },
            }
          );

          if (get(uploadedFile, "data.success")) {
            let document = get(uploadedFile, "data.data");
            delete file["docRaw"];
            if (document) {
              file["documentUrl"] = document.url;
              file["fileId"] = document._id;
            }

            finalDocAr.push(file);
          } else {
            return showNotification(
              "error",
              "An error occurred",
              uploadedFile.data.message
            );
          }
        } else {
          if (file.documentUrl) {
            delete file["docRaw"];
            finalDocAr.push(file);
          }
        }
        // else {
        //   delete file["docRaw"];
        //   file["documentUrl"] = file["documentUrl"] ? file["documentUrl"] : "";
        // }
      });

      await Promise.all(uploadSupportingDocuments);
    }

    delete supportingDocuments["empty"];

    if (this.isSaving === 1) {
      showMessage("Saving Data...");
      this.isSaving = 2;
    }

    const queryResponse = await this.props.client.mutate({
      mutation: PersonaQueries.updateRenterPersona,
      variables: {
        otherInformation,
        income,
        rightToRent,
        landLordOrAgentReference,
        supportingDocuments: finalDocAr,
        // supportingDocuments: supportingDocuments.supportingDocuments
      },
    });

    if (get(queryResponse, "data.updateRenterPersonaInformation.success")) {
      if (this.isSaving === 2) {
        showNotification(
          "success",
          "Persona Details Updated!",
          "Your Persona Details have been successfully updated!"
        );
      }

      let personaData = get(
        queryResponse,
        "data.updateRenterPersonaInformation.data"
      );

      this.isSaving = 0;

      // Todo
      // this.props.contextData.updatePersonaData(personaData, "renter");

      await this.updatePersonaData(personaData);

      // contextData.endLoading();

      this.setState({ isSubmitting: false, showNotification: true });

      if (this.state.verifyNowMode) {
        setTimeout(() => {
          this.props.history.push("/renter/screening/review");
        }, 800);
      }

      this.forceUpdate();
    } else {
      // contextData.endLoading();
      this.setState({ isSubmitting: false, showNotification: true });
      this.forceUpdate();

      showNotification(
        "error",
        "An error occured",
        get(queryResponse, "data.updateRenterPersonaInformation.message")
      );
    }
  };

  savePersonaRenterVerifyNow = async () => {
    const {
      otherInformation,
      income,
      supportingDocuments,
      rightToRent,
      landLordOrAgentReference,
    } = this.state;

    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    this.setState({ isSubmitting: true });
    let uploadSupportingDocuments;
    let uploadableFiles = get(supportingDocuments, "supportingDocuments");

    let finalDocAr = [];

    if (!isEmpty(uploadableFiles)) {
      uploadSupportingDocuments = uploadableFiles.map(async (file, i) => {
        if (file.docRaw && !isEmpty(file.docRaw)) {
          let toUpload = file.docRaw[file.docRaw.length - 1];
          // let getB64File = await this.getBase64(toUpload);

          var formData = new FormData();
          formData.append("file", toUpload);
          formData.append("filename", toUpload.name);
          // for what purpose the file is uploaded to the server.
          formData.append("uploadType", "Persona Document");

          let uploadedFile = await Axios.post(
            `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
            formData,
            {
              headers: {
                authorization: await cookie.load(
                  process.env.REACT_APP_AUTH_TOKEN
                ),
              },
            }
          );

          if (get(uploadedFile, "data.success")) {
            let documentUrl = get(uploadedFile, "data.data");
            delete file["docRaw"];
            file["documentUrl"] = documentUrl;

            finalDocAr.push(file);
          } else {
            return showNotification(
              "error",
              "An error occurred",
              uploadedFile.data.message
            );
          }
        } else {
          if (file.documentUrl) {
            delete file["docRaw"];
            finalDocAr.push(file);
          }
        }
        // else {
        //   delete file["docRaw"];
        //   file["documentUrl"] = file["documentUrl"] ? file["documentUrl"] : "";
        // }
      });

      await Promise.all(uploadSupportingDocuments);
    }

    delete supportingDocuments["empty"];

    const queryResponse = await this.props.client.mutate({
      mutation: PersonaQueries.updateRenterPersona,
      variables: {
        otherInformation,
        income,
        rightToRent,
        landLordOrAgentReference,
        supportingDocuments: finalDocAr,
        // supportingDocuments: supportingDocuments.supportingDocuments
      },
    });

    if (get(queryResponse, "data.updateRenterPersonaInformation.success")) {
      if (this.state.showNotification) {
        showNotification(
          "success",
          "Persona Details Updated!",
          "Your Persona Details have been successfully updated!"
        );
      }

      let personaData = get(
        queryResponse,
        "data.updateRenterPersonaInformation.data"
      );

      await this.updatePersonaData(personaData);

      // contextData.endLoading();
      // console.log(
      //   "isFormSubmittingisFormSubmittingisFormSubmittingisFormSubmittingisFormSubmittingisFormSubmittingisFormSubmittingisFormSubmittingisFormSubmitting",
      //   this.isFormSubmitting
      // );
      if (this.isFormSubmitting === "VerifyNow") {
        setTimeout(() => {
          this.routeToReview();
        }, 1500);
      }
      this.setState({ isSubmitting: false, showNotification: true });
      this.forceUpdate();
    } else {
      // contextData.endLoading();
      this.setState({ isSubmitting: false, showNotification: true });
      this.forceUpdate();

      showNotification(
        "error",
        "An error occured",
        get(queryResponse, "data.updateRenterPersonaInformation.message")
      );
    }
  };

  verifyNow = async () => {
    // let pendingOrders = get(
    //   this.props,
    //   "contextData.pendingOrders.data.getPendingScreening.data"
    // );

    const pendingOrders = []; // todo

    if (!this.props.isMenuDisabled) {
      if (isEmpty(pendingOrders)) {
        showMessage("Saving data...");
        setTimeout(() => {
          this.savePersonaRenterVerifyNow();
        }, 900);
        this.setState({ isPaymentTime: true, showNotification: false });
      } else {
        showMessage("Saving data...");
        message.error("You have already paid for a Self Order!");
        setTimeout(() => {
          this.savePersonaRenterVerifyNow();
          localStorage.setItem("isOriginCorrect", true);
          setTimeout(() => {
            window.location.href = "/renter/screening/review";
          }, 2500);
        }, 900);
      }
    } else {
      message.error("Please fill your details!");
    }
  };

  routeToReview = () => {
    setTimeout(() => {
      localStorage.setItem("isOriginCorrect", true);
      window.location.href = "/renter/screening/review";
    }, 1500);
  };

  onTabChange = (current) => {
    this.setState({ activeTab: current });
    // if (
    //   !professionFromData.profession ||
    //   serviceOrSkillTags.length === 0 ||
    //   !professionFromData.businessType
    // ) {
    //   showNotification(
    //     "info",
    //     "Please provide required info at this step first",
    //     ""
    //   );
    // } else {
    //   setActiveTab(current);
    //   setTabHeader(steps[current].title);
    // }
  };

  render() {
    const {
      // openCollapse,
      income,
      supportingDocuments,
      rightToRent,
      otherInformation,
      landLordOrAgentReference,
      isSubmitting,
      submitDocData,
      isPaymentTime,
      activeTab,
    } = this.state;

    const steps = [
      {
        title: "Income",
        content: (
          <>
            {" "}
            <ProfessionFormSection
              saveProfessionData={this.saveProfessionData}
              income={income}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
            />
          </>
        ),
      },
      {
        title: "Landlord and Agent Reference",
        content: (
          <>
            <LandlordAgentReference
              landLordOrAgentReference={landLordOrAgentReference}
              LandlordPersonaSchema={LandlordPersonaSchema}
              saveLandlordAgentReference={this.saveLandlordAgentReference}
              accountSetting={this.props.accountSetting}
            />
          </>
        ),
      },
      {
        title: "Other Information",
        content: (
          <>
            <OtherInformation
              saveOtherInformation={this.saveOtherInformation}
              otherInformation={otherInformation}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
            />
          </>
        ),
      },
      {
        title: "Right to Rent (Prelimenary)",
        content: (
          <>
            <RightToRent
              rightToRent={rightToRent}
              updateRTAData={this.updateRTAData}
              accountSetting={this.props.accountSetting}
              next={() => this.setState({ activeTab: 4 })}
            />
          </>
        ),
      },
      {
        title: "Upload Documents",
        content: (
          <>
            <DynamicFieldSet
              submitDocData={submitDocData}
              setSupportingDocuments={this.setSupportingDocuments}
              supportingDocuments={supportingDocuments}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
            />
          </>
        ),
      },
    ];

    return (
      <>
        <ScreeningPaymentModal
          closeModal={() => {
            this.setState({ isPaymentTime: false });
          }}
          isPaymentTime={isPaymentTime}
          {...this.props}
        />
        <Steps current={activeTab} onChange={this.onTabChange}>
          {steps.map((item) => (
            <Step
              key={item.title}
              title={
                <Tooltip placement="bottomLeft" title={item.title}>
                  <small style={{ cursor: "pointer" }}>{item.title}</small>
                </Tooltip>
              }
            />
          ))}
        </Steps>
        <div className="steps-content p-3">{steps[activeTab].content}</div>
        {/* <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse1")}
            data-type="collapseLayout"
            className={`card__title card__middle ${
              openCollapse["collapse1"] && "active__tab"
            }`}
          >
            Income *
            {openCollapse["collapse1"] ? (
              <div className="details__icons active">
                <i className="mdi mdi-chevron-up"></i>
              </div>
            ) : (
              <div className="details__icons">
                <i className="mdi mdi-chevron-down down__marg"></i>
              </div>
            )}
          </CardHeader>
          <Collapse isOpen={openCollapse["collapse1"]}>
            <CardBody>
              <ProfessionFormSection
                saveProfessionData={this.saveProfessionData}
                income={income}
                LandlordPersonaSchema={LandlordPersonaSchema}
                accountSetting={this.props.accountSetting}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse2")}
            data-type="collapseLayout"
            className={`card__title card__middle ${
              openCollapse["collapse2"] && "active__tab"
            }`}
          >
            Landlord and Agent Reference *
            {openCollapse["collapse2"] ? (
              <div className="details__icons active">
                <i className="mdi mdi-chevron-up"></i>
              </div>
            ) : (
              <div className="details__icons">
                <i className="mdi mdi-chevron-down down__marg"></i>
              </div>
            )}
          </CardHeader>
          <Collapse isOpen={openCollapse["collapse2"]}>
            <CardBody>
              <LandlordAgentReference
                landLordOrAgentReference={landLordOrAgentReference}
                LandlordPersonaSchema={LandlordPersonaSchema}
                saveLandlordAgentReference={this.saveLandlordAgentReference}
                accountSetting={this.props.accountSetting}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse3")}
            data-type="collapseLayout"
            className={`card__title card__middle ${
              openCollapse["collapse3"] && "active__tab"
            }`}
          >
            Other Information *
            {openCollapse["collapse3"] ? (
              <div className="details__icons active">
                <i className="mdi mdi-chevron-up"></i>
              </div>
            ) : (
              <div className="details__icons">
                <i className="mdi mdi-chevron-down down__marg"></i>
              </div>
            )}
          </CardHeader>
          <Collapse isOpen={openCollapse["collapse3"]}>
            <CardBody>
              <OtherInformation
                saveOtherInformation={this.saveOtherInformation}
                otherInformation={otherInformation}
                LandlordPersonaSchema={LandlordPersonaSchema}
                accountSetting={this.props.accountSetting}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse4")}
            data-type="collapseLayout"
            className={`card__title card__middle ${
              openCollapse["collapse4"] && "active__tab"
            }`}
          >
            Right to Rent (Prelimenary) *
            {openCollapse["collapse4"] ? (
              <div className="details__icons active">
                <i className="mdi mdi-chevron-up"></i>
              </div>
            ) : (
              <div className="details__icons">
                <i className="mdi mdi-chevron-down down__marg"></i>
              </div>
            )}
          </CardHeader>
          <Collapse isOpen={openCollapse["collapse4"]}>
            <CardBody className="cardbody__Padd">
              <RightToRent
                rightToRent={rightToRent}
                updateRTAData={this.updateRTAData}
                accountSetting={this.props.accountSetting}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse5")}
            data-type="collapseLayout"
            className={`card__title card__middle ${
              openCollapse["collapse5"] && "active__tab"
            }`}
          >
            Upload Documents *
            {openCollapse["collapse5"] ? (
              <div className="details__icons active">
                <i className="mdi mdi-chevron-up"></i>
              </div>
            ) : (
              <div className="details__icons">
                <i className="mdi mdi-chevron-down down__marg"></i>
              </div>
            )}
          </CardHeader>
          <Collapse isOpen={openCollapse["collapse5"]}>
            <CardBody>
              <DynamicFieldSet
                submitDocData={submitDocData}
                setSupportingDocuments={this.setSupportingDocuments}
                supportingDocuments={supportingDocuments}
                LandlordPersonaSchema={LandlordPersonaSchema}
                accountSetting={this.props.accountSetting}
              />
            </CardBody>
          </Collapse>
        </Card> */}
        <div className="row mt-3">
          <div className="col-lg-6">
            <div className="form-group">
              <button
                disabled={isSubmitting}
                onClick={() => {
                  this.saveSupportingDocuments();
                  this.savePersonaRenter();
                }}
                className="btn btn-outline-primary btn-block btn-sm"
              >
                Save & Verify Later
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <button
                disabled={isSubmitting || !this.props.isPersonaUpdate}
                // onClick={this.verifyNow}
                onClick={() => {
                  this.setState({ verifyNowMode: true });
                  this.saveSupportingDocuments();
                  this.verifyNow();
                }}
                className="btn btn-primary btn-block btn-sm"
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default RenterPersona;
