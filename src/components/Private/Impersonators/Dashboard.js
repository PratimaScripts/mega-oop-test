import React from "react";
import { Doughnut } from "react-chartjs-2";
import get from "lodash/get";
import { Link } from "react-router-dom";

import "./Dashboard.scss";

const data = {
  labels: ["Red", "Green", "Yellow"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    }
  ]
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let { userData } = this.props;

    return (
      <>
        <div className="home_">
          <div className="container">
            <div className="row welcome text-center">
              <div className="col-12">
                <h2>
                  Good morning{" "}
                  <strong>{`${get(userData, "firstName") ? get(userData, "firstName") : ""
                    }`}</strong>
                  , here is the current status of your properties
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
                        <h4>Invoices Unpaid</h4>
                        <p>
                          <span className="mdi mdi-currency-gbp"></span> 1200.50
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
                        <h4>Other Statistics</h4>
                        <p>
                          <span className="mdi mdi-currency-gbp"> 1200.50</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-12 col-xl-6 d-flex align-items-stretch">
                  <div className="box">
                    <h3 className="box-title">Listed vs Non-listed</h3>
                    <div id="container">
                      <Doughnut data={data} />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-12 col-xl-6 d-flex align-items-stretch ">
                  <div className="box">
                    <h3 className="box-title">Latest Member</h3>
                    <ul className="users-list clearfix">
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="#0" className="users-list-name">
                          Alexander Pierce
                        </Link>
                        <span className="users-list-date">Today</span>
                      </li>
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="" className="users-list-name">
                          Norman
                        </Link>
                        <span className="users-list-date">Yesterday</span>
                      </li>
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="" className="users-list-name">
                          Jane
                        </Link>
                        <span className="users-list-date">12 Jan</span>
                      </li>
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="" className="users-list-name">
                          John
                        </Link>
                        <span className="users-list-date">12 Jan</span>
                      </li>
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="" className="users-list-name">
                          Alexander
                        </Link>
                        <span className="users-list-date">13 Jan</span>
                      </li>
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="" className="users-list-name">
                          Sarah
                        </Link>
                        <span className="users-list-date">14 Jan</span>
                      </li>
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="" className="users-list-name">
                          Nora
                        </Link>
                        <span className="users-list-date">15 Jan</span>
                      </li>
                      <li>
                        {/* <img src={image2} alt="img" /> */}
                        <Link to="" className="users-list-name">
                          Nadia
                        </Link>
                        <span className="users-list-date">15 Jan</span>
                      </li>
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
                </div>
                <div className="col-sm-6 d-flex align-items-stretch">
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
  }
}

export default Dashboard;
