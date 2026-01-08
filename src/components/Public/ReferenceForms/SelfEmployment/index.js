import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import MyNumberInput from "../../../../config/CustomNumberInput";
import { Datepicker } from "react-formik-ui";
import { useParams, withRouter } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import ReferenceQueries from "../../../../config/queries/references";
import { message } from "antd";
import get from "lodash/get";

import "../Employment/style.scss";

const Reference = props => {
  const [isAccountConfirmed, setAccountStatus] = useState(true);
  let { token } = useParams();
  let { data } = useQuery(ReferenceQueries.getReferenceDetail, {
    variables: { token }
  });

  let completeData = get(data, "getReferenceDetail.data", {});

  const submitEMpForm = async formData => {
    let updateEmpForm = await props.client.mutate({
      mutation: ReferenceQueries.submitSelfEmploymentReference,
      variables: { token, reference: { ...formData } }
    });

    if (get(updateEmpForm, "data.submitEmploymentReference.success", false)) {
      message.success("Thank you for filling the form, We appreciate it!");
      props.history.push("/");
    }
  };

  switch (get(data, "getReferenceDetail.success")) {
    case true:
      return (
        <>
          <div className="logo__form">
            <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png" alt="some img" />
          </div>
          <Formik
            enableReinitialize
            onSubmit={(values, { validateForm, setSubmitting }) => {
              setSubmitting(true);
              submitEMpForm(values);
            }}
          >
            {({ isSubmitting, setFieldValue, values, errors }) => (
              <Form>
                <div className="employment_refer">
                  <div className="container">
                    <div className="content_wrap">
                      <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                          <div className="list">
                            <div className="main_list text-center">
                              <h2>Welcome to RentOnCloud Referencing</h2>
                              <p className="title">
                                Self Employment Reference Form
                              </p>
                              <p>
                                If you have any questions about filling in the
                                form, please see our{" "}
                                <a href>step by step guide</a>
                              </p>
                            </div>
                            <div className="sub_list">
                              <div className="leftContent_wrap">
                                <p>
                                  What is type of{" "}
                                  {get(completeData, "senderName")}'s buisness
                                </p>
                              </div>
                              <div className="rightContent_wrap">
                                <Field
                                  component="select"
                                  name={`applicantBusiness`}
                                  className="select"
                                >
                                  <option value selected>
                                    Select Business
                                  </option>
                                  <option value={"Sole Trader"}>
                                    Sole Trader
                                  </option>
                                  <option value="Limited Company">
                                    Limited Company
                                  </option>
                                  <option value="LLP Firm">LLP Firm</option>
                                  <option value="Partnership Firm">
                                    Partnership Firm
                                  </option>
                                </Field>
                              </div>
                            </div>
                            <div className="sub_list">
                              <div className="text_list">
                                <p>
                                  Have you submitted confirmed Accounts Or
                                  verified From past accountants professional
                                  clearance?
                                </p>
                              </div>
                              <div className="form-group yes__no--toogle yes__no--toogle__form">
                                <div className="btn-group">
                                  <a
                                    href
                                    className={
                                      isAccountConfirmed
                                        ? "btn btn-md active activeShowCompany"
                                        : "btn  btn-md active notActiveShowCompany"
                                    }
                                    data-toggle="emp"
                                    data-title="Y"
                                    onClick={() => {
                                      setAccountStatus(true);
                                      setFieldValue(
                                        "employmentStartDateConfirm",
                                        true
                                      );
                                    }}
                                  >
                                    YES
                                  </a>
                                  <a
                                    href
                                    className={
                                      !isAccountConfirmed
                                        ? "btn btn-light btn-md no_activeShowCompany"
                                        : "btn btn-light btn-md no_notActiveShowCompany"
                                    }
                                    data-toggle="emp"
                                    data-title="N"
                                    onClick={() => {
                                      setAccountStatus(false);
                                      setFieldValue(
                                        "employmentStartDateConfirm",
                                        false
                                      );
                                    }}
                                  >
                                    NO
                                  </a>
                                </div>
                              </div>
                            </div>

                            <div className="sub_list">
                              <div className="leftContent_wrap">
                                <p>
                                  For which Financial year latest accounts are
                                  filled
                                </p>
                              </div>
                              <div className="rightContent_wrap">
                                <MyNumberInput
                                  name="financialYear"
                                  placeholder="YYYY"
                                  className="undefined tab__deatils--input"
                                  mask="_"
                                  format={"####"}
                                  value={values["financialYear"]}
                                  onValueChange={val =>
                                    setFieldValue(
                                      "financialYear",
                                      val.floatValue
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="sub_list salary_Wrapper">
                              <div className="leftContent_wrap">
                                <p>
                                  What is {get(completeData, "senderName")}'s
                                  Annual Salary
                                </p>
                              </div>
                              <div className="rightContent_wrap">
                                <div className="form_flex">
                                  <div className="input-group-prepend">
                                    <div className="input-group-text">
                                      <i className="fas fa-pound-sign"></i>
                                    </div>
                                  </div>
                                  <div className="form-element amount">
                                    <div className="amount-wrapper">
                                      <div className="amount_input">
                                        <MyNumberInput
                                          name="annualIncome"
                                          placeholder="Salary or Income"
                                          className="undefined tab__deatils--input"
                                          mask="_"
                                          value={values["annualIncome"]}
                                          onValueChange={val =>
                                            setFieldValue(
                                              "annualIncome",
                                              val.floatValue
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="salary_select">
                                    <Field
                                      component="select"
                                      className="select"
                                      disabled
                                    >
                                      <option selected value="Annually">
                                        Annually
                                      </option>
                                      <option value="Monthly">Monthly</option>
                                      <option value="Daily">Daily</option>
                                      <option value="Hourly">Hourly</option>
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="sub_list">
                              <div className="leftContent_wrap">
                                <p>Start date of Accountant's engagement</p>
                              </div>
                              <div className="rightContent_wrap">
                                <div className="form_flex">
                                  <div className="input-group-prepend">
                                    <div className="input-group-text">
                                      <i className="fa fa-calendar"></i>
                                    </div>
                                  </div>
                                  <div className="form-element picker">
                                    <div className="picker-wrapper">
                                      <div className="picker_input">
                                        <Datepicker
                                          name="endDate"
                                          todayButton="Today"
                                          showYearDropdown
                                          showMonthDropdown
                                          dropdownMode={"select"}
                                          className="tab__deatils--input"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="sub_list">
                              <div className="form-check">
                                <label className="form-check-label">
                                  <input
                                    required
                                    type="checkbox"
                                    className="form-check-input"
                                    value=""
                                  />
                                  <p>
                                    Information provided are true to the best of
                                    my knowledge *
                                  </p>
                                </label>
                              </div>
                              <form className="sub_list--form">
                                <label>Full Name *</label>
                                <Field
                                  placeholder="Enter your full name"
                                  type="text"
                                  name="fullName"
                                  {...props}
                                />

                                <label>Position *</label>
                                <Field
                                  placeholder="Your position"
                                  type="text"
                                  name="position"
                                  {...props}
                                />
                                <label>Company Name</label>
                                <Field
                                  placeholder="Please write, if applicable"
                                  type="text"
                                  name="companyName"
                                  {...props}
                                />
                              </form>
                              <div className="form-check">
                                <label className="form-check-label">
                                  <input
                                    required
                                    type="checkbox"
                                    className="form-check-input"
                                    value=""
                                  />
                                  <p>
                                    I have read and agree to the{" "}
                                    <a
                                      rel="noopener noreferrer"
                                      target="_blank"
                                      href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`}
                                    >
                                      Terms
                                    </a>{" "}
                                    &{" "}
                                    <a
                                      rel="noopener noreferrer"
                                      target="_blank"
                                      href={`${process.env.REACT_APP_ROC_PUBLIC}/privacy-policy`}
                                    >
                                      Privacy Policy
                                    </a>
                                  </p>
                                </label>
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              Submit Employment Reference Form
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </>
      );

    case false:
      props.history.push("/");
      break;
    default:
      return <h1>Loading...</h1>;
  }
};

export default withRouter(Reference);
