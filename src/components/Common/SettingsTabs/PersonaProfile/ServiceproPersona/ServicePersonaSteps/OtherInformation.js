import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import MyNumberInput from "../../../../../../config/CustomNumberInput";
import { Datepicker } from "react-formik-ui";
import { LoadingOutlined } from "@ant-design/icons";

let policyName = [
  "Public Liability Insurance",
  "Professional Indemnity",
  "Other Insurance",
];

const OtherInformation = (props) => {
  let { initialOtherInformationData } = props;
  return (
    <div className="otherinfo_tabs_servicepro">
      <Formik
        enableReinitialize
        initialValues={initialOtherInformationData}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await props.setOtherInformation(values);
          await props.updateProfessionData({
            otherInformation: values.otherInformation,
          });
          setSubmitting(false);
        }}
        render={({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <FieldArray
              name="otherInformation"
              render={(arrayHelpers) => (
                <div>
                  {values?.otherInformation?.map((supportingDoc, index) => (
                    <div key={index}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <Field
                              autoComplete={"none"}
                              component="select"
                              name={`otherInformation[${index}].policyName`}
                              className="form-control select__global"
                            >
                              <option value selected disabled>
                                Insurance
                              </option>
                              {policyName.map((docField, index) => {
                                return (
                                  <option key={index} value={docField}>
                                    {docField}
                                  </option>
                                );
                              })}
                            </Field>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <Field
                              autoComplete={"none"}
                              type="text"
                              placeholder="Policy Provider"
                              className="form-control select__global"
                              name={`otherInformation.${index}.providerName`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <Field
                              autoComplete={"none"}
                              type="number"
                              min={1}
                              placeholder="Policy Number"
                              className="form-control select__global"
                              name={`otherInformation.${index}.policyNumber`}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <div className="date__flex">
                              <div className="input-group-prepend">
                                <div className="input-group-text">
                                  <i className="mdi mdi-currency-gbp" />
                                </div>
                              </div>
                              <MyNumberInput
                                placeholder="Policy Amount"
                                allowNegative={false}
                                className="form-control select__global"
                                thousandSeparator={true}
                                value={
                                  values.otherInformation[index].policyAmount
                                }
                                onValueChange={(val) =>
                                  setFieldValue(
                                    `otherInformation[${index}].policyAmount`,
                                    Number(val.floatValue)
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <div className="date__flex">
                              <div className="input-group-prepend">
                                <div className="input-group-text">
                                  <i className="fa fa-calendar" />
                                </div>
                              </div>
                              <Datepicker
                                name={`otherInformation[${index}].validTillDate`}
                                todayButton="Today"
                                showYearDropdown
                                dateFormat={"dd-MM-yyyy"}
                                showMonthDropdown
                                dropdownMode={"select"}
                                disabledKeyboardNavigation={false}
                                className="form-control select__global"
                                // className={
                                //   errors && errors["startDate"]
                                //     ? "tab__deatils--input error__field_show"
                                //     : "tab__deatils--input"
                                // }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          {values.otherInformation.length > 1 && (
                            <button
                              type="button"
                              className="btn btns__addmore"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <i className="fas fa-minus"></i> Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                  <div className="row">
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
                      <button
                        type="button"
                        className="btn btns__addmore"
                        onClick={() =>
                          arrayHelpers.push({
                            policyName: "",
                            providerName: "",
                            policyNumber: 0,
                            policyAmount: 0,
                            validTillDate: new Date(),
                          })
                        }
                      >
                        <i className="fas fa-plus"></i> Add more
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <button
                          hidden={props.hideSaveButton}
                          ref={props.otherInformationRef}
                          type="submit"
                          className="btn btns__blue"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <LoadingOutlined /> : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </Form>
        )}
      />
    </div>
  );
};

export default OtherInformation;
