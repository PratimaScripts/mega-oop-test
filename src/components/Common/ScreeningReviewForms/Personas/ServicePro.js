/* eslint-disable array-callback-return */

import React from "react";
import ProfessionFormSection from "../../SettingsTabs/PersonaProfile/Personas/PersonaServicePro/ProfessionFormSection";
import ReferencesContacts from "../../SettingsTabs/PersonaProfile/Personas/PersonaServicePro/ReferencesContacts";
import AccrediationsFieldSet from "../../SettingsTabs/PersonaProfile/Personas/DynamicFieldSetAccrediations";
import DynamicFieldSet from "../../SettingsTabs/PersonaProfile/Personas/DynamicFieldSet";
import cookie from "react-cookies";

import LandlordPersonaSchema from "../../../../config/FormSchemas/LandlordPersona";
import AddSkillsTags from "../../SettingsTabs/PersonaProfile/Personas/PersonaServicePro/AddServiceSkills";
import OtherInformation from "../../SettingsTabs/PersonaProfile/Personas/PersonaServicePro/OtherInformation";
import Axios from "axios";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import ValidateEmail from "../../../../config/ValidateEmail";
import showMessage from "../../../../config/ShowLoadingMessage";
import showNotification from "../../../../config/Notification";
import "./styles.scss";
import { message, Checkbox } from "antd";
class ServiceProPersona extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: true,
      acceptConditions: false,
      submitDocData: false,
      isEditableOn: {
        profession: false,
        addSkills: false,
        accrediation: false,
        otherInformation: false,
        referencesContacts: false,
        supportingDocuments: false
      },
      ServiceOrSkillTags: [],
      referenceContacts: {
        referenceContacts: [{ contactName: "", email: "" }]
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
        companyName: "",
        UTR: "",
        startDate: new Date(),
        VAT: ""
      },
      initialOtherInformationData: {
        otherInformation: [
          { policyName: "", providerName: "", validTillDate: new Date() }
        ]
      },
      supportingDocuments: {
        supportingDocuments: [
          {
            document: "something here",
            documentNumber: "123",
            docRaw: [],
            documentUrl: "/images/avatar.png"
          }
        ],
        empty: true
      }
    };

    this.professionRef = React.createRef();
    this.tagsSkillsRef = React.createRef();
    this.accrediationsRef = React.createRef();
    this.otherInformationRef = React.createRef();
    this.referenceContactRef = React.createRef();
    this.supportingDocRef = React.createRef();
  }

  componentDidMount() {
    this.fetchServiceProPersona();

  }

  turnEditableSection = type => {
    let obj = this.state.isEditableOn;
    obj[type] = !obj[type];

    this.setState({ isEditableOn: obj });
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

  saveProfessionData = ProfessionFormData => {
    ProfessionFormData["empty"] = false;
    this.setState({ ProfessionFormData });
    this.turnEditableSection("profession");
    showNotification(
      "success",
      "Updated successfully!",
      "Profession Data has been updated"
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

  // setSupportingDocuments = supportingDocuments => {
  //   supportingDocuments["empty"] = false;
  //   this.setState({ supportingDocuments });
  //   this.toggleCollapse("collapse5");
  // };

  setSupportingDocuments = supportingDocuments => {
    this.setState({ supportingDocuments });
    this.turnEditableSection("supportingDocuments");
    showNotification(
      "success",
      "Updated successfully!",
      "Supporting Documents have been updated"
    );
  };

  // saveSupportingDocuments = () => {
  //   this.setState({ submitDocData: true, isSubmitting: true });
  //   this.forceUpdate();
  // };

  setOtherInformation = initialOtherInformationData => {
    initialOtherInformationData["empty"] = false;
    this.setState({ initialOtherInformationData });
    this.turnEditableSection("otherInformation");
    showNotification(
      "success",
      "Updated successfully!",
      "Other Info has been updated"
    );
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
      showNotification(
        "success",
        "Updated successfully!",
        "References have been updated"
      );
      this.turnEditableSection("referencesContacts");
      this.setState({ referenceContacts });
    }

    return true;
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
    const { PersonaQueries } = this.props;
    // contextData.startLoading();
    this.setState({ isSubmitting: true });

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
    delete initialOtherInformationData["empty"];
    delete referenceContacts["empty"];
    showMessage("Saving Data...");

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
      get(queryResponse, "data.updateServiceProviderPersonaInformation.success")
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

      // this.props.contextData.updatePersonaData(personaData, "servicepro");

      await this.updatePersonaData(personaData);

      // contextData.endLoading();
      this.setState({ isSubmitting: false });
    } else {
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
    this.setState({ ServiceOrSkillTags: tags });
    this.turnEditableSection("addSkills");
    showNotification(
      "success",
      "Updated successfully!",
      "Skills have been updated"
    );
  };

  finalSave = async () => {
    await this.savePersonaLandlord();
    this.props.createScreeningOrder();
  };

  render() {
    const {
      ProfessionFormData,
      accrediations,
      ServiceOrSkillTags,
      initialOtherInformationData,
      referenceContacts,
      isSubmitting,
      isEditableOn,
      submitDocData,
      supportingDocuments,
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

    let addSkillsButton = isEditableOn["addSkills"] ? (
      <button
        type="button"
        onClick={() => {
          this.tagsSkillsRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("addSkills");
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

    let referencesContactsButton = isEditableOn["referencesContacts"] ? (
      <button
        type="button"
        onClick={() => {
          this.referenceContactRef.current.click();
        }}
        className="btn__edit--screening"
      >
        <i className="far fa-save" /> Save
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          this.turnEditableSection("referencesContacts");
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
            <h4>Tag Services or Skills</h4>
            {addSkillsButton}
          </div>
          <div className={!isEditableOn.addSkills && "cover"}>
            <AddSkillsTags
              ServiceOrSkillTags={ServiceOrSkillTags}
              updateSkillTags={this.updateSkillTags}
              tagsSkillsRef={this.tagsSkillsRef}
              hideSaveButton={true}
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
            <h4>Other Information</h4>
            {otherInformationButton}
          </div>
          <div className={!isEditableOn.otherInformation && "cover"}>
            <OtherInformation
              initialOtherInformationData={initialOtherInformationData}
              setOtherInformation={this.setOtherInformation}
              accountSetting={this.props.accountSetting}
              otherInformationRef={this.otherInformationRef}
              hideSaveButton={true}
            />
          </div>
        </div>

        <div className="screening__card">
          <div className="heading__edit">
            <h4>References Contact</h4>
            {referencesContactsButton}
          </div>
          <div className={!isEditableOn.referencesContacts && "cover"}>
            <ReferencesContacts
              referenceContacts={referenceContacts}
              setReferencesContacts={this.setReferencesContacts}
              accountSetting={this.props.accountSetting}
              referenceContactRef={this.referenceContactRef}
              hideSaveButton={true}
            />
          </div>
        </div>

        <div className="screening__card">
          <div className="heading__edit">
            <h4>Supporting Documents</h4>
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
                Validate
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <button
                disabled={isSubmitting}
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

export default ServiceProPersona;
