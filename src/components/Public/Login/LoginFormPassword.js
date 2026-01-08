import React from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Img from "react-image";

const LoginFormPassword = props => {
  let userData = props.ifEmailExists;



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
                  className={
                    errors.email
                      ? "error__field_show full__input"
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
                  autoComplete
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
                      <input
                        defaultChecked={userData.password && true}
                        onClick={(e) => props.setRememberMe(e.target.checked)}
                        type="checkbox"
                      />{" "}
                      Remember me
                    </label>
                  </div>

                  <div className="col-6 text-right">
                    <a
                      href
                      onClick={() => props.history.push("/forgotpassword")}
                      className="forgot-password"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <button
                  disabled={props.isLoading}
                  type="submit"
                  className="btn btn-primary  btn-block"
                >
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
            target="_blank"
            href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`}
          >
            Terms
          </a>{" "}
          &amp;{" "}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`${process.env.REACT_APP_ROC_PUBLIC}/privacy-policy`}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default withRouter(LoginFormPassword);
