import React, { lazy } from "react";
import LoginFormEmail from "./LoginFormEmail";
import LoginQuery from "../../../config/queries/login";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import ValidateEmail from "../../../config/ValidateEmail";
import FormValidationSchema from "../../../config/FormSchemas/login";
import cookie from "react-cookies";
import authenticator from "authenticator";
import { notification, message } from "antd";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import "./login.scss";

// import LoginFormPassword from "./LoginFormPassword";
const LoginFormPassword = lazy(() => import("./LoginFormPassword"));

// import OtpVerificationMFA from "./ValidateOTPMfa";
const OtpVerificationMFA = lazy(() => import("./ValidateOTPMfa"));

// import OtpVerificationEmail from "./ValidateOtp";
const OtpVerificationEmail = lazy(() => import("./ValidateOtp"));

let loaderStyling = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

class LoginMain extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loginStep: 1,
      facebookData: {},
      isSocialLogin: false,
      ifEmailExists: {
        email: ""
      },
      isRememberMe: false,
      currentVerifyOtp: "",
      token: "",
      isMFA: false,
      loggedInRole: "",
      isValidEmail: true,
      isLoading: false,
      isLoadingSave: false
    };
  }

  componentDidMount() {
    this.checkUser();


    if (localStorage.getItem("isLoggedOut")) {
      notification["info"]({
        message: "You have been logged out",
        duration: 0,
        description:
          "You have been logged out for being inactive for more than 30 minutes"
      });
    }

    // userData.password ? true : false
  }

  responseFacebook = async res => {
    this.props.startLoading(true);
    const queryResponse = await this.props.client.query({
      query: LoginQuery.checkEmail,
      variables: { email: res.email }
    });

    if (
      !isEmpty(queryResponse.data.checkEmail) &&
      get(queryResponse, "data.checkEmail.success")
    ) {
      this.onSubmitEmail(res);
      this.props.endLoading(false);
    } else {
      this.props.endLoading(false);

      this.props.history.push("/register", { ...res });
    }
  };

  onSubmitEmail = async formData => {
    this.props.startLoading(true);

    let isValidEmail = await ValidateEmail(formData);

    if (isValidEmail) {
      const queryResponse = await this.props.client.query({
        query: LoginQuery.checkEmail,
        variables: { email: formData.email }
      });

      if (
        !isEmpty(queryResponse.data.checkEmail) &&
        get(queryResponse, "data.checkEmail.success")
      ) {
        if (get(queryResponse, "data.checkEmail.isDeactivate")) {
          let ifEmailExists = queryResponse.data.checkEmail;

          const queryResponseEmail = await this.props.client.query({
            query: LoginQuery.verifyEmailAddress,
            variables: { email: formData.email }
          });

          if (get(queryResponseEmail, "data.verifyEmailAddress.success")) {
            //  this.props.endLoading();
            this.setState({
              showAnim: true,
              loginStep: 4,
              ifEmailExists,
              currentVerifyOtp: get(
                queryResponseEmail,
                "data.verifyEmailAddress.data.otp"
              )
            });
          } else {
            //  this.props.endLoading();
            message.error(
              get(queryResponseEmail, "data.verifyEmailAddress.message")
            );
          }
        } else {
          let ifEmailExists = queryResponse.data.checkEmail;

          //  this.props.endLoading();

          this.setState({
            showAnim: true,
            loginStep: 2,
            ifEmailExists,
            isMFA: ifEmailExists.isMFA
          });
        }
        return true;
      } else {
        //  this.props.endLoading();

        if (!get(queryResponse, "data.checkEmail.isRegister")) {
          this.props.history.push("/register", { email: formData.email });
        } else {
          this.props.history.push("/register", { email: formData.email });
        }
        return true;
      }
    } else {
      this.setState({ isValidEmail: false });
      //  this.props.endLoading();
      return true;
    }
  };

  OTPFilled = async (OTP, type) => {
    this.props.startLoading(true);

    if (type === "mfa") {
      let r = await authenticator.verifyToken(
        process.env.REACT_APP_AUTHENTICATOR_SECRET,
        OTP
      );
      if (r) {
        if (r.delta === 0) {
          this.props.endLoading(false);
          message.success("OTP Verified!");
          cookie.save(process.env.REACT_APP_AUTH_TOKEN, this.state.token, { path: "/" });
          localStorage.removeItem("isLoggedOut");
          window.location = `/${this.state.loggedInRole}`;
        }
        if (r.delta === -1) {
          this.props.endLoading(false);

          message.error("Invalid OTP!");
        }
      }
      if (!r) {
        this.props.endLoading(false);

        message.error("Invalid OTP!");
      }
    }
    if (type === "email") {
      const checkOtpQueryRes = await this.props.client.query({
        query: LoginQuery.checkOtp,
        variables: { email: this.state.ifEmailExists.email, otp: OTP }
      });

      if (
        !isEmpty(checkOtpQueryRes.data.checkOTP) &&
        get(checkOtpQueryRes, "data.checkOTP.success")
      ) {
        this.props.endLoading(false);

        cookie.save(process.env.REACT_APP_AUTH_TOKEN, this.state.token, { path: "/" });
        localStorage.removeItem("isLoggedOut");
        window.location = `/${this.state.loggedInRole}`;
      } else {
        this.props.endLoading(false);
        notification.error({ message: "OTP is incorrect!" });
      }
    }
  };

  validateOTPEmail = async OTP => {
    if (this.state.currentVerifyOtp === OTP) {
      this.props.endLoading(false);
      this.setState({ loginStep: 2 });
    } else {
      this.props.endLoading(false);
      notification.error({ message: "OTP is incorrect!" });
    }
  };

  onSubmitLogin = async formDataLogin => {
    this.props.startLoading(true);
    this.setState({ isLoadingSave: true });

    const loginQueryResponse = await this.props.client.query({
      query: LoginQuery.loginUser,
      variables: { ...formDataLogin }
    });

    if (
      !isEmpty(loginQueryResponse.data.login) &&
      get(loginQueryResponse, "data.login.success")
    ) {
      let loginData = loginQueryResponse.data.login;

      localStorage.setItem("userId", loginData.data._id)

      this.setState({
        token: loginData.token,
        loggedInRole: loginData.data.defaultRole
      });

      if (this.state.isMFA) {
        this.props.endLoading(false);
        this.setState({ loginStep: 3 });
      }

      if (!this.state.isMFA) {
        cookie.save(process.env.REACT_APP_AUTH_TOKEN, loginData.token, { path: "/" });
        localStorage.removeItem("isLoggedOut");

        let role = loginData.data.defaultRole;

        if (
          !get(loginQueryResponse, "data.login.isProfileUpdated") &&
          role !== "admin"
        ) {
          window.location = `/${role}`;
          //This diabled menu logic is removed , Now user can directly land to dashboard
          // let isMenuDisabled =
          //   get(loginQueryResponse, "data.login.data.isProfileUpdate") &&
          //     get(loginQueryResponse, "data.login.data.isPersonaUpdate")
          //     ? false
          //     : true;
              
          // if (isMenuDisabled) {
          //   window.location = `/${role}/settings`;
          // }

          // if (!isMenuDisabled) {
          //   window.location = `/${role}`;
          // }
        } else {
          window.location = `/${role}`;
        }
      }
    } else {
      this.props.endLoading(false);
      this.setState({ isLoadingSave: false });

      notification.error({ message: "Wrong Password! Please try again..." });
    }
  };

  checkUser = async () => {
    this.setState({ isLoading: true });
    const checkUserQuery = await this.props.client.query({
      query: LoginQuery.checkAuth,
      context: {
        headers: {
          token: cookie.load(process.env.REACT_APP_AUTH_TOKEN)
        }
      }
    });

    if (
      !isEmpty(checkUserQuery.data.authentication) &&
      get(checkUserQuery, "data.authentication.success")
    ) {
      let userData = get(checkUserQuery, "data.authentication.data");

      window.location = `/${userData.role}`;
    } else {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      loginStep,
      ifEmailExists,
      OtpCheckStatus,
      isLoading,
      isLoadingSave,
      isValidEmail
    } = this.state;

    return (
      <>
        {isLoading ? (
          <div style={loaderStyling}>
            {/* <div className="spinner-box">
              <div className="configure-border-1">
                <div className="configure-core"></div>
              </div>
              <div className="configure-border-2">
                <div className="configure-core"></div>
              </div>
            </div> */}
            <img
              width="100"
              className="logo__img--loader"
              src="/assets/images/logo.svg"
              alt="Please wait while we load ROC!"
            />
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
          </div>
        ) : (
          <TransitionGroup>
            <CSSTransition
              key={loginStep}
              classNames="page"
              unmountOnExit
              timeout={300}
            >
              <div className="login__bg">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      {(loginStep === 1 && (
                        <LoginFormEmail
                          isValidEmail={isValidEmail}
                          FormValidationSchema={FormValidationSchema}
                          onSubmit={this.onSubmitEmail}
                          responseFacebook={this.responseFacebook}
                        />
                      )) ||
                        (loginStep === 3 && (
                          <OtpVerificationMFA
                            ifEmailExists={ifEmailExists}
                            OTPFilled={this.OTPFilled}
                            OtpCheckStatus={OtpCheckStatus}
                            goBack={() => this.setState({ loginStep: 1 })}
                          />
                        )) ||
                        (loginStep === 2 && (
                          <LoginFormPassword
                            isRememberMe={this.state.isRememberMe}
                            setRememberMe={(e) =>
                              this.setState({
                                isRememberMe: e,
                              })
                            }
                            isLoading={isLoadingSave}
                            FormValidationSchema={FormValidationSchema}
                            onSubmit={this.onSubmitLogin}
                            ifEmailExists={ifEmailExists}
                            {...this.props}
                          />
                        )) ||
                        (loginStep === 4 && (
                          <OtpVerificationEmail
                            ifEmailExists={ifEmailExists}
                            OTPFilled={this.OTPFilled}
                            validateOTPEmail={this.validateOTPEmail}
                            OtpCheckStatus={OtpCheckStatus}
                            goBack={() => this.setState({ loginStep: 1 })}
                            {...this.props}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
          </TransitionGroup>
        )}
      </>
    );
  }
}

export default withRouter(withApollo(LoginMain));
