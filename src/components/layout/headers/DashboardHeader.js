import { SearchOutlined, TeamOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import {
  Badge,
  Button,
  Dropdown,
  Layout,
  Menu,
  notification,
  Popover,
  Select,
  Tooltip,
} from "antd";
import { gql } from "apollo-boost";
import showNotification from "config/Notification";
import AccountQueries from "config/queries/account";
import CommonQuery from "config/queries/login";
import filter from "lodash/filter";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import NProgress from "nprogress";
import React, { useContext, useRef, useState } from "react";
import { useLazyQuery } from "react-apollo";
import { Dropdown as BDropdown } from "react-bootstrap";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Img from "react-image";
import { useLocation } from "react-router";
import { Link, useHistory, withRouter } from "react-router-dom";
import LandlordRoutes from "routes/LandlordRoutes";
import RenterRoutes from "routes/RenterRoutes";
import ServiceProRoutes from "routes/ServiceProRoutes";
import SettingRoutes from "routes/SettingRoutes";
import socket from "SocketIO";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import { UPDATE_UI_DATA, UserDataContext } from "store/contexts/UserContext";
import { removeTokenFromCookie, saveTokenInCookie } from "utils/cookie";
import { setLockScreenState } from "utils/storage";
import ImpersonatingUserExist from "../../Common/Impersonator";
import "../../Private/Landlord/style.scss";

const { Header } = Layout;

const { Option } = Select;

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription getNotification($userId: String!) {
    getNotification(userId: $userId) {
      success
      userId
      message
      type
    }
  }
`;

export const UNREAD_MESSAGE_COUNT_SUBSCRIPTION = gql`
  subscription unreadMessageCount($userId: String!, $role: String!) {
    unreadMessageCount(userId: $userId, role: $role) {
      success
      message
      count
    }
  }
`;

const NOTIFICATION_READ = gql`
  mutation markNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId) {
      success
      message
      data {
        _id
        type
        role
        userId
        title
        markAsRead
        createdAt
      }
    }
  }
