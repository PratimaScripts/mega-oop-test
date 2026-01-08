import React, { useContext, useMemo } from "react";
import { Tag } from "antd";
import { Route, useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { UserDataContext } from "store/contexts/UserContext";
import DashboardLayout from "components/layout/DashboardLayout";
import { withApollo } from "react-apollo";
import { get } from "lodash";
import showNotification from "config/Notification";

import LoadingToRedirect from "components/loaders/LoadingToRedirect";

/* This component adds dashboard sidebar and header and other required 
 compoents for dashboard to the children component
 Also checks if user is authenticated or not */
const PrivateDashboardRoute = ({ accessRole, children, ...rest }) => {
  const history = useHistory();
  const { state } = useContext(UserDataContext);
  const { isAuthenticated = false, userData } = state;
  const location = useLocation();
  const search = location.search;
  let time = 5;

  const query = new URLSearchParams(search);

  const nextUrl = query.get("next"); // next is urls to redirect, it can be any url
  const relativePath = query.get("relpath"); // relative path is path without role

  const currentRole = userData.role;
  const emailVerified = get(userData, "isEmailVerified", false);

  const verifiedStatus =
    userData?.verifiedStatus &&
    get(userData, "verifiedStatus", "Not Verified") !== "Not Verified";

  const isSameRole = accessRole === "all" || accessRole === currentRole;

  let accessCondition =
    isAuthenticated &&
    isSameRole &&
    (currentRole !== "admin" ? emailVerified && verifiedStatus : true);

  const currentPath = rest.path ? rest.path : "/";
  let path = "/";
  let messageToDisplay = <></>;

  if (!isAuthenticated) {
    path = "/login" + history.location.search;
    messageToDisplay = (
      <>
        <p>
          You are <Tag color="red">Not Authorised</Tag> to see this page
        </p>
        <p>You must login first to continue</p>
      </>
    );
  } else if (!emailVerified) {
    path = `/confirm/${userData.email}/` + history.location.search;
    messageToDisplay = (
      <>
        <p>
          Your <Tag color="red">Email Is Not Verified!</Tag>
        </p>
        <p>You must verify your email first on next page to continue</p>
      </>
    );
  } else if (!isSameRole) {
    path = `/${currentRole}` + history.location.search;
    messageToDisplay = (
      <>
        <p>
          You are trying to access page for <Tag color="red">{accessRole}</Tag>
        </p>
        <p>
          But your current role is <Tag color="green">{userData.role}</Tag>
        </p>
        <p>Change your role first</p>
      </>
    );
  } else if (!verifiedStatus) {
    path =
      (userData?.loginMethod === "password"
        ? "/onboarding"
        : "/social/onboarding") + history.location.search;

    messageToDisplay = (
      <>
        <p>
          You <Tag color="red">Haven't Completed The Onboarding</Tag>
        </p>
        <p>Complete your onboarding first on next page to continue</p>
      </>
    );
  } else {
    try {
      if (nextUrl) {
        const url = new URL(nextUrl);
        if (url && url.origin !== window.location.origin) {
          // window.location.assign(url)
          accessCondition = false;
          path = url;
        }
      } else if (relativePath) {
        // history.push(`${currentRole}/${relativePath}`)
        accessCondition = false;
        path = `/${currentRole}/${relativePath}`;
        time = 0;
      }
    } catch (e) {
      path = path + history.location.search;
    }
    currentPath === "/servicepro/fixit/raisetask" &&
      showNotification(
        "info",
        "You need to change role to landlord/renter to post  the maintenance task",
        ""
      );
  }

  const renderContent = useMemo(() => {
    return (
      <Route
        {...rest}
        children={
          <DashboardLayout>
            {{ ...children, props: { ...children.props, ...rest, userData } }}
          </DashboardLayout>
        }
      />
    );
  }, [children, rest, userData]);

  return accessCondition ? (
    renderContent
  ) : (
    <LoadingToRedirect
      path={path}
      messageToDisplay={messageToDisplay}
      time={time}
    />
  );
};

export default React.memo(withApollo(PrivateDashboardRoute));
