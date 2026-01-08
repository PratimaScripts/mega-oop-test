import React, { useState, useRef, useEffect, useContext } from "react";
// import LoqateAddress from "../../../config/AddressAutoCompleteLoqate";
import LoqateAddressFull from "../../../config/LoqateGetFullAddress";
import { Formik, Form, Field } from "formik";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { LinkedIn } from "react-linkedin-login-oauth2";
import GoogleLogin from "react-google-login";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import TelegramLoginButton from "react-telegram-login";
// import SuggestionDropdown from "../SettingsTabs/CommonInfo/Downshift";
import AddressAutocomplete from "../AddressAutocomplete";
import AccountQueries from "config/queries/account";
import showNotification from "config/Notification";
import { UserDataContext } from "store/contexts/UserContext"

const ProfileConnect = props => {
  const { dispatch } = useContext(UserDataContext)
  const [isEditMode, setEditMode] = useState(false);
  let saveBtn = useRef();
  const [addressStr, setAddressStr] = useState("");
  const [connectInformation, setConnectInformation] = useState(
    props.connectInformation
  );
  useEffect(() => {
    setConnectInformation(props.connectInformation);
    setLoqateData(props.connectInformation);
  }, [props.connectInformation]);

  // Save Connect Data
  const saveConnectProfileData = async connectData => {
    // props.contextData.startLoading();

    let updateConnectQuery = await props.client.mutate({
      mutation: AccountQueries.updateConnectInformation,
      variables: { connectInput: connectData }
    });

    if (
      !isEmpty(updateConnectQuery.data.updateConnectInformation) &&
      get(updateConnectQuery, "data.updateConnectInformation.success")
    ) {
      showNotification(
        "success",
        "Details Saved!",
        "Details Saved successfully!"
      );

      let connectInformation = get(
        updateConnectQuery,
        "data.updateConnectInformation.data"
      );

      setLoqateData(connectInformation);
      // props.contextData.updateAddress(connectInformation);
      dispatch({ type: "UPDATE_ADDRESS", payload: connectInformation })
      setEditMode(false);
      // props.contextData.endLoading();
    } else {
      showNotification(
        "error",
        "An error occured",
        get(updateConnectQuery, "data.updateConnectInformation.message")
      );
      // props.contextData.endLoading();
    }
  };

  const findAddress = async address => {
    let fullAddress = await LoqateAddressFull(address.Id);
    let completeAddress = fullAddress.Items[0];
    if (completeAddress) {
      setLoqateData({
        fullAddress: completeAddress.Label,
        addressLine1: completeAddress["Company"]
          ? completeAddress["Company"]
          : completeAddress["Line1"],
        addressLine2: completeAddress["Company"]
          ? `${completeAddress["Line1"]}, ${completeAddress["Line2"]}`
          : completeAddress["Line2"],
        city: completeAddress["City"],
        state: completeAddress["Province"],
        zip: completeAddress["PostalCode"],
        country: completeAddress["CountryName"]
      });
      setAddressStr(completeAddress)
    }
  };

  const saveData = formData => {
    formData.facebookLink = facebookLink;
    formData.googleLink = googleLink;
    formData.telegramLink = telegramLink;
    saveConnectProfileData(formData);
  };

  const responseGoogle = response => {
    setGoogleLink(response);
  };

  const handleTelegramResponse = data => {
    setTelegramLink(data);
  };

  const handleFailure = failure => {
    showNotification("Error", "An error occurred!")
    // console.log(failure);
  };

  const handleSuccess = success => {
    showNotification("Success", "Successful!")
    // console.log(success);
  };

  const responseFacebook = data => {
    setfacebookLink(data);
  };

  const [loqateData, setLoqateData] = useState(connectInformation);

  const [facebookLink, setfacebookLink] = useState(
    get(connectInformation, "facebookLink")
      ? get(connectInformation, "facebookLink")
      : {}
  );
  const [googleLink, setGoogleLink] = useState(
    get(connectInformation, "googleLink")
      ? get(connectInformation, "googleLink")
      : {}
  );
  const [telegramLink, setTelegramLink] = useState(
    get(connectInformation, "telegramLink")
      ? get(connectInformation, "telegramLink")
      : {}
  );

  let SaveButton = isEditMode ? (
    <button
      type="button"
      onClick={() => saveBtn.current.click()}
      className="btn__edit--screening"
    >
      <i className="far fa-save" /> Save
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setEditMode(true)}
      className="btn__edit--screening"
    >
      <i className="fas fa-edit" /> Edit
    </button>
  );

  return (
    <>
      <div className="connect_page">
        <div className="screening__card">
          <div className="heading__edit">
            <h4>Connect</h4>
            {SaveButton}
          </div>
          <div className={!isEditMode && "cover"}>
            <div className="screening__social--listing">
              <div className="row">
                <div className="col-md-6">
                  <div className="notify_settings d-flex flex__middle">
                    {/* <i className="fab fa-facebook-f"></i> */}
                    <FacebookLogin
                      appId={process.env.REACT_APP_FACEBOOK_APPID}
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={responseFacebook}
                      render={renderProps => (
                        <>
                          <i className="fa fa-facebook-f facebook__icon"></i>
                          <div className="details">
                            <h4>
                              {!isEmpty(facebookLink) && (
                                <i
                                  className="fa fa-check-circle"
                                  aria-hidden="true"
                                ></i>
                              )}
                              Connected with Facebook{" "}
                            </h4>
                            <div className="btns">
                              {!isEmpty(facebookLink) ? (
                                <>
                                  <input
                                    onClick={renderProps.onClick}
                                    type="button"
                                    className="btn btn-primary"
                                    value="Reconnect"
                                  />
                                  <input
                                    type="button"
                                    onClick={() => setfacebookLink({})}
                                    className="btn btn-danger"
                                    value="Disconnect"
                                  />
                                </>
                              ) : (
                                <input
                                  type="button"
                                  onClick={renderProps.onClick}
                                  className="btn btn-primary"
                                  value="Connect"
                                />
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="notify_settings d-flex flex__middle">
                    <LinkedIn
                      clientId={process.env.REACT_APP_LINKEDIN_ID}
                      onFailure={handleFailure}
                      onSuccess={handleSuccess}
                      redirectUri={`${window.location.origin}/linkedin`}
                      scope="w_member_social"
                      renderElement={({ onClick, disabled }) => (
                        <>
                          <i className="fa fa-linkedin-in linkedin__icon"></i>
                          <div className="details">
                            <h4>Connect with LinkedIn </h4>
                            <div className="btns">
                              {/* <input
                            type="button"
                            className="btn btn-primary"
                            value="Reconnect"
                          />{" "}
                          <input
                            type="button"
                            className="btn btn-danger"
                            value="Disconnect"
                          /> */}
                              <input
                                type="button"
                                onClick={onClick}
                                className="btn btn-primary"
                                value="Connect"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="notify_settings d-flex flex__middle">
                    <GoogleLogin
                      clientId={process.env.REACT_APP_GOOGLE_TOKEN}
                      render={renderProps => (
                        <>
                          <i className="fa fa-google google__icon"></i>
                          <div className="details">
                            <h4>
                              Connect with Google{" "}
                              {!isEmpty(googleLink) && (
                                <i
                                  className="fa fa-check-circle"
                                  aria-hidden="true"
                                ></i>
                              )}
                            </h4>
                            <div className="btns">
                              {!isEmpty(googleLink) ? (
                                <>
                                  <input
                                    type="button"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    className="btn btn-primary"
                                    value="Reconnect"
                                  />{" "}
                                  <input
                                    type="button"
                                    onClick={() => setGoogleLink({})}
                                    className="btn btn-danger"
                                    value="Disconnect"
                                  />
                                </>
                              ) : (
                                <input
                                  onClick={renderProps.onClick}
                                  disabled={renderProps.disabled}
                                  type="button"
                                  className="btn btn-primary"
                                  value="Connect"
                                />
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      buttonText="Login"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={"single_host_origin"}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="notify_settings d-flex flex__middle"
                    style={{ minHeight: "56px" }}
                  >
                    <i className="fab fa-telegram-plane telegram__icon"></i>

                    <div className="details">
                      <h4>
                        Connect with Telegram{" "}
                        {!isEmpty(telegramLink) && (
                          <i
                            className="fa fa-check-circle"
                            aria-hidden="true"
                          ></i>
                        )}
                      </h4>{" "}
                      <div className="btns">
                        {!isEmpty(telegramLink) ? (
                          <>
                            <input
                              type="button"
                              className="btn btn-primary"
                              value="Reconnect"
                            />{" "}
                            <input
                              type="button"
                              onClick={() => setTelegramLink({})}
                              className="btn btn-danger"
                              value="Disconnect"
                            />
                          </>
                        ) : (
                          <>
                            <TelegramLoginButton
                              dataOnauth={handleTelegramResponse}
                              botName="ftestapp_2248bot"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="labels__global space_between__tooltips">
                  <span>
                    Current Address <span>*</span>
                  </span>
                </label>
                {/* <SuggestionDropdown
                  LoqateAddress={LoqateAddress}
                  findAddress={findAddress}
                  loqateData={loqateData}
                  value={addressStr}
                /> */}
                <AddressAutocomplete 
                  findAddress={findAddress}
                  value={addressStr}
                  onChange={setAddressStr}/>
                <Formik
                  enableReinitialize
                  initialValues={loqateData}
                  onSubmit={(values, { validateForm, setSubmitting }) => {
                    setSubmitting(true);
                    // console.log(values);
                    saveData(values);
                  }}
                >
                  {({ isSubmitting, setFieldValue, values, errors }) => (
                    <Form>
                      <div className="form-group">
                        <Field
                          type="text"
                          id="label"
                          name="fullAddress"
                          className="form-control input__global"
                          placeholder="Full Address"
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          type="text"
                          id="line1"
                          name="addressLine1"
                          className="form-control input__global"
                          placeholder="Address Line 1*"
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          type="text"
                          id="line2"
                          name="addressLine2"
                          className="form-control input__global"
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
                              className="form-control input__global"
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
                              className="form-control input__global"
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
                              className="form-control input__global"
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
                              className="form-control input__global"
                              placeholder="Country *"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mb-1 mt-4">
                        <div className="col-md-6"></div>
                        <div className="col-md-6">
                          <button
                            hidden
                            ref={saveBtn}
                            className="btn btn-primary btn-block"
                          >
                            {" "}
                            Save &amp; next{" "}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileConnect;
