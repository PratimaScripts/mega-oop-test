import React, { useContext } from "react";
import isEmpty from "lodash/isEmpty";
import isNaN from "lodash/isNaN";
import get from "lodash/get";
import Img from "react-image";
import { Progress } from "antd";
import moment from "moment";
import RenterCard from "./RenterCard";
import CardOther from "./LandlordCard";
import { Tooltip } from "antd";
import "./Card.scss";
import { UserDataContext } from "store/contexts/UserContext";
import { useLazyQuery } from "react-apollo";
import UserQuery from "../../../config/queries/login";
import { useEffect } from "react";

const Card = (props) => {
  const { state: userState, dispatch } = useContext(UserDataContext);
  const { userData, accountSetting, profileCompletenessData } = userState;

  const [fetchUserData] = useLazyQuery(UserQuery.checkAuth, {
    onCompleted: ({ authentication }) => {
      if (authentication.success) {
        dispatch({ type: "SET_USER_DATA", payload: authentication });
      }
    },
    onError: (error) => {
      dispatch({ type: "SET_LOADING", payload: false });
    },
  });

  useEffect(() => {
    if (!userData.address) {
      fetchUserData();
    }

    //eslint-disable-next-line
  }, [userData.address]);

  const ProfileCompletenessData = {};

  const calculateColor = (value) => {
    if (value < 30) {
      return "#f5222d";
    } else if (value >= 30 && value < 70) {
      return "#fadb14";
    } else if (value >= 70 && value < 100) {
      return "#389e0d";
    }
  };
  const { lastScreeningData } = userData;

  const { selfDeclaration, profileChecks } = profileCompletenessData;

  const currentRole = get(userData, "role");

  const dateFormat =
    accountSetting && accountSetting["dateFormat"]
      ? accountSetting["dateFormat"]
      : process.env.REACT_APP_DATE_FORMAT;

  return (
    <>
      <div className="active-connect-tab">
        <div className="top_panel">
          <div className="card-body text-center">
            <div className="profile_avator">
              <Img
                src={[
                  userData &&
                  userData.avatar &&
                  userData.avatar.includes("http")
                    ? userData.avatar
                    : "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/avatar.webp",
                  userData &&
                  userData.avatar &&
                  userData.avatar.includes("http")
                    ? userData.avatar
                    : "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg",
                ]}
                alt="img"
              />
              {get(profileCompletenessData, "screeningStatus", false) && (
                <div className="status">
                  <i className="fas fa-check"></i>
                </div>
              )}
            </div>
            <div className="name">
              <>
                {get(userData, "firstName")}{" "}
                {get(userData, "lastName") &&
                  get(userData, "lastName").charAt(0)}
                .
                {!isEmpty(userData, "facebookLink") &&
                get(userData, "facebookLink.email") ? (
                  <Tooltip title={get(userData, "facebookLink.email")}>
                    <a href>
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </Tooltip>
                ) : (
                  ""
                )}
                {!isEmpty(userData, "googleLink") &&
                get(userData, "googleLink.profileObj.email") ? (
                  <Tooltip title={get(userData, "googleLink.profileObj.email")}>
                    <a
                      href={`mailto:${get(
                        userData,
                        "googleLink.profileObj.email"
                      )}`}
                    >
                      <i className="fab fa-google"></i>
                    </a>
                  </Tooltip>
                ) : (
                  ""
                )}
                {isEmpty(userData, "telegramLink") && (
                  <Tooltip title={get(userData, "telegramLink.username")}>
                    <a href>
                      <i className="fab fa-telegram"></i>
                    </a>
                  </Tooltip>
                )}
                {/* {userData.linkedInLink && !isEmpty(userData, "linkedInLink") && (
                  <Tooltip title="prompt text">
                    <a href>
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </Tooltip>
                )} */}
              </>
            </div>
            <div className="address"></div>

            <div className="address">
              {!isNaN(moment().diff(get(userData, "dob"), "year")) &&
                `${moment().diff(get(userData, "dob"), "year")} ,`}
              {userData &&
                userData.address &&
                userData.address.city &&
                userData.address.country &&
                `${userData.address.city}, ${userData.address.country}`}
            </div>

            <div className="reference mb-4">
              <sup>
                <i className="fa fa-quote-left"></i>
              </sup>{" "}
              References <span>0</span>
            </div>
            <div
              className="profile-completeness"
              onClick={() => props.showProfileCompletenessModal()}
            >
              <Progress
                percent={ProfileCompletenessData.profileCompleteness}
                strokeColor={calculateColor(
                  ProfileCompletenessData.profileCompleteness
                )}
              />
            </div>
          </div>
        </div>
        {!isEmpty(profileCompletenessData) && (
          <div className="bottom_panel">
            {currentRole === "renter" ? (
              <RenterCard
                ProfileCompletenessData={profileCompletenessData}
                selfDeclaration={selfDeclaration}
                profileChecks={profileChecks}
              />
            ) : (
              <CardOther
                ProfileCompletenessData={profileCompletenessData}
                profileChecks={profileChecks}
              />
            )}
            <div className="short_foot" style={{ fontSize: "11px" }}>
              Last screen date{" "}
              {moment(
                lastScreeningData ? lastScreeningData : Date.now()
              ).format(dateFormat ? dateFormat : "DD-MM-YYYY")}
              , Powered by{" "}
              <Img
                src={[
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypass.webp",
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypass.png",
                ]}
                alt="img"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Card;
