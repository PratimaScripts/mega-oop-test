import React, { useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import ScreeningQuery from "../../../../config/queries/screening";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { UserDataContext } from "store/contexts/UserContext"

import "../landlordReport.scss";

const ServiceProScreeningReport = props => {
  const { state: userState } = useContext(UserDataContext)
  const { profileInfo } = userState
  const profileConnectInfo = get(profileInfo, "ProfileConnect", {});
  let { id } = useParams();
  const componentRef = useRef();

  const { data } = useQuery(ScreeningQuery.getScreeningReportInformation, {
    variables: {
      screeningId: id
    }
  });



  let apiData = get(data, "getScreeningReportInformation.data", {});

  let accrediations = get(apiData, "accreditation", []);
  let address = `${get(profileConnectInfo, "addressLine1", "ppp").replace(
    // /^.[\s\S]{0,3}\s?\d+/,
    /^(.{5}[^ ]*).*/,
    "*****"
  )}, ${get(profileConnectInfo, "addressLine2")}, ${get(
    profileConnectInfo,
    "city"
  )}, ${get(profileConnectInfo, "zip", "123").replace(
    /[\s\S]{0,6}$/,
    "*****"
  )}`;

  let censoredAddress = address;

  const censorEmail = email => {
    var arr = email.split("@");
    return censorWord(arr[0]) + "@" + arr[1];
  };
  const censorWord = str => {
    if (!isEmpty(str)) {
      return str[0] + str[1] + "*".repeat(str.length - 2) + str.slice(-2);
    }
  };

  return (
    <>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <div className="report__wrapper" ref={componentRef}>
        <div className="col-md-8">
          <div className="box box-form-wrapper">
            <div className="row">
              <div className="col-md-4">
                <label>Report Export Options</label>
              </div>
              <div className="col-md-8 text-right">
                <button className="btn btn-primary">
                  <i className="far fa-file-pdf"></i>&nbsp;Save as PDF
                </button>
                <button className="btn btn-warning">
                  <i className="far fa-envelope"></i>&nbsp;Send by Email
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-share-square"></i>&nbsp;Share
                </button>
              </div>
            </div>
          </div>
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
                      <p>SERVICEPRO SCREENING REPORT</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="right_content">
                      <img
                        alt="Zypass"
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypassfull.png"
                      />
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
                        <h4>{`${profileInfo.firstName} ${profileInfo.middleName} ${profileInfo.lastName}`}</h4>
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
                        <h4>ServicePro Details</h4>
                        <div className="user_image">
                          <img src={profileInfo.avatar} alt="User avatar" />
                        </div>
                      </div>
                    </div>
                    <div className="right__bar">
                      <p>
                        This is the information entered by the applicant; few
                        texts are hidden due to data privacy
                      </p>
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
                              <td>
                                {" "}
                                +
                                {get(
                                  profileInfo,
                                  "phoneNumber",
                                  "0000000"
                                ).replace(/\d{4}$/, "****")}
                              </td>
                            </tr>
                            <tr>
                              <th>Email</th>
                              <td>
                                {censorEmail(get(profileInfo, "email", "@"))}
                              </td>
                            </tr>
                            <tr>
                              <th>Current Address</th>
                              <td>{censoredAddress}</td>
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
                        <p>
                          ID and AML (Anti-money laundering) checks are sourced
                          from credit bureau data analysis and Title ownership
                          from land registry.<a href>Read more</a>
                        </p>
                      </div>
                    </div>
                    <div className="right__bar">
                      <div className="user-info-btn">
                        <button className="btn">
                          <i className="fas fa-play-circle"></i>Proceed
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
                              <th>Alerts</th>
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
                        <h4>AML Watchlist</h4>
                        <i className="fas fa-search-location"></i>
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
                              <th>Alerts</th>
                              <td>
                                <i className="fas fa-exclamation-triangle"></i>
                                Deceased identity fraud was found
                              </td>
                            </tr>
                            <tr>
                              <th>Alerts</th>
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
                                {apiData["isPhoneNumberVerifiedPass"] ===
                                  "Fail" ? (
                                  <>
                                    <i className="fas fa-exclamation-circle"></i>
                                    Not Confirmed
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-check-circle"></i>
                                    Confirmed with OTP Validation
                                  </>
                                )}
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>Email</th>
                              <td>
                                <i className="fas fa-check-circle"></i>
                                Validated during signup
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
                        <h4>Accreditation</h4>
                        <i className="fas fa-id-card-alt"></i>
                      </div>
                    </div>
                    <div className="right__bar">
                      <div className="user-info">
                        <table className="table table-striped">
                          <tbody>
                            {!isEmpty(accrediations) &&
                              accrediations.map((ac, i) => {
                                return (
                                  <>
                                    <tr key={ac.documentNumber}>
                                      <th className="table-striped">
                                        {ac.organization}
                                      </th>
                                      <td>
                                        <i className="fas fa-check-circle"></i>
                                        {ac.documentNumber}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th></th>
                                      <td>
                                        {moment(ac["validTillDate"]).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
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
                              <th>Bank Account and Branch</th>
                              <td>
                                {get(apiData, "accountDetail.IsCorrect") ? (
                                  <span>
                                    <i className="fas fa-check-circle"></i>
                                    Validated
                                  </span>
                                ) : (
                                  <span>
                                    <i className="fas fa-exclamation-circle"></i>
                                    Not Verified
                                    {get(
                                      apiData,
                                      "accountDetail.StatusInformation"
                                    )}
                                  </span>
                                )}
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>Direct Debits accepted?</th>
                              <td>
                                {get(
                                  apiData,
                                  "accountDetail.IsDirectDebitCapable"
                                ) ? (
                                  <span>
                                    <i className="fas fa-check-circle"></i>True
                                  </span>
                                ) : (
                                  <span>
                                    <i className="fas fa-exclamation-circle"></i>
                                    Not Verified
                                    {get(
                                      apiData,
                                      "accountDetail.StatusInformation"
                                    )}
                                  </span>
                                )}
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
                        <h4>Insurance</h4>
                        <i className="fas fa-home"></i>
                      </div>
                    </div>
                    <div className="right__bar">
                      <div className="user-info">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Mobile</th>
                              <td>
                                <i className="fas fa-exclamation-triangle"></i>
                                Confirmed
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th></th>
                              <td>
                                <i className="fas fa-check-circle"></i>Supplied
                                Address found
                              </td>
                            </tr>
                            <tr>
                              <th>Email</th>
                              <td>
                                <i className="fas fa-check-circle"></i>Confirmed
                              </td>
                            </tr>
                            <tr>
                              <th></th>
                              <td>
                                <i className="fas fa-check-circle"></i>Confirmed
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
                        <h4>Self-Declaration</h4>
                        <i className="fas fa-tasks"></i>
                      </div>
                    </div>
                    <div className="right__bar">
                      <div className="user-info">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Profession</th>
                              <td>{get(apiData, "profession")}</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>Job Type</th>
                              <td>{get(apiData, "jobType")}</td>
                            </tr>
                            <tr>
                              <th>Company/Business</th>
                              <td>{get(apiData, "companyName")}</td>
                            </tr>
                            <tr>
                              <th>VAT or UTR</th>
                              <td>{get(apiData, "companyName")}</td>
                            </tr>
                            <tr>
                              <th>Working Since</th>
                              <td>
                                {moment(get(apiData, "startDate")).format(
                                  "MM/YYYY"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <th>Services or Skills</th>
                              <td>
                                *** Lorem Ipsum is simply dummy text of the dsfg
                                dsfg dsfg sdfgprinting and typesetting industry
                                ***
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
                The information and data contained in this report should only be
                used as part of a heuristic approach to evaluating applicants.
                ‘RentOnCloud’or ‘zyPass™’ are the trading brand owned by Free
                Property Agent Ltd. registered with the Information
                Commissioner's Office in compliance with the Data Protection Act
                1998. zyPass™ is provided information from trusted third parties
                and therefore cannot be liable for any inaccuracy or
                incompleteness of any information appearing in this report. This
                reference is valid for 90 days from the date of reference. For
                our full terms and conditions, please visit &nbsp;
                <a
                  rel="noopener noreferrer"
                  href="http://rentoncloud.com/terms"
                  target="_blank"
                  className="link__color"
                >
                  http://rentoncloud.com/terms
                </a>
              </p>
              <br />
              <b>
                {" "}
                <p>Reference ID: #{id}</p>
              </b>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceProScreeningReport;
