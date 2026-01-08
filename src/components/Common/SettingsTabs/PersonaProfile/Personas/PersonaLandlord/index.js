/* eslint-disable array-callback-return */
import React from "react";
import ProfessionFormSection from "./ProfessionFormSection";
import DynamicFieldSet from "../DynamicFieldSet";
import AccrediationsFieldSet from "../DynamicFieldSetAccrediations";
import LandlordPersonaSchema from "config/FormSchemas/LandlordPersona";
// import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import Axios from "axios";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { message, Steps, Tooltip } from "antd";
import showMessage from "config/ShowLoadingMessage";
import showNotification from "config/Notification";
import ScreeningPaymentModal from "config/PaymentModals/ScreeningSelf";
// import { Tooltip } from "antd";
import cookie from "react-cookies";
import { withRouter } from "react-router-dom";
// import { LoadingOutlined } from "@ant-design/icons";
const { Step } = Steps;

class LandlordPersona extends React.Component {
  notificationShown = 0;
  isFormSubmitting = "VerifyLater";
  constructor(props) {
    super(props);

    this.state = {
      verifyNowMode: false,
      showNotification: true,
      isPaymentTime: false,
      submitDocData: false,
      isSubmitting: false,
      openCollapse: {
        collapse1: true,
        collapse2: false,
        collapse3: false,
        isIncomplete: false,
      },
      accrediations: {
        accrediations: [
          {
            documentNumber: "",
            validTillDate: new Date(),
          },
        ],
        empty: true,
      },
      ProfessionFormData: {
        jobTitle: "",
        companyName: "",
        startDate: new Date(),
        companyWebsite: "",
        companyTelephone: "",
        empty: true,
      },
      supportingDocuments: {
        supportingDocuments: [
          { documentNumber: "", docRaw: [], documentUrl: "" },
        ],
        empty: true,
      },
      activeTab: 0,
    };

    this.professionSection = React.createRef();
  }

  componentDidMount() {
    this.fetchLandlordPersona();
  }

  fetchLandlordPersona = async () => {
    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    const fetchLandlordPersonas = await this.props.client.query({
      query: PersonaQueries.fetchLandlordPersona,
    });

    if (
      !isEmpty(fetchLandlordPersonas.data.getLandlordPersonaInformation) &&
      get(fetchLandlordPersonas, "data.getLandlordPersonaInformation.success")
    ) {
      let personaData = get(
        fetchLandlordPersonas,
        "data.getLandlordPersonaInformation.data"
      );

      // console.log(personaData)

      this.updatePersonaData(personaData);

      // contextData.endLoading();
    }
  };

