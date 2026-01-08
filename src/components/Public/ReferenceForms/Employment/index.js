import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import MyNumberInput from "../../../../config/CustomNumberInput";
import { useParams, withRouter } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import ReferenceQueries from "../../../../config/queries/references";
import { message } from "antd";
import get from "lodash/get";
import {DatePicker } from "antd";
import moment from "moment";

import "./style.scss";

const jobType = [
  "Full-Time",
  "Part-Time",
  "Fixed-Term Contract",
  "Temporary Contract",
  "Interim",
  "Probation"
];
const Reference = props => {
  const [showCompany, setCompanyStatus] = useState(true);
  const [empPeriod, confirmEmploymentPeriod] = useState(true);
  const [validReference, setValidReference] = useState(true);

  let { token } = useParams();

  let { data } = useQuery(ReferenceQueries.getReferenceDetail, {
    variables: { token }
  });

  let completeData = get(data, "getReferenceDetail.data", {});

  // console.log("completeDatacompleteDatacompleteDatacompleteData", completeData);

  completeData["employmentType"] = completeData["jobType"];
  completeData["fullName"] = completeData["managerName"];
  completeData["salary"] = completeData["salaryIncome"];
  const submitEMpForm = async formData => {
    // console.log("formDataformDataformData", formData);

    // completeData["employmentType"] = completeData["jobType"];
    // completeData["fullName"] = completeData["managerName"];
    delete formData["jobType"];
    delete formData["managerName"];
    delete formData["startDate"];
    delete formData["name"];
    delete formData["salaryIncome"];
    delete formData["senderName"];
    delete formData["incomeStartDate"];
    delete formData["address"];
    delete formData["duration"];

    formData.validReference
      ? (formData.validReference.isInvalidReference = !validReference)
      : (formData.validReference = {
          isInvalidReference: !validReference
        });
    let vr = formData["validReference"];
    delete formData["validReference"];

    let updateEmpForm = await props.client.mutate({
      mutation: ReferenceQueries.submitEmploymentReference,
      variables: { token, reference: { ...formData }, validReference: vr }
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
            <img
              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
              alt="some img"
            />
          </div>
          <Formik
            enableReinitialize
            initialValues={completeData}
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
                              <p className="title">Employment Reference Form</p>
                              <p>
                                If you have any questions about filling in the
                                form, please see our{" "}
                                <a href>step by step guide</a>
                              </p>
                            </div>
                            <div className="sub_list">
                              <div className="text_list">
                                <p>
                                  Is the applicant{" "}
                                  {get(completeData, "senderName")} works or to
                                  be working for{" "}
                                  {get(completeData, "companyName")}?
                                </p>
                              </div>
                              <div className="form-group yes__no--toogle yes__no--toogle__form">
                                <div className="btn-group">
                                  <a
                                    href
                                    className={
                                      showCompany
                                        ? "btn btn-md active activeShowCompany"
                                        : "btn  btn-md active notActiveShowCompany"
                                    }
                                    data-toggle="company"
                                    data-title="Y"
                                    onClick={() => {
                                      setValidReference(true);
                                      setCompanyStatus(true);
                                      setFieldValue(
                                        "isWorkingForCompany",
                                        true
                                      );
                                    }}
                                  >
                                    YES
                                  </a>
                                  <a
                                    href
                                    className={
                                      !showCompany
                                        ? "btn btn-light btn-md no_activeShowCompany"
                                        : "btn btn-light btn-md no_notActiveShowCompany"
                                    }
                                    data-toggle="company"
                                    data-title="N"
                                    onClick={() => {
                                      setValidReference(false);
                                      setCompanyStatus(false);
                                      setFieldValue(
                                        "isWorkingForCompany",
                                        false
                                      );
                                    }}
                                  >
                                    NO
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* hi */}
                            {!validReference ? (
                              <div className="sub_list">
                                <div className="text_list">
                                  <p>
                                    Please enter the right person to answer this
                                    questionnaire?
                                  </p>
                                </div>
                                <div className="rightContent_wrap">
                                  <Field
                                    placeholder="Name"
                                    type="text"
                                    name="validReference.name"
                                    required
                                    {...props}
                                  />
                                  <Field
                                    placeholder="Email"
                                    type="email"
                                    name="validReference.email"
                                    required
                                    {...props}
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="sub_list">
                                  <div className="text_list">
                                    <p>
                                      Confirm {get(completeData, "senderName")}
                                      's Employment period starts from{" "}
                                      {moment(
                                        get(completeData, "incomeStartDate")
                                      ).format(process.env.REACT_APP_DATE_FORMAT)}
                                    </p>
                                  </div>
                                  <div className="form-group yes__no--toogle yes__no--toogle__form">
                                    <div className="btn-group">
                                      <a
                                        href
                                        className={
                                          empPeriod
                                            ? "btn btn-md active activeShowCompany"
                                            : "btn  btn-md active notActiveShowCompany"
                                        }
                                        data-toggle="emp"
                                        data-title="Y"
                                        onClick={() => {
                                          confirmEmploymentPeriod(true);
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
                                          !empPeriod
                                            ? "btn btn-light btn-md no_activeShowCompany"
                                            : "btn btn-light btn-md no_notActiveShowCompany"
                                        }
                                        data-toggle="emp"
                                        data-title="N"
                                        onClick={() => {
                                          confirmEmploymentPeriod(false);
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

                                {!empPeriod && (
                                  <div className="sub_list">
                                    <div className="leftContent_wrap">
                                      <p>
                                        Confirm{" "}
                                        {get(completeData, "senderName")}'s
                                        Employment start date
                                      </p>
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
                                              <DatePicker
                                                name="confirmStartDate"
                                                placeholder="Start day"
                                                style={{width: 295}}
                                                value={values.dob ? moment(values.dob): undefined}
                                                format={"DD-MM-YYY"}
                                                suffixIcon={undefined}
                                                onChange={(date, dateString) => setFieldValue("dob", date)} />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="sub_list">
                                  <div className="leftContent_wrap">
                                    <p>
                                      Enter job title of{" "}
                                      {get(completeData, "senderName")}
                                    </p>
                                  </div>
                                  <div className="rightContent_wrap">
                                    <Field
                                      placeholder="Job title"
                                      type="text"
                                      name="jobTitle"
                                      {...props}
                                    />
                                  </div>
                                </div>
                                <div className="sub_list">
                                  <div className="leftContent_wrap">
                                    <p>
                                      Please select type of employment contract
                                    </p>
                                  </div>
                                  <div className="rightContent_wrap">
                                    <Field
                                      component="select"
                                      name={`employmentType`}
                                      className="select"
                                    >
                                      {jobType.map((job, i) => {
                                        return (
                                          <option key={i} value={job}>
                                            {job}
                                          </option>
                                        );
                                      })}
                                    </Field>
                                  </div>
                                </div>
                                <div className="sub_list">
                                  <div className="leftContent_wrap">
                                    <p>
                                      If applicable, Confirm employment end date
                                    </p>
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
                                            
                                            <DatePicker
                                              name="endDate"
                                              placeholder="Date of birth"
                                              style={{width: 295}}
                                              value={values.dob ? moment(values.dob): undefined}
                                              format={"DD-MM-YYY"}
                                              suffixIcon={undefined}
                                              onChange={(date, dateString) => setFieldValue("endDate", date)} />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="sub_list salary_Wrapper">
                                  <div className="leftContent_wrap">
                                    <p>
                                      What is {get(completeData, "senderName")}
                                      's Salary
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
                                              name="salary"
                                              placeholder="Salary or Income"
                                              className="undefined tab__deatils--input"
                                              mask="_"
                                              value={values["salary"]}
                                              onValueChange={val =>
                                                setFieldValue(
                                                  "salary",
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
                                          name={`salaryDuration`}
                                          className="select"
                                        >
                                          <option value="Annually">
                                            Annually
                                          </option>
                                          <option value="Monthly">
                                            Monthly
                                          </option>
                                          <option value="Daily">Daily</option>
                                          <option value="Hourly">Hourly</option>
                                        </Field>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="sub_list">
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
                                        Information provided are true to the
                                        best of my knowledge *
                                      </p>
                                    </label>
                                  </div>
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
                              </>
                            )}

                            <button
                              disabled={isSubmitting}
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              Submit Employment Reference Form
                            </button>

                            {/* bye */}
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
