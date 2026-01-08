/* eslint-disable array-callback-return */

import React from "react";
import ProfessionFormSection from "./ProfessionFormSection";
import DynamicFieldSet from "../DynamicFieldSet";
import ReferencesContacts from "./ReferencesContacts";
import AccrediationsFieldSet from "../DynamicFieldSetAccrediations";
import LandlordPersonaSchema from "config/FormSchemas/LandlordPersona";
import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
// import AddSkillsTags from "./AddServiceSkills";
import OtherInformation from "./OtherInformation";
import Axios from "axios";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import ValidateEmail from "config/ValidateEmail";
import showMessage from "config/ShowLoadingMessage";
import showNotification from "config/Notification";
import { withRouter } from "react-router-dom";
import { message } from "antd";
import cookie from "react-cookies";
import { Tooltip } from "antd";
// import ScreeningPaymentModal from "../../../../../../config/PaymentModals/ScreeningSelf";

class ServiceProPersona extends React.Component {
  notificationShown = 0;
  isVerifyNow = false;
  constructor(props) {
    super(props);

    this.state = {
      showNotification: true,
      submitDocData: false,
      ServiceOrSkillTags: [],
      openCollapse: {
        collapse1: true,
        collapse2: false,
        collapse3: false,
        collapse4: false,
        collapse5: false,
        collapse6: false,
        isIncomplete: false
      },
      referenceContacts: {
        referenceContacts: [{ contactName: "", email: "" }]
      },
      accrediations: {
        accrediations: [
          {
            documentNumber: "",
            validTillDate: new Date()
          }
        ],
        empty: true
      },
      ProfessionFormData: {
        companyName: "",
        UTR: "",
        startDate: new Date(),
        VAT: ""
      },
      initialOtherInformationData: {
        otherInformation: [{ providerName: "", validTillDate: new Date() }]
      },
      supportingDocuments: {
        supportingDocuments: [
          { documentNumber: "", docRaw: [], documentUrl: "" }
        ]
      }
    };

    this.professionRef = React.createRef();
  }

  componentDidMount() {
    // let initData = get(this.props, "contextData.personaData.servicepro", {});
    // if (!isEmpty(initData)) {
    //   this.updatePersonaData(initData);
    // }

    // if (isEmpty(initData)) {
    this.fetchServiceProPersona();
    // }
  }

