import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import Greeting from "../../../config/Greeting";
import moment from "moment";
import get from "lodash/get";
import "./Dashboard.scss";
import { Link } from "react-router-dom";
import { Tag } from "antd";
// import { useHistory } from "react-router-dom";
import AdminQueries from "../../../config/queries/admin";
import { useQuery, useMutation } from "@apollo/react-hooks";
import showNotification from "config/Notification";
import { Modal, Input, Button } from "antd";
import ViewWebpageButton from "./ServiceProSideNavs/MyServices/ViewWebpageButton";

const Dashboard = (props) => {
  const { data: allusernames } = useQuery(AdminQueries.usernameList);

  // const { data: findUserRecord } = useQuery(AdminQueries.findUsername, {
  //   variables: { userId: props.userData._id },
  // });

  useQuery(AdminQueries.getServiceProDashboardInfo, {
    onCompleted: (data) => {
      if (data) {
        setDashboardData(data.getServiceProDashboardInfo);
      }
    },
  });

  const [dashboardData, setDashboardData] = useState({});

  //usernameIsAvailable,
  const [setUsernameIsAvailable] = useState();
  const [openActivation, setOpenActivation] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  const data = {
    labels: ["Todo", "InProgress", "Resolved", "Completed"],
    datasets: [
      {
        data: [
          dashboardData?.totalToDo,
          dashboardData?.totalInProgress,
          dashboardData?.totalResolved,
          dashboardData?.totalCompleted,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#6853E0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#6853E0"],
      },
    ],
  };

  const handleInput = (e) => {
    const value = e.target.value;
    if (!value) {
      return setUsernameStatus("Please enter a username.");
    }
    setUsernameInput(value);
    setUsernameIsValid(true);
    setUsernameStatus("Looks Good");
  };

  const [createUsername] = useMutation(AdminQueries.createUsernameList, {
    onCompleted: (response) => {
      if (response.createUsernameList.success) {
        setUsernameStatus("Successfully Activated");
        // props.history.push("/");
        setOpenActivation(false);
        showNotification(
          "success",
          "Successfully Activated",
          "Username Successfully Activated"
        );
        setUsernameIsAvailable(response.createUsernameList.data.userName);
      } else {
        setUsernameStatus(response.createUsernameList.message);
      }
    },
    onError: (error) => {
      showNotification("error", "Error!", "Oops ! There is some Error");
      // console.log("error", error);
    },
  });

  const activatePortfolio = async () => {
    if (allusernames && usernameIsValid) {
      let usernames = allusernames.usernameList.data;
      let isAvailable = true;
      await usernames.map((username) => {
        if (username.userName === usernameInput) {
          isAvailable = false;
          setUsernameStatus("Sorry ! Username Is Not Available");
        }
        return true;
      });

      if (isAvailable) {
        createUsername({
          variables: {
            userId: props.userData._id,
            userName: usernameInput.toLowerCase(),
            activateLandlord: true,
          },
        });
      } else {
        setUsernameStatus("Username Is Already In Use");
      }
    }
  };
  let { userData } = props;
  return (
    <>
      <div className="home_">
        <div className="container">
          <div className="row welcome text-center">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="d-flex">
                        <div className="me-3">
                          <img
                            src={`${
                              get(userData, "avatar")
                                ? get(userData, "avatar")
                                : ""
                            }`}
                            alt=""
                            className="avatar-md rounded-circle img-thumbnail"
                          />
                          <Tag
                            className="mt-2"
                            style={{
                              height: "20px",
                              fontSize: "11px",
                              padding: "2px",
                              width: "80%",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                          >
                            Partially Verified
                          </Tag>
                        </div>
                        <div className="leftBox flex-1 align-self-center ml-3">
                          <div className="text-muted">
                            <p className="mb-2">
                              Good {Greeting(moment())}{" "}
                              <strong>{`${
                                get(userData, "firstName")
                                  ? get(userData, "firstName")
                                  : ""
                              }`}</strong>
                              , Welcome to RentOnCloud Dashboard
                            </p>
                            <h5 className="mb-1">
                              {`${
                                get(userData, "firstName")
                                  ? get(userData, "firstName")
                                  : ""
                              }`}{" "}
                              {`${
                                get(userData, "lastName")
                                  ? get(userData, "lastName")
                                  : ""
                              }`}
                            </h5>
                            <p className="mb-0">
                              {`${
                                get(userData, "role").toUpperCase()
                                  ? get(userData, "role").toUpperCase()
                                  : ""
                              }`}
                            </p>
                            <div
                              className="progress mb-1 mt-2"
                              style={{ height: "12px" }}
                            >
                              <div
                                className="progress-bar bg-danger"
                                style={{ width: "30%" }}
                              >
                                {" "}
                                30%{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="align-self-center col-lg-4">
                      <div className="text-lg-center mt-4 mt-lg-0">
                        <div className="row">
                          <div className="col-4">
                            <div>
                              <p className="text-muted text-truncate mb-2">
                                Offers To-Do
                              </p>
                              <h5 className="mb-0">
                                {dashboardData?.totalToDo}
                              </h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div>
                              <p className="text-muted text-truncate mb-2">
                                Fix In-Progress
                              </p>
                              <h5 className="mb-0">
                                {dashboardData?.totalInProgress}
                              </h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div>
                              <p className="text-muted text-truncate mb-2">
                                Direct Orders
                              </p>
                              <h5 className="mb-0">
                                {dashboardData?.directOrders}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-none d-lg-block col-lg-4">
                      <div className="clearfix mt-4 mt-lg-0">
                        <div className="float-right">
                          <Link
                            to="servicepro/settings/info"
                            className="btn btn__update--profile"
                          >
                            Update Profile
                          </Link>
                        </div>
                      </div>
                      <div className="clearfix mt-4 mt-lg-0">
                        <div className="float-right">
                          <ViewWebpageButton userData={props.userData} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="row">
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-file-document-outline"></i>
                    <div className="info">
                      <h4>Listed Services</h4>
                      <p>{dashboardData?.listedServices}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-account-group"></i>
                    <div className="info">
                      <h4>Total Clients</h4>
                      <p>{dashboardData?.myClients}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-currency-gbp"></i>
                    <div className="info">
                      <h4>Money Earned</h4>
                      <p>
                        <span className="mdi mdi-currency-gbp">
                          {dashboardData?.earnedMoney +
                            dashboardData?.unpaidMoney}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-currency-usd-off"></i>
                    <div className="info">
                      <h4>Money Unpaid</h4>
                      <p>
                        <span className="mdi mdi-currency-gbp">
                          {dashboardData?.unpaidMoney}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <span class="material-icons"></span>
                    <i className="icon mdi mdi-shopping"></i>
                    <div className="info">
                      <h4>Direct Order</h4>
                      <p>{dashboardData?.directOrders}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-6 d-flex align-items-stretch">
                <div className="box">
                  <h3 className="box-title">Fixit Maintenance Tasks</h3>
                  <div id="container">
                    {!dashboardData?.totalToDo &&
                    !dashboardData?.totalInProgress &&
                    !dashboardData?.totalResolved &&
                    !dashboardData?.totalCompleted ? (
                      <p className="text-center mt-5">No data Found</p>
                    ) : (
                      <Doughnut data={data} />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-12 col-xl-6 d-flex align-items-stretch ">
                <div className="box">
                  <h3 className="box-title">Quick Buttons</h3>
                  <ul className="users-list clearfix mt-4">
                    <div className="container">
                      <div className="row">
                        <div className="col shadow-sm">
                          <Link to="/servicepro/myservices/new">
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-file-document-outline"></i>
                            </div>
                          </Link>
                          <div className="mb-4">
                            <Link
                              to="/servicepro/myservices/new"
                              className="users-list-name"
                            >
                              Add New Services
                            </Link>
                          </div>
                        </div>
                        <div className="col shadow-sm">
                          <Link to="/servicepro/findit">
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-comment-quote"></i>
                            </div>
                          </Link>
                          <div className="mb-4">
                            <Link
                              to="/servicepro/findit"
                              className="users-list-name"
                            >
                              Send Quote Offer
                            </Link>
                          </div>
                        </div>
                        <div className="col shadow-sm">
                          <Link to="/servicepro/fixit">
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-hand-pointing-right"></i>
                            </div>
                          </Link>
                          <div className="mb-4">
                            <Link
                              to="/servicepro/fixit"
                              className="users-list-name"
                            >
                              To do FixIt Tasks
                            </Link>
                          </div>
                        </div>
                        <div className="w-100"></div>
                        <div className="col shadow-sm">
                          <Link
                            to={{
                              pathname: `/servicepro/contacts`,
                              fromDashboard: true,
                            }}
                            className="users-list-name"
                          >
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-account-multiple-plus-outline"></i>
                            </div>
                          </Link>
                          <div className="mb-4">
                            <Link
                              to={{
                                pathname: `/servicepro/contacts`,
                                fromDashboard: true,
                              }}
                              className="users-list-name"
                            >
                              Add New Contact
                            </Link>
                          </div>
                        </div>
                        <div className="col shadow-sm">
                          <Link
                            to="servicepro/mymoney"
                            className="users-list-name"
                          >
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-contactless-payment"></i>
                            </div>
                          </Link>
                          <div className="mb-4">
                            <Link
                              to="servicepro/mymoney"
                              className="users-list-name"
                            >
                              Raise New Payout
                            </Link>
                          </div>
                        </div>
                        <div className="col shadow-sm">
                          <Link
                            to={{
                              pathname: `/servicepro/calendar`,
                              fromDashboard: true,
                            }}
                            className="users-list-name mb-3"
                          >
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-calendar"></i>
                            </div>
                          </Link>
                          <div className="mb-4">
                            <Link
                              to={{
                                pathname: `/servicepro/calendar`,
                                fromDashboard: true,
                              }}
                              className="users-list-name mb-3"
                            >
                              Add New Reminder
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-sm-6 d-flex align-items-stretch">
                  <div className="box">
                    <h3 className="box-title">Property Listing Summary</h3>
                    <div
                      id="example_wrapper"
                      className="dataTables_wrapper dt-bootstrap4 no-footer"
                    >
                      <div className="row">
                        <div className="col-sm-12">
                          <table
                            id="example"
                            className="display table-responsive dataTable no-footer"
                            role="grid"
                          >
                            <thead>
                              <tr role="row">
                                <th className="table_head">Property Name</th>
                                <th className="table_head">Location</th>
                                <th className="table_head"># Rooms</th>
                                <th className="table_head">Size (sq.ft.)</th>
                                <th className="table_head">Rent p/m</th>
                                <th className="table_head">Status</th>
                              </tr>
                            </thead>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              {openActivation && (
                <Modal
                  visible={openActivation}
                  footer={null}
                  title="Activate Business Website"
                  centered
                  onCancel={() => setOpenActivation(false)}
                  onOk={() => setOpenActivation(false)}
                  style={{
                    top: 10,
                    overflow: "auto",
                  }}
                  className="custom"
                >
                  <div className="mx-3 my-4">
                    <p className="mb-3" style={{ fontSize: "14px" }}>
                      Choose my website listing page name
                    </p>

                    {/* <Input
                        addonBefore="www.rentoncloud.com/servicepro/"
                        defaultValue="Enter Website Name"
                        className="input-field"
                      /> */}

                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span
                          className="prepend-text"
                          style={{ backgroundColor: "#e9ecef;" }}
                          id="basic-addon2"
                        >
                          www.rentoncloud.com/servicepro/
                        </span>
                      </div>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Enter Website Name"
                        aria-label="website-url"
                        aria-describedby="website-url"
                        onChange={handleInput}
                      />
                    </div>
                    <p>{usernameStatus}</p>
                    <p className="text-center">
                      <Button
                        className="btn btn__activate_webpage_modal my-3"
                        onClick={activatePortfolio}
                      >
                        Activate My Webpage
                      </Button>
                    </p>
                  </div>
                </Modal>
              )}
              {/* <div className="col-sm-6 d-flex align-items-stretch">
                  <div className="box">
                    <h3 className="box-title">Market Trend</h3>
                    <div className="no_data text-center align-self-center">
                      <span className="mdi mdi-cloud-outline"></span>
                      <small>No data found</small>
                    </div>
                  </div>
                </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
