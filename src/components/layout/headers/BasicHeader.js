import React, { useContext } from "react";
import { Link } from "react-router-dom";
// import cookie from "react-cookies";
import { Layout, Menu, Dropdown, Select, Image } from "antd";
import get from "lodash/get";
import { useHistory } from "react-router";
import NProgress from "nprogress";
import Img from "react-image";
import { useLocation } from 'react-router-dom';
import filter from "lodash/filter";

import "../../Private/Landlord/style.scss";
import { UserDataContext } from "store/contexts/UserContext";
import { useLazyQuery } from "react-apollo";
import AccountQueries from "config/queries/account";
import showNotification from "config/Notification";
import socket from "SocketIO";
import { saveTokenInCookie, removeTokenFromCookie } from "utils/cookie";
import LandlordRoutes from "routes/LandlordRoutes";
import RenterRoutes from "routes/RenterRoutes";
import ServiceProRoutes from "routes/ServiceProRoutes";
import SettingRoutes from "routes/SettingRoutes";
import { setLockScreenState } from "utils/storage";
const { Header } = Layout;

const BasicHeader = ({ allowRoleChange = true }) => {
  const history = useHistory(0);
  const { state: userState, dispatch: userDispatch } =
    useContext(UserDataContext);
  const { userData, isAuthenticated = false } = userState;
  const userRole = userData.role;
  const { Option } = Select;

  //, search
  const { pathname } = useLocation();
  // const query = new URLSearchParams(search);
  // const role = query.get('role');

  const [changeUserRoleQuery] = useLazyQuery(AccountQueries.changeRole, {
    onCompleted: ({ changeRole }) => {
      if (get(changeRole, "success", false) && changeRole.data?.role) {
        const newRole = changeRole.data.role;
        // console.log("role", changeRole.data.role)
        removeTokenFromCookie();

        // cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(changeRole, "token"), {
        //   path: "/", domain: ENV_TYPE === "development" ? "localhost" : "rentoncloud.com"
        // });
        saveTokenInCookie(get(changeRole, "token", ""));
        localStorage.setItem("currentRole", newRole);
        userDispatch({ type: "SET_USER_DATA", payload: changeRole });

        let newRoleUrl = pathname.replace(userRole, newRole);

        if (newRoleUrl.charAt(-1) === "/") {
          newRoleUrl = newRoleUrl.substring(0, -2);
        }

        if (
          newRole === "landlord" &&
          filter(LandlordRoutes(), { path: newRoleUrl }).length > 0
        ) {
          history.push(`${newRoleUrl}`);
        } else if (
          newRole === "servicepro" &&
          filter(ServiceProRoutes(), { path: newRoleUrl }).length > 0
        ) {
          history.push(`${newRoleUrl}`);
        } else if (
          newRole === "renter" &&
          filter(RenterRoutes(), { path: newRoleUrl }).length > 0
        ) {
          history.push(`${newRoleUrl}`);
        } else if (
          filter(SettingRoutes(newRole), { path: newRoleUrl }).length > 0
        ) {
          history.push(`${newRoleUrl}`);
        } else {
          history.push(`/${newRole}`);
        }
      } else {
        showNotification("error", "Failed To change role", "Please Try Again!");
      }
    },
  });

  // if(role && role !== userData.role) {
  //   changeUserRoleQuery({variables: {role}})
  // }

  const menu = (
    <Menu className="shift__dropdown">
      <Menu.Item
        key="2"
        onClick={() => {
          socket.emit("LOGOUT_USER", {
            userId: userData._id,
            role: userData.role,
          });

          localStorage.removeItem("isLoggedOut");

          // cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
          removeTokenFromCookie();
          setLockScreenState({ isLock: false });
          userDispatch({ type: "LOGOUT" });
          window.location = "/";
        }}
      >
        <span>
          <i className="fa fa-unlock mr-2" />
          Logout
        </span>
      </Menu.Item>
    </Menu>
  );

  let roles = [
    { title: "Service Pro", value: "servicepro" },
    { title: "Landlord", value: "landlord" },
    { title: "Renter", value: "renter" },
  ];

  roles = roles.filter((e) => e.value !== userRole);

  return (
    <Header className="main__topbar">
      <a href={`${process.env.REACT_APP_PUBLIC_URL}`}>
        <Img
          src={[`${process.env.REACT_APP_ROC_PUBLIC}/images/logo.svg`]}
          alt=""
          className="header__logo"
        />
      </a>
      {isAuthenticated && (
        <>
          <Dropdown overlay={menu} trigger={["click"]}>
            <span className="mobile__toggle--icon">
              <Image
                preview={{ visible: false, mask: undefined }}
                alt={`${userData.firstName}'s profile pic`}
                className="profile__thumb prof_mob"
                src={
                  userData.avatar
                    ? userData.avatar
                    : "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                }
              />
            </span>
          </Dropdown>
          <div className="mobile__toggle--menu">
            <div className="lising__profile">
              <Dropdown overlay={menu} trigger={["click"]}>
                <div className="nav-a user-menu-a">
                  <Image
                    preview={{ visible: false, mask: undefined }}
                    alt={`${userData.firstName}'s profile pic`}
                    className="profile__thumb prof_mob"
                    src={
                      userData.avatar && userData.avatar.includes("http")
                        ? userData.avatar
                        : "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                    }
                  />
                  <span className="profile-text">
                    Hi!,{" "}
                    <span className="profile__name">
                      <Link to={`/${userRole}/settings/info`}>
                        {userData.firstName}
                      </Link>
                    </span>
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>

          <ul className="navbar-nav ml-auto hide__mobile">
            <li>
              <Select
                disabled={!allowRoleChange}
                defaultValue={
                  userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
                }
                style={{ width: 120 }}
                onChange={(value) => {
                  NProgress.start();
                  changeUserRoleQuery({ variables: { role: value } });
                }}
              >
                <Option disabled={true} value="default">
                  Switch Role
                </Option>
                {roles.map((r, i) => {
                  return (
                    <Option key={i} value={r.value}>
                      {r.title}
                    </Option>
                  );
                })}
              </Select>
            </li>

            <li className="nav-item dropdown user-menu">
              <Link to="" className="nav-a user-menu-a">
                <span className="profile-text">
                  Hi!,{" "}
                  <span className="profile__name">{userData.firstName}</span>
                </span>

                <Dropdown overlay={menu} trigger={["click"]}>
                  <img
                    alt={`${userData.firstName}'s profile pic`}
                    className="profile__thumb prof_mob"
                    src={
                      userData.avatar && userData.avatar.includes("http")
                        ? userData.avatar
                        : "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                    }
                  />
                </Dropdown>
              </Link>
            </li>
          </ul>
        </>
      )}
    </Header>
  );
};

export default BasicHeader;
