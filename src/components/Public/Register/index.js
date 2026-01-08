import { message, Modal } from "antd";
import RegistrationFormSchema from "config/FormSchemas/register";
import showNotification from "config/Notification";
import SignUpUser from "config/queries/register";
import { ErrorMessage, Field, Form, Formik } from "formik";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import NProgress from "nprogress";
import { parse as qsParse } from "querystring";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, withApollo } from "react-apollo";
import Img from "react-image";
import { useHistory } from "react-router";
import { Link, useLocation, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { UserDataContext } from "store/contexts/UserContext";
import EmailVerificationCard from "./EmailVerification";
import "./register.scss";




// const EmailVerificationCard = lazy(() => import("./EmailVerification"));

const Register = (props) => {
  const history = useHistory()
  const { search, state: locationState } = useLocation();
  const { state } = useContext(UserDataContext);
  const [selectedCategory, setSelectedCategory] = useState(locationState?.token ? "invitee" : "");
  const [currentVerifyOtp, setCurrentVerifyOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [token, setToken] = useState("")
  const [email, setEmail] = useState(get(props.location.state, "email"));
  const formikRef = useRef();

  useEffect(() => {
    const queryObj = qsParse(search.split("?")[1]);
    if (queryObj.isNewUser) {
      history.push({
        pathname: '/register', state: {
          ...queryObj, emailDisabled: queryObj.email !== "",
          ...(queryObj.email === "" &&{emailError: `Your ${queryObj.provider} account does not have email which is mandatory to register or login on Rent on Cloud.`})
        }
      });
    }
  }, [history, search])

  useEffect(() => {
    // let next = localStorage.getItem('next');
    if (get(state, "isAuthenticated", false)) {
      history.push(`/${get(state, "userData.role", "renter")}` + history.location.search)
      return;
    }
    if (props.location?.state?.email) {
      setEmail(props.location.state.email);
      formikRef.current.values.email = props.location.state.email;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.state, state.isAuthenticated, state.userData.role, setEmail]);

  const setCategory = (category) => {
    setSelectedCategory(category);
  };

  const validateOTPEmail = async (e) => {
    setCurrentVerifyOtp("");
    // message.loading("Verification Successful, signing you up!");
    signUpRequestMain();
  };

  const [signUpMutation] = useMutation(SignUpUser, {
    onCompleted: ({ registration }) => {
      if (!isEmpty(registration) && get(registration, "success", false)) {
        showNotification("success", "Registered Successfully!", "Verify your email to continue.");
        setToken(get(registration, "token"))
        // cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(registration, "token"), {path: "/"});
        // dispatch({ type: "SET_USER_DATA", payload: registration })
        // history.push(`/confirm/${registration.data.email}`)
        setFormStep(2)
      } else {
        showNotification("error", "Not able to register!", get(registration, "message"));
      }
      setLoading(false)
      NProgress.done()
    },
    onError: ({ graphQLErrors, networkError }) => {
      setLoading(false)
      showNotification("error", "Not able to process your request", "Try Again")
      NProgress.done();
    }
  })



  const signUpRequestMain = async (values) => {
    setLoading(true);
    let socialData = get(props, "location.state", {});
    let isSocial = socialData.picture ? true : false;
    let obj = {};
    obj["avatar"] = isSocial ? get(socialData, "picture.data.url", "") : "";
    obj["name"] = isSocial ? get(socialData, "name", "") : "";
    // let formData = userData;
    signUpMutation({ variables: { role: selectedCategory, ...obj, ...values, token: locationState?.token } })
  };



  // const signUp = async (formData) => {
  //   let isValidEmail = await ValidateEmail(formData);

  //   if (isValidEmail) {
  //     setUserData(formData);
  //     let obj = {
  //       type: "send",
  //       email: formData.email,
  //       password: formData.password,
  //       role: selectedCategory,
  //     };
  //     verifyEmailAddressQuery({variables: obj})
  //   } else {
  //     message.error("The Email you entered is Invalid!");
  //     return false;
  //   }
  // };




  return (
    <TransitionGroup>
      <CSSTransition
        key={"Register"}
        classNames="page"
        unmountOnExit
        timeout={300}
      >
        {formStep === 0 ? (
          <div className="login__bg">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="login-wrapper">
                    <Formik
                      initialValues={{
                        email: email ? email : "",
                        password: "",
                      }}
                      innerRef={formikRef}
                      validationSchema={RegistrationFormSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        setEmail(values.email);
                        if (selectedCategory === "") {
                          message.error("Please select a role!");
                          setLoading(false);
                        }
                        // console.log(values)

                        if (selectedCategory !== "") {
                          setLoading(true);
                          // console.log(values)
                          signUpRequestMain(values);
                        }
                      }}
                    >
                      {({ isSubmitting, errors }) => (
                        <>
                          <Img
                            src={["/assets/images/logo.svg"]}
                            alt=""
                            className="login-logo"
                          />
                          <div className="login-box">
                            <Form>
                              <h4>Select Role & Get Started</h4>
                              <div className="user-type d-block clearfix mb-4">
                                {!locationState?.token && <ul>
                                  {[
                                    ["landlord", "mdi-home-account", "I am a Landlord"],
                                    ["renter", "mdi-account-key", "I am a renter"],
                                    ["servicepro", "mdi-account-clock", "I am a ServicePro"]
                                  ].map(([role, className, caption], idx) => <li
                                    key={idx}
                                    className={selectedCategory === role && "active"}
                                    onClick={() => setCategory(role)}
                                  >
                                    <span>
                                      <i className={`mdi ${className}`}></i>
                                      <p>{caption}</p>
                                    </span>
                                  </li>)}
                                </ul>}
                              </div>
                              {locationState?.emailError && <span>
                                <i className="fas fa-info-circle"></i>{locationState?.emailError}
                              </span>}
                              <div className="form-group">
                                <i className="fa fa-envelope i__dark"></i>
                                <Field
                                  placeholder="Please enter your email!"
                                  type="email"
                                  name="email"
                                  disabled={locationState?.token || locationState?.emailDisabled}
                                  className={
                                    errors.email
                                      ? "full__input error__field_show"
                                      : "full__input"
                                  }
                                // readOnly={email}
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="all__errors"
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
                                <i className="fa fa-lock i__dark"></i>
                                <Field
                                  placeholder="Confirm your password"
                                  type="password"
                                  name="comfirmPassword"
                                  className={
                                    errors.password
                                      ? "full__input error__field_show"
                                      : "full__input"
                                  }
                                />
                                <ErrorMessage
                                  name="comfirmPassword"
                                  component="div"
                                  className="all__errors"
                                />
                              </div>

                              <div className="form-group small">
                                <label className="checkbox-inline terms__text">
                                  <input required type="checkbox" /> I have read
                                  and agree with{" "}
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
                                </label>
                              </div>

                              <div className="form-group mb-0">
                                <button
                                  disabled={loading}
                                  type="submit"
                                  className="btn btn-primary  btn-block"
                                >
                                  Signup
                                </button>
                              </div>
                            </Form>
                            <p style={{ marginTop: "3px" }}>
                              Go to <Link to={"/login" + history.location.search}>Login</Link>
                            </p>
                          </div>
                        </>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              title="Verify OTP"
              visible={currentVerifyOtp !== "" ? true : false}
              // onOk={handleOk}
              footer={null}
              onCancel={() => setCurrentVerifyOtp("")}
            >
              <form onSubmit={validateOTPEmail}>
                <input
                  placeholder="Please enter the OTP sent to you via email"
                  type="text"
                  className="form-control mb-3"
                />
                <button className="btn btn-primary w-100" type="submit">
                  Verify OTP
                </button>
              </form>
            </Modal>
          </div>
        ) : (
          <EmailVerificationCard
            back={true}
            validateOTPEmail={validateOTPEmail}
            email={email}
            token={token}
            // otp={currentVerifyOtp}
            setFormStep={setFormStep}
          />
        )}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withApollo(withRouter(Register));
