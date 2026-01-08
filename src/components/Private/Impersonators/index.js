import React from "react";
import LockScreen from "../../Public/LockScreen/";

import Dashboard from "./Dashboard";
import Invitations from "./Invitations";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { Layout, Menu, Button, Popover, Dropdown } from "antd";
// import "../style.scss";
import UserContext from "../../../config/UserContext";
import UserRoleQuery from "../../../config/queries/userRole";

import cookie from "react-cookies";
import get from "lodash/get";
import find from "lodash/find";
import { withApollo } from "react-apollo";
const { Header, Sider, Content } = Layout;

const SettingTabsNames = [
  {
    key: "info",
    title: "Profile"
  },
  {
    key: "persona",
    title: "Persona Profile"
  },
  {
    key: "accountsetting",
    title: "Account Setting"
  },
  {
    key: "privacy",
    title: "Privacy"
  },
  {
    key: "security",
    title: "Security"
  },
  {
    key: "subscriptions",
    title: "Subscriptions"
  },
  {
    key: "notifications",
    title: "Notifications"
  },
  {
    key: "userRole",
    title: "User Role"
  },
  {
    key: "chartOfAccount",
    title: "Chart Of Account"
  }
];
class ImpersonatingUsers extends React.PureComponent {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };
  }

  toggleCollapsed = () => {
    // this.context.changeFooter(!this.state.collapsed);
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  impersonateUserMain = async data => {
    // this.context.startLoading();
    const checkUserQuery = await this.props.client.query({
      query: UserRoleQuery.impersonateUser,
      variables: { userId: data.userId }
    });

    if (get(checkUserQuery, "data.impersonateUser.success")) {
      cookie.remove("user_token_main", { path: "/" });
      cookie.save("user_token_main", cookie.load(process.env.REACT_APP_AUTH_TOKEN), {
        path: "/"
      });

      cookie.save(process.env.REACT_APP_AUTH_TOKEN, get(checkUserQuery, "data.impersonateUser.token"), {
        path: "/"
      });

      // this.context.endLoading();
      window.location.reload();
    }
  };

  logout = () => {
    localStorage.removeItem("isLoggedOut");
    cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
    window.location = "/login";
  };

  render() {
    let userData = get(this.context, "userData.authentication.data");
    let userRole = get(this.context, "userData.authentication.data.role");
    const { match } = this.props;
    let { collapsed } = this.state;
    let pathname = window.location.pathname.split(`/${userRole}/settings/`)[1];
    let activeTabTitle = find(SettingTabsNames, { key: pathname });

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Link to={`/${userRole}/settings/info`}>
            <i className="fa fa-user mr-2" /> Profile
          </Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to={`/${userRole}/settings`}>
            <i className="fa fa-cog mr-2" /> Settings
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <span onClick={this.logout}>
            <i className="fa fa-unlock mr-2" /> Logout
          </span>
        </Menu.Item>
      </Menu>
    );

    const notifications = (
      <div>
        <ul>
          <li>
            {" "}
            Lorem Ipsum dolor sit{" "}
            <span>
              <a href>
                <i className="far fa-eye" />
              </a>{" "}
              <a href>
                <i className="far red fa-trash-alt" />
              </a>
            </span>
          </li>
          <li>
            {" "}
            Lorem Ipsum dolor sit{" "}
            <span>
              <a href>
                <i className="far fa-eye" />
              </a>{" "}
              <a href>
                <i className="far red fa-trash-alt" />
              </a>
            </span>
          </li>
          <li>
            {" "}
            Lorem Ipsum dolor sit{" "}
            <span>
              <a href>
                <i className="far fa-eye" />
              </a>{" "}
              <a href>
                <i className="far red fa-trash-alt" />
              </a>
            </span>
          </li>
        </ul>
        <a href className="d-block text-center mt-2">
          View All
        </a>
      </div>
    );

    const searchBar = (
      <>
        <div className="search__listing">
          <ul>
            <li className="active__tab">Rent</li>
            <li>Task</li>
            <li>Landlord</li>
            <li>ServicePro</li>
          </ul>
          <span className="search__listing--closer">
            <i className="fa fa-times"></i>
          </span>
        </div>
      </>
    );

    return (
      <>
        <LockScreen userData={userData} {...this.props} />

        <div>
          <Layout>
            <Header className="main__topbar">
              <Button
                type="primary"
                onClick={this.toggleCollapsed}
                className="menuIcon"
              >
                {/* <Icon type={this.state.collapsed ? "menu-unfold" : "menu-fold"} /> */}
                <i className="fa fa-bars"></i>
              </Button>

              <img
                src={"https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"}
                alt=""
                className="header__logo"
              />

              <form className="search__wrapper">
                <Popover
                  placement="bottomLeft"
                  title={null}
                  content={searchBar}
                  trigger="click"
                >
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </Popover>
                <button className="btn" type="submit">
                  <i className="mdi mdi-magnify" />
                </button>
              </form>

              {/* <p>Logged in as - {get(userData, "role")}</p> */}

              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a href className="nav-a">
                    <span className="fa fa-calendar" />
                  </a>
                </li>
                <li className="nav-item">
                  <a href className="nav-a">
                    <span className="fa fa-comments" />
                  </a>
                </li>
                <li className="nav-item dropdown notification-menu">
                  <Popover
                    placement="bottom"
                    title={null}
                    content={notifications}
                    trigger="click"
                  >
                    <i className="fa fa-bell" />
                    <span className="badge badge-warning navbar-badge">15</span>
                  </Popover>
                </li>
                <li className="nav-item">
                  <Link to={`/${userRole}/settings/info`}>
                    <span className="fa fa-cog" />
                  </Link>
                </li>
                <li className="nav-item dropdown user-menu">
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <a href className="nav-a user-menu-a">
                      <span className="profile-text">
                        Hi,{" "}
                        <span className="profile__name">
                          {userData.firstName}!
                        </span>
                      </span>
                      <img
                        alt={`${userData.firstName}'s profile pic`}
                        className="profile__thumb"
                        src={
                          userData.avatar
                            ? userData.avatar
                            : "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                        }
                        style={{ width: "32px", marginLeft: "7px" }}
                      />
                    </a>
                  </Dropdown>
                </li>
              </ul>
            </Header>

            <Layout>
              <Sider
                className="menu__sidebar"
                width={250}
                collapsed={this.state.collapsed}
              >
                <div>
                  <Menu defaultOpenKeys={["sub1"]} mode="inline" theme="light">
                    <Menu.Item key="1">
                      <Link to={`/${userRole}/dashboard`}>
                        <i className="mdi mdi-home" />
                        <span>Dashboard</span>
                      </Link>
                    </Menu.Item>

                    <Menu.Item key="2">
                      <i className="mdi mdi-office-building" />
                      <Link to={`/${userRole}/invitations`}>
                        <i className="mdi mdi-home" />
                        <span>Invitations</span>
                      </Link>
                    </Menu.Item>
                  </Menu>
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
                  <div className="row">
                    <div className="col-lg-6">
                      <h2>{activeTabTitle && activeTabTitle.title}</h2>
                    </div>
                    <div className="col-lg-6">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <a href>Home</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href>Settings</a>
                        </li>
                        <li className="breadcrumb-item active">
                          {activeTabTitle && activeTabTitle.title}
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
                <Switch>
                  <Route exact path={`${match.url}`}>
                    <Redirect to={`${match.url}/dashboard`} />
                  </Route>
                  <Route path={`${match.url}/dashboard`}>
                    <Dashboard userData={userData} {...this.props} />
                  </Route>
                  <Route path={`${match.url}/invitations`}>
                    <Invitations
                      impersonateUserMain={this.impersonateUserMain}
                      userData={userData}
                      {...this.props}
                    />
                  </Route>
                  {/* <Route path={`${match.url}/settings`}>
                    <SettingsTab {...this.props} />
                  </Route> */}
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </div>
      </>
    );
  }
}

export default withApollo(ImpersonatingUsers);
