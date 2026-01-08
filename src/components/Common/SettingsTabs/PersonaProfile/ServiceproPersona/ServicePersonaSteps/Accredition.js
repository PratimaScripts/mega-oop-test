import React, { useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import get from "lodash/get";
import { Datepicker } from "react-formik-ui";
import moment from "moment";
import { useLazyQuery } from "@apollo/react-hooks";
import AdminQueries from "config/queries/admin";
import { LoadingOutlined } from "@ant-design/icons";


const Accredition = (props) => {
  
    // let accountSetting = props.accountSetting;
    const { accrediations } = props;
    

    const [fetchAccrediationsList, accrediationsList] = useLazyQuery(
      AdminQueries.fetchAccreditation
    );

    useEffect(()=> {
      fetchAccrediationsList()

      //eslint-disable-next-line
    }, [])

    return (
      <div>
        <Formik
          enableReinitialize
          initialValues={accrediations ? accrediations :  [{
            organization: "",
            documentNumber: "",
            validTillDate: new Date()
          }]}
          // validationSchema={this.props.LandlordPersonaSchema.AccrediationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            setSubmitting(true)
            await props.setAccrediationData(values);
            await props.updateProfessionData({accreditation: values.accrediations})
            props.onTabChange(props.activeTab+1)
            setSubmitting(false)
          }}
          render={({ isSubmitting, values, errors }) => <Form>
              <FieldArray
            
                name="accrediations"
                render={arrayHelpers => (
                  <div className="accrediations__form">
                    {values?.accrediations?.map((accrediation, index) => (
                      <>
                        <div key={index}>
                          <div className="row flex__end">
                            <div className="col-lg-4">
                              <div className="form-group">
                                <label className="tab__deatils--label">
                                  Select Member Organization
                                </label>
                                {accrediation["organization"] === "Other" ? (
                                  <Field
                                    type="text"
                                    className="form-control tab__deatils--input"
                                    name={`accrediations.${index}.organizationCustom`}
                                  />
                                ) : (
                                  <Field
                                    component="select"
                                    loading={accrediationsList.loading}
                                    name={`accrediations[${index}].organization`}
                                    className={
                                      errors &&
                                      errors[
                                        `accrediations[${index}].organization`
                                      ]
                                        ? "form-control error__field_show"
                                        : "form-control"
                                    }
                                  >
                                    <option selected disabled>
                                      Select Organisation
                                    </option>
                                    {get(
                                      accrediationsList,
                                      "data.getAccreditation.data.accreditations",
                                      []
                                    ).map((docField, index) => {
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

                            <div className="col-lg-4">
                              <div className="form-group">
                                <label className="tab__deatils--label">
                                  Member / Registration Ref#
                                </label>
                                <Field
                                  type="text"
                                  placeholder="Enter Registration/ Member Reference"
                                  className="form-control tab__deatils--input"
                                  name={`accrediations.${index}.documentNumber`}
                                />
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="form-group">
                                <label className="tab__deatils--label">
                                  Valid Till Date
                                </label>
                                <div className="date__flex">
                                  <div className="input-group-prepend">
                                    <div className="input-group-text">
                                      <i className="fa fa-calendar" />
                                    </div>
                                  </div>
                                  <Datepicker
                                    name={`accrediations.${index}.validTillDate`}
                                    placeholder="Valid Till"
                                    todayButton="Today"
                                    minDate={moment()}
                                    showYearDropdown
                                    dateFormat={"dd-MM-yyyy"}
                                    showMonthDropdown
                                    dropdownMode={"select"}
                                    disabledKeyboardNavigation={false}
                                    className="tab__deatils--input"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row flex__end">
                            <div className="col-lg-4">
                              {values.accrediations.length > 1 && (
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
                        </div>
                      </>
                    ))}

                    <div className="row">
                      <div className="col-lg-7"> </div>
                      <div className="col-lg-5">
                        <button
                          type="button"
                          className="btn btns__addmore"
                          onClick={() =>
                            arrayHelpers.push({
                              organization: "",
                              documentNumber: "",
                              validTillDate: new Date()
                            })
                          }
                        >
                          <i className="fas fa-plus"></i> Add more
                        </button>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-5">
                        <button
                          ref={props.accrediationsRef}
                          type="submit"
                          className="btn btns__blue--outline"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <LoadingOutlined /> : "Save & Next"} 
                        </button>
                      </div>{" "}
                    </div>
                  </div>
                )}
              />
            </Form>
          }
        />
      </div>
    )
}

export default Accredition;
