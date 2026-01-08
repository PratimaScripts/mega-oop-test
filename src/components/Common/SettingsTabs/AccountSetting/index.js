/* eslint-disable array-callback-return */
import React, { useState, useRef } from "react";
import get from "lodash/get";
// import { Formik, Form, Field } from "formik";
import cookie from "react-cookies";
import { Tooltip, Select, Radio } from "antd";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { useForm, Controller } from "react-hook-form";

import showNotification from "config/Notification";
import confirmModal from "config/ConfirmModal";
import AccountQueries from "config/queries/account";
import timezones from "constants/timezones";
// import {Input} from "roc";

import "./style.scss";

// const { confirm } = Modal;

const AccountSetting = (props) => {
  const { Option } = Select;
  const history = useHistory();
  const [accountPreferences, setAccountPreferences] = useState({});
  const defaultValues = {
    currency: get(accountPreferences, "currency", "United Kingdom Pounds"),
    timeZone: get(accountPreferences, "timeZone", "Europe/London"),
    timeFormat: get(accountPreferences, "timeFormat", "am"),
    dateFormat: get(accountPreferences, "dateFormat", "YYYY-MM-DD"),
    measurementUnit: get(accountPreferences, "measurementUnit", "Metric"),
  };
  const { getValues, control, reset } = useForm({ defaultValues });
  const isUpdated = useRef(false);

  // const [timezones, setTimezones] = useState([]);

  // console.log(timezones)

  history.listen(async (location, action) => {
    if (getValues() && !isUpdated.current) {
      // console.log(getValues());

      const areValuesTheSame = isEquivalent(accountPreferences, getValues());
      isUpdated.current = !areValuesTheSame;
      !areValuesTheSame && updateAccountSettings({ variables: getValues() });
    }
  });

  const isEquivalent = (a, b) => {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;
  };

  const [deleteAccount] = useLazyQuery(AccountQueries.deleteAccount, {
    onCompleted: ({ deleteAccount }) => {
      if (deleteAccount.success) {
        cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
        showNotification("success", "Account deleted successfully", "");
        cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
        window.location.href = "/";
      } else {
        showNotification("success", "Failed to delete the account", "");
      }
    },
    onError: (error) => {
      showNotification("success", "Failed to delete the account", "");
    },
  });

  const [deactivateAccount] = useLazyQuery(AccountQueries.deactivateAccount, {
    onCompleted: ({ deactivateAccount }) => {
      if (deactivateAccount.success) {
        cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
        showNotification("success", "Account deactivated successfully", "");
        cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
        window.location.href = "/";
      } else {
        showNotification("success", "Failed to deactivate the account", "");
      }
    },
    onError: (error) => {
      showNotification("success", "Failed to deactivate the account", "");
    },
  });

  useQuery(AccountQueries.fetchAccountPreferences, {
    onCompleted: ({ getAccountSetting }) => {
      // console.log("data fetched", getAccountSetting);
      if (getAccountSetting.success) {
        setAccountPreferences(getAccountSetting.data);
        reset(getAccountSetting.data);
      } else {
        setAccountPreferences({});
      }
    },
    onError: (error) => {
      setAccountPreferences({});
    },
  });

  const [updateAccountSettings] = useMutation(
    AccountQueries.updateAccountPreferences,
    {
      onCompleted: ({ updateAccountSetting }) => {
        if (updateAccountSetting.success) {
          showNotification(
            "success",
            "Profile Updated!",
            "Your Profile has been updated successfully!"
          );
        }
      },
    }
  );

  const [exportRequest] = useLazyQuery(AccountQueries.exportData, {
    onCompleted: ({ exportData }) => {
      if (exportData.success) {
        showNotification(
          "success",
          "Request Sent Successfully!",
          exportData.message
        );
      } else {
        showNotification("error", "An error occured", exportData.message);
      }
    },
    onError: (error) => showNotification("error", "An error occured", ""),
  });

  return (
    <div className="account_setting">
      <div className="">
        <div className="info_wrap">
          <form>
            <div className="row">
              <div className="col-sm-4 col-md-4">
                <div className="form-group">
                  <label className="labels__global">
                    Currency
                    <Tooltip
                      overlayClassName="tooltip__color"
                      title="Once selected and user account is used, then field will be locked for editing can't be changed further. "
                    >
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                        alt="i"
                      />
                    </Tooltip>
                  </label>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-pound-sign"></i>
                      </span>
                    </div>
                    <Controller
                      control={control}
                      name="currency"
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, ...rest } }) => (
                        <Select
                          name="currency"
                          size="large"
                          style={{ width: "95%" }}
                          placeholder="Seleect Your Currency"
                          defaultValue="United Kingdom Pounds"
                          disabled
                          onChange={(value) => onChange(value)}
                          {...rest}
                        >
                          <Option value="United Kingdom Pounds">
                            United Kingdom Pounds
                          </Option>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-sm-4 col-md-4">
                <div className="form-group">
                  <label className="labels__global">Select Time-zone</label>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-clock"></i>
                      </span>
                    </div>
                    <Controller
                      control={control}
                      name="timeZone"
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, ...rest } }) => (
                        <Select
                          name="timeZone"
                          placeholder="Select your timezone"
                          style={{ width: "95%" }}
                          size="large"
                          onChange={(value) => onChange(value)}
                          {...rest}
                        >
                          {timezones &&
                            timezones.map((zone, i) => {
                              return (
                                <Option key={i} value={zone}>
                                  {zone}
                                </Option>
                              );
                            })}
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-sm-4 col-md-4">
                <div className="form-group form__group--global">
                  <label className="labels__global">Time Format</label>
                </div>

                <div className="custom-control custom-radio custom-control-inline">
                  <Controller
                    control={control}
                    name="timeFormat"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, ...rest } }) => (
                      <Radio.Group
                        name="timeFormat"
                        onChange={(value) => onChange(value)}
                        {...rest}
                      >
                        <Radio value={"am"}>AM/PM</Radio>
                        <Radio value={"24hours"}>24 Hours</Radio>
                      </Radio.Group>
                    )}
                  />
                </div>
              </div>

              <div className="col-sm-4 col-md-4">
                <div className="form-group">
                  <label className="labels__global">Select Date Format</label>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <Controller
                      control={control}
                      name="dateFormat"
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, ...rest } }) => (
                        <Select
                          name="dateFormat"
                          size="large"
                          style={{ width: "95%" }}
                          placeholder="Select date format"
                          onChange={(value) => onChange(value)}
                          {...rest}
                        >
                          <Option value="DD-MM-yyyy">DD-MM-YYYY</Option>
                          <Option value="MM-DD-yyyy">MM-DD-YYYY</Option>
                          <Option value="yyyy-MM-DD">YYYY-MM-DD</Option>
                          <Option value="yyyy-DD-MM">YYYY-DD-MM</Option>
                          <Option value="DD/MM/yyyy">DD/MM/YYYY</Option>
                          <Option value="MM/DD/yyyy">MM/DD/YYYY</Option>
                          <Option value="yyyy/MM/DD">YYYY/MM/DD</Option>
                          <Option value="yyyy/DD/MM">YYYY/DD/MM</Option>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-sm-4 col-md-4">
                <div className="form-group form__group--global">
                  <label className="labels__global">Unit of Measurement</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <Controller
                    control={control}
                    name="measurementUnit"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, ...rest } }) => (
                      <Radio.Group
                        name="measurementUnit"
                        onChange={(value) => onChange(value)}
                        {...rest}
                      >
                        <Radio value={"Imperial"}>Imperial</Radio>
                        <Radio value={"Metric"}>Metric</Radio>
                      </Radio.Group>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
          {/* )}
          </Formik> */}
          <hr></hr>
          <div className="account_set">
            <div className="row mt-4">
              <div className="col-xl-4">
                <div className="form-group">
                  <button
                    onClick={() => exportRequest()}
                    className="btn btn-block btn-outline-success mb-2 btns__success"
                  >
                    Export Data
                  </button>
                  <span className="help-text">
                    It can take some time to prepare files for the export. You
                    can leave the export screen and we'll notify you when the
                    download file is ready.
                  </span>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="form-group">
                  <button
                    className="btn btn-block btn-outline-warning mb-2 btns__warning"
                    onClick={() =>
                      confirmModal({
                        title: "Are you sure you want to deactivate Account?",
                        message: (
                          <p>
                            {" "}
                            Account will be deactivated. You can come back and
                            login for reactivate account..
                            <br />
                            <br />
                            <b>
                              Next login for reactivate you need some
                              authentication with email.
                            </b>
                          </p>
                        ),
                        onOkFunction: () =>
                          deactivateAccount({ variables: {} }),
                      })
                    }
                  >
                    Deactivate Account
                  </button>
                  <span className="help-text">
                    Account will be deactivated. User can come back and login /
                    reactivate account.
                  </span>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="form-group">
                  <button
                    className="btn btn-block btn-outline-danger mb-2 btns__danger"
                    onClick={() =>
                      confirmModal({
                        title: "Are you sure you want to delete Account?",
                        message: (
                          <p>
                            {" "}
                            Once delete can't be revert back. All inforamtion of
                            your account related information are erased.
                            <br />
                            <br />
                            <b>
                              You can choose deactivate account Option if it is
                              temporary.
                            </b>
                          </p>
                        ),
                        onOkFunction: () => deleteAccount({ variables: {} }),
                      })
                    }
                  >
                    Delete Account
                  </button>
                  <span className="help-text">
                    All personal details will be deleted and application will
                    reset to default settings. All your information will be lost
                    and this can't be undone. Some reference link will still be
                    there in few table necessary to run the business
                    application.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
