import React, { useState, useEffect, useRef, useContext } from "react";
// import { useHistory } from "react-router-dom";

import LoqateAddressFull from "config/LoqateGetFullAddress";

import { Formik, Form, Field, ErrorMessage } from "formik";
import CustomInput from "config/FormikInput";
import { Tooltip, Spin, message, DatePicker } from "antd";
import { LoadingOutlined, InfoCircleOutlined } from "@ant-design/icons";
import cookie from "react-cookies";
import axios from "axios";
import CompanyDropdown from "./CompanyDropdown";

import CountryPicker from "config/CountryCodeSelector";
import AboutFormSchema from "config/FormSchemas/About";
// import FindCompany from "config/VerifyCompany";
import UploadProfilePic from "config/DropzoneAll";
import get from "lodash/get";
import moment from "moment";
// import { InterfaceContext } from "store/contexts/InterfaceContext";
import { UserDataContext } from "store/contexts/UserContext";
// import SuggestionDropdown from "../CommonInfo/Downshift";
import "./style.scss";
import { useMutation } from "react-apollo";
import AccountQueries from "config/queries/account";
import showNotification from "config/Notification";
import AddressAutocomplete from "components/Common/AddressAutocomplete";

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const dateFormat = "dd-MM-yyyy";
const About = (props) => {
  // const { dispatch: interfaceDispatch } = useContext(InterfaceContext);
  const { dispatch: userDispatch, state: userState } =
    useContext(UserDataContext);

  const refContainer = useRef();
  const submitBtnRef = useRef();
  const otpInput = useRef();
  const updateMethod = useRef("buttonClick");
  const userDataAbout = userState.profileInfo.ProfileAbout;
  // const accountSetting = userState.accountSetting;
  const connectInformation = userState.profileInfo.ProfileConnect;

  const [loqateData, setLoqateData] = useState(connectInformation);
  const [addressStr, setAddressStr] = useState("");

  const [profileDataState, setProfileDataState] = useState({});

  useEffect(() => {
    setProfileDataState(userDataAbout);
  }, [userDataAbout]);

  const findAddress = async (address) => {
    let fullAddress = await LoqateAddressFull(address.Id);
    // props.setTouchedStatus();
    let completeAddress = fullAddress.Items[0];
    let obj = {
      addressLine1: completeAddress["Company"]
        ? completeAddress["Company"]
        : completeAddress["Line1"],
      addressLine2: completeAddress["Company"]
        ? `${completeAddress["Line1"]}, ${completeAddress["Line2"]}`
        : completeAddress["Line2"],
      city: completeAddress["City"],
      state: completeAddress["Province"],
      zip: completeAddress["PostalCode"],
      country: completeAddress["CountryName"],
    };

    obj.fullAddress = `${obj.addressLine1}, ${obj.addressLine2}, ${obj.city}, ${obj.state}`;

    if (completeAddress) {
      setLoqateData(obj);
      setAddressStr(obj.fullAddress);
    }
    // console.log("****", addressStr);
    // console.warn("*********", loqateData);
  };

  // const history = useHistory();
  // const updateProfileInfo = useRef(true);

  // history.listen((location, action) => {
  //   // console.log("Executed")
  //   if (updateProfileInfo.current) {
  //     // console.log("Executed inside")
  //     updateMethod.current = 'auto'
  //     submitBtnRef.current?.click();
  //     updateProfileInfo.current = false;
  //   }
  // });

  // typedValue
  // const typedPhoneNumber = useState(userDataAbout.phoneNumber);

  //, setMobileVerificationStatus
  const [isMobileVerificationActive] = useState(false);
  // const [isCountryCodeSelectorOpen, setCountryCodeSelector] = useState(false);

  const [showCompany, setCompanyStatus] = useState(
    get(userDataAbout, "isCompany", false)
  );

  // const [currentNumberForValidation, setCurrentValidationNumber] = useState("");
  const [verificationLoadingStates, setVerificationLoadingStates] = useState({
    request: false,
    verify: false,
  });

  const [profilePicture, uploadProfilePicture] = useState({
    filename: "",
    avatar: get(userDataAbout, "avatar", ""),
  });
  const [nationalities, setNationalities] = useState([]);

  const verifyMobile = async (data) => {
    let formValues = get(refContainer, "current.state.values");

    if (
      !formValues.phoneNumber ||
      String(formValues.phoneNumber).length !== 10 ||
      !initialCountryCode
    ) {
      message.error("Please enter a valid contact number!");
    } else {
      setVerificationLoadingStates({ request: true, verify: false });

      // let number = `+${initialCountryCode}${formValues.phoneNumber}`;
      // if (refContainer.current) {
      //   let res = await SinchVerify.VerificationRequest({
      //     number,
      //   });

      //   if (get(res, "status") === 200) {
      //     setVerificationLoadingStates({ request: false, verify: false });
      //     setCurrentValidationNumber(number);
      //     setMobileVerificationStatus(true);
      //   } else {
      //     message.error("An error occured, please try again later!");
      //   }
      // }
    }
  };

  const [updateProfileAboutMutation, { loading: updateProfileLoading }] =
    useMutation(AccountQueries.updateProfileAbout, {
      onCompleted: ({ updateProfileInformation }) => {
        if (updateProfileInformation.success) {
          if (updateMethod.current !== "auto") {
            showNotification(
              "success",
              "Profile Updated!",
              "Your Profile has been updated successfully!"
            );
          }
          const ProfileAbout = updateProfileInformation.data;
          console.log(ProfileAbout);
          userDispatch({ type: "UPDATE_PROFILE_ABOUT", payload: ProfileAbout });
        } else {
          showNotification(
            "error",
            "An error occured",
            updateProfileInformation.message
          );
        }
      },
      onError: (err) => {
        showNotification("error", "An error occured", err.message);
      },
    });

  const updateProfileAbout = async (formData) => {
    try {
      // this.context.startLoading();
      const token = await cookie.load(process.env.REACT_APP_AUTH_TOKEN);

      if (formData.uploadAvatar) {
        var frmData = new FormData();
        frmData.append("file", formData.uploadData.file[0]);
        frmData.append("filename", formData.avatar.filename);
        // for what purpose the file is uploaded to the server.
        frmData.append("uploadType", "Profile");

        let uploadedFile = await axios.post(
          `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
          frmData,
          {
            headers: {
              authorization: token,
            },
          }
        );
        if (uploadedFile.data.success) {
          formData.avatar = uploadedFile.data.data;
        } else {
          formData.avatar = "";
        }

        delete formData["uploadData"];
      }
      delete formData["uploadAvatar"];
      updateProfileAboutMutation({ variables: formData });
    } catch (error) {
      showNotification("error", "An error occurred", error.message);
    }
  };

  // const findCompany = async regNumber => {
  //   let res = await FindCompany(regNumber);

  //   let initData = userDataAbout;
  //   initData.companyName = get(res, "data.company_name", "");

  //   setUserData(initData);
  //   forceUpdate();
  // };

  const verifyOTP = async (e) => {
    setVerificationLoadingStates({ request: false, verify: true });
    // let res = await SinchVerify.VerifyOtp({
    //   number: currentNumberForValidation,
    //   code: otpInput.current.value,
    // });

    // if (
    //   get(res, "status") === 200 &&
    //   get(res, "data.status") === "SUCCESSFUL"
    // ) {
    //   message.success("Mobile Verified!");
    //   setVerifiedStatus(true);
    //   setVerificationLoadingStates({ request: false, verify: false });
    //   submitBtnRef.current.click();
    //   setMobileVerificationStatus(false);
    // } else {
    //   setVerifiedStatus(false);
    //   setVerificationLoadingStates({ request: false, verify: false });
    //   message.error(get(res, "data.message"));
    // }
  };

  const [isPhoneNumberVerified, setVerifiedStatus] = useState(
    userDataAbout && userDataAbout.isPhoneNumberVerified
      ? userDataAbout.isPhoneNumberVerified
      : false
  );

  useEffect(() => {
    // setUserData(get(props, "userDataAbout"));

    setCompanyStatus(get(userDataAbout, "isCompany"));
    setVerifiedStatus(get(userDataAbout, "isPhoneNumberVerified", false));
    uploadProfilePicture({
      filename: "",
      avatar: get(userDataAbout, "avatar"),
    });

    selectCountryCode(get(userDataAbout, "countryCode"));

    axios
      .get("https://api.github.com/gists/2aae12314d5419365bc3cae033239273")
      .then((res) => {
        setNationalities(
          JSON.parse(res.data.files["nationalities.json"].content)
        );
      })
      .catch((error) => {
        // console.log("Network error", error);
        showNotification("error", "An error occurred!");
      });
  }, [userDataAbout]);

  const [initialCountryCode, selectCountryCode] = useState(
    get(userDataAbout, "countryCode") ? get(userDataAbout, "countryCode") : "44"
  );

  const onAddressAutoComplete = (address, prevFormValues) => {
    setAddressStr(address);
    setProfileDataState((prevState) => ({ ...prevState, ...prevFormValues }));
  };

  return (
    <Spin spinning={updateProfileLoading}>
      <Formik
        enableReinitialize
        ref={refContainer}
        initialValues={{ ...profileDataState, ...loqateData }}
        validationSchema={AboutFormSchema}
        onSubmit={(values, { validateForm, setSubmitting }) => {
          setSubmitting(true);
          values.uploadAvatar = false;
          // console.log(values);
          if (profilePicture.avatar.includes(";base64")) {
            values.uploadAvatar = true;
            values.avatar = profilePicture;
            values.uploadData = profilePicture;
          }
          values.isPhoneNumberVerified = isPhoneNumberVerified;
          values.countryCode = initialCountryCode;
          values.dob = values.dob ? moment(values.dob) : undefined;
          values.isCompany = showCompany;
          values.phoneNumber = String(values.phoneNumber);
          if (!(values.phoneNumber.length < 10)) {
            updateProfileAbout(values);
            // interfaceDispatch({ type: "SWITCH_PROFILE_INFO_TAB", payload: 1 });
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values, errors }) => (
          <Form>
            <div className="tab__details">
              <h3>
                Let’s start with basic information <b>about you</b> first
              </h3>
              <div className="row">
                <div className="col-lg-12">
                  <div className="d-block">
                    <UploadProfilePic
                      key={"profilePic"}
                      getValue={(val) => uploadProfilePicture(val)}
                    />
                    <img
                      src={get(
                        profilePicture,
                        "avatar",
                        `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURI(
                          get(values, "firstName", "User")
                        )}`
                      )}
                      alt="avatar"
                      className="profile__img--box"
                    />
                  </div>
                  <div className="d-block">
                    <div className="row mt-4">
                      <div className="col-lg-6 col-md-12 col-xl-4">
                        <div className="form-group">
                          <label className="tab__deatils--label">
                            <span>
                              First Name <span>* </span>
                            </span>
                            <span>
                              <Tooltip
                                overlayClassName="tooltip__color"
                                title="First Name"
                              >
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                                  alt="i"
                                />
                              </Tooltip>
                            </span>
                          </label>
                          <CustomInput
                            placeholder="Enter first name"
                            type="text"
                            name="firstName"
                            errors={errors}
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="all__errors"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12 col-xl-4">
                        <div className="form-group">
                          <label className="tab__deatils--label">
                            <span>Middle Name </span>
                            <span>
                              <Tooltip
                                overlayClassName="tooltip__color"
                                title="Middle Name"
                              >
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                                  alt="i"
                                />
                              </Tooltip>
                            </span>
                          </label>
                          <Field
                            placeholder="Enter middle name"
                            type="text"
                            name="middleName"
                            className="tab__deatils--input"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12 col-xl-4">
                        <div className="form-group">
                          <label className="tab__deatils--label">
                            <span>
                              Last Name <span>* </span>
                            </span>
                            <span>
                              <Tooltip
                                overlayClassName="tooltip__color"
                                title="Last Name"
                              >
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                                  alt="i"
                                />
                              </Tooltip>
                            </span>
                          </label>
                          <CustomInput
                            placeholder="Enter last name"
                            type="text"
                            name="lastName"
                            errors={errors}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-12 col-xl-4 py-3">
                  <div className="form-group yes__no--toogle">
                    <label className="tab__deatils--label">
                      <span>Display Company ?</span>
                    </label>
                    <div className="btn-group ml-3">
                      <label className="switch" for="profilePictureMe">
                        <input
                          onChange={(e) => setCompanyStatus(e.target.checked)}
                          disabled={props.isPreviewMode}
                          checked={showCompany}
                          type="checkbox"
                          id="profilePictureMe"
                        />
                        <div className="slider round"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-xl-4">
                  {showCompany && (
                    <div className="form-group">
                      <label className="tab__deatils--label">
                        <span>
                          Company Name <span>* </span>
                        </span>
                        <span>
                          <Tooltip
                            overlayClassName="tooltip__color"
                            title="Company Name"
                          >
                            <InfoCircleOutlined className="tooltip__size" />
                          </Tooltip>
                        </span>
                      </label>
                      <CompanyDropdown
                        value={values.companyName}
                        field="companyName"
                        onChange={(val) => {
                          setFieldValue("companyName", val.title);
                          setFieldValue(
                            "companyRegistrationNumber",
                            val.company_number
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-lg-6 col-md-12 col-xl-4">
                  {showCompany && (
                    <div className="form-group">
                      <label className="tab__deatils--label">
                        <span>
                          Company Reg. Number <span>*</span>
                        </span>
                        <span>
                          <Tooltip
                            overlayClassName="tooltip__color"
                            title="Company Registration Number"
                          >
                            <InfoCircleOutlined className="tooltip__size" />
                          </Tooltip>
                        </span>
                      </label>
                      {/* <Field
                          placeholder="Company Registration Number"
                          type="text"
                          onBlur={e => findCompany(e.target.value)}
                          name="companyRegistrationNumber"
                          className="tab__deatils--input"
                        /> */}
                      <CompanyDropdown
                        value={values.companyRegistrationNumber}
                        field="companyRegistrationNumber"
                        onChange={(val) => {
                          setFieldValue("companyName", val.title);
                          setFieldValue(
                            "companyRegistrationNumber",
                            val.company_number
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group mb-1">
                    <label className="tab__deatils--label">
                      {" "}
                      <span>
                        Mobile Number <span>* </span>
                      </span>
                      <span>
                        <Tooltip
                          overlayClassName="tooltip__color"
                          title="Mobile Number"
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                            alt="i"
                          />
                        </Tooltip>
                      </span>
                    </label>
                    <div className="date__flex">
                      <CountryPicker
                        name="phoneNumber"
                        countryCode={values.countryCode}
                        value={`${values.countryCode}${values.phoneNumber}`}
                        setValue={(val, countryCode) => {
                          setFieldValue("phoneNumber", val);
                          selectCountryCode(countryCode);
                        }}
                        // disabled={isPhoneNumberVerified}
                        className={
                          errors && errors["phoneNumber"]
                            ? "tab__deatils--input error__field_show"
                            : "tab__deatils--input"
                        }
                      />
                    </div>
                  </div>

                  {/* {!props.isMenuCollapsed && ( */}
                  <div className="form-group">
                    {!isMobileVerificationActive ? (
                      <Spin
                        spinning={verificationLoadingStates.request}
                        indicator={antIcon}
                      >
                        {!isPhoneNumberVerified ? (
                          <button
                            type="button"
                            onClick={verifyMobile}
                            className={`btn btn-outline-danger shadow-sm`}
                            disabled={isPhoneNumberVerified}
                            style={{ fontSize: 12 }}
                          >
                            {" "}
                            Verify your mobile number
                          </button>
                        ) : (
                          "Phone Number Verified"
                        )}
                      </Spin>
                    ) : (
                      <div>
                        <Spin
                          spinning={verificationLoadingStates.verify}
                          indicator={antIcon}
                        >
                          {/* <form onSubmit={verifyOTP}> */}
                          <div className="row">
                            <div className="col-sm-6 col-md-6">
                              <input
                                ref={otpInput}
                                type="text"
                                className="form-control"
                              />
                            </div>
                            <div
                              onClick={verifyOTP}
                              className="col-sm-6 col-md-6 btn btns__orange"
                              style={{ fontSize: 12 }}
                            >
                              Verify Mobile Number
                            </div>
                            {/* </form> */}
                          </div>
                        </Spin>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group mb-1">
                    <label className="tab__deatils--label">
                      <span>
                        Email Address <span>* </span>
                      </span>
                      <span>
                        <Tooltip
                          overlayClassName="tooltip__color"
                          title="Email Address"
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                            alt="i"
                          />
                        </Tooltip>
                      </span>
                    </label>
                    <Field
                      placeholder="Email Address"
                      type="email"
                      name="email"
                      className="tab__deatils--input"
                      disabled
                    />
                  </div>
                  {
                    <div className="form-group">
                      {!isMobileVerificationActive ? (
                        <Spin
                          spinning={verificationLoadingStates.request}
                          indicator={antIcon}
                        >
                          {!isPhoneNumberVerified ? (
                            <button
                              type="button"
                              onClick={verifyMobile}
                              className="btn btn-outline-danger shadow-sm"
                              disabled={isPhoneNumberVerified}
                              style={{ fontSize: 12 }}
                            >
                              {" "}
                              Verify your Email ID
                            </button>
                          ) : (
                            "Email ID Verified"
                          )}
                        </Spin>
                      ) : (
                        <div>
                          <Spin
                            spinning={verificationLoadingStates.verify}
                            indicator={antIcon}
                          >
                            {/* <form onSubmit={verifyOTP}> */}
                            <div className="row">
                              <div className="col-sm-6 col-md-6">
                                <input
                                  ref={otpInput}
                                  type="text"
                                  className="form-control"
                                />
                              </div>
                              <div
                                onClick={verifyOTP}
                                className="col-sm-6 col-md-6 btn btns__orange"
                                style={{ fontSize: 12 }}
                              >
                                Verify Mobile Number
                              </div>
                              {/* </form> */}
                            </div>
                          </Spin>
                        </div>
                      )}
                    </div>
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-12 col-xl-4">
                  <div className="form-group">
                    <label className="tab__deatils--label">Select Gender</label>
                    <Field
                      component="select"
                      name="gender"
                      className="tab__deatils--input"
                    >
                      <option selected disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-xl-4">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      <span>Date of Birth </span>
                      <span>
                        <Tooltip
                          overlayClassName="tooltip__color"
                          title="Date Of Birth"
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                            alt="i"
                          />
                        </Tooltip>
                      </span>
                    </label>
                    <div className="date__flex">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="fa fa-calendar" />
                        </div>
                      </div>

                      <DatePicker
                        name="dob"
                        placeholder="Date of birth"
                        style={{ width: 295 }}
                        value={values.dob ? moment(values.dob) : undefined}
                        format={dateFormat}
                        suffixIcon={undefined}
                        onChange={(date, dateString) =>
                          setFieldValue("dob", date)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="dob"
                      component="span"
                      className="all__errors"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-xl-4">
                  <div className="form-group">
                    <label className="tab__deatils--label">
                      Select Nationality <span>*</span>
                    </label>
                    <Field
                      component="select"
                      name="nationality"
                      defaultValue="select"
                      className={
                        errors && errors["nationality"]
                          ? "tab__deatils--input error__field_show"
                          : "tab__deatils--input"
                      }
                    >
                      <option disabled key="select" value="select">
                        Select Nationality
                      </option>
                      {nationalities &&
                        nationalities.map((n, i) => {
                          return (
                            <option key={i} value={n.nationality}>
                              {n.nationality}
                            </option>
                          );
                        })}
                    </Field>
                  </div>
                </div>
              </div>
              <div className="row my-3">
                <div className="col-lg-12">
                  <div className="d-block">
                    <div className="form-group">
                      <label className="tab__deatils--label">
                        Current Address
                      </label>

                      <AddressAutocomplete
                        findAddress={findAddress}
                        value={addressStr}
                        onChange={(address) =>
                          onAddressAutoComplete(address, values)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        id="label"
                        name="fullAddress"
                        className="form-control"
                        placeholder="Full Address"
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        id="line1"
                        name="addressLine1"
                        className="form-control"
                        placeholder="Address Line 1*"
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type="text"
                        id="line2"
                        name="addressLine2"
                        className="form-control"
                        placeholder="Address Line 2"
                        disabled
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <Field
                            type="text"
                            id="city"
                            name="city"
                            className="form-control"
                            placeholder="City *"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <Field
                            type="text"
                            id="zip"
                            name="zip"
                            className="form-control"
                            placeholder="Post Code/ZIP *"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <Field
                            type="text"
                            id="province"
                            name="state"
                            className="form-control"
                            placeholder="Country / State / Region"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <Field
                            type="text"
                            id="country"
                            name="country"
                            className="form-control"
                            placeholder="Country *"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row my-3">
                <div className="col-lg-12">
                  <div className="info__left--wrapper"></div>
                  <div className="info__right--wrapper">
                    <div className="form-group">
                      <button
                        ref={submitBtnRef}
                        type="submit"
                        className="btn btns__blue"
                      >
                        {isSubmitting ? <LoadingOutlined /> : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Spin>
  );
};
export default About;