  toggleCollapse = key => {
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

  fetchServiceProPersona = async () => {
    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    const fetchServiceProPersona = await this.props.client.query({
      query: PersonaQueries.fetchServiceProPersona
    });

    if (
      !isEmpty(
        fetchServiceProPersona.data.getServiceProviderPersonaInformation
      ) &&
      get(
        fetchServiceProPersona,
        "data.getServiceProviderPersonaInformation.success"
      )
    ) {
      let personaData = get(
        fetchServiceProPersona,
        "data.getServiceProviderPersonaInformation.data"
      );

      await this.updatePersonaData(personaData);

      // contextData.endLoading();
    }
  };

  updatePersonaData = async personaData => {
    let obj = {
      ProfessionFormData: personaData.profession,
      accrediations: { accrediations: personaData.accreditation },
      supportingDocuments: {
        supportingDocuments: personaData.supportingDocuments
      },
      referenceContacts: { referenceContacts: personaData.referenceContacts },
      initialOtherInformationData: {
        otherInformation: personaData.otherInformation
      },
      ServiceOrSkillTags: personaData.serviceOrSkillTags
        ? personaData.serviceOrSkillTags
        : []
    };

    if (isEmpty(personaData.accreditation)) {
      obj.accrediations = this.state.accrediations;
    }

    if (isEmpty(personaData.referenceContacts)) {
      obj.referenceContacts = this.state.referenceContacts;
    }

    if (isEmpty(personaData.supportingDocuments)) {
      obj.supportingDocuments = this.state.supportingDocuments;
    } else {
      personaData.supportingDocuments.map((p, i) => {
        p["docRaw"] = [];
      });
      obj.supportingDocuments = {
        supportingDocuments: personaData.supportingDocuments
      };
    }

    if (isEmpty(personaData.otherInformation)) {
      obj.initialOtherInformationData = this.state.initialOtherInformationData;
    }

    this.setState(obj);
    this.forceUpdate();
  };

  checkIncompleteFields = async () => {
    let isIncomplete = this.state.isIncomplete;
    let profession = this.state["ProfessionFormData"];
    isIncomplete = !profession.empty ? false : true;

    this.setState({ isIncomplete });
  };

  saveProfessionData = data => {
    // console.log("tESTSETSETEST");
    data["empty"] = false;
    this.setState({ ...this.state.ProfessionFormData, ...data });
    this.toggleCollapse("collapse3");
  };

  setAccrediationData = accrediations => {
    accrediations["empty"] = false;
    this.setState({ accrediations });
    this.toggleCollapse("collapse4");
  };

  // setSupportingDocuments = supportingDocuments => {
  //   supportingDocuments["empty"] = false;
  //   this.setState({ supportingDocuments });
  //   this.toggleCollapse("collapse5");
  // };

  setSupportingDocuments = supportingDocuments => {
    supportingDocuments["empty"] = false;
    this.setState({ supportingDocuments, submitDocData: false });
  };

  saveSupportingDocuments = () => {
    this.setState({ submitDocData: true, isSubmitting: true });
    this.forceUpdate();
  };

  setOtherInformation = initialOtherInformationData => {
    initialOtherInformationData["empty"] = false;
    this.setState({ initialOtherInformationData });
    this.toggleCollapse("collapse6");
  };

  setReferencesContacts = async referenceContacts => {
    referenceContacts["empty"] = false;
    let allAr = [];
    let allContacts = referenceContacts.referenceContacts;
    let pr = allContacts.map(async (field, i) => {
      // validate email here
      let res = await ValidateEmail(field);
      if (!res) {
        message.error(`${field.email} is not a valid email!`);
        allAr.push("invalid");
      } else {
        allAr.push("valid");
      }
    });

    await Promise.all(pr);

    if (!allAr.includes("invalid")) {
      this.setState({ referenceContacts });
      this.toggleCollapse("collapse4");
    }

    return true;
  };

  // getBase64 = file => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // };

  

  savePersonaServicePro = async () => {
    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    this.setState({ isSubmitting: true });
    this.professionRef.current.click();
    // this.updateSkillTags()

    const {
      accrediations,
      ProfessionFormData,
      supportingDocuments,
      ServiceOrSkillTags,
      initialOtherInformationData,
      referenceContacts
    } = this.state;

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
          showMessage("Uploading Documents...");

          let toUpload = file.docRaw[file.docRaw.length - 1];
          // let getB64File = await this.getBase64(toUpload);
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
                authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
              }
            }
          );

          if (get(uploadedFile, "data.success")) {
            let documentUrl = get(uploadedFile, "data.data");
            delete file["docRaw"];
            file["documentUrl"] = documentUrl;

            finalDocAr.push(file);
          } else {
            return showNotification("error", "An error occurred", uploadedFile.data.message);
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
    delete initialOtherInformationData["empty"];
    delete referenceContacts["empty"];

    if (this.notificationShown !== 1) {
      showMessage("Saving Data...");
      this.notificationShown = 1;
    }

    let finalObj = {
      serviceOrSkillTags: ServiceOrSkillTags,
      accreditation: accrediations.accrediations,
      profession: ProfessionFormData,
      supportingDocuments: finalDocAr,
      // supportingDocuments: supportingDocuments.supportingDocuments,
      otherInformation: initialOtherInformationData.otherInformation,
      referenceContacts: referenceContacts.referenceContacts
    };

    const queryResponse = await this.props.client.mutate({
      mutation: PersonaQueries.ServiceProPersona,
      variables: finalObj
    });

    if (
      get(
        queryResponse,
        "data.updateServiceProviderPersonaInformation.success"
      ) &&
      this.notificationShown === 1
    ) {
      showNotification(
        "success",
        "Persona Details Updated!",
        "Your Persona Details have been successfully updated!"
      );

      let personaData = get(
        queryResponse,
        "data.updateServiceProviderPersonaInformation.data"
      );
      // todo
      // this.props.contextData.updatePersonaData(personaData, "servicepro");

      await this.updatePersonaData(personaData);

      this.notificationShown = 0;

      localStorage.setItem("isOriginCorrect", true);

      // contextData.endLoading();
      if (this.isVerifyNow) {
        this.props.history.push("/servicepro/screening/review");
      }
      this.setState({ isSubmitting: false });
    } else if (
      !get(
        queryResponse,
        "data.updateServiceProviderPersonaInformation.success"
      )
    ) {
      this.setState({ isSubmitting: false });

      // contextData.endLoading();
      showNotification(
        "error",
        "An error occured",
        get(
          queryResponse,
          "data.updateServiceProviderPersonaInformation.message"
        )
      );
    }
  };

  updateSkillTags = tags => {
    this.professionRef.current.click();
    this.setState({ ServiceOrSkillTags: tags });
  };

  verifyNow = async () => {
    await this.saveSupportingDocuments();

    if (!this.props.isMenuDisabled) {
      this.saveSupportingDocuments();
      // this.setState({ isPaymentTime: true, showNotification: false });
      localStorage.setItem("isOriginCorrect", true);

      setTimeout(() => {
        this.props.history.push("/servicepro/screening/review");
      }, 4500);
      // window.location.href = "/servicepro/screening/review";
    } else {
      message.error("Please fill your details!");
    }
  };

  render() {
    const {
      openCollapse,
      ProfessionFormData,
      accrediations,
      supportingDocuments,
      ServiceOrSkillTags,
      initialOtherInformationData,
      referenceContacts,
      isSubmitting,
      submitDocData
    } = this.state;
    return (
      <>
        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse1")}
            data-type="collapseLayout"
            className={`card__title card__middle ${openCollapse["collapse1"] &&
              "active__tab"}`}
          >
            Profession
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
                professionRef={this.professionRef}
                saveProfessionData={this.saveProfessionData}
                ProfessionFormData={ProfessionFormData}
                LandlordPersonaSchema={LandlordPersonaSchema}
                accountSetting={this.props.accountSetting}
                ServiceOrSkillTags={ServiceOrSkillTags}
                updateSkillTags={this.updateSkillTags}
              />

              
            </CardBody>
          </Collapse>
        </Card>

        {/* <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse2")}
            data-type="collapseLayout"
            className={`card__title card__middle ${openCollapse["collapse2"] &&
              "active__tab"}`}
            style={{ display: "block" }}
          >
            Tag Services or Skills *
            <Tooltip
              overlayClassName="tooltip__color"
              title="Free text to tag services that you provide"
            >
              <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png" alt="i" />
            </Tooltip>
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
              <AddSkillsTags
                ServiceOrSkillTags={ServiceOrSkillTags}
                updateSkillTags={this.updateSkillTags}
              />
            </CardBody>
          </Collapse>
        </Card> */}

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse3")}
            data-type="collapseLayout"
            className={`card__title card__middle ${openCollapse["collapse3"] &&
              "active__tab"}`}
            style={{ display: "block" }}
          >
            Accreditation *&nbsp;
            <Tooltip
              overlayClassName="tooltip__color"
              title="Member / Registration Ref"
            >
              <img
                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                alt="i"
              />
            </Tooltip>
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
              <AccrediationsFieldSet
                setAccrediationData={this.setAccrediationData}
                accrediations={accrediations}
                LandlordPersonaSchema={LandlordPersonaSchema}
                {...this.props}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse5")}
            data-type="collapseLayout"
            className={`card__title card__middle ${openCollapse["collapse5"] &&
              "active__tab"}`}
            style={{ display: "block" }}
          >
            Other Information * &nbsp;
            <Tooltip
              overlayClassName="tooltip__color"
              title="need to upload supporting document of Policy number"
            >
              <img
                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                alt="i"
              />
            </Tooltip>
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
              <OtherInformation
                initialOtherInformationData={initialOtherInformationData}
                setOtherInformation={this.setOtherInformation}
                accountSetting={this.props.accountSetting}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse6")}
            data-type="collapseLayout"
            className={`card__title card__middle ${openCollapse["collapse6"] &&
              "active__tab"}`}
          >
            References Contact *
            {openCollapse["collapse6"] ? (
              <div className="details__icons active">
                <i className="mdi mdi-chevron-up"></i>
              </div>
            ) : (
              <div className="details__icons">
                <i className="mdi mdi-chevron-down down__marg"></i>
              </div>
            )}
          </CardHeader>
          <Collapse isOpen={openCollapse["collapse6"]}>
            <CardBody>
              <ReferencesContacts
                referenceContacts={referenceContacts}
                setReferencesContacts={this.setReferencesContacts}
                accountSetting={this.props.accountSetting}
              />
            </CardBody>
          </Collapse>
        </Card>

        <Card style={{ marginBottom: "1rem" }}>
          <CardHeader
            onClick={() => this.toggleCollapse("collapse4")}
            data-type="collapseLayout"
            className={`card__title card__middle ${openCollapse["collapse4"] &&
              "active__tab"}`}
          >
            Upload Documents *
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
        </Card>

        <div className="row">
          <div className="col-lg-6">
            <div className="form-group">
              <button
                disabled={isSubmitting}
                onClick={this.saveSupportingDocuments}
                className="btn btns__blue--outline"
              >
                Save & Verify Later
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <button
                // disabled={isSubmitting || !this.props.isPersonaUpdate}
                disabled= {isSubmitting}
                onClick={() => {
                  this.isVerifyNow = true;
                  this.saveSupportingDocuments();
                  this.savePersonaServicePro();

                }}
                className="btn btns__blue"
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

export default withRouter(ServiceProPersona);
