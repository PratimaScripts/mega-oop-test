import React, { useEffect, useState, useContext, useRef } from "react";
import { withApollo } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { message } from "antd";
import { withRouter, useParams } from "react-router-dom";
import LoginQuery from "../../../config/queries/login";
// import cookie from "react-cookies";
import OTPInput from "otp-input-react";
import Img from "react-image";
import { UserDataContext } from "store/contexts/UserContext";
import { useHistory } from "react-router";
import showNotification from "config/Notification";
import { useLazyQuery } from "react-apollo";
import NProgress from "nprogress";
import BasicHeader from "components/layout/headers/BasicHeader";
import { saveTokenInCookie } from "utils/cookie";

const EmailVerification = (props) => {
  const email = useRef(useParams().email);
  const token = useParams().token;
  // /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
  const history = useHistory();
  const { state, dispatch } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated = false, userData } = state;
  //   const { email, role } = userData;

  const [inputtedOtp, setInputtedOtp] = useState("");

  useEffect(() => {
    if (props.email) {
      email.current = props.email;
    }
    if (isAuthenticated && userData.isEmailVerified) {
      showNotification("success", "Your email is already verified", "");
      history.push("/" + history.location.search);
    }
    if (email.current === undefined) {
      showNotification(
        "error",
        "You are not allowed to access this page",
        "Login or register first to continue"
      );
      history.push("/" + history.location.search);
    } else if (
      emailRegex.test(email.current) &&
      token === undefined &&
      props.email === undefined
    ) {
      setLoading(true);
      sendOtpQuery({ variables: { email: email.current } });
    } else if (emailRegex.test(email.current) && token !== undefined) {
      setLoading(true);
      verifyEmail({
        variables: { email: email.current, token, method: "token" },
      });
    }

    //eslint-disable-next-line
  }, [email.current]);

  const checkOtp = (value) => {
    setInputtedOtp(value);
    if (value.length === 6) {
      setLoading(true);
      NProgress.start();
      verifyEmail({
        variables: { email: email.current, otp: value, method: "otp" },
      });
    }
  };

  const [sendOtpQuery] = useLazyQuery(LoginQuery.resendOTP, {
    onCompleted: ({ resendOTP }) => {
      if (!isEmpty(resendOTP) && get(resendOTP, "success", false)) {
        message.success(`New OTP has been sent to ${email.current}`);
      } else {
        showNotification("error", "Failed to send otp", "Try Again");
      }
      NProgress.done();
      setLoading(false);
    },
    onError: ({ graphQLErrors, networkError }) => {
      setLoading(false);
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      NProgress.done();
    },
  });

  const [verifyEmail] = useLazyQuery(LoginQuery.verifyEmail, {
    onCompleted: ({ verifyEmail }) => {
      if (verifyEmail.success) {
        showNotification("success", "Email Verified!", "Thank You!");
        //  cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(verifyEmail, "token"), {path: "/"});
        saveTokenInCookie(get(verifyEmail, "token"));
        dispatch({ type: "SET_USER_DATA", payload: verifyEmail });
        //  let next = localStorage.getItem('next');
        //  if(next){
        //    history.push("/onboarding"+next)
        //  }
        //  else{
        history.push("/onboarding" + history.location.search);
        //  }
      } else {
        showNotification(
          "error",
          "Failed to verify",
          get(verifyEmail, "message", "")
        );
      }
      setLoading(false);
      NProgress.done();
    },
    onError: ({ graphQLErrors, networkError }) => {
      setLoading(false);
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      NProgress.done();
    },
  });

  const resendOTPRequest = async () => {
    setLoading(true);
    sendOtpQuery({ variables: { email: email.current } });
  };

  return (
    <>
      <BasicHeader />
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
                  <form action="" method="post">
                    <h4>Verify your email</h4>

                    <div className="input-group verify-code">
                      <div className="verify__otp">
                        <OTPInput
                          title="Please enter the OTP!"
                          value={inputtedOtp}
                          onChange={checkOtp}
                          autoFocus
                          OTPLength={6}
                          separator={<span>-</span>}
                          otpType="number"
                          inputStyle={"form-control gcode"}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <p className="verification__para">
                      We've sent you a confirmation email to
                      <span className="text-warning"> {email.current}. </span>
                      Please check your inbox or spam folder and follow the link
                      or copy &amp; paste the code from the mail.
                    </p>

                    <div className="row bluetext">
                      {props.back && (
                        <div
                          className="col-6 text-left"
                          style={{ cursor: "pointer" }}
                          onClick={() => props.setFormStep(0)}
                        >
                          <i className="mdi mdi-arrow-left"></i> Back
                        </div>
                      )}
                      <div
                        style={{ cursor: "pointer", textAlign: "center" }}
                        className="col-6 text-center"
                        onClick={resendOTPRequest}
                      >
                        Resend to Email <i className="mdi mdi-arrow-right"></i>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(withApollo(EmailVerification));
