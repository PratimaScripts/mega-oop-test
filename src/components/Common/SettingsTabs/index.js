/* eslint-disable array-callback-return */

import React, { useState, useContext, Suspense } from "react";
import { Drawer, Popover } from "antd";
import { useQuery } from "@apollo/react-hooks";

// import get from "lodash/get";
import Img from "react-image";

import { UserDataContext } from "store/contexts/UserContext";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import CardData from "../Card";
import ProfileCompleteness from "./ProfileCompleteness";
import AccountQueries from "config/queries/account";

import { withRouter } from "react-router-dom";
import SettingsSidebar from "components/layout/sidebars/SettingsSidebar";
import "./style.scss";
import AppLoader from "components/loaders/AppLoader";

// const SettingRoutes = lazy(() => import("routes/SettingRoutes"))

const NoLeftDivAr = [
  "accountsetting",
  // "security",
  "privacy",
  "notifications",
  "subscriptions",
  "chartOfAccount",
  "userRole",
];

const Settings = (props) => {
  const { match } = props;
  const { state: userState } = useContext(UserDataContext);
  const { state: interfaceState } = useContext(InterfaceContext);
  const accountSetting = userState.accountSetting;
  const currentUserRole = userState.userData.role;
  const { sidebarCollapsed } = interfaceState;
  const [qrCode, setQrCode] = useState({});

  const pathname = window.location.pathname.split(
    `/${currentUserRole}/settings/`
  )[1];
  const [showProfileCompletenessModal, setProfileCompletenessModal] =
    useState(false);

  useQuery(AccountQueries.fetchMFAQrCode, {
    onCompleted: ({ getQRCode }) => {
      // console.log(getQRCode)
      if (getQRCode.success) {
        setQrCode(getQRCode.data.qrcode);
      }
    },
  });

  let sidebarClass = NoLeftDivAr.includes(pathname)
    ? "profile__details--left fullwidth "
    : "profile__details--left ";
  // sidebarClass = pathname.includes("security") && "fullwidth";
  sidebarClass += !sidebarCollapsed ? " roc__desktop--responsive" : "";

  return (
    <>
      <Drawer
        title="Profile Completeness"
        placement={"right"}
        closable={true}
        width={"70%"}
        onClose={() =>
          setProfileCompletenessModal(!showProfileCompletenessModal)
        }
        visible={showProfileCompletenessModal}
      >
        <ProfileCompleteness />
      </Drawer>

      {/* Profile Compleness Modal End */}
      <SettingsSidebar
        pathname={pathname}
        match={match}
        currentUserRole={currentUserRole}
      />

      <div className="profile__menu--details">
        <div className={sidebarClass}>
          <Suspense fallback={<AppLoader />}>{props.children}</Suspense>
        </div>

        {!NoLeftDivAr.includes(pathname) && (
          <div className="profile__details--right">
            {window.location.pathname.includes("security") ? (
              <div className="blue__box">
                <div className="text-center mb-3">
                  <div className="col-12 verify_img">
                    <Img
                      src={[
                        "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/img-2-step-auth.webp",
                        "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/img-2-step-auth.png",
                      ]}
                      alt="img"
                    />
                  </div>
                </div>
                <div className="lr__gap">
                  <div className="row mb-1">
                    <div className="col-12">
                      <h4>Protect your account with 2-Step Verification</h4>
                      <p>
                        Each time you sign in to your account, you'll need your
                        password and a verification code.
                        <a
                          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en_IN"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more...
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col-md-3">
                      <Img
                        className="steps__img"
                        src={[
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/auth1.webp",
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/auth1.png",
                        ]}
                        alt="img"
                      />
                    </div>
                    <div className="col-md-9">
                      <p>
                        <strong>Step 1:</strong> Download Google Authenticator
                        App from app-store,{" "}
                      </p>
                      <p>
                        <strong>Step 2:</strong> Scan bar code and Step 3: enter
                        verification code.
                      </p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <Img
                        className="steps__img"
                        src={[
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/auth2.webp",
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/auth2.png",
                        ]}
                        alt="img"
                      />
                    </div>
                    <div className="col-md-9">
                      <p>
                        After enabling, each time you login to your account, you
                        will need to enter password along with code generated by
                        this app.
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 text-center">
                      <Popover
                        content={
                          <img
                            src={qrCode && qrCode}
                            alt="Authenticator QR Code"
                          />
                        }
                        title="Please Scan the Following Image with the Authenticator App"
                        trigger="hover"
                      >
                        <button className="btn btn-block btn-warning btns__warning w-100 p-2 m-auto">
                          Get Started
                        </button>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <CardData
                // contextData={context}
                accountSetting={accountSetting}
                showProfileCompletenessModal={() =>
                  setProfileCompletenessModal(true)
                }
                currentUserData={userState.userData}
                {...props}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default withRouter(Settings);
