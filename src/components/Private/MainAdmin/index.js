/* eslint-disable array-callback-return */
import React from "react";
import LockScreen from "../../Public/LockScreen/";

import Dashboard from "./Dashboard";
// import ChartOfAccount from "./ChartOfAccount";
import AdminQueries from "../../../config/queries/admin";
import AllUsers from "./Users";
import Exports from "./Exports";
import Reports from "./Reports";
import PaymentHistory from "./PaymentHistory";
import Accrediations from "./AccrediationsList";
import DocumentVerificationRequest from "./DocumentVerificationRequest";
import DeleteRequests from "./DeleteRequests";
import AddTaskCategory from "./AddTaskCategory";
import ScreeningOrdersHistory from "./ScreeningOrders";
import PropertyQueries from "../../../config/queries/property";
import AddPropertySubcategory from "./AddPropertySubcategory";
import UpdateRates from "./UpdateRates";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { Layout, Menu, Button, Popover, Dropdown } from "antd";
import "../style.scss";
import UserContext from "../../../config/UserContext";
import AccountQueries from "../../../config/queries/account";
import cookie from "react-cookies";
import get from "lodash/get";
import { withApollo } from "react-apollo";
import ChartOfAccountSchema from "../../../config/FormSchemas/ChartOfAccount";
import showNotification from "../../../config/Notification";
import AdminServices from "./Services";
import { setLockScreenState } from "utils/storage";
const { Header, Sider, Content } = Layout;