  updatePersonaData = async (personaData) => {
    let obj = {
      ProfessionFormData: personaData.profession,
      accrediations: {
        accrediations: personaData.accreditation,
      },
      supportingDocuments: {
        supportingDocuments: personaData.supportingDocuments,
      },
    };

    if (isEmpty(personaData.accreditation)) {
      obj.accrediations = this.state.accrediations;
    }

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

  checkIncompleteFields = async () => {
    let isIncomplete = this.state.isIncomplete;
    let profession = this.state["ProfessionFormData"];
    isIncomplete = !profession.empty ? false : true;

    this.setState({ isIncomplete });
  };

  saveProfessionData = (ProfessionFormData) => {
    ProfessionFormData["empty"] = false;
    this.setState({ ProfessionFormData, activeTab: 1 });
    // this.toggleCollapse("collapse2");
  };

  setAccrediationData = (accrediations) => {
    accrediations["empty"] = false;
    this.setState({ accrediations, activeTab: 2 });
    // this.toggleCollapse("collapse3");
  };

  setSupportingDocuments = (supportingDocuments) => {
    supportingDocuments["empty"] = false;
    this.setState({ supportingDocuments, submitDocData: false });
    this.savePersonaLandlord();
  };

  saveSupportingDocuments = () => {
    setTimeout(() => {
      this.setState({
        submitDocData: true,
        isSubmitting: true,
      });
      this.forceUpdate();
    }, 800);
  };

  // getBase64 = file => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // };

  verifyNow = async () => {
    const pendingOrders = []; // Todo

    if (!this.props.isMenuDisabled) {
      if (isEmpty(pendingOrders)) {
        showMessage("Saving Data...");
        setTimeout(() => {
          this.savePersonaLandlordVerifyNow();
        }, 900);
        this.setState({ isPaymentTime: true, showNotification: false });
      } else {
        message.error("You have already paid for a Self Order!");
        showMessage("Saving Data...");
        setTimeout(() => {
          this.savePersonaLandlordVerifyNow();
          localStorage.setItem("isOriginCorrect", true);
          setTimeout(() => {
            window.location.href = "/landlord/screening/review";
          }, 2500);
        }, 800);
      }
    } else {
      message.error("Please fill your details!");
    }
  };

  savePersonaLandlord = async () => {
    const { accrediations, ProfessionFormData, supportingDocuments } =
      this.state;

    const { PersonaQueries } = this.props;
    this.setState({ isSubmitting: true });
    // contextData.startLoading();

    if (ProfessionFormData["profession"] === "Other") {
      ProfessionFormData["profession"] = ProfessionFormData["professionCustom"];
      delete ProfessionFormData["empty"];
      delete ProfessionFormData["professionCustom"];
    }

    delete ProfessionFormData["empty"];

    let uploadSupportingDocuments;
    let uploadableFiles = get(supportingDocuments, "supportingDocuments");

    let finalDocAr = [];
    if (!isEmpty(uploadableFiles)) {
      uploadSupportingDocuments = uploadableFiles.map(async (file, i) => {
        if (file.docRaw && !isEmpty(file.docRaw)) {
          if (this.state.showNotification) {
            showMessage("Uploading Documents...");
          }

          let toUpload = file.docRaw[file.docRaw.length - 1];

          // let getB64File = toUpload["preview"];

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
      });

      await Promise.all(uploadSupportingDocuments);
    }

    delete supportingDocuments["empty"];

    if (this.state.showNotification && this.notificationShown !== 1) {
      showMessage("Saving Data...");
      this.notificationShown = 1;
    }

    const queryResponse = await this.props.client.mutate({
      mutation: PersonaQueries.LandlordPersona,
      variables: {
        accreditation: accrediations.accrediations,
        profession: ProfessionFormData,
        supportingDocuments: finalDocAr,
        // supportingDocuments: supportingDocuments.supportingDocuments
      },
    });

    if (get(queryResponse, "data.updateLandlordPersonaInformation.success")) {
      if (this.state.showNotification && this.notificationShown === 1) {
        showNotification(
          "success",
          "Persona Details Updated!",
          "Your Persona Details have been successfully updated!"
        );
      }

      let personaData = get(
        queryResponse,
        "data.updateLandlordPersonaInformation.data"
      );

      this.props?.contextData?.updatePersonaData(personaData, "landlord");

      await this.updatePersonaData(personaData);

      this.notificationShown = 0;
      this.setState({ isSubmitting: false, showNotification: true });

      if (this.state.verifyNowMode) {
        localStorage.setItem("isOriginCorrect", true);
        this.props.history.push("/landlord/screening/review");
      }

      // contextData.endLoading();
    } else {
      // contextData.endLoading();
      this.setState({ isSubmitting: false, showNotification: true });

      showNotification(
        "error",
        "An error occured",
        get(queryResponse, "data.updateLandlordPersonaInformation.message")
      );
    }
  };

  savePersonaLandlordVerifyNow = async () => {
    const { accrediations, ProfessionFormData, supportingDocuments } =
      this.state;

    const { PersonaQueries } = this.props;
    this.setState({ isSubmitting: true });
    // contextData.startLoading();

    if (ProfessionFormData["profession"] === "Other") {
      ProfessionFormData["profession"] = ProfessionFormData["professionCustom"];
      delete ProfessionFormData["empty"];
      delete ProfessionFormData["professionCustom"];
    }

    delete ProfessionFormData["empty"];

    let uploadSupportingDocuments;
    let uploadableFiles = get(supportingDocuments, "supportingDocuments");

    let finalDocAr = [];
    if (!isEmpty(uploadableFiles)) {
      uploadSupportingDocuments = uploadableFiles.map(async (file, i) => {
        if (file.docRaw && !isEmpty(file.docRaw)) {
          let toUpload = file.docRaw[file.docRaw.length - 1];

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
            // {
            //   file: getB64File,
            //   filename: toUpload.name
            // }
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
      mutation: PersonaQueries.LandlordPersona,
      variables: {
        accreditation: accrediations.accrediations,
        profession: ProfessionFormData,
        supportingDocuments: finalDocAr,
        // supportingDocuments: supportingDocuments.supportingDocuments
      },
    });

    // console.log(queryResponse)

    if (get(queryResponse, "data.updateLandlordPersonaInformation.success")) {
      if (this.state.showNotification) {
        showNotification(
          "success",
          "Persona Details Updated!",
          "Your Persona Details have been successfully updated!"
        );
      }

      let personaData = get(
        queryResponse,
        "data.updateLandlordPersonaInformation.data"
      );

      await this.updatePersonaData(personaData);

      this.setState({ isSubmitting: false, showNotification: true });

      if (this.isFormSubmitting === "VerifyNow") {
        setTimeout(() => {
          this.routeToReview();
        }, 1500);
      }

      // contextData.endLoading();
    } else {
      // contextData.endLoading();
      this.setState({ isSubmitting: false, showNotification: true });

      showNotification(
        "error",
        "An error occured",
        get(queryResponse, "data.updateLandlordPersonaInformation.message")
      );
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
      ProfessionFormData,
      accrediations,
      supportingDocuments,
      isSubmitting,
      submitDocData,
      isPaymentTime,
      activeTab,
    } = this.state;

    const steps = [
      {
        title: "Profession",
        content: (
          <>
            <ProfessionFormSection
              professionSectionRef={this.professionSection}
              saveProfessionData={this.saveProfessionData}
              ProfessionFormData={ProfessionFormData}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
            />
          </>
        ),
      },
      {
        title: "Accreditations",
        content: (
          <>
            <AccrediationsFieldSet
              setAccrediationData={this.setAccrediationData}
              accrediations={accrediations}
              LandlordPersonaSchema={LandlordPersonaSchema}
              {...this.props}
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
          closeModal={() => this.setState({ isPaymentTime: false })}
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
        <div className="row mt-3">
          <div className="col-lg-6">
            <div className="form-group">
              <button
                onClick={() => {
                  this.saveSupportingDocuments();
                  this.savePersonaLandlord();
                }}
                // onClick={this.savePersonaLandlord}
                className="btn btn-outline-primary btn-block btn-sm"
              >
                Save &amp; Verify Later
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
                // onClick={() => {
                //   console.log(
                //     "this.professionSectionthis.professionSectionthis.professionSection",
                //     this.professionSection
                //   );
                // }}
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

export default withRouter(LandlordPersona);
