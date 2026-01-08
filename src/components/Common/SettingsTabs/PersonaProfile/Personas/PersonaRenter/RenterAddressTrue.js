import React from "react";
import { Formik, Form, Field } from "formik";
import CustomInput from "../../../../../../config/FormikInput";
import MyNumberInput from "../../../../../../config/CustomNumberInput";
import CountryPicker from "../../../../../../config/CountryCodeSelector";
import get from "lodash/get";
import { DatePicker } from "antd";
import moment from "moment";

const residencyStatuses = [
  "Renting",
  "Owned / Mortgaged",
  "Staying with parents/ family",
];

const ProfessionFormSection = (props) => {
  // console.log("propspropsprops", props);
  // let accountSetting = props.accountSetting;
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...props.landLordOrAgentReference }}
      //   validationSchema={props.LandlordPersonaSchema.ProfessionSchema}
      onSubmit={(values, { validateForm, setSubmitting }) => {
        setSubmitting(true);
        values.durationInMonth = String(values.durationInMonth);
        props.saveData(values);
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <div className="tab__details">
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="tab__deatils--label">
                    Current Residency Status
                  </label>
                  <Field
                    autoComplete={"none"}
                    component="select"
                    name={`currentResidencyStatus`}
                    className={
                      errors && errors["currentResidencyStatus"]
                        ? "form-control error__field_show"
                        : "form-control tab__deatils--select"
                    }
                  >
                    <option selected disabled>
                      Select Status
                    </option>
                    {residencyStatuses.map((docField, index) => {
                      return (
                        <option key={index} value={docField}>
                          {docField}
                        </option>
                      );
                    })}
                  </Field>
                </div>
              </div>

              {get(values, "currentResidencyStatus", "") !==
              "Owned / Mortgaged" ? (
                get(values, "currentResidencyStatus", "") !==
                  "Staying with parents/ family" && (
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="tab__deatils--label">
                        Landlord/Agent's Full Name <span>*</span>
                      </label>
                      <CustomInput
                        placeholder="Enter Landlord/Agent's Full Name"
                        type="text"
                        name="landlordName"
                        errors={errors}
                        required
                      />
                    </div>
                  </div>
                )
              ) : (
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Property owner status <span>*</span>
                    </label>
                    <Field
                      autoComplete={"none"}
                      component="select"
                      name={`propertyOwnerStatus`}
                      required
                      className={
                        errors && errors["propertyOwnerStatus"]
                          ? "form-control error__field_show"
                          : "form-control tab__deatils--select"
                      }
                    >
                      <option selected disabled>
                        Select Status
                      </option>
                      {["Owner", "Mortgage"].map((docField, index) => {
                        return (
                          <option key={index} value={docField}>
                            {docField}
                          </option>
                        );
                      })}
                    </Field>
                  </div>
                </div>
              )}
            </div>

            {get(values, "currentResidencyStatus", "") !==
            "Owned / Mortgaged" ? (
              get(values, "currentResidencyStatus", "") !==
                "Staying with parents/ family" && (
                <>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Rent Per Month <span>*</span>
                        </label>
                        <MyNumberInput
                          placeholder="Rent Per Month"
                          className={
                            errors && errors["rentPerMonth"]
                              ? "tab__deatils--input error__field_show"
                              : "tab__deatils--input"
                          }
                          required
                          mask="_"
                          value={values.rentPerMonth}
                          onValueChange={(val) =>
                            setFieldValue(
                              "rentPerMonth",
                              String(val.floatValue)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Duration in Month <span>*</span>
                        </label>
                        <CustomInput
                          placeholder="Duration in month"
                          type="number"
                          min="1"
                          required
                          name="durationInMonth"
                          errors={errors}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Landlord/Agent's Contact Number <span>*</span>
                        </label>
                        <CountryPicker
                          name="landlordContactNumber"
                          placeholder="Landlord/Agent's Contact Number"
                          defaultValue={""}
                          value={values.landlordContactNumber}
                          required
                          setValue={(val, countryCode) => {
                            setFieldValue(
                              "landlordContactNumber",
                              String(countryCode + val)
                            );
                          }}
                          className={
                            errors && errors["landlordContactNumber"]
                              ? "tab__deatils--input error__field_show"
                              : "tab__deatils--input"
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Landlord/Agent's Email <span>*</span>
                        </label>

                        <CustomInput
                          placeholder="Enter Agent's email"
                          type="email"
                          required
                          name="landlordEmail"
                          errors={errors}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Rental Start Date <span>*</span>
                        </label>
                        <div className="date__flex">
                          <div className="input-group-prepend">
                            <div className="input-group-text">
                              <i className="fa fa-calendar" />
                            </div>
                          </div>
                          <DatePicker
                            name="rentalStartDate"
                            todayButton="Today"
                            showYearDropdown
                            dateFormat={"dd-MM-yyyy"}
                            showMonthDropdown
                            dropdownMode={"select"}
                            defaultValue={
                              moment(
                                new Date(values.rentalStartDate),
                                "dd-MM-yyyy"
                              ) || undefined
                            }
                            disabledKeyboardNavigation={false}
                            className={
                              errors && errors["rentalStartDate"]
                                ? "tab__deatils--input error__field_show"
                                : "tab__deatils--input"
                            }
                            onChange={(value) =>
                              setFieldValue("rentalStartDate", value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            ) : (
              <>
                {get(values, "propertyOwnerStatus", "") === "Mortgage" && (
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Monthly Mortgage Amount <span>*</span>
                        </label>
                        <MyNumberInput
                          placeholder="Monthly Mortgage Amount"
                          className={
                            errors && errors["monthlyMortgageAmount"]
                              ? "tab__deatils--input error__field_show"
                              : "tab__deatils--input"
                          }
                          mask="_"
                          value={values.monthlyMortgageAmount}
                          required
                          onValueChange={(val) =>
                            setFieldValue(
                              "monthlyMortgageAmount",
                              val.floatValue
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Mortgage Provider Name <span>*</span>
                        </label>
                        <CustomInput
                          placeholder=" Mortgage Provider Name"
                          type="text"
                          required
                          name="mortgageProviderName"
                          errors={errors}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  {get(values, "propertyOwnerStatus", "") === "Owner" && (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Land Registry Title No. <span>*</span>
                        </label>
                        <CustomInput
                          placeholder="Land Registry Title No."
                          type="text"
                          required
                          name="landRegistryTitleNumber"
                          errors={errors}
                        />
                      </div>
                    </div>
                  )}{" "}
                  {get(values, "propertyOwnerStatus", "") === "Mortgage" && (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="tab__deatils--label">
                          Mortgage Provider's Email <span>*</span>
                        </label>
                        <CustomInput
                          placeholder="Mortgage Provider's email"
                          type="email"
                          required
                          name="mortgageProviderEmail"
                          errors={errors}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="row">
              <div className="col-lg-4">
                <div className="form-group">
                  <button
                    hidden={props.hideSaveButton}
                    ref={props.agentReferenceRef}
                    type="submit"
                    className="btn btn-primary px-5 btn-sm shadow"
                  >
                    Next
                  </button>
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
