import React, { useEffect, useState } from "react";
import { withApollo } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { withRouter } from "react-router-dom";
import LoginQuery from "../../../config/queries/login";
import OTPInput from "otp-input-react";
import Img from "react-image";

const EmailVerification = (props) => {
  let { email, otp } = useParams();
  const [userEmail, setUserEmail] = useState("");
  const [currentOtp, setCurrentOtp] = useState("");
  const [inputtedOtp, setInputtedOtp] = useState("");

  useEffect(() => {
    setUserEmail(email ? email : props.email);
  }, [email, props]);

  useEffect(() => {
    setCurrentOtp(otp ? otp : props.otp);
  }, [otp, props]);

  useEffect(() => {
    const hasCorrectLength = String(inputtedOtp).length === 6;
    const isOtpCorrect = String(inputtedOtp) === String(currentOtp);
    if (inputtedOtp && hasCorrectLength && isOtpCorrect) {
      setInputtedOtp("");
      props.validateOTPEmail();
    }
    if (hasCorrectLength && !isOtpCorrect) {
      message.error("OTP is not matched!");
    }
  }, [inputtedOtp, props, currentOtp]);

  const resendOTPRequest = async () => {
    const resendOtp = await props.client.query({
      query: LoginQuery.resendOTP,
      variables: { email: userEmail },
    });

    if (
      !isEmpty(resendOtp.data.resendOTP) &&
      get(resendOtp, "data.resendOTP.success")
    ) {
      message.success(`New OTP has been sent to ${userEmail}`);
    }
  };

  return (
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
                        onChange={setInputtedOtp}
                        autoFocus
                        OTPLength={6}
                        separator={<span>-</span>}
                        otpType="number"
                        inputStyle={"form-control gcode"}
                        disabled={false}
                      />
                    </div>
                  </div>

                  <p className="verification__para">
                    We've sent you a confirmation email to
                    <span className="text-warning"> {userEmail}. </span>
                    Please check your inbox or spam folder and follow the link
                    or copy &amp; paste the code from the mail.
                  </p>

                  <div className="row bluetext">
                    <div
                      className="col-6 text-left"
                      style={{ cursor: "pointer" }}
                      onClick={() => props.history.goBack()}
                    >
                      <i className="mdi mdi-arrow-left"></i> Back
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      className="col-6 text-right"
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
  );
};

export default withRouter(withApollo(EmailVerification));