class LandlordMain extends React.PureComponent {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      allUsers: [],
      flaggedReports: [],
      screeningOrders: [],
      taskCategories: {
        taskCategories: [{ name: "", subCategory: [], docRaw: [], avatar: "" }]
      },
      verificationDocList: [],
      paymentHistory: [],
      accreditations: [],
      exportRequests: [],
      deleteRequests: [],
      closeCoaDrawer: false,
      chartOfAccounts: {
        businessExpenses: [],
        businessIncome: [],
        capitalInflow: [],
        capitalOutflow: []
      }
    };
  }

  toggleCollapsed = () => {
    // this.context.changeFooter(!this.state.collapsed);
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  logout = () => {
    localStorage.removeItem("isLoggedOut");

    cookie.remove(process.env.REACT_APP_AUTH_TOKEN, { path: "/" });
    setLockScreenState({ isLock: false });

    window.location = "/login";
  };

  componentDidMount() {
    this.fetchAllUsers();
    this.fetchScreeningOrders();
    this.fetchChartOfAccount();
    this.fetchDeleteRequests();
    this.fetchExportRequests();
    this.getAccreditationList();
    this.fetchPaymentHistory();
    this.fetchDocVerificationList();
    this.fetchTaskCategories();
    this.fetchPropertySubtypes();
    this.getFlaggedTasks();
  }

  fetchAllUsers = async () => {
    const getAllUsers = await this.props.client.query({
      query: AdminQueries.userList
    });

    if (get(getAllUsers, "data.userList.success")) {
      let allUsers = get(getAllUsers, "data.userList.data");

      this.setState({ allUsers });
    }
  };

  fetchDocVerificationList = async () => {
    const docQuery = await this.props.client.query({
      query: AdminQueries.docVerificationList
    });

    if (get(docQuery, "data.getDocumentList.success")) {
      let verificationDocList = get(docQuery, "data.getDocumentList.data");

      this.setState({ verificationDocList });
    }
  };

  fetchDeleteRequests = async () => {
    const deleteR = await this.props.client.query({
      query: AdminQueries.deleteRequests
    });

    if (get(deleteR, "data.getDeleteRequestList.success")) {
      let deleteRequests = get(deleteR, "data.getDeleteRequestList.data");

      this.setState({ deleteRequests });
      this.forceUpdate();
    }
  };

  fetchPropertySubtypes = async () => {
    const getPropertyType = await this.props.client.query({
      query: PropertyQueries.getPropertyType
    });

    if (get(getPropertyType, "data.getPropertyType.success")) {
      let propertyTypes = get(getPropertyType, "data.getPropertyType.data");

      this.setState({ propertyTypes });
      this.forceUpdate();
    }
  };

  getFlaggedTasks = async () => {
    const getflags = await this.props.client.query({
      query: AdminQueries.getFlaggedTasks
    });

    this.setState({
      flaggedReports: get(getflags, "data.getFlaggedTasks.data")
    });
  };

  changeFlagTaskStatus = async data => {
    // this.context.startLoading();

    // const requestUpdate = await this.props.client.mutate({
    //   mutation: AdminQueries.changeFlagTaskStatus,
    //   variables: data
    // });
  };

  updatePropertySubtypes = async data => {
    // this.context.startLoading();

    data.map(async (obj, j) => {
      const requestUpdate = await this.props.client.mutate({
        mutation: PropertyQueries.updatePropertyType,
        variables: { propertyType: obj }
      });

      if (get(requestUpdate, "data.updatePropertyType.success")) {
        // this.context.endLoading();

        showNotification("success", "Request Updated!", "");
        this.forceUpdate();
      } else {
        // this.context.endLoading();

        showNotification(
          "error",
          "An Error Occured",
          get(requestUpdate, "data.updatePropertyType.message")
        );
      }
    });
  };

  fetchExportRequests = async () => {
    const requests = await this.props.client.query({
      query: AdminQueries.getExportRequests
    });

    if (get(requests, "data.getExportRequestList.success")) {
      let exportRequests = get(requests, "data.getExportRequestList.data");

      this.setState({ exportRequests });
      this.forceUpdate();
    }
  };

  getAccreditationList = async () => {
    const requests = await this.props.client.query({
      query: AdminQueries.fetchAccreditation
    });

    // console.log("requestsrequestsrequests", requests);
    // if (get(requests, "data.getAccreditationList.success")) {
    let accreditations = get(
      requests,
      "data.getAccreditation.data.accreditations"
    );

    this.setState({ accreditations });
    this.forceUpdate();
    // }
  };

  updateExportRequest = async data => {
    // this.context.startLoading();

    const requestUpdate = await this.props.client.mutate({
      mutation: AdminQueries.updateExportRequest,
      variables: { userId: data._id, action: data.action }
    });

    if (get(requestUpdate, "data.updateExportDataRequest.success")) {
      // this.context.endLoading();

      showNotification("success", "Request Updated!", "");
      this.forceUpdate();
    } else {
      // this.context.endLoading();

      showNotification(
        "error",
        "An Error Occured",
        get(requestUpdate, "data.updateExportDataRequest.message")
      );
    }
  };

  deleteUser = async data => {
    // this.context.startLoading();

    const deleteUser = await this.props.client.mutate({
      mutation: AdminQueries.deleteUser,
      variables: { userId: data._id }
    });

    if (get(deleteUser, "data.deleteUserById.success")) {
      let allUsers = get(deleteUser, "data.deleteUserById.data");

      // this.context.endLoading();

      showNotification(
        "success",
        "User Deleted!",
        "User has been deleted successfully!"
      );
      this.setState({ allUsers });
      this.forceUpdate();
    } else {
      // this.context.endLoading();

      showNotification(
        "error",
        "An Error Occured",
        get(deleteUser, "data.deleteUserById.message")
      );
    }
  };

  denyRequest = async data => {
    // this.context.startLoading();

    const denyRequest = await this.props.client.mutate({
      mutation: AdminQueries.rejectUserAccountDeleteRequest,
      variables: { userId: data._id }
    });

    if (get(denyRequest, "data.rejectUserAccountDeleteRequest.success")) {
      let allUsers = get(
        denyRequest,
        "data.rejectUserAccountDeleteRequest.data"
      );

      // this.context.endLoading();

      showNotification(
        "success",
        "User Deleted!",
        "User has been deleted successfully!"
      );
      this.setState({ allUsers });
      this.forceUpdate();
    } else {
      // this.context.endLoading();

      showNotification(
        "error",
        "An Error Occured",
        get(denyRequest, "data.rejectUserAccountDeleteRequest.message")
      );
    }
  };

  fetchTaskCategories = async () => {
    const getTaskCategories = await this.props.client.query({
      query: AdminQueries.getTaskCategories
    });

    if (get(getTaskCategories, "data.getTaskCategories.success")) {
      let taskCategories = get(
        getTaskCategories,
        "data.getTaskCategories.data"
      );

      let updateAr = taskCategories.map((doc, i) => {
        doc["docRaw"] = [];
      });

      await Promise.all(updateAr);

      this.setState({
        taskCategories: { taskCategories }
      });
      this.forceUpdate();
    }
  };

  fetchChartOfAccount = async formData => {
    const getChartOfAccount = await this.props.client.query({
      query: AccountQueries.fetchChartOfAccount
    });

    if (get(getChartOfAccount, "data.getChartOfAccount.success")) {
      let chartOfAccounts = get(
        getChartOfAccount,
        "data.getChartOfAccount.data"
      );

      this.setState({ chartOfAccounts });
      this.forceUpdate();
    }
  };

  fetchPaymentHistory = async () => {
    const getPaymentHistory = await this.props.client.query({
      query: AdminQueries.retrievePaymentHistory
    });

    if (get(getPaymentHistory, "data.retrievePaymentHistory.success")) {
      let paymentHistory = get(
        getPaymentHistory,
        "data.retrievePaymentHistory.data"
      );

      this.setState({ paymentHistory });
      this.forceUpdate();
    }
  };

  fetchScreeningOrders = async () => {
    const getOrderHistory = await this.props.client.query({
      query: AdminQueries.fetchScreeningList
    });

    if (get(getOrderHistory, "data.fetchScreeningList.success")) {
      let orders = get(getOrderHistory, "data.fetchScreeningList.data");

      this.setState({ screeningOrders: orders.reverse() });
      this.forceUpdate();
    }
  };

  addChartOfAccount = async formData => {
    // this.context.startLoading();
    const addChartOfAccount = await this.props.client.mutate({
      mutation: AccountQueries.addChartOfAccount,
      variables: formData
    });

    if (get(addChartOfAccount, "data.createChartOfAccount.success")) {
      let chartOfAccounts = get(
        addChartOfAccount,
        "data.createChartOfAccount.data"
      );
      showNotification("success", "Chart of Account Added!", "");
      // this.context.endLoading();
      this.setState({ closeCoaDrawer: true, chartOfAccounts });
    } else {
      showNotification(
        "error",
        "An error occured",
        get(addChartOfAccount, "data.createChartOfAccount.message")
      );
    }
  };

  updateChartOfAccount = async formData => {
    this.setState({ closeCoaDrawer: false });
    // this.context.startLoading();
    const updateChartOfAccount = await this.props.client.mutate({
      mutation: AccountQueries.updateChartOfAccount,
      variables: formData
    });

    if (get(updateChartOfAccount, "data.updateChartOfAccount.success")) {
      showNotification("success", "Chart of Account Updated!", "");

      let chartOfAccounts = get(
        updateChartOfAccount,
        "data.updateChartOfAccount.data"
      );
      // this.context.endLoading();
      this.setState({ closeCoaDrawer: true, chartOfAccounts });
    } else {
      showNotification(
        "error",
        "An error occured",
        get(updateChartOfAccount, "data.updateChartOfAccount.message")
      );
    }
  };

  updateAccreditations = async formData => {
    // this.context.startLoading();
    const updateAccreditation = await this.props.client.mutate({
      mutation: AdminQueries.updateAccreditation,
      variables: { accreditations: formData }
    });

    if (get(updateAccreditation, "data.updateAccreditation.success")) {
      showNotification("success", "Accreditation Updated!", "");

      let accreditations = get(
        updateAccreditation,
        "data.updateAccreditation.data.accreditations"
      );
      // this.context.endLoading();
      this.setState({ accreditations: accreditations });
    } else {
      showNotification(
        "error",
        "An error occured",
        get(updateAccreditation, "data.updateAccreditation.message")
      );
    }
  };

  addTaskCategories = async data => {
    // this.context.startLoading();
    const createTaskCategory = await this.props.client.mutate({
      mutation: AdminQueries.createTaskCategory,
      variables: { taskCategories: data }
    });

    if (get(createTaskCategory, "data.updateTaskCategories.success")) {
      showNotification("success", "Accreditation Updated!", "");

      let taskCategories = get(
        createTaskCategory,
        "data.updateTaskCategories.data"
      );
      // this.context.endLoading();
      this.setState({
        taskCategories: { taskCategories: taskCategories }
      });
    } else {
      showNotification(
        "error",
        "An error occured",
        get(createTaskCategory, "data.updateTaskCategories.message")
      );
    }
  };

  setDocumentStatus = async data => {
    // this.context.startLoading();
    const updateDocStatus = await this.props.client.mutate({
      mutation: AdminQueries.updateDocumentAdmin,
      variables: {
        documentId: data.record._id,
        status: data.type,
        description: "No Special Reason"
      }
    });

    // console.log(
    //   "updateDocStatusupdateDocStatusupdateDocStatus",
    //   updateDocStatus
    // );

    if (get(updateDocStatus, "data.updateDocument.success")) {
      showNotification("success", "Document Status Updated!", "");
      // this.context.endLoading();
    } else {
      showNotification(
        "error",
        "An error occured",
        get(updateDocStatus, "data.updateDocument.message")
      );
      // this.context.startLoading();
    }
  };

  setScreeningOrderStatus = async data => {
    // this.context.startLoading();
    const updateDocStatus = await this.props.client.mutate({
      mutation: AdminQueries.changeScreeningStatus,
      variables: {
        screeningId: data.record._id,
        status: data.type
      }
    });

    // console.log(
    //   "updateDocStatusupdateDocStatusupdateDocStatus",
    //   updateDocStatus
    // );

    if (get(updateDocStatus, "data.changeScreeningStatus.success")) {
      showNotification("success", "Order Status Updated!", "");
      // this.context.endLoading();
    } else {
      showNotification(
        "error",
        "An error occured",
        get(updateDocStatus, "data.changeScreeningStatus.message")
      );
      // this.context.startLoading();
    }
  };

  userAction = async formData => {
    this.setState({ closeCoaDrawer: false });
    // this.context.startLoading();
    const updateChartOfAccount = await this.props.client.mutate({
      mutation: AdminQueries.userActionQuery,
      variables: formData
    });

    if (get(updateChartOfAccount, "data.updateUserAccountSetting.success")) {
      showNotification(
        "success",
        "User Updated!",
        get(updateChartOfAccount, "data.updateUserAccountSetting.message")
      );

      this.fetchAllUsers();
      // this.context.endLoading();
    } else {
      showNotification(
        "error",
        "An error occured",
        get(updateChartOfAccount, "data.updateUserAccountSetting.message")
      );
    }
  };

  render() {
    let userData = get(this.context, "userData.authentication.data");
    let userRole = get(this.context, "userData.authentication.data.role");
    const { match } = this.props;
    let { collapsed, accreditations } = this.state;

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

    let {
      chartOfAccounts,
      closeCoaDrawer,
      allUsers,
      deleteRequests,
      exportRequests,
      paymentHistory,
      verificationDocList,
      taskCategories,
      screeningOrders,
      propertyTypes,
      flaggedReports
    } = this.state;

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
                src={
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                }
                alt=""
                className="header__logo"
              />

              <form className="form-inline my-0 site_search">
                <Popover
                  placement="bottomLeft"
                  title={null}
                  content={"Hello"}
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

              <p>Logged in as - {get(userData, "role")}</p>

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

                </div>
              </Sider>

              <Content
                className={
                  !collapsed
                    ? "right__container--part right__container--padding"
                    : "right__container--part"
                }
              >
                <Switch>
                  <Route exact path={`${match.url}`}>
                    <Redirect to={`${match.url}/dashboard`} />
                  </Route>
                  <Route path={`${match.url}/dashboard`}>
                    <Dashboard userData={userData} {...this.props} />
                  </Route>

                  {/* <Route path={`${match.url}/chartOfAccount`}>
                    <ChartOfAccount
                      chartOfAccounts={chartOfAccounts}
                      fetchChartOfAccount={this.fetchChartOfAccount}
                      addChartOfAccount={this.addChartOfAccount}
                      ChartOfAccountSchema={ChartOfAccountSchema}
                      closeCoaDrawer={closeCoaDrawer}
                      updateChartOfAccount={this.updateChartOfAccount}
                      {...this.props}
                    />
                  </Route> */}
                  <Route path={`${match.url}/users`}>
                    <AllUsers
                      userAction={this.userAction}
                      deleteUser={this.deleteUser}
                      allUsers={allUsers}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/exportRequests`}>
                    <Exports
                      updateExportRequest={this.updateExportRequest}
                      exportRequests={exportRequests}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/deleteRequests`}>
                    <DeleteRequests
                      deleteUser={this.deleteUser}
                      denyRequest={this.denyRequest}
                      deleteRequests={deleteRequests}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/accrediations`}>
                    <Accrediations
                      accreditations={accreditations}
                      updateAccreditations={this.updateAccreditations}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/paymentHistory`}>
                    <PaymentHistory
                      paymentHistory={paymentHistory}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/docVerification`}>
                    <DocumentVerificationRequest
                      setDocumentStatus={this.setDocumentStatus}
                      verificationDocList={verificationDocList}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/taskCategory`}>
                    <AddTaskCategory
                      addTaskCategories={this.addTaskCategories}
                      taskCategories={taskCategories}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/propertySubtype`}>
                    <AddPropertySubcategory
                      updatePropertySubtypes={this.updatePropertySubtypes}
                      propertyTypes={propertyTypes}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/screeningOrders`}>
                    <ScreeningOrdersHistory
                      addTaskCategories={this.addTaskCategories}
                      setDocumentStatus={this.setDocumentStatus}
                      screeningOrders={screeningOrders}
                      setScreeningOrderStatus={this.setScreeningOrderStatus}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/reports`}>
                    <Reports
                      flaggedReports={flaggedReports}
                      requestUpdate={this.requestUpdate}
                      {...this.props}
                    />
                  </Route>

                  <Route path={`${match.url}/rates`}>
                    <UpdateRates {...this.props} />
                  </Route>

                  <Route path={`${match.url}/services`}>
                    <AdminServices />
                  </Route>

                  {/*  */}
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </div>
      </>
    );
  }
}

export default withApollo(LandlordMain);