`;

const DashboardHeader = (props) => {
  const history = useHistory();

  //, search
  const { pathname } = useLocation();
  const sidebarToggleRef = useRef();
  const [notifCount, setNotifications] = useState([]);
  const { state: userState, dispatch: userDispatch } =
    useContext(UserDataContext);
  const { dispatch: interfaceDispatch, state: interfaceState } =
    useContext(InterfaceContext);
  const { userData, isImpersonate, impersonator, uiData } = userState;
  const currentRole = userData.role;
  const userRole = userData.role;
  // const roleToSet = useRef(userRole)
  const { sidebarCollapsed, sidebarClass } = interfaceState;

  const [unreadMessages, setUnreadMessages] = useState(0);

  // const query = new URLSearchParams(search);
  // const role = query.get('role');

  // const [changeRole] = useMutation(AccountQueries.changeRole, {
  //   onCompleted: ({ changeRole }) => {
  //     if (changeRole.success) {
  //       cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });

  //       cookie.save(process.env.REACT_APP_AUTH_TOKEN, changeRole.token, {
  //         path: "/"
  //       });
  //       localStorage.setItem("currentRole", roleToSet.current);

  //       window.location = `/${roleToSet.current}`;
  //     } else {
  //       message.error(changeRole.message);
  //     }
  //   }
  // });

  const [changeUserRoleQuery] = useLazyQuery(AccountQueries.changeRole, {
    onCompleted: ({ changeRole }) => {
      if (get(changeRole, "success", false) && changeRole.data?.role) {
        const newRole = changeRole.data.role;
        // console.log("role", changeRole.data.role);
        // cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
        removeTokenFromCookie();

        // cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(changeRole, "token"), {
        //   path: "/",
        // });
        saveTokenInCookie(get(changeRole, "token"));

        localStorage.setItem("currentRole", newRole);
        // console.log("Dispatched")
        userDispatch({ type: "SET_USER_DATA", payload: changeRole });
        let newRoleUrl = pathname.replace(currentRole, newRole);

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
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      // showNotification("error", "Failed To change role", "Please Try Again!");
    },
  });

  // if(role && role !== userData.role) {
  //   changeUserRoleQuery({variables: {role}})
  // }

  const toggleCollapsedMobile = (e) => {
    e.preventDefault();
    // let newClass = sidebarClass;
    if (sidebarClass.includes("mobileSidebarShow")) {
      // document.querySelector("body").setAttribute("style", "");
      interfaceDispatch({
        type: "UPDATE_SIDEBAR_CLASS",
        payload: sidebarClass.replace("mobileSidebarShow", ""),
      });
    } else {
      // document
      //   .querySelector("body")
      //   .setAttribute("style", "overflow: hidden; height: 100%");
      interfaceDispatch({
        type: "UPDATE_SIDEBAR_CLASS",
        payload: sidebarClass + " mobileSidebarShow",
      });
    }
  };

  useQuery(CommonQuery.getUnreadMessageCount, {
    onCompleted: (data) => {
      userDispatch({
        type: UPDATE_UI_DATA,
        payload: {
          key: "unreadMessageCount",
          data: get(data, "getUnreadMessageCount.count", 0),
        },
      });
      setUnreadMessages(get(data, "getUnreadMessageCount.count", 0));
    },
  });

  useQuery(CommonQuery.getNotifications, {
    onCompleted: (notifs) => {
      setNotifications(get(notifs, "getNotifications.data", []));
    },
  });

  useQuery(CommonQuery.getCalendarNotifications, {
    onCompleted: (notifications) => {
      userDispatch({
        type: UPDATE_UI_DATA,
        payload: {
          key: "calendarNotification",
          data: get(notifications, "getCalendarNotifications.count", 0),
        },
      });
    },
  });

  const [markNotificationAsRead] = useMutation(NOTIFICATION_READ, {
    onCompleted: (notifs) => {
      setNotifications(get(notifs, "makeAsReadNotification.data", []));
    },
  });

  const [isSearchActive, setSearchStatus] = useState(
    window.screen.width > 2048 ? true : false
  );

  // useEffect(() => {
  //   if(sidebarCollapsed && window.screen.width <= 768) {
  //     console.log("Sidebar Header", sidebarCollapsed)
  //     document.querySelector("body").setAttribute("style", "");
  //     interfaceDispatch({
  //       type: "UPDATE_SIDEBAR_CLASS",
  //       payload: sidebarClass.replace("mobileSidebarShow", "")
  //     })
  //   }
  // }, [sidebarCollapsed]);

  const newNotification = (data) => {
    let existingNotifications = notifCount;

    notification.success({
      message: get(data, "subscriptionData.data.getNotification.message"),
    });

    existingNotifications.push(
      get(data, "subscriptionData.data.getNotification.data")
    );

    setNotifications(existingNotifications);
  };

  useSubscription(NOTIFICATION_SUBSCRIPTION, {
    variables: {
      userId: localStorage.getItem("userId"),
    },
    shouldResubscribe: true,
    onSubscriptionData: newNotification,
  });

  useSubscription(UNREAD_MESSAGE_COUNT_SUBSCRIPTION, {
    variables: {
      userId: localStorage.getItem("userId"),
      role: userData.role,
    },
    shouldResubscribe: true,
    onSubscriptionData: (data) => {
      if (
        get(data, "subscriptionData.data.unreadMessageCount.success", false)
      ) {
        setUnreadMessages(
          get(data, "subscriptionData.data.unreadMessageCount.count", 0)
        );
      }
    },
  });

  //isSelectionActive,
  const [setSelectionActive] = useState(false);
  const [activeSearchType, setActiveSearchType] = useState("Rent");
  // const [searchText, setSearchText] = useState("");
  // let { userData, userDataMain, userRole } = props;

  // const searchData = (e) => {
  //   e.preventDefault();
  //   let searchTextI = e.target[0].value;

  //   if (activeSearchType === "Landlord" || activeSearchType === "ServicePro") {
  //     let idObj = {
  //       Landlord: "ld",
  //       Renter: "rnt",
  //       ServicePro: "spr",
  //     };

  //     setSearchText("");
  //     window.open(
  //       `${process.env.REACT_APP_ROC_PUBLIC}/user/${idObj[activeSearchType]}__${searchTextI}`,
  //       "_blank"
  //     );
  //   }

  //   if (activeSearchType === "Rent") {
  //     setSearchText("");

  //     window.open(
  //       `${process.env.REACT_APP_ROC_PUBLIC}/rent/${searchTextI}`,
  //       "_blank"
  //     );
  //   }
  // };

  const menu = (
    <Menu className="shift__dropdown">
      <Menu.Item key="0">
        <Link to={`/${userRole}/settings/info`}>
          <i className="fa fa-user mr-2" /> Profile
        </Link>
      </Menu.Item>
      {!isImpersonate ? (
        <Menu.Item key="1">
          <Link to={`/${userRole}/settings`}>
            <i className="fa fa-cog mr-2" /> Settings
          </Link>
        </Menu.Item>
      ) : (
        <React.Fragment />
      )}
      {isImpersonate || userData.invitedOn?.length ? (
        <Menu.Item key="2">
          <Link to={`/workspace`}>
            <i className="fa fa-users mr-2" /> Workspace
          </Link>
        </Menu.Item>
      ) : (
        <React.Fragment />
      )}
      <Menu.Item
        key="3"
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

  const notifications = (
    <div className="notify_home">
      <ul>
        {!isEmpty(notifCount) &&
          notifCount.length > 0 &&
          notifCount.map(
            (n, i) =>
              n && (
                <>
                  <li key={n._id} className="font-weight-bold">
                    {get(n, "title", "")}

                    <span className="right_section">
                      {get(n, "markAsRead", false) === "false" && (
                        <Tooltip
                          placement="topLeft"
                          title="Mark as Read"
                          color="#217BE0"
                        >
                          <i
                            onClick={() => {
                              markNotificationAsRead({
                                variables: {
                                  notificationId: n._id,
                                },
                              });
                            }}
                            className="far fa-eye"
                          />
                        </Tooltip>
                      )}
                      {/* <a href>
                      <i className="far red fa-trash-alt" />
                    </a> */}
                    </span>
                  </li>
                  <hr style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }} />
                </>
              )
          )}
      </ul>
      <Link to="" className="d-block view text-center mt-2">
        View All
      </Link>
    </div>
  );

  const searchBar = (
    <>
      <div className="search__listing">
        <ul>
          <li
            onClick={() => setActiveSearchType("Rent")}
            className={activeSearchType === "Rent" && "active__tab"}
          >
            Rent
          </li>
          <li
            onClick={() => setActiveSearchType("Task")}
            className={activeSearchType === "Task" && "active__tab"}
          >
            Task
          </li>
          {/* <li
            onClick={() => setActiveSearchType("Landlord")}
            className={activeSearchType === "Landlord" && "active__tab"}
          >
            Landlord
          </li> */}
          <li
            onClick={() => setActiveSearchType("ServicePro")}
            className={activeSearchType === "ServicePro" && "active__tab"}
          >
            ServicePro
          </li>
        </ul>
        <span
          onClick={() => {
            setSelectionActive(false);
            setSearchStatus(false);
          }}
          className="search__listing--closer"
        >
          <i className="fa fa-times"></i>
        </span>
      </div>
    </>
  );

  const onVisibleChange = (data) => {
    setSearchStatus(data);
    setSelectionActive(data);
  };

  let classesToAdd = !isSearchActive
    ? "search__wrapper hide__mobile"
    : "search__wrapper hide__mobile  search_inc ";

  classesToAdd = !sidebarCollapsed
    ? classesToAdd + " search_shift"
    : classesToAdd;

  let roles = [
    { title: "ServicePro", value: "servicepro" },
    { title: "Landlord", value: "landlord" },
    { title: "Renter", value: "renter" },
  ];

  roles = roles.filter((e) => e.value !== currentRole);

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    options: {
      types: ["(regions)"],
      componentRestrictions: { country: "uk" },
    },
  });

  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  const [searchType, setSelectedSearch] = useState("Rent");

  //Places
  const [, setPlaces] = useState("");
  React.useEffect(() => {
    // fetch place details for the first element in placePredictions array
    if (placePredictions?.length ? placePredictions.length : 0)
      placesService?.getDetails(
        {
          placeId: placePredictions[0].place_id,
        },
        (placeDetails) => setPlaces(placeDetails)
      );
    //eslint-disable-next-line
  }, [placePredictions]);

  // console.log("header", isAuth, userData,  currentRole)

  //showMenu,
  const [setShowMenu] = useState(false);
  const [showSrch_drop, setShowSrch_drop] = useState(false);
  const [showSrch_drop2, setShowSrch_drop2] = useState(false);
  const [focus, setFocus] = useState(false);
  const [focus2, setFocus2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSrch_drop(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    //eslint-disable-next-line
  }, [wrapperRef, menuRef]);
  const Locator = () => {
    switch (searchType) {
      case "Rent":
        return `${process.env.REACT_APP_PUBLIC_URL}/search/properties?location=`;
      case "Task":
        return `${process.env.REACT_APP_PUBLIC_URL}/search/tasks?location=`;
      case "ServicePro":
        return `${process.env.REACT_APP_PUBLIC_URL}/search/servicepro?location=`;
      default:
        return "";
    }
  };

  const searchBarMobile = (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          // let searchText = e.target[0].value;
          // document.querySelector(".site_search").reset();
          // }
          if (searchType === "ServicePro") {
            window.location.replace(
              `${process.env.REACT_APP_PUBLIC_URL}/search/servicepro?location=${searchTerm}`
            );
          }
          if (searchType === "Rent") {
            window.location.replace(
              `${process.env.REACT_APP_PUBLIC_URL}/search/properties?location=${searchTerm}`
            );
          }

          if (searchType === "Task") {
            window.location.replace(
              `${process.env.REACT_APP_PUBLIC_URL}/search/tasks?location=${searchTerm}`
            );
          }
        }}
      >
        <input
          // value={searchText}
          // onChange={(e) => setSearchText(e.target.value)}
          className="form-control mb-1"
          type="text"
          placeholder="Search"
          aria-label="Search"
          onFocus={() => {
            setFocus2(true);
            setShowSrch_drop2(true);
          }}
          // ref={ref}
          value={searchTerm}
          onChange={(evt) => {
            setSearchTerm(evt.target.value);
            getPlacePredictions({ input: evt.target.value });
          }}
          loading={isPlacePredictionsLoading.toString()}
          onBlur={() =>
            setTimeout(() => {
              setFocus2(false);
              setShowSrch_drop2(false);
            }, 500)
          }
        />
        {showSrch_drop2 && focus2 && searchTerm.length > 0 && (
          <div
            style={{
              position: "absolute",
              width: "89%",
              fontSize: 14,
              background: "#fff",
              borderRadius: 5,
              top: 95,
              zIndex: 1,
            }}
            className="shadow-sm p-3 border"
          >
            {placePredictions &&
              placePredictions?.map((item) => (
                <p
                  className="mb-1 d-block"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setTimeout(() => {
                      setFocus2(false);
                    }, 1000);
                    setSearchTerm(item.description.replace(", UK", ""));
                    window.location.replace(
                      `${Locator() + item.description.replace(", UK", "")}`
                    );
                  }}
                >
                  {item.description.replace(", UK", "")}
                </p>
              ))}
          </div>
        )}
        <div className="search__listing">
          <ul>
            <li
              onClick={() => setSelectedSearch("Rent")}
              className={searchType === "Rent" && "active__tab"}
            >
              Rent
            </li>
            <li
              onClick={() => setSelectedSearch("Task")}
              className={searchType === "Task" && "active__tab"}
            >
              Task
            </li>
            {/* <li
              onClick={() => setSelectedSearch("Landlord")}
              className={searchType === "Landlord" && "active__tab"}
            >
              Landlord
            </li> */}
            <li
              onClick={() => setSelectedSearch("ServicePro")}
              className={searchType === "ServicePro" && "active__tab"}
            >
              ServicePro
            </li>
          </ul>
        </div>
        <div className="btn__wrapper text-right">
          <button
            disabled={searchTerm === "" && true}
            className="btn btn-primary mt-2"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
  return (
    <>
      <Header className="main__topbar">
        {/* <button onClick={() => loadGreeting()}>TEST QUERY</button> */}
        {history.location.pathname !== "/workspace" && (
          <Button
            type="primary"
            onClick={(e) =>
              window.screen.width <= 768
                ? //  Mobile
                  toggleCollapsedMobile(e)
                : //  Desktop
                  interfaceDispatch({ type: "TOGGLE_SIDEBAR" })
            }
            className="menuIcon hvr-pop"
            ref={sidebarToggleRef}
          >
            {/* <Icon type={this.state.collapsed ? "menu-unfold" : "menu-fold"} /> */}
            <i className="fa fa-bars"></i>
          </Button>
        )}

        <Link to="/">
          <Img
            src={[`${process.env.REACT_APP_ROC_PUBLIC}/images/logo.svg`]}
            alt=""
            className="header__logo"
          />
        </Link>

        {/* search_shift */}
        <form
          className="form-inline my-0 site_search d-none d-md-block"
          style={{ width: showSrch_drop ? 364 : 182 }}
          ref={wrapperRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (searchType === "ServicePro") {
              window.location.replace(
                `${process.env.REACT_APP_PUBLIC_URL}/search/servicepro?location=${searchTerm}`
              );
            }
            if (searchType === "Rent") {
              window.location.replace(
                `${process.env.REACT_APP_PUBLIC_URL}/search/properties?location=${searchTerm}`
              );
            }

            if (searchType === "Task") {
              window.location.replace(
                `${process.env.REACT_APP_PUBLIC_URL}/search/tasks?location=${searchTerm}`
              );
            }
          }}
        >
          <div
            className=" d-inline-block"
            style={{
              position: "relative",
              height: 20,
              width: 20,
              zIndex: 9999,
            }}
          >
            <i
              className="mdi mdi-magnify text-secondary d-inline-block"
              style={{ position: "absolute", top: 8, left: 7 }}
            />
          </div>

          <input
            className="form-control"
            type="text"
            placeholder="Search"
            aria-label="Search"
            onFocus={() => {
              setFocus(true);
              setShowSrch_drop(true);
            }}
            // ref={ref}
            value={searchTerm}
            onChange={(evt) => {
              setSearchTerm(evt.target.value);
              getPlacePredictions({ input: evt.target.value });
            }}
            loading={isPlacePredictionsLoading.toString()}
            onBlur={() =>
              setTimeout(() => {
                setFocus(false);
              }, 500)
            }
          />
          {showSrch_drop && focus && searchTerm.length > 0 && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                fontSize: 14,
                background: "#fff",
                borderRadius: 5,
                top: 45,
              }}
              className="shadow-sm p-3 border"
            >
              {placePredictions &&
                placePredictions?.map((item) => (
                  <p
                    className="mb-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFocus(false);
                      // setSearchTerm(item.description);
                      window.location.replace(
                        `${Locator() + item.description.replace(", UK", "")}`
                      );
                    }}
                  >
                    {item.description.replace(", UK", "")}
                  </p>
                ))}
            </div>
          )}

          <input type="hidden" value={searchType} />
          {showSrch_drop && (
            <BDropdown className="d-inline">
              <BDropdown.Toggle
                id="dropdown-autoclose-true"
                style={{
                  fontSize: 12,
                  marginTop: 0,
                  marginRight: 0,
                  height: 30,
                }}
                variant="primary"
              >
                {searchType}
              </BDropdown.Toggle>

              <BDropdown.Menu>
                <BDropdown.Item onClick={() => setSelectedSearch("Rent")}>
                  Rent
                </BDropdown.Item>
                <BDropdown.Item onClick={() => setSelectedSearch("Task")}>
                  Tasks
                </BDropdown.Item>
                <BDropdown.Item onClick={() => setSelectedSearch("ServicePro")}>
                  ServicePro
                </BDropdown.Item>
              </BDropdown.Menu>
            </BDropdown>
          )}

          <button className="btn btnr" type="submit">
            <i className="fas fa-arrow-circle-right" />
          </button>
        </form>

        {/* <form onSubmit={searchData} className={classesToAdd}>
        <Popover
          placement="bottomLeft"
          title={null}
          content={searchBar}
          visible={isSelectionActive}
          trigger="click"
          onVisibleChange={onVisibleChange}
        >
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="form-control"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        </Popover>
        <button
          disabled={searchText === "" && true}
          className="btn"
          type="submit"
        >
          <i className="mdi mdi-magnify" />
        </button>
      </form> */}

        {/* <p>Logged in as - {get(userData, "role")}</p> */}

        {!isImpersonate && (
          <div className="hide__desktop">
            <div className="search__mobile">
              <Popover
                placement="bottom"
                content={searchBarMobile}
                title="Search"
                trigger="click"
              >
                {/* <Icon
                style={{ fontSize: "25px", padding: "3px" }}
                type="search"
              /> */}
                <SearchOutlined style={{ fontSize: "25px", padding: "3px" }} />
              </Popover>
            </div>
            <div className="role__mobile">
              <Popover
                content={
                  <>
                    <Select
                      defaultValue={
                        currentRole.charAt(0).toUpperCase() +
                        currentRole.slice(1)
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
                  </>
                }
                placement="bottomLeft"
                title="Switch Role to"
                trigger="click"
              >
                {/* <Icon style={{ fontSize: "25px", padding: "3px" }} type="team" /> */}
                <TeamOutlined style={{ fontSize: "25px", padding: "3px" }} />
              </Popover>
            </div>
          </div>
        )}

        <Dropdown overlay={menu} trigger={["click"]}>
          <span className="mobile__toggle--icon">
            <img
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
          <div className="listing">
            <form className={classesToAdd}>
              <div className="moible__search">
                <Popover
                  placement="bottomLeft"
                  title={null}
                  content={searchBar}
                  trigger="click"
                  onVisibleChange={onVisibleChange}
                >
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onFocus={() => {
                      setFocus(true);
                      setShowSrch_drop(true);
                    }}
                    // ref={ref}
                    value={searchTerm}
                    onChange={(evt) => {
                      setSearchTerm(evt.target.value);
                      getPlacePredictions({ input: evt.target.value });
                    }}
                    loading={isPlacePredictionsLoading.toString()}
                    onBlur={() =>
                      setTimeout(() => {
                        setFocus(false);
                      }, 500)
                    }
                  />
                </Popover>
                <button className="btn" type="submit">
                  <i className="mdi mdi-magnify" />
                </button>
              </div>
            </form>
          </div>

          <div className="lising__profile">
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="nav-a user-menu-a">
                <img
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

          <div className="listing__icons">
            <span>
              <Link to="calendar" className="nav-a">
                <span className="fa fa-calendar" />
              </Link>
            </span>
            <span>
              {/* <a
              href
              onClick={() => (window.location.href = `/${userRole}/messenger`)}
            >
              <span className="fa fa-comments" />
            </a> */}
              <Badge count={filter(notifCount, { type: "message" }).length}>
                <Link to={`/${userRole}/messenger`}>
                  <span className="fa fa-comments" />
                </Link>
              </Badge>
            </span>
            <span>
              <Popover
                placement="bottom"
                title={null}
                content={notifications}
                trigger="click"
              >
                <Badge
                  count={filter(notifCount, { markAsRead: "false" }).length}
                >
                  <i className="fa fa-bell" />
                </Badge>
              </Popover>
            </span>
            <span>
              <Link to={`/${userRole}/settings/info`}>
                <span className="fa fa-cog" />
              </Link>
            </span>
          </div>
        </div>

        <ul className="navbar-nav ml-auto hide__mobile">
          {!isImpersonate && (
            <li>
              <Select
                defaultValue={
                  currentRole.charAt(0).toUpperCase() + currentRole.slice(1)
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
          )}
          {history.location.pathname !== "/workspace" && (
            <>
              <li className="nav-item">
                <Link to={`/${userRole}/calendar`} className="nav-a">
                  <Badge
                    count={uiData.calendarNotification}
                    style={{ backgroundColor: "#ffc107", fontSize: "10px" }}
                  >
                    <span className="fa fa-calendar" />
                  </Badge>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={`/${userRole}/messenger`}>
                  <Badge
                    count={unreadMessages}
                    style={{ backgroundColor: "#ffc107", fontSize: "10px" }}
                  >
                    <span className="fa fa-comments" />
                  </Badge>
                </Link>
                {/* <a
            href
            onClick={() => (window.location.href = `/${userRole}/messenger`)}
          >
            <span className="fa fa-comments" />
          </a> */}
              </li>
              <li className="nav-item dropdown notification-menu">
                <Popover
                  placement="bottom"
                  title={null}
                  content={notifications}
                  trigger="click"
                  fitToScreen={true}
                  // overlayStyle={{
                  //   width: "30vw"
                  // }}
                >
                  <Badge
                    count={filter(notifCount, { markAsRead: "false" }).length}
                    style={{ backgroundColor: "#ffc107", fontSize: "10px" }}
                  >
                    <i className="fa fa-bell" />
                  </Badge>
                </Popover>
              </li>
              <li className="nav-item">
                <Link to={`/${userRole}/settings/info`}>
                  <span className="fa fa-cog" />
                </Link>
              </li>
            </>
          )}
          <li className="nav-item dropdown user-menu">
            <Link to="" className="nav-a user-menu-a">
              <span className="profile-text">
                Hi!, <span className="profile__name">{userData.firstName}</span>
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
      </Header>
      {isImpersonate && (
        <>
          <ImpersonatingUserExist>
            <span>
              {impersonator?.firstName ? `Hi ${impersonator?.firstName},` : ""}{" "}
              You are impersonating as {userData.firstName}
            </span>
          </ImpersonatingUserExist>
        </>
      )}
    </>
  );
};

export default withRouter(DashboardHeader);
