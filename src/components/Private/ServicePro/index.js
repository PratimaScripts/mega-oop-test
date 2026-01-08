import React, { lazy } from "react";
import LockScreen from "../../Public/LockScreen/";

import HeaderMain from "../../layout/headers/DashboardHeader";
import { Breadcrumb } from "antd";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Dashboard from "./Dashboard";
import SettingsTab from "../../Common/SettingsTabs";
import ScreeningReview from "../../Common/ScreeningReviewForms/ServicePro";
import ScreeningOrders from "./ServiceProSideNavs/Screening";
import FixIt from "./ServiceProSideNavs/Fixit";
import FixItTaskReview from "./ServiceProSideNavs/Fixit/TaskReview";
import FindIt from "./ServiceProSideNavs/FindIt/index";
import FixItTask from "../../Common/Tasks/FixIt/AddTask";
// import ScreeningReportSample from "../../Common/ScreeningReports/Sample/servicepro";
// import ScreeningReport from "../../Common/ScreeningReports/Main/servicepro";
// import FixItResolveTask from "./ServiceProSideNavs/FixitTasks/Resolve";

// import ContactCards from "./ServiceProSideNavs/ContactCards";
// import Messenger from "../../Common/Chats";

import { Link, Switch, Route, Redirect } from "react-router-dom";
import { Layout, Menu, Tooltip } from "antd";
import "../style.scss";

import UserContext from "../../../config/UserContext";
import AccountQueries from "../../../config/queries/account";
import cookie from "react-cookies";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { withApollo } from "react-apollo";
// import MyServices from "./ServiceProSideNavs/MyServices";
import CreateOrEditService from "./ServiceProSideNavs/MyServices/CreateOrEdit";
import StorageLevel from "components/Common/StorageLevel";
import { setLockScreenState } from "utils/storage";

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

const ScreeningReportSample = lazy(() =>
  import("../../Common/ScreeningReports/Sample/servicepro")
);
const ScreeningReport = lazy(() =>
  import("../../Common/ScreeningReports/Main/servicepro")
);

const ContactCards = lazy(() => import("./ServiceProSideNavs/ContactCards"));
const Messenger = lazy(() => import("../../Common/Chats"));
const Calendar = lazy(() => import("../../Common/Calendar"));
const Services = lazy(() => import("./ServiceProSideNavs/MyServices"));
const MyMoney = lazy(() => import("./ServiceProSideNavs/MyMoney"));

const breadcrumbNameMap = {
  "/servicepro/settings": "Settings",
  "/servicepro/settings/info": "Profile Info",
  "/servicepro/settings/persona": "Persona Profile",
  "/servicepro/settings/accountsetting": "Account Setting",
  "/servicepro/settings/privacy": "Privacy",
  "/servicepro/screening": "Screening",
  "/servicepro/settings/security": "Security",
  "/servicepro/settings/subscriptions": "Subscriptions",
  "/servicepro/settings/notifications": "Notifications",
  "/servicepro/settings/userRole": "User Role",
  "/servicepro/screening/review": "Review",
  "/servicepro/contacts": "My Client",
  "/servicepro/findit": "Find It",
  "/servicepro/fixit": "Tasks",
  "/servicepro/fixit/tasks": "Tasks",
  "/servicepro/calendar": "Calendar",
  "/servicepro/messenger": "Messenger",
  "/servicepro/fixit/task": "Task",
  "/servicepro/fixit/task/offers": "View",
  "/servicepro/fixit/task/:id": "{{id}}",
  "/servicepro/services": "Services",
  "/servicepro/mymoney": "My Money",
  "/servicepro/myservices/:id": "Service",
};

// const Breadcrumbs = breadcrumbConfig({
//   dynamicRoutesMap: {
//     "/": "test",
//     "/servicepro/fixit/task/:id": "{{id}}"
//   }
// });

