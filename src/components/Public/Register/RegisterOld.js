import React, { useState, useEffect, lazy } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SignUpUser from "../../../config/queries/register";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import cookie from "react-cookies";
import { Modal, message } from "antd";

import showNotification from "../../../config/Notification";
import ValidateEmail from "../../../config/ValidateEmail";
import RegistrationFormSchema from "../../../config/FormSchemas/register";
import LoginQuery from "../../../config/queries/login";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { withApollo } from "react-apollo";
import Img from "react-image";

import "./register.scss";

// import EmailVerificationCard from "./EmailVerification";
const EmailVerificationCard = lazy(() => import("./EmailVerification"));

const Register = props => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentVerifyOtp, setcurrentVerifyOtp] = useState("");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [userData, setUserData] = useState({});
  const [formStep, setFormStep] = useState(0);

  const setCategory = category => {
    setSelectedCategory(category);
  };

  const validateOTPEmail = async e => {
    setcurrentVerifyOtp("");
    message.loading("Verification Successful, signing you up!");
    setSubmittingForm(true);
    signUpRequestMain();
  };

  const signUpRequestMain = async () => {
    props.startLoading();
    let socialData = get(props, "location.state", {});
    let isSocial = socialData.picture ? true : false;
    let obj = {};
    obj["avatar"] = isSocial ? get(socialData, "picture.data.url", "") : "";
    obj["name"] = isSocial ? get(socialData, "name", "") : "";
    let formData = userData;
    const queryResponse = await props.client.mutate({
      mutation: SignUpUser,
      variables: { ...formData, role: selectedCategory, ...obj }
    });

    // console.log("queryResponsequeryResponsequeryResponse", queryResponse);
    if (
      !isEmpty(queryResponse.data.registration) &&
      get(queryResponse, "data.registration.success")
    ) {
      showNotification(
        "success",
        "Welcome!",
        "You have been registered successfully!"
      );

      props.endLoading();
      cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(queryResponse, "data.registration.token"), {
        path: "/"
      });

      setTimeout(() => {
        window.location = `/${selectedCategory}`;
      }, 1500);
    } else {
      props.endLoading();
      setSubmittingForm(false);
      showNotification(
        "error",
        "An error occured",
        get(queryResponse, "data.registration.message")
      );
    }
  };

  const signUp = async formData => {
    let isValidEmail = await ValidateEmail(formData);

    if (isValidEmail) {
      setUserData(formData);
      let obj = {
        type: "send",
        email: formData.email,
        password: formData.password,
        role: selectedCategory
      };

      const queryResponseEmail = await props.client.query({
        query: LoginQuery.verifyEmailAddressSignUp,
        variables: obj
      });
      let currentVerifyOtp = get(
        queryResponseEmail,
        "data.verifyEmailAddressSignUp.data.otp"
      );

      setcurrentVerifyOtp(currentVerifyOtp);
      setFormStep(1);

      return true;
    } else {
      message.error("The Email you entered is Invalid!");
      return false;
    }
  };

  let [email, setEmail] = useState(get(props.location.state, "email"));

  useEffect(() => {
    setEmail(get(props.location.state, "email"));
  }, [props.location.state]);

  return (
    <TransitionGroup>
      <CSSTransition
        key={"Register"}
        classNames="page"
        unmountOnExit
        timeout={300}
      >
        {formStep === 0 ? (
          <div className="login__bg">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="login-wrapper">
                    <Formik
                      initialValues={{
                        email: email ? email : "",
                        password: "",
                      }}
                      validationSchema={RegistrationFormSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        if (selectedCategory === "") {
                          message.error("Please select a role!");
                          setSubmittingForm(false);
                        }

                        if (selectedCategory !== "") {
                          setSubmittingForm(true);
                          let res = await signUp(values);
                          if (res || !res) {
                            setSubmittingForm(false);
                          }
                        }
                      }}
                    >
                      {({ isSubmitting, errors }) => (
                        <>
                          <Img
                            src={["/assets/images/logo.svg"]}
                            alt=""
                            className="login-logo"
                          />
                          <div className="login-box">
                            <Form>
                              <h4>Select Role & Get Started</h4>
                              <div className="user-type d-block clearfix mb-4">
                                <ul>
                                  <li
                                    className={
                                      selectedCategory === "landlord" &&
                                      "active"
                                    }
                                    onClick={() => setCategory("landlord")}
                                  >
                                    <span>
                                      <i className="mdi mdi-home-account"></i>
                                      <p>I am a Landlord</p>
                                    </span>
                                  </li>
                                  <li
                                    className={
                                      selectedCategory === "renter" && "active"
                                    }
                                    onClick={() => setCategory("renter")}
                                  >
                                    <span>
                                      <i className="mdi mdi-account-key"></i>
                                      <p>I am a renter</p>
                                    </span>
                                  </li>
                                  <li
                                    className={
                                      selectedCategory === "servicepro" &&
                                      "active"
                                    }
                                    onClick={() => setCategory("servicepro")}
                                  >
                                    <span>
                                      <i className="mdi mdi-account-clock"></i>
                                      <p>I am a ServicePro</p>
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <div className="form-group">
                                <i className="fa fa-envelope i__dark"></i>
                                <Field
                                  placeholder="Please enter your email!"
                                  type="email"
                                  name="email"
                                  className={
                                    errors.email
                                      ? "full__input error__field_show"
                                      : "full__input"
                                  }
                                  disabled={email && true}
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="all__errors"
                                />
                              </div>
                              <div className="form-group">
                                <i className="fa fa-lock i__dark"></i>
                                <Field
                                  placeholder="Enter your password"
                                  type="password"
                                  name="password"
                                  className={
                                    errors.password
                                      ? "full__input error__field_show"
                                      : "full__input"
                                  }
                                />
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="all__errors"
                                />
                              </div>
                              <div className="form-group">
                                <i className="fa fa-lock i__dark"></i>
                                <Field
                                  placeholder="Confirm your password"
                                  type="password"
                                  name="comfirmPassword"
                                  className={
                                    errors.password
                                      ? "full__input error__field_show"
                                      : "full__input"
                                  }
                                />
                                <ErrorMessage
                                  name="comfirmPassword"
                                  component="div"
                                  className="all__errors"
                                />
                              </div>

                              <div className="form-group small">
                                <label className="checkbox-inline terms__text">
                                  <input required type="checkbox" /> I have read
                                  and agree with{" "}
                                  <a
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`}
                                  >
                                    Terms
                                  </a>{" "}
                                  &amp;{" "}
                                  <a
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={`${process.env.REACT_APP_ROC_PUBLIC}/privacy-policy'}
                                  >
                                    Privacy Policy
                                  </a>
                                </label>
                              </div>

                              <div className="form-group mb-0">
                                <button
                                  disabled={submittingForm}
                                  type="submit"
                                  className="btn btn-primary  btn-block"
                                >
                                  Signup
                                </button>
                              </div>
                            </Form>
                          </div>
                        </>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              title="Verify OTP"
              visible={currentVerifyOtp !== "" ? true : false}
              // onOk={handleOk}
              footer={null}
              onCancel={() => setcurrentVerifyOtp("")}
            >
              <form onSubmit={validateOTPEmail}>
                <input
                  placeholder="Please enter the OTP sent to you via email"
                  type="text"
                  className="form-control mb-3"
                />
                <button className="btn btn-primary w-100" type="submit">
                  Verify OTP
                </button>
              </form>
            </Modal>
          </div>
        ) : (
          <EmailVerificationCard
            back={true}
            validateOTPEmail={validateOTPEmail}
            email={email}
            otp={currentVerifyOtp}
          />
        )}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withApollo(withRouter(Register));
