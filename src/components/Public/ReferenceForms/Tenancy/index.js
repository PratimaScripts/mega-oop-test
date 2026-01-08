import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import MyNumberInput from "../../../../config/CustomNumberInput";
import { useParams, withRouter } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { DatePicker } from "antd";
import { message } from "antd";
import ReferenceQueries from "../../../../config/queries/references";
import get from "lodash/get";
import moment from "moment";
import "../Employment/style.scss";

const Reference = (props) => {
  const [isPersonCorrect, setPersonStatus] = useState(true);
  const [isTenancyDurationRight, confirmTenancyDuration] = useState(true);
  const [rentPaidOnTime, setRentStatus] = useState(true);
  const [wasRentLate, setRentTiming] = useState(true);
  const [anyProblemInDepositOrDeduction, setDeductionStatus] = useState(true);
  const [wasPropertyInGoodCondition, setPropertyCondition] = useState(true);
  const [validReference, setValidReference] = useState(true);

  let { token } = useParams();
  let { data } = useQuery(ReferenceQueries.getReferenceDetail, {
    variables: { token },
  });

  let completeData = get(data, "getReferenceDetail.data", {});

  const submitEMpForm = async (formData) => {
    formData.validReference.isInvalidReference = !validReference;
    let vr = formData["validReference"];
    delete formData["validReference"];

    let updateEmpForm = await props.client.mutate({
      mutation: ReferenceQueries.submitTenancyReference,
      variables: { token, reference: { ...formData }, validReference: vr },
    });

    if (get(updateEmpForm, "data.submitTenancyReference.success", false)) {
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
                              <p className="title">Tenancy Reference Form</p>
                              <p>
                                If you have any questions about filling in the
                                form, please see our{" "}
                                <a href>step by step guide</a>
                              </p>
                            </div>
                            <div className="sub_list">
                              <div className="text_list">
                                <p>
                                  Are you correct person to provide the tenancy
                                  reference for{" "}
                                  {get(completeData, "senderName")}, residing at{" "}
                                  {get(completeData, "address.addressLine1")},{" "}
                                  {get(completeData, "address.addressLine2")} ?
                                </p>
                              </div>
                              <div className="form-group yes__no--toogle yes__no--toogle__form">
                                <div className="btn-group">
                                  <a
                                    href
                                    className={
                                      isPersonCorrect
                                        ? "btn btn-md active activeShowCompany"
                                        : "btn  btn-md active notActiveShowCompany"
                                    }
                                    data-toggle="company"
                                    data-title="Y"
                                    onClick={() => {
                                      setValidReference(true);
                                      setPersonStatus(true);
                                      setFieldValue("isPersonCorrect", true);
                                    }}
                                  >
                                    YES
                                  </a>
                                  <a
                                    href
                                    className={
                                      !isPersonCorrect
                                        ? "btn btn-light btn-md no_activeShowCompany"
                                        : "btn btn-light btn-md no_notActiveShowCompany"
                                    }
                                    data-toggle="company"
                                    data-title="N"
                                    onClick={() => {
                                      setValidReference(false);
                                      setPersonStatus(false);
                                      setFieldValue("isPersonCorrect", false);
                                    }}
                                  >
                                    NO
                                  </a>
                                </div>
                              </div>
                            </div>

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
                                      Confirm applicant's tenancy duration from{" "}
                                      {moment(
                                        get(completeData, "startDate")
                                      ).format("DD-MM-YYY")}{" "}
                                      to{" "}
                                      {moment(
                                        get(completeData, "endDate")
                                      ).format(
                                        process.env.REACT_APP_DATE_FORMAT
                                      )}{" "}
                                      ?
                                    </p>
                                  </div>
                                  <div className="form-group yes__no--toogle yes__no--toogle__form">
                                    <div className="btn-group">
                                      <a
                                        href
                                        className={
                                          isTenancyDurationRight
                                            ? "btn btn-md active activeShowCompany"
                                            : "btn  btn-md active notActiveShowCompany"
                                        }
                                        data-toggle="emp"
                                        data-title="Y"
                                        onClick={() => {
                                          confirmTenancyDuration(true);
                                          setFieldValue(
                                            "isTenancyDurationRight",
                                            true
                                          );
                                        }}
                                      >
                                        YES
                                      </a>
                                      <a
                                        href
                                        className={
                                          !isTenancyDurationRight
                                            ? "btn btn-light btn-md no_activeShowCompany"
                                            : "btn btn-light btn-md no_notActiveShowCompany"
                                        }
                                        data-toggle="emp"
                                        data-title="N"
                                        onClick={() => {
                                          confirmTenancyDuration(false);
                                          setFieldValue(
                                            "isTenancyDurationRight",
                                            false
                                          );
                                        }}
                                      >
                                        NO
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                {!isTenancyDurationRight && (
                                  <>
                                    <div className="sub_list">
                                      <div className="leftContent_wrap">
                                        <p>Rental Start Date</p>
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
                                                  name="rentalStartDate"
                                                  placeholder="Rental Start Day"
                                                  style={{ width: 295 }}
                                                  value={
                                                    values.dob
                                                      ? moment(values.dob)
                                                      : undefined
                                                  }
                                                  format={
                                                    process.env
                                                      .REACT_APP_DATE_FORMAT
                                                  }
                                                  suffixIcon={undefined}
                                                  onChange={(date) =>
                                                    setFieldValue(
                                                      "rentalStartDate",
                                                      date
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="sub_list">
                                      <div className="leftContent_wrap">
                                        <p>Duration in month</p>
                                      </div>
                                      <div className="rightContent_wrap">
                                        <div className="form_flex">
                                          <div className="form-element amount">
                                            <div className="amount-wrapper">
                                              <div className="amount_input">
                                                <MyNumberInput
                                                  name="duration"
                                                  placeholder="Enter Duration"
                                                  className="undefined tab__deatils--input"
                                                  mask="_"
                                                  value={values["duration"]}
                                                  onValueChange={(val) =>
                                                    val.floatValue > 0 &&
                                                    setFieldValue(
                                                      "duration",
                                                      val.floatValue
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="sub_list">
                                  <div className="leftContent_wrap">
                                    <p>Was the rent paid on time?</p>
                                  </div>
                                  <div className="rightContent_wrap">
                                    <div className="form-group yes__no--toogle yes__no--toogle__form">
                                      <div className="btn-group">
                                        <a
                                          href
                                          className={
                                            rentPaidOnTime
                                              ? "btn btn-md active activeShowCompany"
                                              : "btn  btn-md active notActiveShowCompany"
                                          }
                                          data-toggle="company"
                                          data-title="Y"
                                          onClick={() => {
                                            setRentStatus(true);
                                            setFieldValue(
                                              "rentPaidOnTime",
                                              true
                                            );
                                          }}
                                        >
                                          YES
                                        </a>
                                        <a
                                          href
                                          className={
                                            !rentPaidOnTime
                                              ? "btn btn-light btn-md no_activeShowCompany"
                                              : "btn btn-light btn-md no_notActiveShowCompany"
                                          }
                                          data-toggle="company"
                                          data-title="N"
                                          onClick={() => {
                                            setRentStatus(false);
                                            setFieldValue(
                                              "rentPaidOnTime",
                                              false
                                            );
                                          }}
                                        >
                                          NO
                                        </a>
                                      </div>
                                    </div>
                                  </div>

                                  {!rentPaidOnTime && (
                                    <>
                                      <div className="leftContent_wrap">
                                        <p>
                                          Has there been situation where rent
                                          arrears was more than two weeks for
                                          over two times?
                                        </p>
                                      </div>
                                      <div className="rightContent_wrap">
                                        <div className="form-group yes__no--toogle yes__no--toogle__form">
                                          <div className="btn-group">
                                            <a
                                              href
                                              className={
                                                wasRentLate
                                                  ? "btn btn-md active activeShowCompany"
                                                  : "btn  btn-md active notActiveShowCompany"
                                              }
                                              data-toggle="company"
                                              data-title="Y"
                                              onClick={() => {
                                                setRentTiming(true);
                                                setFieldValue(
                                                  "wasRentLate",
                                                  true
                                                );
                                              }}
                                            >
                                              YES
                                            </a>
                                            <a
                                              href
                                              className={
                                                !wasRentLate
                                                  ? "btn btn-light btn-md no_activeShowCompany"
                                                  : "btn btn-light btn-md no_notActiveShowCompany"
                                              }
                                              data-toggle="company"
                                              data-title="N"
                                              onClick={() => {
                                                setRentTiming(false);
                                                setFieldValue(
                                                  "wasRentLate",
                                                  false
                                                );
                                              }}
                                            >
                                              NO
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="sub_list">
                                  <div className="leftContent_wrap">
                                    <p>
                                      Was the property kept in good condition?
                                    </p>
                                  </div>
                                  <div className="rightContent_wrap">
                                    <div className="form-group yes__no--toogle yes__no--toogle__form">
                                      <div className="btn-group">
                                        <a
                                          href
                                          className={
                                            wasPropertyInGoodCondition
                                              ? "btn btn-md active activeShowCompany"
                                              : "btn  btn-md active notActiveShowCompany"
                                          }
                                          data-toggle="company"
                                          data-title="Y"
                                          onClick={() => {
                                            setPropertyCondition(true);
                                            setFieldValue(
                                              "wasPropertyInGoodCondition",
                                              true
                                            );
                                          }}
                                        >
                                          YES
                                        </a>
                                        <a
                                          href
                                          className={
                                            !wasPropertyInGoodCondition
                                              ? "btn btn-light btn-md no_activeShowCompany"
                                              : "btn btn-light btn-md no_notActiveShowCompany"
                                          }
                                          data-toggle="company"
                                          data-title="N"
                                          onClick={() => {
                                            setPropertyCondition(false);
                                            setFieldValue(
                                              "wasPropertyInGoodCondition",
                                              false
                                            );
                                          }}
                                        >
                                          NO
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="sub_list">
                                  <div className="text_list">
                                    <p>
                                      Was there any problem over deposit,
                                      potential claim or deduction to be made
                                      from deposit?
                                    </p>
                                  </div>
                                  <div className="form-group yes__no--toogle yes__no--toogle__form">
                                    <div className="btn-group">
                                      <a
                                        href
                                        className={
                                          anyProblemInDepositOrDeduction
                                            ? "btn btn-md active activeShowCompany"
                                            : "btn  btn-md active notActiveShowCompany"
                                        }
                                        data-toggle="company"
                                        data-title="Y"
                                        onClick={() => {
                                          setDeductionStatus(true);
                                          setFieldValue(
                                            "anyProblemInDepositOrDeduction",
                                            true
                                          );
                                        }}
                                      >
                                        YES
                                      </a>
                                      <a
                                        href
                                        className={
                                          !anyProblemInDepositOrDeduction
                                            ? "btn btn-light btn-md no_activeShowCompany"
                                            : "btn btn-light btn-md no_notActiveShowCompany"
                                        }
                                        data-toggle="company"
                                        data-title="N"
                                        onClick={() => {
                                          setDeductionStatus(false);
                                          setFieldValue(
                                            "anyProblemInDepositOrDeduction",
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
                                  <p>
                                    Any reccomendations or comments: Free text
                                    field
                                  </p>
                                  <Field
                                    name="extraComments"
                                    // cols="145"
                                    placeholder="Could be anything"
                                    component="textarea"
                                  />
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
                                    <label>
                                      Letting Agency or Company Landlord Name
                                    </label>
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
                              type="submit"
                              disabled={isSubmitting}
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