class ServiceProMain extends React.PureComponent {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      siderClass: "menu__sidebar menu__sidebar--servicepro ",
    };
  }

  toggleCollapsed = () => {
    // this.context.changeFooter(!this.state.collapsed);
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount() {
    let userData = get(this.context, "userData.authentication.data");
    let userRole = get(this.context, "userData.authentication.data.role");
    // this.context.changeFooter(this.state.collapsed);
    this.setState({
      userData,
      userRole,
      collapsed: window.screen.width <= 768 ? true : false,
    });
  }

  changeRole = async (role) => {
    // this.context.startLoading();
    let roleToSet = role;
    const checkUserQuery = await this.props.client.query({
      query: AccountQueries.changeRole,
      variables: { role: roleToSet },
    });

    if (
      !isEmpty(checkUserQuery.data.changeRole) &&
      get(checkUserQuery, "data.changeRole.success")
    ) {
      cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });

      cookie.save(
        process.env.REACT_APP_AUTH_TOKEN,
        get(checkUserQuery, "data.changeRole.token"),
        {
          path: "/",
        }
      );
      localStorage.setItem("currentRole", roleToSet);

      window.location = `/${roleToSet}`;
    }
  };

  hideScroll = (type) => {
    if (type === "hide") {
      document.querySelector("body").setAttribute("style", "");
    }

    if (type === "show") {
      document.querySelector("body").setAttribute("style", "overflow: hidden");
    }
  };

  hideSidebarMenuClick = () => {
    let obj = this.state.siderClass;
    if (window.screen.width <= 768) {
      document.querySelector("body").setAttribute("style", "");

      obj = obj.replace("mobileSidebarShow", "");
    }
    this.setState({
      siderClass: obj,
      collapsed: true,
    });
  };

  toggleCollapsedMobile = () => {
    let newClass = this.state.siderClass;
    if (newClass.includes("mobileSidebarShow")) {
      document.querySelector("body").setAttribute("style", "");

      let rclass = newClass.replace("mobileSidebarShow", "");
      newClass = rclass;
    } else {
      document
        .querySelector("body")
        .setAttribute("style", "overflow: hidden; height: 100%");
      newClass += " mobileSidebarShow";
    }

    this.setState({ siderClass: newClass, collapsed: !this.state.collapsed });
  };

  logout = () => {
    localStorage.removeItem("isLoggedOut");

    cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
    setLockScreenState({ isLock: false });

    window.location = "/login";
  };

  render() {
    let userData = get(this.context, "userData.authentication.data");
    let userRole = get(this.context, "userData.authentication.data.role");
    const { match, location } = this.props;

    // BreadCrumb Data
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    let finalUrl = `/${pathSnippets
      .slice(0, pathSnippets.length - 1 + 1)
      .join("/")}`;

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return (
        <Breadcrumb.Item key={url} className="breadcrumb-item">
          <Link to={url}>{breadcrumbNameMap[url]}</Link>

          {breadcrumbNameMap[url] === "Settings" ? (
            <span className="pathArrow">&#62;</span>
          ) : (
            <span className="pathArrow" style={{ display: "none" }}></span>
          )}
          {/* {console.log(breadcrumbNameMap[url])} */}
          {/* {console.log(pathSnippets.pop())} */}
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [
      <>
        <Link to="/">
          Home<span className="pathFirstArrow">&#62;</span>
        </Link>
      </>,
    ].concat(extraBreadcrumbItems);

    // BreadCrumb Data END

    let { collapsed, siderClass } = this.state;

    let userDataMain = get(this.context, "userData.authentication");
    let isMenuDisabled =
      get(userData, "isProfileUpdate") && get(userData, "isPersonaUpdate")
        ? false
        : true;

    // console.log(userRole);
    return (
      <>
        <LockScreen userData={userData} {...this.props} />

        <div>
          <Layout>
            <HeaderMain
              userData={userData}
              toggleCollapsedMobile={this.toggleCollapsedMobile}
              userDataMain={userDataMain}
              userRole={userRole}
              changeRole={this.changeRole}
              toggleCollapsed={this.toggleCollapsed}
              logout={this.logout}
              isCollapsed={this.state.collapsed}
              isMenuDisabled={isMenuDisabled}
            />

            <Layout>
              <Sider
                className={siderClass}
                width={250}
                collapsed={this.state.collapsed}
              >
                <div>
                  {this.state.collapsed && (
                    <Menu
                      defaultOpenKeys={[]}
                      mode="inline"
                      theme="light"
                      onClick={this.hideSidebarMenuClick}
                      onMouseOver={() => this.hideScroll("show")}
                      onMouseOut={() => this.hideScroll("hide")}
                    >
                      <Menu.Item key="1">
                        <Tooltip
                          overlayClassName="hover__menu__sidebar"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={
                            <div
                              onClick={() =>
                                this.props.history.push(
                                  `/${userRole}/dashboard`
                                )
                              }
                            >
                              Dashboard
                            </div>
                          }
                        >
                          <Link to={`/${userRole}/dashboard`}>
                            <i className="mdi mdi-home" />
                            <span className="padd__left">Dashboard</span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>

                      <Menu.Item disabled={isMenuDisabled} key="2">
                        <Tooltip
                          overlayClassName="hover__menu__sidebar"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={
                            <span
                              onClick={() =>
                                this.props.history.push(`/${userRole}/findit`)
                              }
                            >
                              Find It
                            </span>
                          }
                        >
                          <Link to={`/${userRole}/findit`}>
                            <i className="mdi mdi-file-search-outline" />

                            <span className="padd__left"> Find It </span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>
                      <SubMenu
                        key="sub1"
                        disabled={isMenuDisabled}
                        title={
                          <Link to={`/${userRole}/fixit`}>
                            <i className="mdi mdi-hand-pointing-right"></i>
                            <span className="padd__left">Fix It</span>
                          </Link>
                        }
                      >
                        <Menu.Item key="5" disabled={isMenuDisabled}>
                          <Link to={`/${userRole}/fixit`}>Task</Link>
                        </Menu.Item>
                        <Menu.Item key="6" disabled={isMenuDisabled}>
                          <Link to={`/${userRole}/calendar`}>Reminders</Link>
                        </Menu.Item>
                        {/* <Menu.Item key="5">Task</Menu.Item>
                      <Menu.Item key="6">Reminders</Menu.Item> */}
                      </SubMenu>

                      <Menu.Item key="Screening" disabled={isMenuDisabled}>
                        <Tooltip
                          overlayClassName="hover__menu__sidebar no__margin"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={
                            <div
                              onClick={() =>
                                this.props.history.push(
                                  `/${userRole}/screening`
                                )
                              }
                            >
                              Screening
                            </div>
                          }
                        >
                          <Link to={`/${userRole}/screening`}>
                            <i className="mdi mdi-file-search-outline"></i>
                            <span className="padd__left">Screening</span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>

                      {/* <Menu.Item key="3" disabled={isMenuDisabled}>
                        <Tooltip
                          overlayClassName="hover__menu__sidebar no__margin"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={<>Services</>}
                        >
                          <Link to={`/${userRole}/services`}>
                            <i className="mdi mdi-file-document-outline"></i>
                            <span className="padd__left">Services</span>
                          </Link>
                        </Tooltip>
                      </Menu.Item> */}

                      <Menu.Item key="7" disabled={isMenuDisabled}>
                        <Tooltip
                          overlayClassName="hover__menu__sidebar no__margin"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={<>Services</>}
                        >
                          <Link to={`/${userRole}/services`}>
                            <i className="mdi mdi-server"></i>
                            <span className="padd__left">Services</span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>

                      <Menu.Item key="7" disabled={isMenuDisabled}>
                        <Tooltip
                          overlayClassName="hover__menu__sidebar no__margin"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={<>My Money</>}
                        >
                          <Link to={`/${userRole}/mymoney`}>
                            <i className="mdi mdi-cash-multiple"></i>
                            <span className="padd__left">My Money</span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>

                      <Menu.Item key="8" disabled={isMenuDisabled}>
                        <Tooltip
                          overlayClassName="hover__menu__sidebar no__margin"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={
                            <span
                              onClick={() =>
                                this.props.history.push(`/${userRole}/contacts`)
                              }
                            >
                              My Client
                            </span>
                          }
                        >
                          <Link to={`/${userRole}/contacts`}>
                            <i className="mdi mdi-account-multiple-outline"></i>
                            <span className="padd__left">My Client </span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>

                      <Menu.Item key="9" disabled={isMenuDisabled}>
                        <Tooltip
                          overlayClassName="hover__menu__sidebar no__margin"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={<>Diary</>}
                        >
                          <Link to={`/${userRole}/dashboard`}>
                            <i className="mdi mdi-book-open-variant"></i>
                            <span className="padd__left">Diary</span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>

                      <Menu.Item key="10" className="fixed__btm--settings">
                        <Tooltip
                          overlayClassName="hover__menu__sidebar"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={
                            <div
                              onClick={() =>
                                this.props.history.push(`/${userRole}/settings`)
                              }
                            >
                              Settings
                            </div>
                          }
                        >
                          <Link to={`/${userRole}/settings`}>
                            <i className="mdi mdi-settings"></i>
                            <span className="padd__left">Settings</span>
                          </Link>
                        </Tooltip>
                      </Menu.Item>

                      <Menu.Item key="11" className="fixed__btm--support">
                        <Tooltip
                          overlayClassName="hover__menu__sidebar no__margin"
                          mouseLeaveDelay={0.15}
                          mouseEnterDelay={-0.15}
                          placement="right"
                          title={<>Support</>}
                        >
                          <a
                            rel="noopener noreferrer"
                            href={`https://rentoncloud.freshdesk.com/support/home`}
                            target="_blank"
                          >
                            <i className="mdi mdi-headphones"></i>
                            <span>Support</span>
                          </a>
                        </Tooltip>
                      </Menu.Item>

                      <div className="used_space text-center fixed__btm--progressbar">
                        <StorageLevel />
                      </div>
                    </Menu>
                  )}

                  {!this.state.collapsed && (
                    <Menu
                      defaultOpenKeys={[]}
                      onClick={this.hideSidebarMenuClick}
                      mode="inline"
                      theme="light"
                    >
                      <Menu.Item key="1">
                        <Link to={`/${userRole}/dashboard`}>
                          <i className="mdi mdi-home" />
                          <span className="padd__left">Dashboard</span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="2" disabled={isMenuDisabled}>
                        <Link to={`/${userRole}/findit`}>
                          <i className="mdi mdi-file-search-outline" />

                          <span className="padd__left"> Find It </span>
                        </Link>
                      </Menu.Item>
                      <SubMenu
                        key="sub1"
                        disabled={isMenuDisabled}
                        title={
                          <span>
                            <i className="mdi mdi-hand-pointing-right"></i>
                            <span className="padd__left">Fix It</span>
                          </span>
                        }
                      >
                        <Menu.Item key="5" disabled={isMenuDisabled}>
                          <Link to={`/${userRole}/fixit`}>Task</Link>
                        </Menu.Item>
                        <Menu.Item key="6" disabled={isMenuDisabled}>
                          <Link to={`/${userRole}/calendar`}>Reminders</Link>
                        </Menu.Item>
                      </SubMenu>

                      <Menu.Item key="Screening" disabled={isMenuDisabled}>
                        <Link to={`/${userRole}/screening`}>
                          <i className="mdi mdi-file-search-outline"></i>
                          <span className="padd__left">Screening</span>
                        </Link>
                      </Menu.Item>

                      {/* <Menu.Item key="3" disabled={isMenuDisabled}>
                        <Link to={`/${userRole}/dashboard`}>
                          <i className="mdi mdi-file-document-outline"></i>
                          <span className="padd__left">Services</span>
                        </Link>
                      </Menu.Item> */}

                      <Menu.Item key="services" disabled={isMenuDisabled}>
                        <Link to={`/${userRole}/services`}>
                          <i className="mdi mdi-server"></i>
                          <span className="padd__left">Services</span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="7" disabled={isMenuDisabled}>
                        <Link to={`/${userRole}/mymoney`}>
                          <i className="mdi mdi-cash-multiple"></i>
                          <span className="padd__left">My Money</span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="8" disabled={isMenuDisabled}>
                        <Link to={`/${userRole}/contacts`}>
                          <i className="mdi mdi-account-multiple-outline"></i>
                          <span className="padd__left">My Client </span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="9" disabled={isMenuDisabled}>
                        <Link to={`/${userRole}/dashboard`}>
                          <i className="mdi mdi-book-open-variant"></i>
                          <span className="padd__left">Diary</span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="10" className="fixed__btm--settings">
                        <Link to={`/${userRole}/settings`}>
                          <i className="mdi mdi-settings"></i>
                          <span className="padd__left">Settings</span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="11" className="fixed__btm--support">
                        <a
                          rel="noopener noreferrer"
                          href={`https://rentoncloud.freshdesk.com/support/home`}
                          target="_blank"
                        >
                          <i className="mdi mdi-headphones"></i>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <span>Support</span>
                        </a>
                      </Menu.Item>

                      <div className="used_space text-center fixed__btm--progressbar">
                        <StorageLevel />
                      </div>
                    </Menu>
                  )}
                </div>
              </Sider>

              <Content
                className={
                  !collapsed
                    ? "right__container--part right__container--padding"
                    : "right__container--part"
                }
              >
                {/* BreadCrumb Data */}
                <div className="dashboard__header">
                  {!window.location.pathname.includes("dashboard") && (
                    <div className="row">
                      <div className="col-lg-6">
                        <h2>{breadcrumbNameMap[finalUrl]}</h2>
                      </div>
                      <div className="col-lg-6">
                        {/* <Breadcrumbs pathname={this.props.location.pathname} /> */}
                        <Breadcrumb separator="" className="breadcrumb">
                          {breadcrumbItems}
                        </Breadcrumb>
                      </div>
                    </div>
                  )}
                </div>
                <Switch>
                  <Route exact path={`${match.url}`}>
                    <Redirect to={`${match.url}/dashboard`} />
                  </Route>
                  <Route path={`${match.url}/dashboard`}>
                    <Dashboard userData={userData} {...this.props} />
                  </Route>
                  <Route path={`${match.url}/settings`}>
                    <SettingsTab
                      isMenuCollapsed={collapsed}
                      isMenu
                      {...this.props}
                    />
                  </Route>
                  <TransitionGroup>
                    <CSSTransition
                      key={get(this.props, "location.key", "Settings")}
                      classNames="page"
                      unmountOnExit
                      timeout={300}
                    >
                      <>
                        <Route exact path={`${match.url}/screening/review`}>
                          <ScreeningReview
                            // contextData={this.context}
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            {...this.props}
                          />
                        </Route>
                        <Route exact path={`${match.url}/screening`}>
                          <ScreeningOrders
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/screening/report/:id`}>
                          <ScreeningReport
                            isMenuCollapsed={collapsed}
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        {/* <Route path={`${match.url}/fixit`}>
                    <FixIt 
                    // contextData={this.context} 
                    {...this.props} />
                  </Route> */}
                        <Route
                          exact
                          path={`${match.url}/screening/report/sample`}
                        >
                          <ScreeningReportSample
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/findit`}>
                          <FindIt
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit`}>
                          {/* <ContactCards
                            // contextData={this.context}
                            {...this.props}
                          /> */}
                          <FixIt
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/calendar`}>
                          <Calendar
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/services`}>
                          <Services
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        {/* My Service Routes */}
                        {/* <Route exact path={`${match.url}/myservices`}>
                          <MyServices
                            contextData={this.context}
                            {...this.props}
                          />
                        </Route> */}

                        <Route exact path={`${match.url}/myservices/:id`}>
                          <CreateOrEditService
                            contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/mymoney`}>
                          <MyMoney
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit/task/offers`}>
                          <FixItTaskReview
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit/add`}>
                          <FixItTask
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/contacts`}>
                          <ContactCards
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/messenger`}>
                          <Messenger
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/messenger/:id`}>
                          <Messenger
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        {/* <Route exact path={`${match.url}/fixit/resolve`}>
                          <FixItResolveTask
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route> */}
                      </>
                    </CSSTransition>
                  </TransitionGroup>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </div>
      </>
    );
  }
}

export default withApollo(ServiceProMain);
