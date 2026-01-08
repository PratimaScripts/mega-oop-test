import React, { useState } from "react";
import { withApollo } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { message } from "antd";
import LoginQuery from "../../../config/queries/login";
import OTPInput from "otp-input-react";
import Img from "react-image";

let currentVerification = "mfa";

const OtpVerification = props => {
  const [OTP, setOTP] = useState("");

  if (OTP && String(OTP).length === 6) {
    if (currentVerification === "email") {
      props.OTPFilled(OTP, "email");
    } else {
      props.OTPFilled(OTP, "mfa");
    }
  }

  return (
    <div className="verify__otp">
      <OTPInput
        title="Please enter the OTP!"
        value={OTP}
        hasErrored={true}
        onChange={setOTP}
        autoFocus
        OTPLength={6}
        separator={<span>-</span>}
        otpType="number"
        inputStyle={"form-control gcode"}
        disabled={false}
      />
    </div>
  );
};

const OtpValidate = props => {
  let userProps = props.ifEmailExists;

  const resendOTPRequest = async email => {
    currentVerification = "email";

    const checkUserQuery = await props.client.query({
      query: LoginQuery.resendOTP,
      variables: { email }
    });

    if (
      !isEmpty(checkUserQuery.data.resendOTP) &&
      get(checkUserQuery, "data.resendOTP.success")
    ) {
      message.success(`New OTP has been sent to ${email}`);
    }
  };

  return (
    <div className="login-wrapper">
      <Img src={["/assets/images/logo.svg"]} alt="" className="login-logo" />
      <div className="login-box">
        <form action="" method="post">
          <h4>Multi-Factor Authentication</h4>

          <div className="input-group verify-code">
            <OtpVerification {...props} />
          </div>

          <p className="verification__para">
            Please check your Authenticator app, and enter the code coming up on
            it
          </p>

          <div className="row bluetext">
            <div className="col-6 text-left" onClick={() => props.goBack()}>
              <i className="mdi mdi-arrow-left"></i> Back
            </div>
            <div
              style={{ cursor: "pointer" }}
              className="col-6 text-right"
              onClick={() => resendOTPRequest(userProps.email)}
            >
              Resend to Email <i className="mdi mdi-arrow-right"></i>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withApollo(OtpValidate);
