import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Img from "react-image";

import { Popover } from "antd";

const LoginFormPassword = props => {
  let userData = props.ifEmailExists;
  const [resetPassword, openResetPassword] = useState(false);
  const content = (
    <div>
      <form>
        <div>
          <input
            className="form-control"
            type="email"
            placeholder="Please enter the email!"
          />
        </div>
        <span>error message</span>
        <button type="button" onClick={() => openResetPassword(!resetPassword)}>
          CLose
        </button>
      </form>
    </div>
  );
  return (
    <div className="login-wrapper">
      <Img src={["/assets/images/logo.svg"]} alt="" className="login-logo" />
      <div className="login-box">
        <Formik
          initialValues={userData}
          validationSchema={props.FormValidationSchema.PasswordSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            let obj = { email: values.email, password: values.password };
            props.onSubmit(obj);
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <h4>Welcome back {userData && userData.firstName}!</h4>
              <div className="form-group">
                <i className="fa fa-envelope i__dark"></i>
                <Field
                  placeholder="Please enter your email!"
                  type="email"
                  name="email"
                  className="full__input"
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

              <div className="form-group mb-30">
                <div className="row">
                  <div className="col-6 text-left">
                    <label className="pull-left checkbox-inline">
                      <input type="checkbox" /> Remember me
                    </label>
                  </div>
                  <Popover
                    content={content}
                    title="Reset Password"
                    trigger="click"
                    visible={resetPassword}
                  >
                    <div
                      onClick={() => openResetPassword(true)}
                      className="col-6 text-right"
                    >
                      <a href onClick={() => openResetPassword(!resetPassword)}>
                        Forgot Password?
                      </a>
                    </div>
                  </Popover>
                </div>
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary  btn-block">
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="terms__text">
          By clicking login, you agree to our{" "}
          <a
            rel="noopener noreferrer"
            href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`}
            target="_blank"
          >
            Terms
          </a>{" "}
          &{" "}
          <a
            rel="noopener noreferrer"
            href={`${process.env.REACT_APP_ROC_PUBLIC}/privacy-policy`}
            target="_blank"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default withRouter(LoginFormPassword);
