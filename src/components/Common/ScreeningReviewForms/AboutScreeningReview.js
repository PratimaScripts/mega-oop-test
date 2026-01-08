/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DatePicker } from "antd";
import axios from "axios";
import CustomInput from "config/FormikInput";
import { Checkbox, Row, Col } from "antd";
import { useQuery } from "@apollo/react-hooks";
import CountryPicker from "config/CountryCode";
import AboutFormSchema from "config/FormSchemas/About";
import MyNumberInput from "config/CustomNumberInput";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import PropertyQuery from "config/queries/property";
import AccountQueries from "config/queries/account";
import PropertyOwnershipVerification from "config/OOV";
import showNotification from "config/Notification";
import moment from "moment";
import find from "lodash/find";
import useForceUpdate from "use-force-update";
import cookie from "react-cookies";
import { UserDataContext } from "store/contexts/UserContext"

// import "../";

const About = props => {
  const { state: userState } = useContext(UserDataContext)
  const { userData, accountSetting } = userState
  const forceUpdate = useForceUpdate();
  const { data, loading } = useQuery(PropertyQuery.fetchProperty);

  const [propertiesToCheck, setCheckedProperties] = useState([]);

  const dateFormat = accountSetting && accountSetting["dateFormat"]
  ? accountSetting["dateFormat"].toUpperCase()
  : process.env.REACT_APP_DATE_FORMAT.toUpperCase()

  let refContainer = useRef();
  let submitBtnRef = useRef();
  const [typedPhoneNumber, setTypedPhoneNumber] = useState(
    get(props, "userDataAbout.phoneNumber")
  );

  const [isSaveMode, setSaveMode] = useState(false);
  const [isPropertySelectMode, setPropertySelectMode] = useState(false);

  // Save About Data

  const updateProfileAbout = async formData => {
    // props.contextData.startLoading();

    if (formData.uploadAvatar) {
      var frmData = new FormData();
      frmData.append("file", formData.avatar.avatar);
      frmData.append("filename", formData.avatar.filename);
      // for what purpose the file is uploaded to the server.
      frmData.append("uploadType", "Screening");
      let uploadedFile = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
        frmData,
        {
          headers: {
            authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
          }
        }
      );
      if (uploadedFile.data.success) {
        formData.avatar = uploadedFile.data.data;
      } else {
        formData.avatar = "";
        return showNotification("error", "An error occurred", uploadedFile.data.message);
      }

      uploadProfileAbout(formData);
    } else {
      uploadProfileAbout(formData);
    }
  };

  const uploadProfileAbout = async formData => {
    delete formData["uploadAvatar"];

    let updateAboutQuery = await props.client.mutate({
      mutation: AccountQueries.updateProfileAbout,
      variables: { ...formData }
    });

    if (
      !isEmpty(updateAboutQuery.data.updateProfileInformation) &&
      get(updateAboutQuery, "data.updateProfileInformation.success")
    ) {
      // showNotification(
      //   "success",
      //   "Profile Updated!",
      //   "Your Profile has been updated successfully!"
      // );

      // let userData = get(
      //   updateAboutQuery,
      //   "data.updateProfileInformation.data"
      // );

      // setUserData(userData);
      setSaveMode(false);
      // props.contextData.endLoading();

      // setTimeout(() => {
      //   props.contextData.updateUserData(userData);
      // }, 1000);
    } else {
      showNotification(
        "error",
        "An error occured",
        get(updateAboutQuery, "data.updateProfileInformation.message")
      );
      // props.contextData.endLoading();
    }
  };

  // Save about data end

  const [isCountryCodeSelectorOpen, setCountryCodeSelector] = useState(false);

  const [showCompany, setCompanyStatus] = useState(
    get(props, "userDataAbout.isCompany")
  );

  let [profilePicture, uploadProfilePicture] = useState({
    filename: "",
    avatar: get(props, "userDataAbout.avatar", "")
  });

  let [userDataAbout, setUserData] = useState({
    ...get(props, "userDataAbout", {})
  });
  const [isPhoneNumberVerified, setVerifiedStatus] = useState(false);

  const [optionsWithDisabled, setOptionsWithDisabled] = useState([]);

  useEffect(() => {
    if (!loading) {
      let properties = get(data, "fetchProperty.data", []);

      let optionsWithDisabled = [];
      properties.map((pr, i) => {
        optionsWithDisabled.push({
          label: get(pr, "title", ""),
          value: get(pr, "_id"),
          // disabled: get(pr, "isVerify", false),
          disabled: false,
          checked: false
        });
      });
      setOptionsWithDisabled(optionsWithDisabled);
    }

    setCompanyStatus(get(props, "userDataAbout.isCompany", false));
    setVerifiedStatus(get(userDataAbout, "isPhoneNumberVerified", false));
    uploadProfilePicture({
      filename: "",
      avatar: get(props, "userDataAbout.avatar", "")
    });

    selectCountryCode(get(props, "userDataAbout.countryCode"));

    setUserData(props.userDataAbout);
  }, [data, loading, props, props.userDataAbout, userDataAbout]);

  const onChange = async checkedAr => {
    let op = optionsWithDisabled;
    if (checkedAr.length >= 4) {
      if (checkedAr.length === 4) {
        setCheckedProperties(checkedAr);
      }
      let disableAll = op.map((o, p) => {
        if (!checkedAr.includes(o.value)) {
          o.disabled = true;
          o.checked = false;
        }
      });
      await Promise.all(disableAll);
      setOptionsWithDisabled(op);
      forceUpdate();
    }
    if (checkedAr.length < 4) {
      setCheckedProperties(checkedAr);
      let disableAll = op.map((o, p) => {
        if (!checkedAr.includes(o.value)) {
          o.disabled = false;
        }
      });
      await Promise.all(disableAll);
      setOptionsWithDisabled(op);
      forceUpdate();
    }
  };

  const verifyProperties = async () => {
    let properties = get(data, "fetchProperty.data", []);
    let toCheckAr = [];

    let useProperty = propertiesToCheck.map(async (p, i) => {
      let property = await find(properties, { _id: p });
      if (property) {
        toCheckAr.push(property);
      }
    });

    await Promise.all(useProperty);
    let nameObj = {
      FirstForename: get(props, "userDataAbout.firstName", ""),
      MiddleName: get(props, "userDataAbout.middleName", ""),
      Surname: get(props, "userDataAbout.lastName", "")
    };

    let res = await PropertyOwnershipVerification(toCheckAr, nameObj);

    // PropertyQuery
    let verifyProperties = await props.client.mutate({
      mutation: PropertyQuery.verifyProperty,
      variables: { properties: res }
    });

    if (get(verifyProperties, "data.verifyProperty.success")) {
      setPropertySelectMode(false);
      let pid = [];
      let getPropertyIdsOnly = res.map((p, i) => {
        pid.push(p.propertyId);
      });

      await Promise.all(getPropertyIdsOnly);
      props.setCheckedProperties(pid);
    }
  };

  const [initialCountryCode, selectCountryCode] = useState(
    get(props, "userDataAbout.countryCode")
      ? get(props, "userDataAbout.countryCode")
      : "44"
  );

  let changeBtn = isSaveMode ? (
    <button
      onClick={() => submitBtnRef.current.click()}
      type="button"
      className="btn__edit--screening"
    >
      <i className="far fa-save" /> Save
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setSaveMode(true)}
      className="btn__edit--screening"
    >
      <i className="fas fa-edit" /> Edit
    </button>
  );

  let editPropertyVerifyBtn = isPropertySelectMode ? (
    <button
      onClick={verifyProperties}
      type="button"
      className="btn__edit--screening"
    >
      <i className="far fa-save" /> Save
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setPropertySelectMode(true)}
      className="btn__edit--screening"
    >
      <i className="fas fa-edit" /> Edit
    </button>
  );

  return (
    <Formik
      enableReinitialize
      ref={refContainer}
      initialValues={{ ...userDataAbout }}
      validationSchema={AboutFormSchema}
      onSubmit={(values, { validateForm, setSubmitting }) => {
        setSubmitting(true);
        values.uploadAvatar = false;
        if (profilePicture.avatar.includes(";base64")) {
          values.uploadAvatar = true;
          values.avatar = profilePicture;
        }
        values.isPhoneNumberVerified = isPhoneNumberVerified;
        values.countryCode = initialCountryCode;
        values.isCompany = showCompany;
        values.phoneNumber = String(values.phoneNumber);
        updateProfileAbout(values);
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <div className="tab__details">
            <div className="container-fluid">
              <div className="row">
                {/* <h4 className="screening__heading">
                  Review your detail and update required info
                </h4>
                <p className="screening__subheading">
                  You have provided following info as part of registration,
                  however it is important for you to review those detail and
                  make any correction as this is final opportunity and later
                  changes are not allowed when referencing in under-process.
                  These information will be verified through external 3rd party
                  agencies and credit bureau (such as; land registry, Equifax,
                  Experian, TransUnion)
                </p> */}

                {userData.role ===
                  "landlord" && (
                    <div className="screening__card">
                      <div className="screening__card--listing">
                        <div className="heading__edit">
                          <h4>Properties</h4>
                          {editPropertyVerifyBtn}
                        </div>
                        <div className={!isPropertySelectMode && "cover"}>
                          <Checkbox.Group
                            style={{ width: "100%" }}
                            onChange={onChange}
                          >
                            <Row>
                              {optionsWithDisabled.map((option, i) => {
                                return (
                                  <Col span={8} key={i}>
                                    <Checkbox
                                      checked={get(option, "checked", "false")}
                                      disabled={get(option, "disabled", "false")}
                                      value={get(option, "value")}
                                    >
                                      {get(option, "label")}
                                    </Checkbox>
                                  </Col>
                                );
                              })}
                            </Row>
                          </Checkbox.Group>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="screening__card">
                  <div className="screening__card--listing">
                    <div className="heading__edit">
                      <h4>About</h4>
                      {changeBtn}
                    </div>

                    <div className={!isSaveMode && "cover"}>
                      <ul>
                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label space_between__tooltips">
                              <span>
                                First Name <span>*</span>
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
                        </li>
                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label space_between__tooltips">
                              <span>Middle Name</span>
                            </label>
                            <Field
                              placeholder="Enter middle name"
                              type="text"
                              name="middleName"
                              className="tab__deatils--input"
                              {...props}
                            />
                          </div>
                        </li>
                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label space_between__tooltips">
                              <span>
                                Last Name <span>*</span>
                              </span>
                            </label>
                            <CustomInput
                              placeholder="Enter last name"
                              type="text"
                              name="lastName"
                              errors={errors}
                            />
                          </div>
                        </li>

                        <li>
                          <div className="form-group yes__no--toogle">
                            <label className="tab__deatils--label">
                              <span>Display Company ?</span>
                            </label>
                            <div className="btn-group d-block">
                              <a
                                href
                                className={
                                  showCompany
                                    ? "btn btn-md active activeShowCompany"
                                    : "btn btn-md active notActiveShowCompany"
                                }
                                data-toggle="company"
                                data-title="Y"
                                onClick={() => setCompanyStatus(true)}
                              >
                                YES
                              </a>
                              <a
                                href
                                className={
                                  !showCompany
                                    ? "btn btn-light btn-md no_activeShowCompany"
                                    : "btn btn-light btn-md no_notActiveShowCompany"
                                }
                                data-toggle="company"
                                data-title="N"
                                onClick={() => setCompanyStatus(false)}
                              >
                                NO
                              </a>
                            </div>
                          </div>
                        </li>

                        {showCompany && (
                          <li>
                            <div className="form-group">
                              <label className="tab__deatils--label space_between__tooltips">
                                <span>
                                  Company Registration Number <span>*</span>
                                </span>
                              </label>
                              <Field
                                placeholder="Company Registration Number"
                                type="text"
                                name="companyRegistrationNumber"
                                className="tab__deatils--input"
                              />
                            </div>
                          </li>
                        )}

                        {showCompany && (
                          <li>
                            <div className="form-group">
                              <label className="tab__deatils--label space_between__tooltips">
                                <span>
                                  Company Name <span>*</span>
                                </span>
                              </label>
                              <Field
                                placeholder="Company Name"
                                type="text"
                                name="companyName"
                                className="tab__deatils--input"
                              />
                            </div>
                          </li>
                        )}

                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label space_between__tooltips">
                              {" "}
                              <span>
                                Mobile Number <span>*</span>
                              </span>
                            </label>
                            <div className="date__flex">
                              <div
                                onClick={() =>
                                  setCountryCodeSelector(
                                    !isCountryCodeSelectorOpen
                                  )
                                }
                                className="input-group-prepend"
                              >
                                <div className="input-group-text">
                                  +{initialCountryCode}
                                </div>
                              </div>
                              <CountryPicker
                                typedPhoneNumber={typedPhoneNumber}
                                isCountryCodeSelectorOpen={
                                  isCountryCodeSelectorOpen
                                }
                                updateSelectedCountryCode={e => {
                                  selectCountryCode(e);
                                  setCountryCodeSelector(
                                    !isCountryCodeSelectorOpen
                                  );
                                }}
                              />
                              <MyNumberInput
                                placeholder="Your Contact Number"
                                style={{
                                  marginLeft: " -38px"
                                }}
                                className={
                                  errors && errors["phoneNumber"]
                                    ? "tab__deatils--input error__field_show"
                                    : "tab__deatils--input"
                                }
                                format="(###) ###-####"
                                mask="_"
                                disabled={isPhoneNumberVerified}
                                value={values.phoneNumber}
                                onValueChange={val => {
                                  setTypedPhoneNumber(val.floatValue);
                                  setFieldValue("phoneNumber", val.floatValue);
                                }}
                              />
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label space_between__tooltips">
                              <span>
                                Date of Birth<span>*</span>
                              </span>
                            </label>
                            <div className="date__flex">
                              <div className="input-group-prepend">
                                <div className="input-group-text">
                                  <i className="fa fa-calendar" />
                                </div>
                              </div>
                              <DatePicker
                                required={true}
                                placeholder="Please select date of birth"
                                // style={{width: 295}}
                                value={values.dob ? moment(values.dob): undefined}
                                format={dateFormat}
                                onChange={(date, dateString) => setFieldValue("dob", date)} />
                          
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label">
                              Select Nationality <span>*</span>
                            </label>
                            <Field
                              component="select"
                              name="nationality"
                              className={
                                errors && errors["nationality"]
                                  ? "tab__deatils--input error__field_show"
                                  : "tab__deatils--input"
                              }
                            >
                              <option selected disabled>
                                Select Nationality <span>*</span>
                              </option>
                              {props.nationalities &&
                                props.nationalities.map((n, i) => {
                                  return (
                                    <option key={n.nationality} value={n.nationality}>
                                      {n.nationality}
                                    </option>
                                  );
                                })}
                            </Field>
                          </div>
                        </li>

                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label space_between__tooltips">
                              <span>Email Address</span>
                            </label>
                            <Field
                              placeholder="Email Address"
                              type="email"
                              name="email"
                              className="tab__deatils--input"
                              disabled
                            />
                          </div>
                        </li>

                        <li>
                          <div className="form-group">
                            <label className="tab__deatils--label">
                              Select Gender
                            </label>
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
                        </li>
                      </ul>
                      <button ref={submitBtnRef} hidden type="submit">
                        submit
                      </button>
                    </div>
                  </div>

                  <div className="screening__card--listing">
                    <ul>
                      <li></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default About;
