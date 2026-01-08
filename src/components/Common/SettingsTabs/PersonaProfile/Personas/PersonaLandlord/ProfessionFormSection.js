import React from "react";
import { Datepicker } from "react-formik-ui";
import { Formik, Form, Field } from "formik";
import CustomInput from "../../../../../../config/FormikInput";
import CountryPicker from "../../../../../../config/CountryCodeSelector";

const professionList = ["Employed", "Self Employed", "Other"];

const jobType = [
  "Full-Time",
  "Part-Time",
  "Fixed-Term Contract",
  "Temporary Contract",
  "Interim",
  "Probation",
];

const ProfessionFormSection = (props) => {
  return (
    <Formik
      enableReinitialize
      ref={props.professionSectionRef}
      initialValues={{ ...props.ProfessionFormData }}
      validationSchema={props.LandlordPersonaSchema.ProfessionSchema}
      onSubmit={(values, { validateForm, setSubmitting }) => {
        setSubmitting(true);
        props.saveProfessionData(values);
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <input type="hidden" value="something" />
          <div className="profession_tabs">
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
                            setFieldValue("profession", "Full-Time")
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
                          values && values["profession"]
                            ? "form-control greenger"
                            : errors && errors["profession"]
                            ? "form-control error__field_show"
                            : "form-control tab__deatils--select"
                        }
                      >
                        <option selected disabled>
                          Select Profession
                        </option>
                        {!professionList.includes(values["profession"]) ? (
                          <option
                            key={values["profession"]}
                            value={values["profession"]}
                          >
                            {values["profession"]}
                          </option>
                        ) : null}
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
                    <label className="tab__deatils--label">
                      Select Job Type
                    </label>
                    <Field
                      autoComplete={"none"}
                      component="select"
                      name={`jobType`}
                      className={
                        values && values["jobType"]
                          ? "form-control greenger"
                          : errors && errors["jobType"]
                          ? "form-control error__field_show"
                          : "form-control tab__deatils--select"
                      }
                    >
                      <option value selected disabled>
                        Select Job Type
                      </option>
                      {jobType.map((docField, index) => {
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

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Company / Business Name
                    </label>
                    <CustomInput
                      placeholder="Company / Business Name"
                      type="text"
                      name="companyName"
                      values={values}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Job title</label>
                    <CustomInput
                      placeholder="Job title"
                      type="text"
                      name="jobTitle"
                      values={values}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
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
                        // dateFormat={process.env.REACT_APP_DATE_FORMAT}
                        showMonthDropdown
                        dateFormat={"dd-MM-yyyy"}
                        dropdownMode={"select"}
                        disabledKeyboardNavigation={false}
                        className={
                          errors && errors["startDate"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Company Website 2
                    </label>
                    <CustomInput
                      onBlur={() => {
                        const value = values["companyWebsite"];
                        if (
                          !value.includes("https://") &&
                          !value.includes("http://")
                        ) {
                          setFieldValue("companyWebsite", "https://" + value);
                        }
                      }}
                      placeholder="Website URL"
                      type="text"
                      name="companyWebsite"
                      errors={errors}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Office Telephone
                    </label>
                    <div className="date__flex">
                      <CountryPicker
                        name="companyTelephone"
                        value={`${values.companyTelephone}`}
                        setValue={(val, countryCode) => {
                          setFieldValue("companyTelephone", countryCode + val);
                        }}
                        className={
                          values && values["companyTelephone"]
                            ? "tab__deatils--input greenger"
                            : errors && errors["companyTelephone"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                      />
                      {/* <div className="input-group-prepend">
                        <div className="input-group-text">+44</div>
                      </div>
                      <MyNumberInput
                        autoComplete={"none"}
                        placeholder="Office Telephone"
                        className={
                          errors && errors["companyTelephone"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        format="(###) ###-####"
                        mask="_"
                        value={values.companyTelephone}
                        onValueChange={val =>
                          setFieldValue(
                            "companyTelephone",
                            String(val.floatValue)
                          )
                        }
                      /> */}
                    </div>
                    {/* <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="tab__deatils--label">
                    Office Telephone
                  </label>
                  <div className="date__flex">
                    <CountryPicker
                      name="companyTelephone"
                      value={`${values.companyTelephone}`}
                      setValue={(val, countryCode) => {
                        setFieldValue("companyTelephone", countryCode + val);
                      }}
                      className={
                        errors && errors["companyTelephone"]
                          ? "tab__deatils--input error__field_show"
                          : "tab__deatils--input"
                      }
                    />
                    <MyNumberInput
                      autoComplete={"none"}
                      placeholder="Office Telephone"
                      className={
                        errors && errors["companyTelephone"]
                          ? "tab__deatils--input error__field_show"
                          : "tab__deatils--input"
                      }
                      format="(###) ###-####"
                      mask="_"
                      value={values.companyTelephone}
                      onValueChange={val =>
                        setFieldValue(
                          "companyTelephone",
                          String(val.floatValue)
                        )
                      }
                    /> */}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <div className="form-group">
                    <button
                      // hidden={props.hideSaveButton}
                      // ref={props.professionRef}
                      type="submit"
                      className="btn btn-outline-primary btn-sm px-5"
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
