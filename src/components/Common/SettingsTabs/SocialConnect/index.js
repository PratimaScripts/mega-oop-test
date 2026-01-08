import showNotification from "config/Notification";
import AccountQueries from "config/queries/account";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { withRouter } from 'react-router-dom';
import { UserDataContext } from "store/contexts/UserContext";
import "./style.scss";

const Connect = withRouter((props) => {
  const { state: userState, dispatch: userDispatch } =
    useContext(UserDataContext);
  const [refresh, setRefresh] = useState(false);
  useQuery(
    AccountQueries.fetchConnectProfile,
    {
      fetchPolicy: "network-only",
      onCompleted: ({ getConnectInformation }) => {
        if (getConnectInformation.success) {
          userDispatch({ type: "UPDATE_CONNECT_DETAILS", payload: getConnectInformation.data })
          userDispatch({ type: "UPDATE_ADDRESS", payload: getConnectInformation.data });
        }
      }
    }
  );

  const [disConnectSocialAccount] = useMutation(
    AccountQueries.disConnectSocialAccount,
    {
      onCompleted: ({ disConnectSocialAccount }) => {
        if (disConnectSocialAccount.success) {
          showNotification(
            "success",
            "Details Saved!",
            "Details Saved successfully!"
          );
          const connectInformation = get(disConnectSocialAccount, "data");
          userDispatch({
            type: "UPDATE_CONNECT_DETAILS",
            payload: connectInformation,
          });
          userDispatch({ type: "UPDATE_ADDRESS", payload: connectInformation });
        } else {
          showNotification(
            "error",
            "An error occured",
            disConnectSocialAccount.message
          );
        }
      },
    }
  );
  const handleDisconnectAc = (accountId) => disConnectSocialAccount({ variables: { accountId } })
  const onFocus = () => {
    refresh && window.location.reload()
  };

  useEffect(() => {
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  });
  const socialConnectList = [
    { name: "facebook", account: userState.profileInfo.ProfileConnect.facebookLink, caption: "Facebook", icon: "fa fa fa-facebook-f facebook__icon" },
    { name: "linkedIn", account: userState.profileInfo.ProfileConnect.linkedInLink, caption: "LinkedIn", icon: "fa fa-linkedin-in linkedin__icon" },
    { name: "google", account: userState.profileInfo.ProfileConnect.googleLink, caption: "Google", icon: "fa fa-google google__icon" },
    // { name: "telegram", account: userState.profileInfo.ProfileConnect.telegramLink, caption: "Telegram", icon: "fab fa-telegram-plane telegram__icon", disabled: true },
  ]
  return (
    <>
      <div className="connect_page">
        <div className="container">
          <div className="main_header">
            <h3 className="mt-4 mb-4 text-center">
              Connect your Social profile to build your online social
              reputation.
            </h3>
          </div>
          <div className="row">
            {socialConnectList.map((acc, idx) => <div key={acc.name + idx} className="col-md-6">
              <div className="notify_settings d-flex flex__middle">
                <i className={acc.icon}></i>
                <div className="details">
                  <h4>
                    Connect with {acc.caption} {!isEmpty(acc.account) && (
                      <i
                        className="fa fa-check-circle"
                        aria-hidden="true"
                      ></i>
                    )}
                  </h4>
                  <div className="btns">
                    {isEmpty(acc.account)
                      ? <span
                        onClick={() => {
                          setRefresh(true);
                          window.open(
                            `${process.env.REACT_APP_SERVER}/connect/${acc.name}?next=${props.location?.pathname}&email=${userState.userData?.email}`,
                            "_blank",
                            "width=600,height=600, top=200, left=450"
                          );
                        }}>
                        <input
                          type="button"
                          className={`btn ${acc?.disabled ? 'btn-gray' : 'btn-primary'}`}
                          value={"Connect"}
                          disabled={acc?.disabled}
                        />
                      </span>
                      : <input
                        onClick={() => handleDisconnectAc(acc.account._id)}
                        type="button"
                        className="btn btn-danger"
                        value="Disconnect" />}
                  </div>
                </div>
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </>
  );
});

export default Connect;
