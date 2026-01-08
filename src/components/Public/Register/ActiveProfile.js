import React, { useEffect, useState, useContext, useRef } from "react";
import {
  MailOutlined,
  LoadingOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useForm } from "react-hook-form";
import get from "lodash/get";

import CountryPicker from "config/CountryCodeSelector";
import CompaniesHouse from "components/Common/SettingsTabs/CommonInfo/CompaniesHouseDropdown";
import LoqateAddressFull from "config/LoqateGetFullAddress";
import "./activeProfile.scss";
import { useMutation } from "react-apollo";
import LoginQuery from "config/queries/login";
import OTPInput from "otp-input-react";
import { useHistory } from "react-router";
import showNotification from "config/Notification";
import BasicHeader from "components/layout/headers/BasicHeader";
import { UserDataContext } from "store/contexts/UserContext";
import AddressAutocomplete from "components/Common/AddressAutocomplete";
import SearchPlace from "../../Common/Maps/PlaceSearch";

const ActiveProfile = () => {
  // const search = useLocation().search;
  // const nextUrl = new URLSearchParams(search).get("next");
  const history = useHistory();
  const { state, dispatch } = useContext(UserDataContext);
  const { userData } = state;
  const [counter, setCounter] = useState(60);
  const startTimer = useRef(false);
  const otpSendButtonRef = useRef();

  const {
    // register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [countryCode, selectCountryCode] = useState("44");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState({});
  const [companyStr, setCompanyStr] = useState("");
  const [isCompany, setIsCompany] = useState(false);
  const [isCompanyAddress, setIsCompanyAddress] = useState(false);
  const [hasPhoneNo, setHasPhoneNo] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [addressStr, setAddressStr] = useState(undefined);
  const [address, setAddress] = useState({});
  const [names, setNames] = useState({
    firstName: "",
    lastName: "",
  });
  const [location, setLocation] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationLoadingStates, setVerificationLoadingStates] = useState({
    request: false,
    verify: false,
  });
  const [currentNumberForValidation, setCurrentValidationNumber] = useState("");

  useEffect(() => {
    const setButtonCounter = () => {
      if (counter <= 0) {
        startTimer.current = false;
        otpSendButtonRef.current.disabled = false;
        setCounter(60);
      } else {
        setCounter(counter - 1);
      }
    };
    if (
      userData.email === undefined ||
      ["Verified", "Partially Verified"].includes(
        get(userData, "verifiedStatus", "Not Verified")
      )
    ) {
      return history.replace(
        "/" + userData.defaultRole || userData.role + history.location.search
      );
    }

    setIsCompany(
      get(userData, "role", "renter") === "landlord" ||
        get(userData, "role", "renter") === "servicepro"
        ? true
        : false
    );

    const timer = setTimeout(() => {
      startTimer.current && counter >= 0 && setButtonCounter();
    }, 1000);
    return () => clearTimeout(timer);
  }, [userData, counter, history]);

  const [executeUpdateRegisteredUser, { loading: savingLoading }] = useMutation(
    LoginQuery.updateRegisteredUser,
    {
      onCompleted: ({ updateRegisteredUser }) => {
        if (updateRegisteredUser.success) {
          showNotification("success", "Completed Onboarding!", "Thank You!");
          const payload = {
            ...updateRegisteredUser,
            data: {
              ...userData,
              ...updateRegisteredUser.data,
              defaultRole: updateRegisteredUser.data.role,
            },
          };
          dispatch({
            type: "SET_USER_DATA",
            payload,
          });
          return history.replace(
            "/" + payload.data.defaultRole + history.location.search
          );
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

  const onSubmit = () => {
    if (!names.firstName || !names.lastName)
      return message.error("First Name and Last Name are required!");

    let profileData = {
      email: userData.email,
      role: userData.role,
      firstName: names.firstName,
      lastName: names.lastName,
      phoneNo: phoneNumber,
      countryCode,
      fullAddress: addressStr,
      location,
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

    if (
      profileData.addressLine1 === undefined ||
      profileData.zip === undefined ||
      profileData.city === undefined ||
      profileData.country === undefined
    ) {
      showNotification("error", "Please select your address properly", "");
      return;
    }
    return executeUpdateRegisteredUser({ variables: profileData });
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
    try {
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

      let location = await SearchPlace(obj.zip);
      if (Object.keys(location).length) {
        location = { coordinates: [location.lat, location.lng], type: "Point" };
        setLocation(location);
      }

      obj.fullAddress = `${obj.addressLine1}, ${obj.addressLine2}, ${obj.city}, ${obj.zip}`;
      if (obj.fullAddress) setAddressStr(obj.fullAddress);
      if (completeAddress) setAddress(obj);
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  const checkOtp = async (data) => {
    setEnteredOtp(data);
    // console.log(data.length);
    if (data.length === 4) {
      await verifyOTP(data);
    }
  };

  return (
    <div className="active-profile__wrapper">
      <BasicHeader />

      <div className="box">
        <h4>Let's get your portal setup</h4>
        <form className="active-profile" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Input
              className="input-field"
              size="large"
              placeholder="Email"
              value={userData.email}
              disabled
              prefix={<MailOutlined />}
            />
          </div>
          <div className="form-group">
            <Input
              className="input-field"
              size="large"
              placeholder="Legal first name"
              prefix={<UserOutlined />}
              value={names.firstName}
              onChange={(e) =>
                setNames({ ...names, firstName: e.target.value })
              }
            />
            {errors.firstName && (
              <div className="all__errors">First Name is required!</div>
            )}
          </div>
          <div className="form-group">
            <Input
              className="input-field"
              size="large"
              placeholder="Legal last name"
              prefix={<UserOutlined />}
              value={names.lastName}
              onChange={(e) => setNames({ ...names, lastName: e.target.value })}
            />
            {errors.lastName && (
              <div className="all__errors">Last Name is required!</div>
            )}
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

          {isCompany && (
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
            <HomeOutlined />
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
              placeholder="Enter current address and select"
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
              Activate your profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActiveProfile;
