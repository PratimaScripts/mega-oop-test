import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";

import FormQuery from "config/queries/account";
import get from "lodash/get";
import { Switch } from "antd";
import showNotification from "config/Notification";
// import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLazyQuery, useMutation, withApollo } from "react-apollo";
import "./index.scss";
import { UserDataContext } from "store/contexts/UserContext"

const Security = (props) => {
  const { state: userState } = useContext(UserDataContext)
  const { userData } = userState
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [isMfa, setMfaStatus] = useState(
    get(userData, "isMFA", false)
  );

  const [updateMFA] = useLazyQuery(FormQuery.updateMfa, {
    onCompleted: ({ updateMFA }) => {
      if (updateMFA.success) {
        showNotification(
          "success",
          "MFA Settings updated!",
          "Updated successfully"
        );
        setMfaStatus(updateMFA.data)
      } else {
        showNotification(
          "error",
          "An error occured!",
          updateMFA.message
        );
      }
    }
  })

  const resetPassword = (data) => {
    // console.log(data)
    resetPasswordMutation({ variables: data })
  }

  const [resetPasswordMutation] = useMutation(FormQuery.resetPassword, {
    onCompleted: ({ changePassword }) => {
      if (changePassword.success) {
        showNotification(
          "success",
          "Password updated!",
          "Your password has been reset successfully!"
        );
      } else {
        showNotification(
          "error",
          "An Error Occured",
          changePassword.message
        );
      }
    }
  })
  return (
    <div className="security_setting">
      <div className="">
        <div className="row">
          <div className="col-xl-12">
            <div className="box box-form-wrapper">
              <form onSubmit={handleSubmit(resetPassword)}>
                <div className="form-group">
                  <label className="labels__global">
                    Current Password
                        </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-unlock"></i>
                      </div>
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control"
                      autoComplete="new-password"
                      {...register("currentPassword", { required: true })}
                    />
                    {errors.currentPassword && <span role="alert" style={{ color: "red" }} >This field is required</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="labels__global">
                    Enter New Password
                        </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-lock"></i>
                      </div>
                    </div>

                    <input
                      type="password"
                      name="newPassword"
                      className="form-control"
                      {...register("newPassword", { required: true })}
                    />
                  </div>
                  {errors.newPassword && <span role="alert" style={{ color: "red" }} >This field is required</span>}
                </div>

                <div className="form-group">
                  <label className="labels__global">
                    Confirm New Password
                        </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fa fa-key"></i>
                      </div>
                    </div>

                    <input
                      type="password"
                      name="newPasswordConfirm"
                      className="form-control"
                      {...register("newPasswordConfirm", { required: true })}
                    />
                  </div>
                  {errors.newPasswordConfirm && <span role="alert" style={{ color: "red" }} >This field is required</span>}
                </div>
                <div className="form-group mb-30 p-2">
                  <div className="row">
                    <div className="text_protect justify-content-left align-self-center">
                      Protect your account with an extra layer of
                      security. You'll be required to enter both your
                      password and an authentication code to log in to
                      your account.
                          </div>
                    <div className="security__toggle__container">
                      <div className="form-group yes__no--toogle">
                        <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked={isMfa}
                          onChange={() => updateMFA({ variables: { isMFA: !isMfa } })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group text-right">
                  <button type="submit" className="btn btns__blue ">
                    Save
                        </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withApollo(Security);
