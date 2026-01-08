import React, {useState, useRef, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ForgotPassQueries from "../../../config/queries/login";
import showNotification from "../../../config/Notification";
import { useParams } from "react-router-dom";
import RegistrationFormSchema from "../../../config/FormSchemas/register";
import get from "lodash/get";
import { useHistory } from "react-router";
import { withApollo } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import Img from "react-image";
// import { message } from "antd";
// import isEmpty from "lodash/isEmpty";
import { UserDataContext } from "store/contexts/UserContext";
import LoadingToRedirect from "components/loaders/LoadingToRedirect";


import "./register.scss";

const ResetPassword = props => {
  const { state } = useContext(UserDataContext);
  const history = useHistory()
  const [showReroutingView, setReroutingView] = useState(false)



  let { token } = useParams();
  let newRef = useRef();
  const submitBtnRef = useRef();

  useEffect(() => {

    if(get(state, "isAuthenticated", false)) {
      setReroutingView(true)
    }
    //eslint-disable-next-line
  }, [state.isAuthenticated])

  const { data } = useQuery(ForgotPassQueries.getUserInformation, {
    variables: { token }
  });

  const resetPassword = async data => {
    const resetPasswordQuery = await props.client.mutate({
      mutation: ForgotPassQueries.resetPassword,
      variables: { token, password: data.password }
    });

    if (get(resetPasswordQuery, "data.resetPassword.success")) {
      showNotification("success", "Password was reset successfully!", "");
      window.location.replace("/login");
    } else {
      showNotification(
        "error",
        "An error occured",
        get(resetPasswordQuery, "data.resetPassword.message")
      );
    }
  };

  if (get(data, "getUserInformation.message") === "Token expire.") {
    props.history.push("/login"+history.location.search);
    return <></>;
  }

  if (!get(data, "getUserInformation.success")) {
    return (
      <>
        {/* <div className="spinner-box">
          <div className="configure-border-1">
            <div className="configure-core"></div>
          </div>
          <div className="configure-border-2">
            <div className="configure-core"></div>
          </div>
        </div> */}

        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>
      </>
    );
  }

  // const resendOTPRequest = async () => {
  //   let email = get(newRef, "current.state.values").email;
  //   const checkUserQuery = await props.client.query({
  //     query: ForgotPassQueries.resendOTP,
  //     variables: { email }
  //   });

  //   if (
  //     !isEmpty(checkUserQuery.data.resendOTP) &&
  //     get(checkUserQuery, "data.resendOTP.success")
  //   ) {
  //     message.success(`New OTP has been sent to ${email}`);
  //     props.history.push("/login"+history.location.search);
  //   } else {
  //     message.error("Invalid Email!");
  //   }
  // };

  if (get(data, "getUserInformation.success")) {
    let userData = get(data, "getUserInformation.data");
    return showReroutingView ? (
      <LoadingToRedirect
        path={"/"}
        messageToDisplay={
          <>
            <p>You must be logged out to access this page</p>
            <p>Rerouting to dashboard</p>
          </>
        }
        time={3}
      />
    ) : (
      <div className="login__bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="login-wrapper">
                <Formik
                  initialValues={{ email: userData ? userData.email : "" }}
                  ref={newRef}
                  validationSchema={RegistrationFormSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    resetPassword(values);
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
                          <h4>Welcome Back, {userData && userData.name}!</h4>
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
                              disabled
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
                                errors.confirmPassword
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

                          <div className="row bluetext mb-3">
                            <div
                              style={{ cursor: "pointer" }}
                              className="col-6 text-left"
                              onClick={() => props.history.push("/"+history.location.search)}
                            >
                              <i className="mdi mdi-arrow-left"></i> Back
                            </div>

                            <div
                              style={{ cursor: "pointer" }}
                              className="col-6 text-right"
                              onClick={() => submitBtnRef.current?.click()}
                            >
                              Resend <i className="mdi mdi-arrow-right"></i>
                            </div>
                          </div>

                          <div className="form-group mb-0">
                            <button
                              ref={submitBtnRef}
                              type="submit"
                              className="btn btn-primary  btn-block"
                            >
                              Reset Password
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
      </div>
    );
  }
};

export default withApollo(withRouter(ResetPassword));
