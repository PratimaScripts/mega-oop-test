import React from "react";
import { Tooltip, Progress } from "antd";
import "./Card.scss";
import Img from "react-image";
import isEmpty from "lodash/isEmpty";
import RenterCard from "./RenterCard";
import CardOther from "./LandlordCard";

const Profile = (props) => {
  const calculateColor = (value) => {
    if (value < 30) {
      return "#f5222d";
    } else if (value >= 30 && value < 70) {
      return "#fadb14";
    } else if (value >= 70 && value < 100) {
      return "#389e0d";
    }
  };

  return (
    <div className="active-connect-tab">
      <div className="top_panel">
        <div className="card-body text-center">
          <div className="profile_avator">
            <Img
              alt="profile avatar"
              src={[
                props.avatar,
                "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/avatar.webp",
                "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg",
              ]}
            />
            {props.screeningStatus && (
              <div className="status">
                <i className="fas fa-check"></i>
              </div>
            )}
          </div>

          <div className="name">
            {props.name}
            {props?.facebookLink?.email && (
              <Tooltip title={props.facebookLink.email}>
                <a href>
                  <i className="fab fa-facebook-f" />
                </a>
              </Tooltip>
            )}
            {props?.googleLink?.profileObj?.email && (
              <Tooltip title={props.googleLink.profileObj.email}>
                <a href={`mailto:${props.googleLink.profileObj.email}`}>
                  <i className="fab fa-google" />
                </a>
              </Tooltip>
            )}
            {props?.telegramLink?.username && (
              <Tooltip title={props.telegramLink.username}>
                <a href>
                  <i className="fab fa-telegram" />
                </a>
              </Tooltip>
            )}
          </div>

          <div className="address">
            {props.dob && `${props.dob} ,`}
            {props.address}
          </div>

          <div className="reference">
            <sup>
              <i className="fa fa-quote-left mr-1"></i>
            </sup>
            References <span className="ml-1">0</span>
          </div>

          <div className="profile-completeness">
            <Progress
              percent={props.profileCompletenessData.profileCompleteness}
              strokeColor={calculateColor(
                props.profileCompletenessData.profileCompleteness
              )}
            />
          </div>
        </div>
      </div>
      {!isEmpty(props.profileCompletenessData) && (
        <div className="bottom_panel">
          {props.role === "renter" ? (
            <RenterCard
              ProfileCompletenessData={props.profileCompletenessData}
              selfDeclaration={props.profileCompletenessData.selfDeclaration}
              profileChecks={props.profileCompletenessData.profileChecks}
            />
          ) : (
            <CardOther
              ProfileCompletenessData={props.profileCompletenessData}
              profileChecks={props.profileCompletenessData.profileChecks}
            />
          )}
          <div className="short_foot" style={{ fontSize: "11px" }}>
            {props.lastScreeningDate &&
              `Last screen date ${props.lastScreeningDate}, `}
            Powered by{" "}
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
  );
};

export default Profile;
