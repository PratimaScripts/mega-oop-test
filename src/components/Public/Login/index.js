import React, { useState, useContext } from "react";
import LoginFormEmail from "./LoginFormEmail";
import LoginQuery from "../../../config/queries/login";
import { useLazyQuery, withApollo, useMutation } from "react-apollo";
import { withRouter, useLocation } from "react-router-dom";
import ValidateEmail from "../../../config/ValidateEmail";
import FormValidationSchema from "../../../config/FormSchemas/login";
// import cookie from "react-cookies";
import authenticator from "authenticator";
import { notification, message } from "antd";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import LoginFormPassword from "./LoginFormPassword";
import OtpVerificationMFA from "./ValidateOTPMfa";
import OtpVerificationEmail from "./ValidateOtp";
import NProgress from "nprogress";
import { useHistory } from "react-router";

import { UserDataContext } from "store/contexts/UserContext";
import "./login.scss";
import { useEffect } from "react";
import showNotification from "config/Notification";
import { saveTokenInCookie } from "utils/cookie";
import LoadingToRedirect from "components/loaders/LoadingToRedirect";
import axios from "axios";
const LoginMain = (props) => {
  const history = useHistory();
  const search = useLocation().search;
  const nextUrl = new URLSearchParams(search).get("next");

  const { dispatch, state } = useContext(UserDataContext);
  const [loginStep, setLoginStep] = useState(1);

  const [ifEmailExists, setIfEmailExists] = useState({ email: "" });
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [currentVerifyOtp, setCurrentVerifyOtp] = useState("");
  const [isMFA, setIsMFA] = useState(false);
  const [loggedInRole, setLoggedInRole] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const [showReroutingView] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (search && search.includes("?next")) {
      localStorage.setItem("next", search);
    }
    if (get(state, "isAuthenticated", false)) {
      if (
        ["Verified", "Partially Verified"].includes(
          get(state.userData, "verifiedStatus", "Not Verified")
        )
      ) {
        return history.push(
          `/${
            state.userData.invitedOn?.length
              ? "workspace"
              : state.userData.role || "renter"
          }` + history.location.search
        );
      } else {
        history.push("/onboarding" + history.location.search);
      }
      return history.push("/onboarding" + history.location.search);
    }
  }, [history, search, state]);

  const [socialLogin] = useMutation(LoginQuery.socialLogin, {
    onCompleted: ({ socialLogin }) => {
      if (!isEmpty(socialLogin) && socialLogin.success) {
        const userData = socialLogin.data;
        localStorage.setItem("userId", userData._id);
        saveTokenInCookie(get(socialLogin, "token", ""));
        localStorage.removeItem("isLoggedOut");
        setToken(socialLogin.token);
        setLoggedInRole(userData.defaultRole);
        if (isMFA) {
          setLoginStep(3);
        }
        dispatch({ type: "SET_USER_DATA", payload: socialLogin });
        if (
          ["Verified", "Partially Verified"].includes(
            get(userData, "verifiedStatus", "Not Verified")
          )
        ) {
          history.push(
            `/${get(state, "userData.defaultRole", "renter")}` +
              history.location.search
          );
          message.success(
            `Welcome Back ${userData.firstName ? userData.firstName : " "}`
          );
        } else {
          history.push("onboarding" + history.location.search);
        }
      } else {
        showNotification(
          "error",
          "Something went wrong",
          "Please Try Again..."
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

  const responseFacebook = async (res) => {
    // console.log(res)
    if (res.email && res.accessToken && res.userId) {
      NProgress.start();
      setLoading(true);
      socialLogin({
        variables: {
          email: res.email,
          loginMethod: "facebook",
          accesstoken: res.accessToken,
          socialId: res.userID,
        },
      });
    } else if (!res.email) {
      message.error(
        "Not able to log you in, email was not provided by facebook!"
      );
    } else {
      message.error(
        "Not able to log you in via facebook, try different method!"
      );
    }
  };

  const responseLinkedIn = async (success) => {
    try {
      // console.log(success)
      NProgress.start();
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      };
      const code = success.code;
      const secret = "8XEVZ1Qo6sAhVeAm";
      const redirect_uri_linked = `${window.location.origin}/linkedin`;
      let linkedUrl = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${process.env.REACT_APP_LINKEDIN_ID}&client_secret=${secret}&code=${code}&redirect_uri=${redirect_uri_linked}`;
      const resdult = await axios.post(linkedUrl, config);
      const access_token = resdult.data.access_token;
      linkedUrl = `https://api.linkedin.com/v2/me/?oauth2_access_token=${access_token}&projection=(id,localizedLastName,localizedFirstName,profilePicture(displayImage~:playableStreams))`;
      const resdult2 = await axios.get(linkedUrl);
      const values = {
        firstName: resdult2.data.localizedFirstName,
        lastName: resdult2.data.localizedLastName,
        socialId: resdult2.data.id,
      };
      let profileData = resdult2.data.profilePicture["displayImage~"].elements;

      if (profileData.length > 0) {
        // let len = profileData.length;
        let image = profileData[0].identifiers[0].identifier;
        values.avatar = image;
      }
      if (profileData.length > 1) {
        let len = profileData.length;
        let image = profileData[len - 1].identifiers[0].identifier;
        values.profilePic = image;
      }
      linkedUrl = `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token=${access_token}`;
      const resdult3 = await axios.get(linkedUrl);
      values.email = resdult3.data.elements[0]["handle~"].emailAddress;
      // console.log(values)
      socialLogin({ variables: values });
      NProgress.done();
    } catch (error) {
      NProgress.done();
      // console.log(error)
      showNotification("error", "An error occurred!");
    }
  };

  const [verifyEmailAddressQuery] = useLazyQuery(
    LoginQuery.verifyEmailAddress,
    {
      onCompleted: ({ verifyEmailAddress }) => {
        if (get(verifyEmailAddress, "success", false)) {
          //  NProgress.done();
          // setShowAnim(true)
          setLoginStep(4);
          setCurrentVerifyOtp(get(verifyEmailAddress, "data.otp"));
        } else {
          //  NProgress.done();
          message.error(get(verifyEmailAddress, "message"));
        }
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
    }
  );

  const [checkEmailQuery] = useLazyQuery(LoginQuery.checkEmail, {
    onCompleted: async ({ checkEmail }) => {
      if (!isEmpty(checkEmail) && get(checkEmail, "success", false)) {
        if (get(checkEmail, "isDeactivate", false)) {
          // let ifEmailExists = queryResponse.data.checkEmail;
          // console.log('isDeactivate')
          await verifyEmailAddressQuery({
            variables: { email: checkEmail.email },
          });
        } else {
          let ifEmailExists = checkEmail;

          // console.log('login')
          //  NProgress.done();
          // setShowAnim(true)
          setLoginStep(2);
          setIfEmailExists(ifEmailExists);
          setIsMFA(ifEmailExists.isMFA);
        }
      } else {
        //  NProgress.done();

        // const next = localStorage.getItem('next')
        history.push("/register" + history.location.search, {
          email: checkEmail.email,
        });
        //  history.push("/register", { email: checkEmail.email });
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

  const onSubmitEmail = async (formData) => {
    NProgress.start();
    setLoading(true);

    let isValidEmail = await ValidateEmail(formData);

    if (isValidEmail) {
      checkEmailQuery({ variables: { email: formData.email } });
    } else {
      setIsValidEmail(false);
      //  NProgress.done();
      return true;
    }
  };

  const OTPFilled = async (OTP, type) => {
    NProgress.start();

    if (type === "mfa") {
      let r = await authenticator.verifyToken(
        process.env.REACT_APP_AUTHENTICATOR_SECRET,
        OTP
      );
      if (r) {
        if (r.delta === 0) {
          NProgress.done(false);
          message.success("OTP Verified!");
          // cookie.save(process.env.REACT_APP_AUTH_TOKEN, token, { path: "/" });
          saveTokenInCookie(token);
          localStorage.removeItem("isLoggedOut");
          history.push(nextUrl ? nextUrl : `/${loggedInRole}`);
        }
        if (r.delta === -1) {
          NProgress.done(false);

          message.error("Invalid OTP!");
        }
      }
      if (!r) {
        NProgress.done(false);

        message.error("Invalid OTP!");
      }
    }
    if (type === "email") {
      const checkOtpQueryRes = await props.client.query({
        query: LoginQuery.checkOtp,
        variables: { email: ifEmailExists.email, otp: OTP },
      });

      if (
        !isEmpty(checkOtpQueryRes.data.checkOTP) &&
        get(checkOtpQueryRes, "data.checkOTP.success")
      ) {
        NProgress.done(false);

        // cookie.save(process.env.REACT_APP_AUTH_TOKEN, token, { path: "/" });
        saveTokenInCookie(token);
        localStorage.removeItem("isLoggedOut");
        history.push(nextUrl ? nextUrl : `/${loggedInRole}`);
      } else {
        NProgress.done(false);
        notification.error({ message: "OTP is incorrect!" });
      }
    }
  };

  const validateOTPEmail = async (OTP) => {
    if (currentVerifyOtp === OTP) {
      NProgress.done();
      setLoginStep(2);
    } else {
      NProgress.done();
      notification.error({ message: "OTP is incorrect!" });
    }
  };

  const [loginQuery] = useLazyQuery(LoginQuery.loginUser, {
    onCompleted: ({ login }) => {
      if (!isEmpty(login) && get(login, "success", false)) {
        localStorage.removeItem("next");
        localStorage.setItem("userId", login.data._id);
        saveTokenInCookie(get(login, "token", ""));
        localStorage.removeItem("isLoggedOut");
        setToken(login.token);
        setLoggedInRole(login.data.defaultRole);

        if (isMFA) {
          setLoginStep(3);
        }
        dispatch({
          type: "SET_USER_DATA",
          payload: { ...login, isVerified: login?.data?.verifiedStatus },
        });
        message.success(
          `Welcome Back ${login.data.firstName ? login.data.firstName : " "}`
        );
      } else {
        setLoading(false);
        showNotification("error", "Wrong Password", "Please Try Again...");
      }
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

  const onSubmitLogin = async (formDataLogin) => {
    NProgress.start();
    setLoading(true);
    loginQuery({ variables: { ...formDataLogin } });
  };

  return showReroutingView ? (
    <LoadingToRedirect
      path={nextUrl}
      messageToDisplay={
        <>
          <p>Logged In Successfully</p>
          <p>Rerouting to original url</p>
        </>
      }
      time={3}
    />
  ) : (
    <>
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
                      onSubmit={onSubmitEmail}
                      isLoading={isLoading}
                      responseFacebook={responseFacebook}
                      responseLinkedIn={responseLinkedIn}
                    />
                  )) ||
                    (loginStep === 3 && (
                      <OtpVerificationMFA
                        ifEmailExists={ifEmailExists}
                        OTPFilled={OTPFilled}
                        goBack={() => setLoginStep(1)}
                      />
                    )) ||
                    (loginStep === 2 && (
                      <LoginFormPassword
                        isRememberMe={isRememberMe}
                        setRememberMe={(e) => setIsRememberMe(e)}
                        isLoading={isLoading}
                        FormValidationSchema={FormValidationSchema}
                        onSubmit={onSubmitLogin}
                        ifEmailExists={ifEmailExists}
                        {...props}
                      />
                    )) ||
                    (loginStep === 4 && (
                      <OtpVerificationEmail
                        ifEmailExists={ifEmailExists}
                        OTPFilled={OTPFilled}
                        validateOTPEmail={validateOTPEmail}
                        goBack={() => setLoginStep(1)}
                        {...props}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

export default withRouter(withApollo(LoginMain));
