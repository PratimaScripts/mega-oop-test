import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FormValidationSchema from "../../../config/FormSchemas/login";
import LoginQuery from "../../../config/queries/login";
import ScreeningQuery from "../../../config/queries/screening";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import ScreeningPaymentModal from "../../../config/PaymentModals/ScreeningInvitationAccept";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import Img from "react-image";
import { message } from "antd";
// import cookie from "react-cookies";
import { saveTokenInCookie } from "utils/cookie";

import "../Login/login.scss";

const AcceptInvitationScreening = props => {
  let { token } = useParams();
  const { data } = useQuery(ScreeningQuery.acceptScreeningInvitation, {
    variables: { token }
  });

  let apiResponse = get(data, "acceptScreeningInvitation.data");
  // console.log("teeeeeeeeeeeeeeeeeee", apiResponse);
  const loginUser = async credentials => {
    if (get(apiResponse, "email") === credentials["email"]) {
      props.startLoading(true);
      const loginQueryResponse = await props.client.query({
        query: LoginQuery.loginUser,
        variables: { ...credentials }
      });

      if (
        !isEmpty(loginQueryResponse.data.login) &&
        get(loginQueryResponse, "data.login.success")
      ) {
        localStorage.setItem("isOriginCorrect", true);
        props.endLoading(true);
        let role = get(apiResponse, "invitedRole");
        if (!get(apiResponse, "isPayment")) {
          // initiate payment here
          // cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(apiResponse, "token"), {
          //   path: "/"
          // });
          saveTokenInCookie(get(apiResponse, "token"))
          setPaymentTime(true);
        } else {
          // cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(apiResponse, "token"), {
          //   path: "/"
          // });
          saveTokenInCookie(get(apiResponse, "token"))

          if (get(apiResponse, "isNew")) {
            // push to settings
            // props.history.push(`/${role}/settings`);
            window.location.href = `/${role}/settings`;
          } else {
            // push to review
            // props.history.push(`/${role}/screening/review`);
            window.location.href = `/${role}/screening/review`;
          }
        }
      } else {
        props.endLoading(true);
        message.error(get(loginQueryResponse, "data.login.message"));
      }
    } else {
      message.error("Invalid Email!");
    }
  };

  const [isPaymentTime, setPaymentTime] = useState(false);

  return (
    <>
      <ScreeningPaymentModal
        closeModal={() => setPaymentTime(false)}
        isPaymentTime={isPaymentTime}
        apiResponse={apiResponse}
        token={get(data, "acceptScreeningInvitation.token")}
        {...props}
      />
      <div className="login__bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="login-wrapper">
                <Img
                  src={["/assets/images/logo.svg"]}
                  alt=""
                  className="login-logo"
                />
                <div className="login-box">
                  <Formik
                    validationSchema={FormValidationSchema.PasswordSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      setSubmitting(true);

                      loginUser(values);
                    }}
                  >
                    {({ isSubmitting, errors }) => (
                      <Form>
                        <h4>
                          Please log in to accept invitation for this screening
                          order!
                        </h4>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(AcceptInvitationScreening);
