/* eslint-disable array-callback-return */
import React from "react";
import ProfessionFormSection from "../../SettingsTabs/PersonaProfile/Personas/PersonaLandlord/ProfessionFormSection";
import DynamicFieldSet from "../../SettingsTabs/PersonaProfile/Personas/DynamicFieldSet";
import AccrediationsFieldSet from "../../SettingsTabs/PersonaProfile/Personas/DynamicFieldSetAccrediations";
import LandlordPersonaSchema from "../../../../config/FormSchemas/LandlordPersona";
import Axios from "axios";
import isEmpty from "lodash/isEmpty";
import { Checkbox } from "antd";
import get from "lodash/get";
import showMessage from "../../../../config/ShowLoadingMessage";
import showNotification from "../../../../config/Notification";
import cookie from "react-cookies";
import "./styles.scss";

class LandlordPersona extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptConditions: false,
      isPaymentTime: false,
      submitDocData: false,
      isSubmitting: true,
      isEditableOn: {
        profession: false,
        accrediation: false,
        supportingDocuments: false
      },
      accrediations: {
        accrediations: [
          {
            organization: "",
            documentNumber: "",
            validTillDate: new Date()
          }
        ],
        empty: true
      },
      ProfessionFormData: {
        jobTitle: "",
        companyName: "",
        startDate: new Date(),
        companyWebsite: "",
        companyTelephone: "",
        empty: true
      },
      supportingDocuments: {
        supportingDocuments: [
          { document: "", documentNumber: "", docRaw: [], documentUrl: "" }
        ],
        empty: true
      }
    };

    this.professionRef = React.createRef();
    this.accrediationsRef = React.createRef();
    this.supportingDocRef = React.createRef();
  }

  // componentDidMount() {
  //   this.fetchLandlordPersona();
  // }

  componentDidMount() {


    // if (isEmpty(initData)) {
    this.fetchLandlordPersona();
    // }
  }

  fetchLandlordPersona = async () => {
    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    const fetchLandlordPersonas = await this.props.client.query({
      query: PersonaQueries.fetchLandlordPersona
    });

    if (
      !isEmpty(fetchLandlordPersonas.data.getLandlordPersonaInformation) &&
      get(fetchLandlordPersonas, "data.getLandlordPersonaInformation.success")
    ) {
      let personaData = get(
        fetchLandlordPersonas,
        "data.getLandlordPersonaInformation.data"
      );

      await this.updatePersonaData(personaData);

      // contextData.endLoading();
    }
  };

  updatePersonaData = async personaData => {
    let obj = {
      ProfessionFormData: personaData.profession,
      accrediations: {
        accrediations: personaData.accreditation
      },
      supportingDocuments: {
        supportingDocuments: personaData.supportingDocuments
      }
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
        supportingDocuments: personaData.supportingDocuments
      };
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

  saveProfessionData = ProfessionFormData => {
    ProfessionFormData["empty"] = false;
    this.setState({ ProfessionFormData });
    this.turnEditableSection("profession");
    showNotification(
      "success",
      "Details Updated!",
      "Profession Details Updated"
    );
  };

  setAccrediationData = accrediations => {
    accrediations["empty"] = false;
    this.setState({ accrediations });
    this.turnEditableSection("accrediation");
    showNotification(
      "success",
      "Updated successfully!",
      "Accreditations have been updated"
    );
  };

  setSupportingDocuments = supportingDocuments => {
    supportingDocuments["empty"] = false;
    this.setState({ supportingDocuments });
    this.turnEditableSection("supportingDocuments");
    showNotification(
      "success",
      "Updated successfully!",
      "Supporting Documents have been updated"
    );
  };

  // saveSupportingDocuments = () => {
  //   this.setState({
  //     submitDocData: true,
  //     isSubmitting: true
  //   });
  //   this.forceUpdate();
  // };

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  verifyNow = () => {
    this.setState({ isPaymentTime: true });
    // this.saveSupportingDocuments
  };

  turnEditableSection = type => {
    let obj = this.state.isEditableOn;
    obj[type] = !obj[type];

    this.setState({ isEditableOn: obj });
  };

  savePersonaLandlord = async () => {
    const {
      accrediations,
      ProfessionFormData,
      supportingDocuments
    } = this.state;

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
          showMessage("Uploading Documents...");

          let toUpload = file.docRaw[file.docRaw.length - 1];

          var formData = new FormData();
          formData.append("file", toUpload);
          formData.append("filename", toUpload.name);
          // for what purpose the file is uploaded to the server.
          formData.append("uploadType", "Screening");

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

    showMessage("Saving Data...");

    const queryResponse = await this.props.client.mutate({
      mutation: PersonaQueries.LandlordPersona,
      variables: {
        accreditation: accrediations.accrediations,
        profession: ProfessionFormData,
        supportingDocuments: finalDocAr
        // supportingDocuments: supportingDocuments.supportingDocuments
      }
    });

    if (get(queryResponse, "data.updateLandlordPersonaInformation.success")) {
      showNotification(
        "success",
        "Persona Details Updated!",
        "Your Persona Details have been successfully updated!"
      );

      let personaData = get(
        queryResponse,
        "data.updateLandlordPersonaInformation.data"
      );

      await this.updatePersonaData(personaData);

      this.setState({ isSubmitting: false });

      // contextData.endLoading();
    } else {
      // contextData.endLoading();
      this.setState({ isSubmitting: false });

      showNotification(
        "error",
        "An error occured",
        get(queryResponse, "data.updateLandlordPersonaInformation.message")
      );
    }
  };

  finalSave = async () => {
    await this.savePersonaLandlord();
    this.props.createScreeningOrder();
  };

  render() {
    const {
      ProfessionFormData,
      accrediations,
      supportingDocuments,
      isSubmitting,
      submitDocData,
      isEditableOn,
      acceptConditions
    } = this.state;

    let professionButton = isEditableOn["profession"] ? (
      <button
        type="button"
        onClick={() => {
          this.professionRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("profession");
        }}
        className="btn__edit--screening"
      >
        <i className="fas fa-edit" /> Edit
      </button>
    );

    let accrediationButton = isEditableOn["accrediation"] ? (
      <button
        type="button"
        onClick={() => {
          this.accrediationsRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("accrediation");
        }}
        className="btn__edit--screening"
      >
        <i className="fas fa-edit" /> Edit
      </button>
    );

    let supportingDocumentsButton = isEditableOn["supportingDocuments"] ? (
      <button
        type="button"
        onClick={() => {
          this.supportingDocRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("supportingDocuments");
        }}
        className="btn__edit--screening"
      >
        <i className="fas fa-edit" /> Edit
      </button>
    );
    return (
      <>
        <div className="screening__card">
          <div className="heading__edit">
            <h4>Profession</h4>
            {professionButton}
          </div>
          <div className={!isEditableOn.profession && "cover"}>
            <ProfessionFormSection
              saveProfessionData={this.saveProfessionData}
              ProfessionFormData={ProfessionFormData}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
              hideSaveButton={true}
              professionRef={this.professionRef}
            />
          </div>
        </div>

        <div className="screening__card">
          <div className="heading__edit">
            <h4>Accreditation</h4>
            {accrediationButton}
          </div>
          <div className={!isEditableOn.accrediation && "cover"}>
            <AccrediationsFieldSet
              setAccrediationData={this.setAccrediationData}
              accrediations={accrediations}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accrediationsRef={this.accrediationsRef}
              hideSaveButton={true}
              {...this.props}
            />
          </div>
        </div>

        <div className="screening__card">
          <div className="heading__edit">
            <h4> Upload Documents *</h4>
            {supportingDocumentsButton}
          </div>
          <div className={!isEditableOn.supportingDocuments && "cover"}>
            <DynamicFieldSet
              submitDocData={submitDocData}
              setSupportingDocuments={this.setSupportingDocuments}
              supportingDocuments={supportingDocuments}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
              supportingDocRef={this.supportingDocRef}
              hideSaveButton={true}
            />
          </div>
        </div>
        <div className="form-group col-lg-12">
          <Checkbox
            checked={acceptConditions}
            onClick={e =>
              this.setState({
                acceptConditions: e.target.checked,
                isSubmitting: !e.target.checked
              })
            }
          >
            <b>
              {" "}
              In order to complete your references fully, we need to perform
              identity and credit check via credit bureau, partner agencies and
              referee contacts. This is ‘soft’ check that do not impact credit
              rating report. By checking this box, you confirm that you are
              happy for us to perform necessary checks, collect and retain data
              according to agreed ‘Terms’ & ‘Privacy’ policy
            </b>
          </Checkbox>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="form-group">
              <button
                onClick={this.savePersonaLandlord}
                // onClick={this.savePersonaLandlord}
                className="btn btns__blue--outline"
              >
                Validate
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <button
                disabled={isSubmitting}
                // onClick={this.verifyNow}
                onClick={this.finalSave}
                className="btn btns__blue"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LandlordPersona;
