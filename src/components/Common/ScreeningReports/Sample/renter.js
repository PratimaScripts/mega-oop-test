import React from "react";

import "../landlordReport.scss";

class LandlordScreeningReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <div className="report__wrapper">
          <div className="col-md-8">
            <div className="landlordscreen--report">
              <img
                alt=""
                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/cornerstyle.png"
                className="corner__style"
              />
              <div className="screen_header">
                <div className="container">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="left_content">
                        <p>
                          <b>Free Property Agent Ltd.</b>
                        </p>
                        <p>Company: 123456789</p>
                        <p>ICO: 123456789</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="center_content">
                        <p>TENANT SCREENING REPORT</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="right_content">
                        <img alt="Zypass" src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypassfull.png" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="screen_content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-name pt-3">
                          <h4>Rajiv Singh</h4>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-proccess pt-3">
                          <p>
                            processed on{" "}
                            <span>
                              <b>20-03-2019</b>
                            </span>{" "}
                            at 10:20AM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Applicant Details</h4>
                          <div className="user_image">
                            <i className="fas fa-user"></i>
                          </div>
                        </div>
                      </div>
                      <div className="right__bar">
                      <p>This is the information entered by the applicant; few texts are hidden due to data privacy</p>
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Date Of Birth</th>
                                <td>**/**/****</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Mobile</th>
                                <td>132564****</td>
                              </tr>
                              <tr>
                                <th>Email</th>
                                <td>gu*****84@gmail.com</td>
                              </tr>
                              <tr>
                                <th>Current Address</th>
                                <td>
                                  *** Lorem Ipsum is simply dummy text of the
                                  dsfg dsfg dsfg sdfgprinting and typesetting
                                  industry ***
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Report Summary</h4>
                          <p>Risk level report is based on Equifax Risk score analysis<a href>Read more</a></p>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info-btn d-flex">
                        <button className="btn mr-2">
                            <i className="fas fa-play-circle"></i>Proceed
                          </button>                          
                          <button className="btn btn_risk">
                            <i className="fas fa-times-circle"></i>Low Risk
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Identity & Address</h4>
                          <i className="fas fa-address-card"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Identity</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Confirmed
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Address</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Supplied
                                  Address found
                                </td>
                              </tr>
                              <tr>
                                <th>Alias</th>
                                <td>
                                  <i className="fas fa-exclamation-circle"></i>
                                  Alias were found
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Credit Check</h4>
                          <i className="fas fa-search-location"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Judgement</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Confirmed
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Insolvencies</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Supplied
                                  Address found
                                </td>
                              </tr>
                              <tr>
                                <th>Disputes and corrections</th>
                                <td>
                                  <i className="fas fa-exclamation-triangle"></i>
                                  Deceased identity fraud was found
                                </td>
                              </tr>
                              <tr>
                                <th>Adverse debt (DRO/DAS)</th>
                                <td>
                                  <i className="fas fa-exclamation-circle"></i>
                                  Deceased identity fraud was found
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Mobile & Email Verifiction</h4>
                          <i className="fas fa-phone-alt"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Mobile</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Confirmed
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Email</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Supplied
                                  Address found
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Income Reference</h4>
                          <i className="fas fa-pound-sign"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Employment reference</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Confirmed
                                </td>
                              </tr>
                              <tr>
                                <th></th>
                                <td>Confirmed</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Email</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Supplied
                                  Address found
                                </td>
                              </tr>
                              <tr>
                                <th></th>
                                <td>Confirmed</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>UK Bank Account</h4>
                          <i className="fas fa-university"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Bank account & branch</th>
                                <td>
                                  <span>
                                    <i className="fas fa-exclamation-circle"></i>
                                    Confirmed
                                  </span>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Direct debit accepted</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Supplied
                                  Address found
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Past Rental</h4>
                          <i className="fas fa-money-bill-alt"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Landlord or agency reference</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Confirmed
                                </td>
                              </tr>
                              <tr>
                                <th></th>
                                <td>Confirmed</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Email</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Supplied
                                  Address found
                                </td>
                              </tr>
                              <tr>
                                <th></th>
                                <td>Confirmed</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Right to rent</h4>
                          <i className="fas fa-money-bill-alt"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Preliminary check</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Confirmed
                                </td>
                              </tr>
                              <tr>
                                <th></th>
                                <td>Confirmed</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Email</th>
                                <td>
                                  <i className="fas fa-check-circle"></i>Supplied
                                  Address found
                                </td>
                              </tr>
                              <tr>
                                <th></th>
                                <td>Confirmed</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="left__bar">
                        <div className="user-detail">
                          <h4>Self-Declaration</h4>
                          <i className="fas fa-tasks"></i>
                        </div>
                      </div>
                      <div className="right__bar">
                        <div className="user-info">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Number of Adults</th>
                                <td>**/**/****</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Number of Kids</th>
                                <td>132564****</td>
                              </tr>
                              <tr>
                                <th>Number of Pets</th>
                                <td>gu*****84@gmail.com</td>
                              </tr>
                              <tr>
                                <th>Disability assistance</th>
                                <td>
                                  *** Lorem Ipsum is simply dummy text of the
                                  dsfg dsfg dsfg sdfgprinting and typesetting
                                  industry ***
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer_wrap">
                <p>
                  <span>
                    <b>Disclaimer:</b>
                  </span>{" "}
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LandlordScreeningReport;
