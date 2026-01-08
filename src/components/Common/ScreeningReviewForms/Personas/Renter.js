/* eslint-disable array-callback-return */
import React from "react";
import ProfessionFormSection from "../../SettingsTabs/PersonaProfile/Personas/PersonaRenter/IncomeFormSection";
import DynamicFieldSet from "../../SettingsTabs/PersonaProfile/Personas/DynamicFieldSet";
import OtherInformation from "../../SettingsTabs/PersonaProfile/Personas/PersonaRenter/OtherInformation";
import LandlordAgentReference from "../../SettingsTabs/PersonaProfile/Personas/PersonaRenter/LandlordAgentReference";
import LandlordPersonaSchema from "../../../../config/FormSchemas/LandlordPersona";
import RightToRent from "../../SettingsTabs/PersonaProfile/Personas/PersonaRenter/RightToRent";
import Axios from "axios";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { Checkbox } from "antd";
import cookie from "react-cookies";
import showMessage from "../../../../config/ShowLoadingMessage";
import showNotification from "../../../../config/Notification";
import "./styles.scss";

class RenterPersona extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: true,
      showNotification: true,
      isPaymentTime: false,
      acceptConditions: false,
      submitDocData: false,
      isEditableOn: {
        income: false,
        agentReference: false,
        otherInformation: false,
        rightToRent: false,
        supportingDocuments: false
      },
      openCollapse: {
        collapse1: true,
        collapse2: false,
        collapse3: false,
        collapse4: false,
        collapse5: false,
        isIncomplete: false
      },
      landLordOrAgentReference: {
        isSameAddress: false,
        landlordName: "", // Landlord/Agent's Full Name
        landlordContactNumber: "", // Landlord/Agent's Contact Number
        landlordEmail: "", //Landlord/Agent's Email
        rentPerMonth: "",
        rentalStartDate: new Date(),
        durationInMonth: "1"
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
        endorsementFromHomeOffice: false
      },
      otherInformation: {
        moveInDate: new Date(),
        smoking: false,
        incomeSupport: false,
        disability: false
      },
      income: {
        startDate: new Date(),
        endDate: new Date(),
        salary: {
          amount: 0
        },
        hoursPerWeek: 40,
        workdaysPerWeek: 5
      },
      supportingDocuments: {
        supportingDocuments: [
          { document: "", documentNumber: "", docRaw: [], documentUrl: "" }
        ]
      }
    };
    this.incomeRef = React.createRef();
    this.agentReferenceRef = React.createRef();
    this.otherInformationRef = React.createRef();
    this.supportingDocRef = React.createRef();
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.fetchRenterPersona();
  //   }, 1500);
  // }
  componentDidMount() {


    // if (isEmpty(initData)) {
    this.fetchRenterPersona();
    // }
  }

  turnEditableSection = type => {
    let obj = this.state.isEditableOn;
    obj[type] = !obj[type];

    this.setState({ isEditableOn: obj });
  };

  fetchRenterPersona = async () => {
    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    const fetchRenterPersonas = await this.props.client.query({
      query: PersonaQueries.fetchRenterPersona
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

  updatePersonaData = async personaData => {
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
        supportingDocuments: personaData.supportingDocuments
      };
    }

    this.setState(obj);
    this.forceUpdate();
  };

  saveProfessionData = income => {
    this.setState({ income });
    showNotification("success", "Details Updated!", "Income Details Updated");
    this.turnEditableSection("income");
  };

  updateRTAData = (event, id) => {
    let initialData = this.state.rightToRent;

    initialData[id] = !initialData[id];

    this.setState({ rightToRent: initialData });
  };

  saveLandlordAgentReference = landLordOrAgentReference => {
    this.setState({ landLordOrAgentReference });
    showNotification(
      "success",
      "Details Updated!",
      "Reference Details Updated"
    );
    this.turnEditableSection("agentReference");
  };

  saveOtherInformation = otherInformation => {
    this.setState({ otherInformation });
    showNotification(
      "success",
      "Details Updated!",
      "Other Information Updated"
    );
    this.turnEditableSection("otherInformation");
  };

  // setSupportingDocuments = supportingDocuments => {
  //   this.setState({ supportingDocuments });
  // };

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

  saveSupportingDocuments = () => {
    this.setState({ submitDocData: true, isSubmitting: true });
    this.forceUpdate();
  };

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  savePersonaLandlord = async () => {
    const {
      otherInformation,
      income,
      supportingDocuments,
      rightToRent,
      landLordOrAgentReference
    } = this.state;

    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    this.setState({ isSubmitting: true });
    let uploadSupportingDocuments;
    let uploadableFiles = get(supportingDocuments, "supportingDocuments");

    let finalDocAr = [];

    if (!isEmpty(uploadableFiles)) {
      if (this.state.showNotification) {
        showMessage("Uploading Documents...");
      }

      uploadSupportingDocuments = uploadableFiles.map(async (file, i) => {
        if (file.docRaw && !isEmpty(file.docRaw)) {
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

    if (this.state.showNotification) {
      showMessage("Saving Data...");
    }

    const queryResponse = await this.props.client.mutate({
      mutation: PersonaQueries.updateRenterPersona,
      variables: {
        otherInformation,
        income,
        rightToRent,
        landLordOrAgentReference,
        supportingDocuments: finalDocAr
        // supportingDocuments: supportingDocuments.supportingDocuments
      }
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
      this.setState({ isSubmitting: false, showNotification: true });
    } else {
      // contextData.endLoading();
      this.setState({ isSubmitting: false, showNotification: true });

      showNotification(
        "error",
        "An error occured",
        get(queryResponse, "data.updateRenterPersonaInformation.message")
      );
    }
  };

  verifyNow = () => {
    if (!this.props.isMenuDisabled) {
      this.setState({ isPaymentTime: true, showNotification: false });
      this.saveSupportingDocuments();
    }
  };

  finalSave = async () => {
    await this.savePersonaLandlord();
    this.props.createScreeningOrder();
  };

  render() {
    const {
      income,
      supportingDocuments,
      rightToRent,
      otherInformation,
      landLordOrAgentReference,
      isSubmitting,
      submitDocData,
      isEditableOn,
      acceptConditions
    } = this.state;

    let incomeButton = isEditableOn["income"] ? (
      <button
        type="button"
        onClick={() => {
          this.incomeRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("income");
        }}
        className="btn__edit--screening"
      >
        <i className="fas fa-edit" /> Edit
      </button>
    );

    let agentReferenceButton = isEditableOn["agentReference"] ? (
      <button
        type="button"
        onClick={() => {
          this.agentReferenceRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("agentReference");
        }}
        className="btn__edit--screening"
      >
        <i className="fas fa-edit" /> Edit
      </button>
    );

    let otherInformationButton = isEditableOn["otherInformation"] ? (
      <button
        type="button"
        onClick={() => {
          this.otherInformationRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("otherInformation");
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

    let rightToRentButton = isEditableOn["rightToRent"] ? (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("rightToRent");
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("rightToRent");
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
            <h4>Income *</h4>
            {incomeButton}
          </div>
          <div className={!isEditableOn.income && "cover"}>
            <ProfessionFormSection
              saveProfessionData={this.saveProfessionData}
              income={income}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
              hideSaveButton={true}
              incomeRef={this.incomeRef}
            />
          </div>
        </div>

        <div className="screening__card">
          <div className="heading__edit">
            <h4>Landlord and Agent Reference *</h4>
            {agentReferenceButton}
          </div>
          <div className={!isEditableOn.agentReference && "cover"}>
            <LandlordAgentReference
              landLordOrAgentReference={landLordOrAgentReference}
              LandlordPersonaSchema={LandlordPersonaSchema}
              saveLandlordAgentReference={this.saveLandlordAgentReference}
              accountSetting={this.props.accountSetting}
              hideSaveButton={true}
              agentReferenceRef={this.agentReferenceRef}
            />
          </div>
        </div>

        <div className="screening__card">
          <div className="heading__edit">
            <h4>Other Information *</h4>
            {otherInformationButton}
          </div>
          <div className={!isEditableOn.otherInformation && "cover"}>
            <OtherInformation
              saveOtherInformation={this.saveOtherInformation}
              otherInformation={otherInformation}
              LandlordPersonaSchema={LandlordPersonaSchema}
              accountSetting={this.props.accountSetting}
              hideSaveButton={true}
              otherInformationRef={this.otherInformationRef}
            />
          </div>
        </div>

        <div className="screening__card">
          <div className="heading__edit">
            <h4>Right to Rent (Prelimenary) *</h4>
            {rightToRentButton}
          </div>
          <div className={!isEditableOn.rightToRent && "cover"}>
            <RightToRent
              rightToRent={rightToRent}
              updateRTAData={this.updateRTAData}
              accountSetting={this.props.accountSetting}
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
                disabled={isSubmitting}
                onClick={this.savePersonaLandlord}
                className="btn btns__blue--outline"
              >
                Save & Verify Later
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <button
                disabled={isSubmitting}
                onClick={this.finalSave}
                // onClick={this.saveSupportingDocuments}
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

export default RenterPersona;
