import React, { lazy } from "react";
import LockScreen from "../../Public/LockScreen/";
import HeaderMain from "../../layout/headers/DashboardHeader";
import { Breadcrumb } from "antd";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Dashboard from "./Dashboard";
import SettingsTab from "../../Common/SettingsTabs";
import Screening from "./RenterSideNavs/Screening";
import InviteScreeningUser from "./RenterSideNavs/InviteScreeningUser";
import ScreeningReview from "../../Common/ScreeningReviewForms/Renter";
import ScreeningOrder from "./RenterSideNavs/Screening/ScreeningList";
import FixIt from "../../Common/Tasks/FixIt";
import RaiseTaskFixIt from "../../Common/Tasks/FixIt/AddTask";
import UpdateTaskFixIt from "../../Common/Tasks/FixIt/UpdateTask";
import FixitTaskReview from "../../Common/Tasks/TaskReview";
import AddProperty from "../../Common/PropertyDemo";

import { Link, Switch, Route, Redirect } from "react-router-dom";
import { Layout, Menu, Tooltip } from "antd";
import "../style.scss";
import UserContext from "../../../config/UserContext";
import AccountQueries from "../../../config/queries/account";
import cookie from "react-cookies";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { withApollo } from "react-apollo";
import { setLockScreenState } from "utils/storage";
const { SubMenu } = Menu;
const { Sider, Content } = Layout;

// LAZY LOADED COMPONENTS
// import Messenger from "../../Common/Chats";
const Messenger = lazy(() => import("../../Common/Chats"));

// import MyRental from "./RenterSideNavs/MyRental";
const MyRental = lazy(() => import("./RenterSideNavs/MyRental"));

const Calendar = lazy(() => import("../../Common/Calendar"));

// import RentalWishlist from "./RenterSideNavs/RentalWishlist";
const RentalWishlist = lazy(() => import("./RenterSideNavs/RentalWishlist"));

// import Applications from "./RenterSideNavs/Applications";
const Applications = lazy(() => import("./RenterSideNavs/Applications"));

// import ScreeningReportSample from "../../Common/ScreeningReports/Sample/renter";
const ScreeningReportSample = lazy(() =>
  import("../../Common/ScreeningReports/Sample/renter")
);

// import ScreeningReportSampleLandlord from "../../Common/ScreeningReports/Sample/landlord";
const ScreeningReportSampleLandlord = lazy(() =>
  import("../../Common/ScreeningReports/Sample/landlord")
);

// import ScreeningReport from "../../Common/ScreeningReports/Main/renter";
const ScreeningReport = lazy(() =>
  import("../../Common/ScreeningReports/Main/renter")
);

// LAZY LOADED COMPONENTS

const breadcrumbNameMap = {
  "/renter/settings": "Settings",
  "/renter/settings/info": "Profile Info",
  "/renter/settings/persona": "Persona Profile",
  "/renter/settings/accountsetting": "Account Setting",
  "/renter/settings/privacy": "Privacy",
  "/renter/settings/security": "Security",
  "/renter/settings/subscriptions": "Subscriptions",
  "/renter/settings/notifications": "Notifications",
  "/renter/settings/userRole": "User Role",
  "/renter/screening": "Screening",
  "/renter/screening/review": "Review",
  "/renter/screening/order": "New Order",
  "/renter/fixit": "Tasks",
  "/renter/fixit/raisetask": "Raise Task",
  "/renter/calendar": "Calendar",
  "/renter/messenger": "Messenger",
  "/renter/wishlist": "Rental Wishlist",
  "/renter/fixit/task/offers": "Task",
  "/renter/myrental": "My Rental",
  "/renter/myrental/add": "Add New"
};

