import React from "react";
import { Datepicker } from "react-formik-ui";
import { Formik, Form, Field } from "formik";
import CustomInput from "config/FormikInput";
// import ValidateVat from "config/ValidateVat";
import AddSkillsTags from "./AddServiceSkills";
import { Tooltip, 
    // message 
} from "antd";
// import get from "lodash/get";
const professionList = ["Handyman", "Plumber", "Electrician", "Other"];
const businessType = ["Sole Trader", "Ltd. Company", "Self Employed"];

const ProfessionFormSection = (props) => {
  const submitForm = async (formData) => {
    // let vatRes = await ValidateVat(formData.VAT);
    // if (!get(vatRes, "data.valid")) {
    //   message.error("The VAT Number you entered is invalid!");
    // } else {
      props.saveProfessionData(formData);
    // }
    // props.saveProfessionData(formData);
  };

  let accountSetting = props.accountSetting;
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...props.ProfessionFormData }}
      validationSchema={props.LandlordPersonaSchema.ProfessionSchemaServicePro}
      onSubmit={(values, { validateForm, setSubmitting }) => {
        setSubmitting(true);
        submitForm(values);
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <div className="professionform__tabs">
            <div className="tab__details">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Profession</label>
                    {values["profession"] === "Other" ? (
                      <>
                        <CustomInput
                          placeholder="Enter Profession"
                          type="text"
                          name="professionCustom"
                          errors={errors}
                        />
                        <small
                          onClick={() =>
                            setFieldValue("profession", "Handyman")
                          }
                        >
                          <a href>Clear</a>
                        </small>
                      </>
                    ) : (
                      <Field
                        autoComplete={"none"}
                        component="select"
                        name={`profession`}
                        className={
                          errors && errors["profession"]
                            ? "form-control error__field_show"
                            : "form-control"
                        }
                      >
                        <option selected disabled>
                          Select Profession
                        </option>
                        {professionList.map((docField, index) => {
                          return (
                            <option key={index} value={docField}>
                              {docField}
                            </option>
                          );
                        })}
                      </Field>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Business Type</label>
                    <Field
                      component="select"
                      name={`businessType`}
                      className={
                        errors && errors["businessType"]
                          ? "form-control error__field_show"
                          : "form-control"
                      }
                    >
                      <option selected disabled>
                        Select Business Type
                      </option>
                      {businessType.map((docField, index) => {
                        return (
                          <option key={index} value={docField}>
                            {docField}
                          </option>
                        );
                      })}
                    </Field>
                  </div>
                </div>
              </div>

              <AddSkillsTags
                ServiceOrSkillTags={props.ServiceOrSkillTags}
                updateSkillTags={props.updateSkillTags}
              />

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Company / Business Name
                    </label>
                    <CustomInput
                      placeholder="Enter Company name"
                      type="text"
                      name="companyName"
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">UTR Number</label>
                    <Tooltip
                      overlayClassName="tooltip__color"
                      title="Enter your 10 digit tax reference number (UTR) used for tax return or National Insurance number if you don’t file tax return."
                    >
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                        alt="i"
                      />
                    </Tooltip>
                    <CustomInput
                      placeholder="UTR or NI Number"
                      type="text"
                      value={values.UTR}
                      name="UTR"
                      onChange={(e) =>
                        e.target.value.length <= 10 &&
                        setFieldValue("UTR", e.target.value)
                      }
                      errors={errors}
                    />
                    {/* <MyNumberInput
                      placeholder="UTR or NI Number"
                      className={
                        errors && errors["UTR"]
                          ? "tab__deatils--input error__field_show"
                          : "tab__deatils--input"
                      }
                      format="##########"
                      mask="_"
                      value={values.UTR}
                      onValueChange={val =>
                        setFieldValue("UTR", String(val.floatValue))
                      }
                    /> */}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Vat Number</label>
                    {/* <MyNumberInput
                    placeholder="VAT Number"
                    className={
                      errors && errors["vatNumber"]
                        ? "tab__deatils--input error__field_show"
                        : "tab__deatils--input"
                    }
                    format="########"
                    mask="_"
                    value={values.vatNumber}
                    onValueChange={val =>
                      setFieldValue("vatNumber", String(val.floatValue))
                    }
                  /> */}
                    <CustomInput
                      placeholder="Enter VAT Number"
                      type="text"
                      name="VAT"
                      required={false}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Start Date</label>
                    <div className="date__flex">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fa fa-calendar" />
                        </div>
                      </div>
                      <Datepicker
                        name="startDate"
                        todayButton="Today"
                        showYearDropdown
                        dateFormat={
                          accountSetting && accountSetting["dateFormat"]
                            ? accountSetting["dateFormat"]
                            : process.env.REACT_APP_DATE_FORMAT
                        }
                        showMonthDropdown
                        dropdownMode={"select"}
                        disabledKeyboardNavigation={false}
                      required={false}
                        className={
                          errors && errors["startDate"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <button
                      ref={props.professionRef}
                      // hidden={props.hideSaveButton}
                      type="submit"
                      className="btn btns__blue"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProfessionFormSection;
