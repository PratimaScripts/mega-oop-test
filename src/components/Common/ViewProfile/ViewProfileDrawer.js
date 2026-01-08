import { Drawer, Spin } from "antd";
import showNotification from "config/Notification";
import { fetchProfileCompleteness } from "config/queries/account";
import { getUserInformationById } from "config/queries/userRole";
import { get } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLazyQuery } from "react-apollo";
import Profile from "../Card/Profile";

const errorMessage = "Something went wrong!";

const ViewProfileDrawer = ({ visible, onClose }) => {
  const [profileData, setProfileData] = useState({
    dob: "",
    role: "",
    name: "",
    city: "",
    avatar: "",
    address: "",
    country: "",
    googleLink: {},
    facebookLink: {},
    telegramLink: {},
    screeningStatus: "",
    lastScreeningDate: "",
    profileCompletenessData: {
      selfDeclaration: {},
      profileCompleteness: 0,
      profileChecks: {},
    },
  });

  const [fetchUserInfoById, { loading: fetching }] = useLazyQuery(
    getUserInformationById,
    {
      onCompleted: (data) => {
        if (data.getUserInformationById.success) {
          let profile = data.getUserInformationById.data;

          setProfileData((prevState) => ({
            ...prevState,
            dob: get(profile, "dob", ""),
            role: visible.role,
            name: `${profile.firstName}${
              profile.lastName && " " + profile.lastName[0] + "."
            }`,
            address: `${profile.address.city || ""}${
              profile.address.country && ", " + profile.address.country
            }`,
            avatar: profile.avatar,
            lastScreeningDate: profile.lastScreeningDate || "",
            googleLink: profile.googleLink || {},
            facebookLink: profile.facebookLink || {},
            telegramLink: profile.telegramLink || {},
          }));
        } else {
          showNotification(
            "error",
            data.getUserInformationById?.message || errorMessage
          );
        }
      },
    }
  );

  const [getProfileCompleteness] = useLazyQuery(fetchProfileCompleteness, {
    onCompleted: (data) => {
      if (data.getProfileCompleteness.success) {
        setProfileData((prevState) => ({
          ...prevState,
          profileCompletenessData: {
            ...data.getProfileCompleteness.data,
            profileChecks: data.getProfileCompleteness.data.profile,
          },
        }));
      } else {
        showNotification(
          "error",
          data.getProfileCompleteness?.message || errorMessage
        );
      }
    },
  });

  useEffect(() => {
    if (Boolean(visible.userParam && visible.role)) {
      fetchUserInfoById({ variables: { ...visible } });
      getProfileCompleteness({
        variables: { userId: visible.userParam, role: visible.role },
      });
    }

    // eslint-disable-next-line
  }, [visible]);

  return (
    <Drawer
      title="View Profile"
      placement="right"
      visible={Boolean(visible.userParam && visible.role)}
      onClose={onClose}
      width={348}
      closable
    >
      {fetching ? (
        <div className="d-flex justify-content-center my-5">
          <Spin />
        </div>
      ) : (
        <Profile {...profileData} />
      )}
    </Drawer>
  );
};

export default ViewProfileDrawer;
