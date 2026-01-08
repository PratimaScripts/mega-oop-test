import React from "react";
import { Datepicker } from "react-formik-ui";
import { Formik, Form, Field } from "formik";
import CustomInput from "config/FormikInput";
import SerivceSkillField from "./ServiceSkillsDropdown";
import { Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const professionList = ["Handyman", "Plumber", "Electrician", "Painter",
"Bathrooms", "Roofer", "Builder", "Gardener", "Carpenter", "Landscaper",
"Plasterer", "Fencing", "Tree Surgeon", "Locksmith", "Tiler", "Central Heating",
"Boiler Repair", "Driveways / Patios" ];
const businessType = ["Sole Trader", "Ltd. Company", "Self Employed"];


const Profession = (props) => {

  // let accountSetting = props.accountSetting;
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...props.ProfessionFormData }}
      validationSchema={props.LandlordPersonaSchema.ProfessionSchemaServicePro}
      onSubmit={async (values, { validateForm, setSubmitting }) => {
        setSubmitting(true);
        const formData = {...values, profession: values.profession === 'Other' ? values.professionCustom : values.profession}
        delete formData.professionCustom
        await props.saveProfessionData(values)
        await props.updateProfessionData({profession: formData, serviceOrSkillTags: props.serviceOrSkillTags})
        setSubmitting(false)
        props.onTabChange(props.activeTab+1)
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <div className="professionform__tabs">
            <div className="tab__details">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Profession *</label>
                     
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
                        {!professionList.includes(props.ProfessionFormData?.profession) && 
                        <option key={12345} value={props.ProfessionFormData?.profession}>
                          {props.ProfessionFormData?.profession}</option>}
                        <option key={9867} value={"Other"}>Other</option>
                      </Field>
                      
                  </div>
                  {values["profession"] === "Other" && (
                      <>
                        <CustomInput
                          placeholder="Enter Profession"
                          type="text"
                          name="professionCustom"
                          required={true}
                          errors={errors}
                        />
                        <small
                          onClick={() =>
                            setFieldValue("profession", props.ProfessionFormData.profession)
                          }
                        >
                          <a href>Clear</a>
                        </small>
                      </>
                    
                    )}
                </div>
                </div>
                
                <SerivceSkillField
                values={props.serviceOrSkillTags}
                updateTags={props.updateSkillTags}
              />
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Business Type *</label>
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
                        dateFormat={"dd-MM-yyyy"}
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
                      disabled={isSubmitting}
                    >
                     {isSubmitting ? <LoadingOutlined /> : "Save & Next"}   
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

export default Profession;