class RenterMain extends React.PureComponent {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      siderClass: "menu__sidebar menu__sidebar--renter "
    };
  }

  toggleCollapsed = () => {
    // this.context.changeFooter(!this.state.collapsed);
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  hideSidebarMenuClick = () => {
    let obj = this.state.siderClass;
    if (window.screen.width <= 768) {
      document.querySelector("body").setAttribute("style", "");

      obj = obj.replace("mobileSidebarShow", "");
    }
    this.setState({
      siderClass: obj,
      // collapsed: false
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

    this.setState({ siderClass: newClass, collapsed: false });
  };

  componentDidMount() {
    let userData = get(this.context, "userData.authentication.data");
    let userRole = get(this.context, "userData.authentication.data.role");

    this.setState({
      userData,
      userRole,
      collapsed: window.screen.width <= 768 ? true : false
    });
  }

  changeRole = async role => {
    // this.context.startLoading();
    let roleToSet = role;
    const checkUserQuery = await this.props.client.query({
      query: AccountQueries.changeRole,
      variables: { role: roleToSet }
    });

    if (
      !isEmpty(checkUserQuery.data.changeRole) &&
      get(checkUserQuery, "data.changeRole.success")
    ) {
      cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });

      cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(checkUserQuery, "data.changeRole.token"), {
        path: "/"
      });
      localStorage.setItem("currentRole", roleToSet);

      window.location = `/${roleToSet}`;
    }
  };

  logout = () => {
    localStorage.removeItem("isLoggedOut");

    cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
    setLockScreenState({ isLock: false });

    window.location = "/login";
  };

  hideScroll = type => {
    if (type === "hide") {
      document.querySelector("body").setAttribute("style", "");
    }

    if (type === "show") {
      document.querySelector("body").setAttribute("style", "overflow: hidden");
    }
  };

  render() {
    let userData = get(this.context, "userData.authentication.data");
    let userRole = get(this.context, "userData.authentication.data.role");
    const { match, location } = this.props;

    let { collapsed, siderClass } = this.state;

    // BreadCrumb Data
    const pathSnippets = location.pathname.split("/").filter(i => i);
    let finalUrl = `/${pathSnippets
      .slice(0, pathSnippets.length - 1 + 1)
      .join("/")}`;

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return (
        <Breadcrumb.Item key={url} className="breadcrumb-item">
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
          {(breadcrumbNameMap[url] === "Settings" ? <span className="pathArrow">&#62;</span> : <span className="pathArrow" style={{ display: "none" }}></span>)}
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [
      <>
        <Link to="/">Home<span className="pathFirstArrow">&#62;</span></Link>
      </>
    ].concat(extraBreadcrumbItems);

    // BreadCrumb Data END

    let userDataMain = get(this.context, "userData.authentication");
    let isMenuDisabled =
      get(userData, "isProfileUpdate") && get(userData, "isPersonaUpdate")
        ? false
        : true;
    return (
      <>
        <LockScreen userData={userData} {...this.props} />

        <div>
          <Layout>
            <HeaderMain
              userData={userData}
              userDataMain={userDataMain}
              userRole={userRole}
              changeRole={this.changeRole}
              toggleCollapsed={this.toggleCollapsed}
              toggleCollapsedMobile={this.toggleCollapsedMobile}
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
                        <Route exact path={`${match.url}/screening`}>
                          <Screening
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/application`}>
                          <Applications
                            // contextData={this.context}
                            isMenuCollapsed={collapsed}
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit/task/offers`}>
                          <FixitTaskReview
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/messenger`}>
                          <Messenger
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/screening/order`}>
                          <ScreeningOrder
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>
                        <Route exact path={`${match.url}/screening/invite`}>
                          <InviteScreeningUser
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/myrental`}>
                          <MyRental
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/myrental/add`}>
                          <AddProperty
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route
                          exact
                          path={`${match.url}/screening/report/sample`}
                        >
                          <ScreeningReportSample
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

                        <Route
                          exact
                          path={`${match.url}/screening/report/sample/landlord`}
                        >
                          <ScreeningReportSampleLandlord
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/screening/report/:id`}>
                          <ScreeningReport
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/screening/review`}>
                          <ScreeningReview
                            // contextData={this.context}
                            responsiveClasses={
                              !collapsed ? " roc__desktop--responsive" : ""
                            }
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit`}>
                          <FixIt
                          // contextData={this.context} {...this.props} 
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit/raisetask`}>
                          <RaiseTaskFixIt
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit/update`}>
                          <UpdateTaskFixIt
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/fixit/task/review`}>
                          <FixitTaskReview
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>

                        <Route exact path={`${match.url}/wishlist`}>
                          <RentalWishlist
                            // contextData={this.context}
                            {...this.props}
                          />
                        </Route>
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

export default withApollo(RenterMain);
