import React, { useState, useRef, useEffect, useContext} from "react";
import { withRouter } from "react-router-dom";
import { message } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ForgotPassQueries from "../../../config/queries/login";
import FormValidationSchema from "../../../config/FormSchemas/login";
import get from "lodash/get";
import { withApollo } from "react-apollo";
import Img from "react-image";

import { UserDataContext } from "store/contexts/UserContext";
import LoadingToRedirect from "components/loaders/LoadingToRedirect";


import "./register.scss";


const ResetPasswordInvite = props => {
  const { state } = useContext(UserDataContext);
  let newRef = useRef();
  const [showReroutingView, setReroutingView] = useState(false)
  const submitBtnRef = useRef();


  useEffect(() => {

    if(get(state, "isAuthenticated", false)) {
      if(!showReroutingView) {
        setReroutingView(true)
      }
    }

    //eslint-disable-next-line
  }, [state.isAuthenticated])

  const [double, setDouble] = useState(false);

  const signUp = async formData => {
    const checkUserQuery = await props.client.mutate({
      mutation: ForgotPassQueries.forgotPassword,
      variables: formData
    });

    if (get(checkUserQuery, "data.forgotPassword.success")) {
      message.success("We have sent an email to your registered email!");
    } else {
      message.error(get(checkUserQuery, "data.forgotPassword.message"));
    }
  };

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
                innerRef={newRef}
                initialValues={{ email: "" }}
                validationSchema={FormValidationSchema.EmailCheckSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  signUp(values);
                  setDouble(true);
                }}
              >
                {({ values, isSubmitting, errors }) => (
                  <>
                    <Img
                      src={["/assets/images/logo.svg"]}
                      alt=""
                      className="login-logo"
                    />
                    <div className="login-box">
                      <Form>
                        <h4>Forgot your Password?</h4>
                        <p className="lead">
                          We'll email you the instruction on <br /> how to reset
                          your password.
                        </p>
                        <div className="form-group">
                          <i className="fa fa-envelope i__dark"></i>
                          <Field
                            placeholder="Enter your registered email address"
                            type="email"
                            name="email"
                            required={true}
                            className={
                              values.email
                                ? errors.email
                                  ? "error__field_show full__input"
                                  : "error__field_hide full__input"
                                : "fields__empty_color full__input"
                            }
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="all__errors"
                          />
                        </div>
                        <div className="row bluetext mb-3">
                          <div
                            style={{ cursor: "pointer" }}
                            className="col-6 text-left"
                            onClick={() => props.history.push("/login"+props.history.location.search)}
                          >
                            <i className="mdi mdi-arrow-left"></i> Login
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
                            disabled={double}
                            type="submit"
                            ref={submitBtnRef}
                            className="btn btn-primary  btn-block"
                          >
                            Send me instruction
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
};

export default withApollo(withRouter(ResetPasswordInvite));
