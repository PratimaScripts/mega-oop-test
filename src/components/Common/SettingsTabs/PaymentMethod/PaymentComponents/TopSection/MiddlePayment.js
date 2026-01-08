import React, { useContext, useEffect, useMemo, useState } from "react";
import showNotification from "config/Notification";
import TransferwiseLogo from "../../../CommonInfo/image/wise.svg";
import StripeLogo from "../../../CommonInfo/image/stripelogo.png";
import GocardlessLogo from "../../../CommonInfo/image/gocardless.png";
import { LoadingOutlined, EditFilled, EyeOutlined } from "@ant-design/icons";
import { Tooltip, notification } from "antd";
import { createStripeAccount, createStripeLogin } from "config/queries/stripe";
import {
  getAccessToken,
  getConnectionLink,
  checkCustomerVerified,
  disconnectGoCardLess,
} from "config/queries/gocardless";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import { useHistory, useLocation } from "react-router-dom";
import {
  GOCARDLESS_CONNECTED,
  UserDataContext,
} from "store/contexts/UserContext";
import ComingSoonWrapper from "components/Common/ComingSoonWrapper";

const MiddlePayment = (
  {
    setStates,
    paymentType,
    userRole,
    toggleSelection,
    showComplete,
    connectAccId,
    transferwise,
    linkLoading,
  },
  props
) => {
  const history = useHistory();
  const location = useLocation();

  const { state, dispatch } = useContext(UserDataContext);

  const [isConnected, setConnected] = useState(false);

  const openNotificationWithIcon = (type, title, msg) => {
    notification[type]({
      message: title,
      description: msg,
    });
  };

  // GraphQL for creating link
  const [createHandleAccountLinks] = useMutation(createStripeAccount);

  const [getGoCardLessConnectionLink, { loading: gettingConnectionLink }] =
    useLazyQuery(getConnectionLink, {
      onCompleted: (data) => {
        if (data?.connectionLink?.success) {
          dispatch({ type: "CALLED_API", payload: false });
          if (data.connectionLink?.data?.authorization_url)
            window.open(data.connectionLink.data.authorization_url);
        } else {
          showNotification("error", data.connectionLink.message);
        }
      },
    });

  const [disconnectGoCardLessAccount] = useMutation(disconnectGoCardLess, {
    onCompleted: (data) => {
      if (data.disconnectGoCardLess?.success) {
        setConnected(false);
      } else {
        showNotification("error", data.disconnectGoCardLess.message);
      }
    },
  });

  const handleGoCardLessConnection = () => {
    if (isConnected) {
      disconnectGoCardLessAccount();
    } else {
      getGoCardLessConnectionLink();
    }
  };

  const handleAccountLinks = async () => {
    setStates(true, "linkLoading");
    try {
      const res = await createHandleAccountLinks();
      if (res?.data?.createStripeAccount) {
        window.open(res.data?.createStripeAccount);
      } else {
        openNotificationWithIcon(
          "error",
          "An error occurred!",
          "Unable to generate a link, Please try again."
        );
      }
      setStates(false, "linkLoading");
    } catch (error) {
      // console.log(error);
      setStates(false, "linkLoading");
      openNotificationWithIcon(
        "error",
        "An error occurred!",
        "Please refresh your browser and try again."
      );
    }
  };
  // Create Link
  const creatAccLink = async () => {
    try {
      const res = await creatAccLinkQL();
      if (res.data?.createStripeLogin?.status === "link") {
        window.open(res.data?.createStripeLogin?.link);
      }
      if (res.data?.createStripeLogin?.status === "onboard") {
        window.open(res.data?.createStripeLogin?.link);
      }
    } catch (error) {
      showNotification(
        "error",
        "An error occurred!",
        "Stripe login failed, please refresh your browser and try again."
      );
    }
  };
  const [creatAccLinkQL] = useMutation(createStripeLogin);

  const [setGOCardLessToken] = useMutation(getAccessToken);

  useQuery(checkCustomerVerified, {
    onCompleted: (data) => setConnected(data?.checkCustomerVerified?.verified),
  });

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const goCardlessCode = params.get("code");

  useEffect(() => {
    (async () => {
      if (goCardlessCode !== null) {
        if (!state.calledAPI) {
          dispatch({ type: "CALLED_API", payload: true });
          await setGOCardLessToken({
            variables: {
              code: goCardlessCode,
            },
          }).then(({ data }) => {
            let { getAccessToken } = data;
            if (getAccessToken.success) {
              dispatch({ type: GOCARDLESS_CONNECTED, payload: true });
              showNotification(
                "success",
                "Your GoCardless account has been connected with ROC."
              );
              // remove the code from the url
              params.delete("code");
              history.replace({
                search: params.toString(),
              });
              setConnected(true);
            } else {
              showNotification(
                "error",
                "An error occurred!",
                getAccessToken.message || "Something went wrong!"
              );
            }
          });
        }
      }
    })();
  }, [
    params,
    history,
    location,
    dispatch,
    goCardlessCode,
    state.calledAPI,
    setGOCardLessToken,
  ]);

  return (
    <>
      <div className="col-md-12">
        {userRole === "servicepro" && (
          <div
            style={{
              cursor:
                paymentType === "manual" && transferwise
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <div
              id="automatic"
              className={`radioBx ${
                paymentType === "automatic" ? "active" : ""
              }`}
              onClick={(e) => {
                toggleSelection(e);
              }}
            >
              <span> Automatic </span> <img src={StripeLogo} alt="stripe" />
            </div>
          </div>
        )}

        {/* landlord gocardless tab - Manual */}
        {userRole === "landlord" && (
          <>
            <div className="mt-4" />
            <div
              id="automatic"
              className={`radioBx ${
                paymentType === "automatic" ? "active" : ""
              }`}
              onClick={(e) => toggleSelection(e)}
            >
              <span> Automatic </span>{" "}
              <img src={GocardlessLogo} alt="gocardless" />
            </div>
          </>
        )}

        {/* servicepro trasferwise tab - Automatic */}
        {userRole === "servicepro" && (
          <div
            style={{
              cursor:
                paymentType === "automatic" && connectAccId
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <div
              id="manual"
              className={`radioBx ${paymentType === "manual" ? "active" : ""}`}
              onClick={(e) => {
                toggleSelection(e);
              }}
            >
              <span>Manual</span>
              <img className="wiseImg" src={TransferwiseLogo} alt="" />
            </div>
          </div>
        )}

        {/* landlord trasferwise tab - Manual */}
        {userRole === "landlord" && (
          <div
            id="manual"
            className={`radioBx ${paymentType === "manual" ? "active" : ""}`}
            onClick={(e) => toggleSelection(e)}
          >
            <span> Manual </span>

            {/* <img src={TransferwiseLogo} alt /> */}
          </div>
        )}
      </div>
      <div className="col-md-12"></div>

      {paymentType === "automatic" && (
        <div className={"card m-5"}>
          <div className="card-body">
            <div className="row pay_sec">
              <div className="col-12">
                <div className="pay_sec_inner">
                  {/* servicepro stripe connect div */}
                  {userRole === "servicepro" && (
                    <>
                      <div className="connectedTickDiv">
                        <div style={{ width: "100%" }}>
                          <span className="stripeTitle">Stripe </span> &nbsp;
                          {!showComplete && connectAccId && (
                            <Tooltip
                              placement="bottom"
                              title="Stripe Connect Account Onboarding process is incomplete. You will not be able to make any offers against tasks until you complete the account onboarding process."
                            >
                              <span className="connectedTagsIncomplete">
                                Incomplete
                              </span>
                            </Tooltip>
                          )}
                          {showComplete && (
                            <Tooltip
                              placement="bottom"
                              title="Stripe Connect Account Onboarding process is Complete. You are now able to make offers against tasks."
                            >
                              <span className="connectedTagsComplete">
                                Complete
                              </span>
                            </Tooltip>
                          )}
                        </div>

                        {paymentType === "automatic" &&
                          !showComplete &&
                          connectAccId && (
                            <Tooltip
                              placement="bottom"
                              title="Complete Stripe Connect Onboarding process to activate your accout."
                            >
                              <span>
                                <EditFilled
                                  className="connectEditTick"
                                  onClick={() => creatAccLink()}
                                />
                              </span>
                            </Tooltip>
                          )}

                        {paymentType === "automatic" && showComplete && (
                          <Tooltip
                            placement="bottom"
                            title="View your Stripe Connected Account."
                          >
                            <span>
                              <EyeOutlined
                                className="connectEditTick"
                                onClick={() => creatAccLink()}
                              />
                            </span>
                          </Tooltip>
                        )}
                      </div>

                      <p className="card-text">
                        Get paid 2x faster with online automated payments via
                        Stripe Connect gateway. Once you're connected
                        successfully, you will not be able revert back the
                        settings to manual payout. Reach out to our support team
                        for any change requests.
                        <span>
                          <br />
                          <br />
                          {paymentType !== "automatic" && (
                            <span
                              style={{
                                color: "red",
                                fontStyle: "italic",
                              }}
                            >
                              (Do not refresh or stop the account creation
                              process halfway through after clicking the Connect
                              button below)
                            </span>
                          )}
                        </span>
                      </p>
                      <button
                        className="btn btn-primary"
                        disabled={
                          paymentType === "automatic" && connectAccId
                            ? true
                            : false
                        }
                        type="button"
                        onClick={() => {
                          handleAccountLinks();
                        }}
                      >
                        {linkLoading && (
                          <LoadingOutlined
                            style={{
                              fontSize: "20px",
                              color: "white",
                            }}
                          />
                        )}
                        &nbsp;
                        {connectAccId ? "Connected to Stripe" : "Connect"}
                      </button>
                    </>
                  )}

                  {/* landlord gocardless div */}
                  {userRole === "landlord" && (
                    <ComingSoonWrapper>
                      <h5 className="card-title">GoCardless</h5>
                      <p className="card-text">
                        Set up in minutes and collect monthly Rental payments by
                        Direct Debit straight to your account. It’s perfect for
                        regular or ad-hoc payments. T&C applies for GoCardless
                        fee under the subscription plan.
                      </p>
                      <button
                        disabled={
                          gettingConnectionLink ||
                          isConnected ||
                          state.isGoCardlessConnected
                        }
                        onClick={handleGoCardLessConnection}
                        className={`btn btn-primary ${
                          isConnected && "disableBtn"
                        }`}
                      >
                        {isConnected || state.isGoCardlessConnected
                          ? "Disconnect"
                          : "Connect"}
                      </button>
                    </ComingSoonWrapper>
                  )}
                </div>
              </div>
              <div className="col-4"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MiddlePayment;
