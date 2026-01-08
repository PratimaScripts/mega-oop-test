import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import AdminQuery from "../../../config/queries/admin";
import "./Dashboard.scss";
import moment from "moment"


const Dashboard = props => {
  const { data } = useQuery(AdminQuery.fetchAdminDashboardInfo);

  let apiData = get(data, "fetchAdminDashboardInfo.data");
  let roleData = get(apiData, "roleData");
  let screeningSets = get(apiData, "screeningOrderData");

  let userData = {
    labels: ["Landlord", "Tenant", "ServicePro", "Support"],
    datasets: [
      {
        data: [100, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ]
  };

  let screeningData = {
    labels: ["Landlord", "Tenant", "ServicePro", "Support"],
    datasets: [
      {
        data: [100, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ]
  };

  if (!isEmpty(screeningSets)) {
    userData.datasets = [
      {
        data: [
          get(find(roleData, { role: "landlord" }), "count", 0),
          get(find(roleData, { role: "renter" }), "count", 0),
          get(find(roleData, { role: "servicepro" }), "count", 0),
          get(find(roleData, { role: "invitee" }), "count", 0)
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ];
  }

  if (!isEmpty(roleData)) {
    screeningData.datasets = [
      {
        data: [
          get(find(screeningSets, { role: "landlord" }), "count", 0),
          get(find(screeningSets, { role: "renter" }), "count", 0),
          get(find(screeningSets, { role: "servicepro" }), "count", 0),
          get(find(screeningSets, { role: "invitee" }), "count", 0)
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ];
  }

  return (
    <>
      <div className="home_">
        <div className="container">
          <div className="row welcome text-center">
            <div className="col-12">
              <h2>
                Good morning , here is the current status of your properties
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nam
                cursus. Morbi ut mi. Nullam enim leo, egestas id, condimentum
                at, laoreet mattis, massa. Sed eleifend nonummy diam.
              </p>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-office-building"></i>
                    <div className="info">
                      <h4>Listed Properties</h4>
                      <p>120</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-bank"></i>
                    <div className="info">
                      <h4>Rented Properties</h4>
                      <p>25</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-3">
                <div className="card widget-dashboard">
                  <div className="widget-small primary coloured-icon">
                    <i className="icon mdi mdi-creative-commons"></i>
                    <div className="info">
                      <h4>Total Payment</h4>
                      <p>
                        <span className="mdi mdi-currency-gbp"></span>{" "}
                        {get(apiData, "totalPayout")}
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
                      <h4>Screening Orders</h4>
                      <p> {get(apiData, "screeningOrderCount")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-6 d-flex align-items-stretch">
                <div className="box">
                  <h3 className="box-title">Users</h3>
                  <div id="container">
                    <Pie data={userData} />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-12 col-xl-6 d-flex align-items-stretch ">
                <div className="box">
                  <h3 className="box-title">Last 5 Users</h3>
                  <ul className="users-list clearfix">
                    {!isEmpty(get(apiData, "userData")) &&
                      get(apiData, "userData").map((u, i) => {
                        return (
                          <li key={i}>
                            <img src={u.avatar} alt="img" />
                            <a href className="users-list-name">
                              {u.email}
                            </a>
                            <span className="users-list-date">
                              {moment(u.createdAt).format("DD-MM-YYYY HH:MM:S")}
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 d-flex align-items-stretch">
                <div className="box">
                  <h3 className="box-title">Property Listing Summary</h3>
                  <div
                    id="example_wrapper"
                    className="dataTables_wrapper table-responsive dt-bootstrap4 no-footer"
                  >
                    <div className="row">
                      <div className="col-sm-12">
                        <table
                          id="example"
                          className="display dataTable no-footer"
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
              </div>
              <div className="col-12 col-lg-12 col-xl-6 d-flex align-items-stretch">
                <div className="box">
                  <h3 className="box-title">Market Trend</h3>
                  <div id="container">
                    <Bar data={screeningData} />
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

export default Dashboard;
