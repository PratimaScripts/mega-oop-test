import React, { useEffect, useState, useContext, useRef } from "react";
import {
  // MailOutlined,
  LoadingOutlined,
  MedicineBoxOutlined,
  PushpinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, message, Avatar } from "antd";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useLocation } from "react-router-dom";

import CountryPicker from "config/CountryCodeSelector";
import CompaniesHouse from "components/Common/SettingsTabs/CommonInfo/CompaniesHouseDropdown";
// import LoqateAddress from "config/AddressAutoCompleteLoqate";
import LoqateAddressFull from "config/LoqateGetFullAddress";
// import HouseSuggestions from "components/Common/SettingsTabs/CommonInfo/Downshift";
import "./activeProfile.scss";
import { useMutation } from "react-apollo";
import LoginQuery from "config/queries/login";
import OTPInput from "otp-input-react";
import { useHistory } from "react-router";
import showNotification from "config/Notification";
import BasicHeader from "components/layout/headers/BasicHeader";
import { UserDataContext } from "store/contexts/UserContext";
import AddressAutocomplete from "components/Common/AddressAutocomplete";

const SocialLoginOnboarding = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const search = useLocation().search;
  const nextUrl = new URLSearchParams(search).get("next");
  const history = useHistory();
  const { state, dispatch } = useContext(UserDataContext);
  const { userData } = state;
  const [counter, setCounter] = useState(60);
  const startTimer = useRef(false);
  const otpSendButtonRef = useRef();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [countryCode, selectCountryCode] = useState("44");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState({});
  const [companyStr, setCompanyStr] = useState("");
  const [isCompanyAddress, setIsCompanyAddress] = useState(false);
  const [hasPhoneNo, setHasPhoneNo] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [addressStr, setAddressStr] = useState("");
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationLoadingStates, setVerificationLoadingStates] = useState({
    request: false,
    verify: false,
  });
  const [currentNumberForValidation, setCurrentValidationNumber] = useState("");

  useEffect(() => {
    if (
      userData.email === undefined ||
      (userData.verifiedStatus !== null &&
        get(userData, "verifiedStatus", "Not Verified") !== "Not Verified")
    ) {
      try {
        const url = new URL(nextUrl);
        if (url && url.origin !== window.location.origin) {
          window.location.assign(url);
        } else {
          history.push(nextUrl ? nextUrl : `/`);
        }
      } catch (e) {
        history.push(nextUrl ? nextUrl : `/`);
      }
      return;
    }

    const timer = setTimeout(() => {
      startTimer.current && counter >= 0 && setButtonCounter();
    }, 1000);
    return () => clearTimeout(timer);

    //eslint-disable-next-line
  }, [userData, counter, history, startTimer.current]);

  const setButtonCounter = () => {
    if (counter <= 0) {
      startTimer.current = false;
      otpSendButtonRef.current.disabled = false;
      setCounter(60);
    } else {
      setCounter(counter - 1);
    }
  };

  const [executeUpdateRegisteredUser, { loading: savingLoading }] = useMutation(
    LoginQuery.onboardSocialUser,
    {
      onCompleted: ({ onboardSocialUser }) => {
        if (onboardSocialUser.success) {
          showNotification("success", "Completed Onboarding!", "Thank You!");
          // console.log("Active Profile",  onboardSocialUser)
          dispatch({ type: "SET_USER_DATA", payload: onboardSocialUser });

          history.push(nextUrl ? nextUrl : "/");
        } else {
          showNotification("error", "Failed To Register", "");
        }
        setLoading(false);
      },
      onError: ({ graphQLErrors, networkError }) => {
        setLoading(false);
        showNotification(
          "error",
          "Not able to process your request",
          "Try Again"
        );
        // NProgress.done();
      },
    }
  );

  const addCompany = (company) => {
    if (company) {
      // console.log(company)
      if (
        !company.address_snippet ||
        !company.address_line_1 ||
        !company.locality ||
        !company.postal_code ||
        !company.country
      ) {
        setIsCompanyAddress(true);
        setCompany(company);
        setAddressStr(get(company, "address_snippet", ""));
      } else {
        setIsCompanyAddress(false);
        message.error("Company Address is not compatible, add manually");
      }
    } else {
      setIsCompanyAddress(false);
      setCompany(null);
      setAddressStr("");
    }
  };

  const onSubmit = (data) => {
    let profileData = {
      email: userData.email,
      role: selectedRole,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNo: phoneNumber,
      countryCode,
      fullAddress: addressStr,
      addressLine1: isCompanyAddress
        ? get(company, "address.address_line_1", "")
        : address.addressLine1,
      addressLine2: isCompanyAddress
        ? get(company, "address.address_line_2", "")
        : address.addressLine2,
      city: isCompanyAddress
        ? get(company, "address.locality", "")
        : address.city,
      zip: isCompanyAddress
        ? get(company, "address.postal_code", "")
        : address.zip,
      state: isCompanyAddress
        ? get(company, "address.address_line_2", "")
        : address.state,
      country: isCompanyAddress
        ? get(company, "address.country", "")
        : address.country,
      verifiedStatus: "Partially Verified",
    };

    if (isCompanyAddress) {
      profileData = {
        ...profileData,
        companyName: company.title,
        companyNumber: company.company_number,
      };
    }

    // console.log(profileData)
    if (
      profileData.addressLine1 === undefined ||
      profileData.zip === undefined ||
      profileData.city === undefined ||
      profileData.country === undefined
    ) {
      showNotification("error", "Please select your address properly", "");
      return;
    }

    executeUpdateRegisteredUser({ variables: profileData });
  };

  const [sendPhoneOtpMutation] = useMutation(LoginQuery.sendPhoneOtp, {
    onCompleted: ({ sendPhoneOtp }) => {
      if (sendPhoneOtp.success) {
        showNotification("success", "Otp sent on your device", "");
        otpSendButtonRef.current.disabled = true;
        startTimer.current = true;
        setVerificationLoadingStates({ request: true, verify: false });
        setCurrentValidationNumber(`+${countryCode}${phoneNumber}`);
      } else {
        showNotification(
          "error",
          "Couldn't send otp",
          "Please try again later!"
        );
      }
      setLoading(false);
    },
    onError: ({ graphQLErrors, networkError }) => {
      setLoading(false);
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      // NProgress.done();
    },
  });

  const [verifyPhoneOtpMutation] = useMutation(LoginQuery.verifyPhoneOtp, {
    onCompleted: ({ verifyPhoneOtp }) => {
      if (verifyPhoneOtp.success) {
        showNotification("success", "Mobile Verified!", "");
        setVerificationLoadingStates({ request: false, verify: true });
      } else {
        setVerificationLoadingStates({ request: true, verify: false });
        showNotification("success", "Failed to verify mobile!", "");
      }
      setLoading(false);
    },
    onError: ({ graphQLErrors, networkError }) => {
      setLoading(false);
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      // NProgress.done();
    },
  });

  const handleSendOtp = async () => {
    setLoading(true);
    if (!phoneNumber || String(phoneNumber).length !== 10 || !countryCode) {
      showNotification("error", "Please enter a valid contact number!", "");
      // message.error("Please enter a valid contact number!");
    } else {
      sendPhoneOtpMutation({
        variables: { phoneNumber: `+${countryCode}${phoneNumber}` },
      });
    }
  };

  const verifyOTP = async (otpcode) => {
    setLoading(true);
    setVerificationLoadingStates({ request: false, verify: true });
    verifyPhoneOtpMutation({
      variables: { phoneNumber: currentNumberForValidation, phoneOtp: otpcode },
    });
  };

  const findAddress = async (address) => {
    const fullAddress = await LoqateAddressFull(address.Id);

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

    if (
      obj.addressLine1 === undefined ||
      obj.country === undefined ||
      obj.zip === undefined
    ) {
      message.error("This address is not compatible, choose other one");
      return;
    }

    obj.fullAddress = `${obj.addressLine1}, ${obj.addressLine2}, ${obj.city}, ${obj.zip}`;
    if (obj.fullAddress) setAddressStr(obj.fullAddress);
    if (completeAddress) setAddress(obj);
    // console.log(obj)
  };

  const checkOtp = async (data) => {
    setEnteredOtp(data);
    // console.log(data.length);
    if (data.length === 4) {
      await verifyOTP(data);
    }
  };

  // console.log("useData", userData)

  return (
    <div className="active-profile__wrapper">
      <BasicHeader allowRoleChange={false} />

      <div className="box">
        <h4>Let's get your portal setup</h4>
        <div class="user-avatar">
          <Avatar
            style={{ backgroundColor: "#f28e1d", verticalAlign: "middle" }}
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            // src={<Image src={`${userData.avatar}&width=100&height=100`}/>}
            icon={<UserOutlined />}
          >
            {!userData.avatar ? userData.firstName : ""}
          </Avatar>
          <h6>
            {userData.firstName}
            {userData.middleName ? ` ${userData.middleName} ` : " "}
            {userData.lastName}
          </h6>
          <p>{userData.email}</p>
        </div>

        <form className="active-profile" onSubmit={handleSubmit(onSubmit)}>
          <h6>Select Your Role</h6>
          <div className="user-type d-block clearfix mb-4">
            <ul>
              <li
                className={selectedRole === "landlord" && "active"}
                onClick={() => setSelectedRole("landlord")}
              >
                <span>
                  <i className="mdi mdi-home-account"></i>
                  <p>I am a Landlord</p>
                </span>
              </li>
              <li
                className={selectedRole === "renter" && "active"}
                onClick={() => setSelectedRole("renter")}
              >
                <span>
                  <i className="mdi mdi-account-key"></i>
                  <p>I am a renter</p>
                </span>
              </li>
              <li
                className={selectedRole === "servicepro" && "active"}
                onClick={() => setSelectedRole("servicepro")}
              >
                <span>
                  <i className="mdi mdi-account-clock"></i>
                  <p>I am a ServicePro</p>
                </span>
              </li>
            </ul>
          </div>

          {/* <div className="form-group d-flex justify-content-between">
            <p>Company?</p>
            <Switch
              checked={isCompanyAddress}
              onChange={(value) => setIsCompany(value)}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked
            />
          </div> */}
          {(selectedRole === "servicepro" || selectedRole === "landlord") && (
            <div className="form-group company-wrapper">
              <MedicineBoxOutlined />
              <CompaniesHouse
                field="companyName"
                value={companyStr}
                values={{ companyName: company?.title }}
                setCompany={addCompany}
                required={false}
                onChange={(event, { newValue }) => {
                  setCompanyStr(newValue ? newValue : "");
                  if (newValue === "") {
                    addCompany();
                  }
                }}
              />
            </div>
          )}

          <div className="form-group company-wrapper">
            <PushpinOutlined />
            {/* <HouseSuggestions
              LoqateAddress={LoqateAddress}
              findAddress={findAddress}
              value={addressStr}
              required={true}
              register={register}
              // disabled={isCompanyAddress}
              onChange={(event, { newValue }) => {
                setAddressStr(newValue ? newValue : "")
                if( isCompanyAddress && newValue !== addressStr) {
                  setIsCompanyAddress(false)
                }
              }
              }
            /> */}
            <AddressAutocomplete
              findAddress={findAddress}
              value={addressStr}
              required={true}
              onChange={(value) => {
                setAddressStr(value ? value : "");
                if (isCompanyAddress && value !== addressStr) {
                  setIsCompanyAddress(false);
                }
              }}
            />
            {/* <Input
              placeholder="Your current address"
              prefix={<PushpinOutlined />}
              {...register("address")}
              value={company?.address_snippet}
            /> */}
          </div>

          {/* {isCompanyAddress && (
            <div className="form-group">
              <div className="website-wrapper">
                <span className="website">
                  <GlobalOutlined />
                  &nbsp;
                  <span>https://rentoncloud/landloard/</span>
                </span>
                <Input
                  placeholder="Enter website name"
                  {...register("website")}
                />
              </div>
            </div>
          )} */}

          <div className="form-group">
            <div className="date__flex">
              <CountryPicker
                name="phoneNumber"
                countryCode={countryCode}
                value={`${countryCode}${phoneNumber}`}
                setValue={(val, countryCode) => {
                  setHasPhoneNo(val.length === 10);
                  setPhoneNumber(`${val}`);
                  selectCountryCode(countryCode);
                }}
                className={
                  errors && errors.phoneNumber
                    ? "tab__deatils--input error__field_show"
                    : "tab__deatils--input"
                }
                disabled={verificationLoadingStates.verify}
                required={false}
              />
            </div>
          </div>

          {hasPhoneNo && (
            <div className="get-otp-button">
              <small>You should get an otp on your device.</small>
              <Button
                type="ghost"
                size="small"
                ref={otpSendButtonRef}
                className="btn-otp"
                onClick={handleSendOtp}
                icon={loading ? <LoadingOutlined /> : null}
                disabled={verificationLoadingStates.verify}
              >
                {!verificationLoadingStates.request
                  ? "Get OTP"
                  : counter > 0 && startTimer.current
                  ? `Resend OTP (${counter.toString().padStart(2, "0")})`
                  : "Resend OTP"}
              </Button>
            </div>
          )}

          {verificationLoadingStates.request && (
            <div className="input-group verify-code">
              <div className="verify__otp">
                <OTPInput
                  title="Please enter the OTP!"
                  value={enteredOtp}
                  hasErrored={true}
                  onChange={checkOtp}
                  autoFocus
                  OTPLength={4}
                  separator={<span>-</span>}
                  otpType="number"
                  inputStyle={"form-control gcode"}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <Button
              type="primary"
              className=""
              htmlType="submit"
              block
              disabled={!verificationLoadingStates.verify}
              icon={savingLoading ? <LoadingOutlined /> : null}
            >
              Active your profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialLoginOnboarding;
