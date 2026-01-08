import React from "react";
import { Formik, Form, Field } from "formik";
import CustomInput from "../../../../../../config/FormikInput";
import MyNumberInput from "../../../../../../config/CustomNumberInput";
import CountryPicker from "../../../../../../config/CountryCodeSelector";
import { DatePicker, Tooltip } from "antd";
import moment from "moment";

// import calculateAffordability from "../../../../../../config/AffordabilityCalculator";

const professionList = ["Employed", "Self Employed", "Student", "Not Working"];

const jobType = [
  "Full-Time",
  "Part-Time",
  "Fixed-Term Contract",
  "Temporary Contract",
  "Interim",
  "Probation",
];

const ProfessionFormSection = (props) => {
  // let accountSetting = props.accountSetting;
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...props.income }}
      onSubmit={(values, { validateForm, setSubmitting }) => {
        setSubmitting(true);

        // calculateAffordability(values);
        props.saveProfessionData(values);
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <div className="income__tabs">
            <div className="tab__details">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Profession</label>
                    <Field
                      autoComplete={"none"}
                      component="select"
                      name={`profession`}
                      className={
                        errors && errors["profession"]
                          ? "form-control error__field_show"
                          : "form-control tab__deatils--select"
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
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">Job Type</label>
                    <Field
                      autoComplete={"none"}
                      component="select"
                      name={`jobType`}
                      className={
                        errors && errors["jobType"]
                          ? "form-control error__field_show"
                          : "form-control tab__deatils--select"
                      }
                      disabled={
                        (values.profession === "Student" ||
                          values.profession === "Not Working") &&
                        true
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
                    <label className="tab__deatils--label">Job title</label>
                    <CustomInput
                      placeholder="Enter Job title"
                      type="text"
                      name="jobTitle"
                      errors={errors}
                      disabled={
                        (values.profession === "Student" ||
                          values.profession === "Not Working") &&
                        true
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Salary or Income
                    </label>
                    <div className="flex__div">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fas fa-pound-sign" />
                        </div>
                      </div>
                      <MyNumberInput
                        name="salary.amount"
                        placeholder="Salary or Income"
                        className={
                          errors && errors["salary.amount"]
                            ? "tab__deatils--input error__field_show border__radius--zero"
                            : "tab__deatils--input border__radius--zero"
                        }
                        mask="_"
                        value={values.salary.amount}
                        onValueChange={(val) =>
                          setFieldValue("salary.amount", val.floatValue)
                        }
                        disabled={
                          (values.profession === "Student" ||
                            values.profession === "Not Working") &&
                          true
                        }
                      />
                      <Field
                        name="salary.duration"
                        className="tab__deatils--input"
                        component="select"
                        disabled={
                          (values.profession === "Student" ||
                            values.profession === "Not Working") &&
                          true
                        }
                      >
                        <option value disabled selected>
                          Select Duration
                        </option>

                        <option value="daily">Daily</option>
                        <option value="hourly">Hourly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>

              {values.salary.duration === "yearly" ||
              values.salary.duration === "monthly" ? (
                <></>
              ) : (
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="tab__deatils--label">
                        Workdays per week
                      </label>
                      <MyNumberInput
                        name="workdaysPerWeek"
                        placeholder="Workdays per week"
                        className={
                          errors && errors["workdaysPerWeek"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        min={1}
                        max={7}
                        mask="_"
                        value={values.workdaysPerWeek}
                        onValueChange={(val) =>
                          setFieldValue("workdaysPerWeek", val.floatValue)
                        }
                        disabled={
                          (values.jobType === "Part-Time" ||
                          values.jobType === "Temporary Contract"
                            ? false
                            : true) ||
                          (values.profession === "Student" ||
                          values.profession === "Not Working"
                            ? true
                            : false)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="tab__deatils--label">
                        Hours per week
                      </label>
                      <MyNumberInput
                        name="hoursPerWeek"
                        placeholder="Hours per week"
                        className={
                          errors && errors["hoursPerWeek"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        min={1}
                        max={24}
                        mask="_"
                        value={values.hoursPerWeek}
                        onValueChange={(val) =>
                          setFieldValue("hoursPerWeek", val.floatValue)
                        }
                        disabled={
                          (values.jobType === "Part-Time" ||
                          values.jobType === "Temporary Contract"
                            ? false
                            : true) ||
                          (values.profession === "Student" ||
                          values.profession === "Not Working"
                            ? true
                            : false)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Company / Business Name <span>*</span>
                    </label>
                    <CustomInput
                      placeholder="Enter Company name"
                      type="text"
                      name="companyName"
                      required
                      errors={errors}
                      disabled={
                        (values.profession === "Student" ||
                          values.profession === "Not Working") &&
                        true
                      }
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Manager Full Name
                      <Tooltip
                        overlayClassName="tooltip__color"
                        title="This contact reference field will be used for employment referencing your past income data. In case if you are self-employed, please provide Accountant details."
                      >
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                          alt="i"
                        />
                      </Tooltip>
                    </label>
                    <CustomInput
                      placeholder="Enter Manager name"
                      type="text"
                      name="managerName"
                      errors={errors}
                      disabled={
                        (values.profession === "Student" ||
                          values.profession === "Not Working") &&
                        true
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Manager's Contact Number
                      <Tooltip
                        overlayClassName="tooltip__color"
                        title="This contact reference field will be used for employment referencing your past income data. In case if you are self-employed, please provide Accountant details."
                      >
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                          alt="i"
                        />
                      </Tooltip>
                    </label>
                    <CountryPicker
                      name="managerContactNumber"
                      placeholder="Manager's Contact Number"
                      defaultValue={""}
                      value={values.managerContactNumber}
                      setValue={(val, countryCode) => {
                        setFieldValue(
                          "managerContactNumber",
                          String(countryCode + val)
                        );
                      }}
                      disabled={
                        (values.profession === "Student" ||
                          values.profession === "Not Working") &&
                        true
                      }
                      className={
                        errors && errors["managerContactNumber"]
                          ? "tab__deatils--input error__field_show"
                          : "tab__deatils--input"
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Manager's Email/Accountant's Email <span>*</span>
                      <Tooltip
                        overlayClassName="tooltip__color"
                        title="This contact reference field will be used for employment referencing your past income data. In case if you are self-employed, please provide Accountant details."
                      >
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                          alt="i"
                        />
                      </Tooltip>
                    </label>

                    <CustomInput
                      placeholder="Enter Manager email"
                      type="email"
                      required
                      name="managerEmail"
                      errors={errors}
                      disabled={
                        (values.profession === "Student" ||
                          values.profession === "Not Working") &&
                        true
                      }
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
                      <DatePicker
                        name="startDate"
                        todayButton="Today"
                        showYearDropdown
                        maxDate={
                          values.endDate ? moment(values.endDate) : undefined
                        }
                        dateFormat={"dd-MM-yyyy"}
                        showMonthDropdown
                        dropdownMode={"select"}
                        disabledKeyboardNavigation={false}
                        className={
                          errors && errors["startDate"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        disabled={
                          (values.profession === "Student" ||
                            values.profession === "Not Working") &&
                          true
                        }
                        onChange={(value) => setFieldValue("startDate", value)}
                        defaultValue={
                          moment(new Date(values["startDate"]), "dd-MM-yyyy") ||
                          undefined
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">End Date</label>
                    <div className="date__flex">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fa fa-calendar" />
                        </div>
                      </div>
                      <DatePicker
                        name="endDate"
                        todayButton="Today"
                        showYearDropdown
                        minDate={moment(values.startDate).toDate()}
                        dateFormat={"dd-MM-yyyy"}
                        showMonthDropdown
                        dropdownMode={"select"}
                        disabledKeyboardNavigation={false}
                        className={
                          errors && errors["endDate"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                        disabled={
                          (values.profession === "Student" ||
                            values.profession === "Not Working") &&
                          true
                        }
                        onChange={(value) => setFieldValue("endDate", value)}
                        defaultValue={
                          moment(new Date(values["endDate"]), "dd-MM-yyyy") ||
                          undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <div className="form-group">
                    <button
                      hidden={props.hideSaveButton}
                      ref={props.incomeRef}
                      type="submit"
                      className="btn btn-primary btn-sm px-5"
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
