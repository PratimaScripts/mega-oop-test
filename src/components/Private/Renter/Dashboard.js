import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import Greeting from "../../../config/Greeting";
import AdminQueries from "../../../config/queries/admin";
import moment from "moment";
import get from "lodash/get";
import "./Dashboard.scss";
import { Link, useHistory } from "react-router-dom";
import { Tag } from "antd";
import { useQuery } from "react-apollo";
import { MessageFilled } from "@ant-design/icons";
import { UserDataContext } from "store/contexts/UserContext";

const Dashboard = (props) => {
  const [dashboardData, setDashboardData] = React.useState({});
  const { state: userState } = useContext(UserDataContext);

  const history = useHistory();

  let { userData } = props;
  useQuery(AdminQueries.getRenterDashboardInfo, {
    onCompleted: (data) => {
      if (data) {
        setDashboardData(data.getRenterDashboardInfo);
      }
    },
  });

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
                                Renter Property
                              </p>
                              <h5 className="mb-0">
                                {dashboardData?.rentedProperties || 0}
                              </h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div>
                              <p className="text-muted text-truncate mb-2">
                                Landlord
                              </p>
                              <h5 className="mb-0">
                                {dashboardData?.myContactsLanloard || 0}
                              </h5>
                            </div>
                          </div>
                          <div className="col-4">
                            <div>
                              <p className="text-muted text-truncate mb-2">
                                ServicePro
                              </p>
                              <h5 className="mb-0">
                                {dashboardData?.myContactsServicePro || 0}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-none d-lg-block col-lg-4">
                      <div className="clearfix mt-4 mt-lg-0">
                        <div className="float-right">
                          <button
                            className="btn btn__update--profile"
                            onClick={() =>
                              history.push("/renter/settings/info")
                            }
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
                      <div className="clearfix mt-4 mt-lg-0">
                        <div className="float-right">
                          <a
                            className="btn btn-outline-primary btn__activate_webpage"
                            href={process.env.REACT_APP_PUBLIC_URL}
                            style={{ width: 165 }}
                          >
                            Find Home
                          </a>
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
                    <MessageFilled className="icon" size="small" />
                    <div className="info">
                      <h4>Unread Messages</h4>
                      <p>{userState.uiData.unreadMessageCount}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-bank"></i>
                    <div className="info">
                      <h4>Appoinments</h4>
                      <p>{dashboardData?.upcomingEvents || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-creative-commons"></i>
                    <div className="info">
                      <h4>Invoices Unpaid</h4>
                      <p>
                        <span className="mdi mdi-currency-gbp">
                          {dashboardData?.unpaidInvoices}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-apple-icloud"></i>
                    <div className="info">
                      <h4>Invoices Paid</h4>
                      <p>
                        <span className="mdi mdi-currency-gbp">
                          {" "}
                          {dashboardData?.paidInvoices}
                        </span>
                      </p>
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
                          <Link to="/renter/wishlist">
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-office-building"></i>
                            </div>
                          </Link>
                          <Link
                            to="/renter/wishlist"
                            className="users-list-name"
                          >
                            <div className="mb-4">View Wish List</div>
                          </Link>
                        </div>

                        <div className="col shadow-sm">
                          <Link to="/renter/messenger">
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-chat"></i>
                            </div>
                          </Link>
                          <Link
                            to="/renter/messenger"
                            className="users-list-name"
                          >
                            <div className="mb-4">Send Chat Message</div>
                          </Link>
                        </div>

                        <div className="col shadow-sm">
                          <Link to="/renter/fixit/raisetask">
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-hand-pointing-right"></i>
                            </div>
                          </Link>
                          <Link
                            to="/renter/fixit/raisetask"
                            className="users-list-name"
                          >
                            <div className="mb-4">Raise FixIt Tasks</div>
                          </Link>
                        </div>
                        <div className="w-100"></div>
                        <div className="col shadow-sm">
                          <Link
                            to={{
                              pathname: `/renter/contacts`,
                              fromDashboard: true,
                            }}
                          >
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-account-multiple-plus-outline"></i>
                            </div>
                          </Link>
                          <Link
                            to={{
                              pathname: `/renter/contacts`,
                              fromDashboard: true,
                            }}
                            className="users-list-name"
                          >
                            <div className="mb-4">Add New Contact</div>
                          </Link>
                        </div>
                        <div className="col shadow-sm">
                          <Link to="/renter/fixit/raisetask">
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-download"></i>
                            </div>
                          </Link>
                          <Link to="" className="users-list-name">
                            <div className="mb-4">Download Rent Receipts</div>
                          </Link>
                        </div>
                        <div className="col shadow-sm">
                          <Link
                            to={{
                              pathname: `/renter/calendar`,
                              fromDashboard: true,
                            }}
                          >
                            <div className="widget-small primary coloured-icon align-items-center">
                              <i className="icon mdi mdi-calendar"></i>
                            </div>
                          </Link>
                          <Link
                            to={{
                              pathname: `/renter/calendar`,
                              fromDashboard: true,
                            }}
                            className="users-list-name mb-3"
                          >
                            <div className="mb-4">Add New Reminder</div>
                          </Link>
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
              <div className="col-sm-12 col-md-6 d-flex align-items-stretch">
                <div className="box">
                  <h3 className="box-title">Market Trend</h3>
                  <div className="no_data text-center align-self-center">
                    <span className="mdi mdi-cloud-outline"></span>
                    <small>No data found</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// }

export default Dashboard;
