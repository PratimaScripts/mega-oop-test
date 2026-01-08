import { Alert, Image, Space, Spin } from "antd";
// import showNotification from "config/Notification";
import { ErrorMessage, Field, Form, Formik } from "formik";
import isEmpty from "lodash/isEmpty";
import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router";
import { Link, withRouter } from "react-router-dom";
import { UserDataContext } from "store/contexts/UserContext";

const LoginFormEmail = (props) => {
  // const handleFailure = (failure) => {
  //   // console.log(failure);
  //   showNotification("error", "An error occurred!");
  // };
  const history = useHistory();

  // const handleLinkedSuccess = async (success) => {
  //   try {
  //     const code = success.code;
  //     const secret ="8XEVZ1Qo6sAhVeAm"
  //     const redirect_uri_linked = `${window.location.origin}/linkedin`
  //     let linkedUrl = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${process.env.REACT_APP_LINKEDIN_ID}&client_secret=${secret}&code=${code}&redirect_uri=${redirect_uri_linked}`
  //     const resdult = await axios.post(linkedUrl)
  //     const access_token = resdult.data.access_token
  //     linkedUrl = `https://api.linkedin.com/v2/me/?oauth2_access_token=${access_token}&projection=(id,localizedLastName,localizedFirstName,profilePicture(displayImage~:playableStreams))`
  //     const resdult2 = await axios.get(linkedUrl)
  //     const userData = {
  //       name: resdult2.data.localizedLastName + resdult2.data.localizedFirstName,
  //       socialId: resdult2.data.id,
  //     }
  //     let profileData = resdult2.data.profilePicture["displayImage~"].elements
  //     if(profileData.length > 0){
  //       let len = profileData.length;
  //       let image = profileData[len-1].identifiers[0].identifier
  //       userData.imageUrl = image
  //     }
  //     linkedUrl = `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token=${access_token}`
  //     const resdult3 = await axios.get(linkedUrl)
  //     userData.email = resdult3.data.elements[0]["handle~"].emailAddress;
  //     console.log(userData)

  //   } catch (error) {
  //     console.log(error)
  //   }

  // };

  console.log(process.env.REACT_APP_PUBLIC_URL);

  return (
    <div className="login-wrapper">
      <Image
        width="100%"
        preview={{ visible: false, mask: undefined }}
        height="60"
        src={"/assets/images/logo.svg"}
        alt="Rent on cloud logo"
        className="login-logo"
        onClick={() =>
          (window.location.href = process.env.REACT_APP_PUBLIC_URL)
        }
      />
      {localStorage.getItem("isLoggedOut") && (
        <Alert
          message="You have been logged out, for being inactive for more than 30 minutes"
          type="warning"
          showIcon
          closable
        />
      )}
      <div className="login-box">
        {props.isLoading && (
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <Spin tip="Loading..." />
          </div>
        )}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={props.FormValidationSchema.EmailCheckSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            let res = await props.onSubmit(values);
            if (res) {
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting, errors }) => (
            <Form>
              <h4>Login | Get Started</h4>
              <div className="form-group">
                {" "}
                <i className="fa fa-envelope i__dark"></i>
                <Field
                  placeholder="Please enter your email!"
                  type="email"
                  name="email"
                  className={
                    values.email
                      ? errors.email || !props.isValidEmail
                        ? "error__field_show full__input"
                        : "error__field_hide full__input"
                      : "fields__empty_color full__input"
                  }
                />
                {values.email && isEmpty(errors) && (
                  <>
                    {(props.isValidEmail && (
                      <div className="isCorrect__text all__errors">
                        Looks Good
                      </div>
                    )) ||
                      (!props.isValidEmail && (
                        <div className="isError__text">
                          Please Enter a valid email
                        </div>
                      ))}
                  </>
                )}
                {!values.email && (
                  <div className="validation-message">
                    For new user, we will send a verification code to this email
                  </div>
                )}
                {!isEmpty(errors) && (
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="all__errors"
                  />
                )}
              </div>

              <div className="form-group">
                <button
                  disabled={!isEmpty(errors) ? true : false || props.isLoading}
                  type="submit"
                  className="btn btn-primary btn-block submit-btn"
                >
                  Login | Get Started
                </button>
                <Space align="baseline" size={"small"} direction="horizontal">
                  <p>New user?</p>{" "}
                  <Link to={"/register" + history.location.search}>
                    Register
                  </Link>
                </Space>
              </div>
              <div className="or-seperator">
                <span>OR</span>
              </div>
              <SocialLogin />
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
          &amp;{" "}
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

const SocialLoginDiv = ({ isLockScreen, ...props }) =>
  isLockScreen ? (
    <div
      {...props}
      onClick={() =>
        window.open(
          props.href,
          "_blank",
          "width=600,height=600, top=200, left=450"
        )
      }
    >
      {" "}
      {props.children}
    </div>
  ) : (
    <a href={props.href}> {props.children} </a>
  );

export const SocialLogin = withRouter(({ isLockScreen, location, ...rest }) => {
  const { state } = useContext(UserDataContext);
  const callBackUrl = useCallback(
    (url) =>
      `${process.env.REACT_APP_SERVER}${url}${
        isLockScreen
          ? `?next=${process.env.REACT_APP_SERVER}${location?.pathname}&email=${state.userData?.email}`
          : ""
      }`,
    [location, isLockScreen, state.userData]
  );
  return (
    <>
      <div className="form-group">
        {" "}
        <SocialLoginDiv
          isLockScreen={isLockScreen}
          href={callBackUrl("/auth/facebook")}
        >
          <div className="btn btn-primary btn-facebook">
            <i className="fab fa-facebook-f social__position"></i>
            &nbsp; {isLockScreen ? "Unlock" : "Login"} with Facebook
          </div>
        </SocialLoginDiv>
      </div>
      <div className="form-group">
        {" "}
        <SocialLoginDiv
          isLockScreen={isLockScreen}
          href={callBackUrl(`/auth/linkedin`)}
        >
          <div className="btn btn-primary btn-linkedin">
            <i className="fab fa-linkedin-in social__position"></i>
            &nbsp; {isLockScreen ? "Unlock" : "Login"} with LinkedIn
          </div>
        </SocialLoginDiv>
      </div>
    </>
  );
});
export default withRouter(LoginFormEmail);
