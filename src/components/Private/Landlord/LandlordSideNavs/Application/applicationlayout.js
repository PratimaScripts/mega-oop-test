import React, { useContext } from "react";
// import { UserDataContext } from "store/contexts/UserContext";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import { Spin, Select, Tooltip, Avatar } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  UserOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ViewProfile from "./ViewProfile";
import { withRouter } from "react-router-dom";
// import { Pagination } from "antd";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import "./styles.scss";
const { Option } = Select;
// const { Search } = Input;

const ApplicationDashboard = (props) => {
  // const { state } = useContext(UserDataContext);

  const { state: interfaceState, dispatch: interfaceDispatch } =
    useContext(InterfaceContext);

  const accountSetting = interfaceState.accountSettings;

  const {
    openViewProfileModal,
    // windowWidth
  } = interfaceState;

  const dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat", process.env.REACT_APP_DATE_FORMAT)
    : process.env.REACT_APP_DATE_FORMAT;

  // const [loading ] = useState(false);
  return (
    <>
      <Tabs defaultIndex={0}>
        <div className="row">
          <div className="col-md-12">
            <div className="application_header_wrapper">
              <div className="application_tabs">
                <TabList>
                  <Tab>All</Tab>
                  <Tab>Active</Tab>
                  <Tab>Archived</Tab>
                </TabList>
                <TabPanel></TabPanel>
                <TabPanel></TabPanel>
                <TabPanel></TabPanel>

                {/* <h2>Applicants sorted by profile suitability and your preference</h2> */}
              </div>
              <div className="application_fields">
                <Select placeholder="Status" className="select____property">
                  <Option value="All">All</Option>
                  <Option value="Listed">Listed</Option>
                  <Option value="Un-Listed">Un-Listed</Option>
                  <Option value="Occupied">Occupied</Option>
                  <Option value="Archived">Archived</Option>
                  <Option value="Rented">Rented</Option>
                </Select>
                <Select
                  placeholder="Select Property"
                  className="select____property"
                >
                  <Option value="All">All</Option>
                  <Option value="Listed">Listed</Option>
                  <Option value="Un-Listed">Un-Listed</Option>
                  <Option value="Occupied">Occupied</Option>
                  <Option value="Archived">Archived</Option>
                  <Option value="Rented">Rented</Option>
                </Select>

                <button className="btn btn__enquiry">
                  <PlusOutlined
                    className="mr-2"
                    style={{ verticalAlign: "middle" }}
                  />{" "}
                  Manual Enquiry{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
        <h2 className="applicants-title">
          Applicants sorted by profile suitability and your preference
        </h2>
        <div className="clearfix" />

        <Spin tip="Loading...">
          <div className="application__tables">
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead className="thead-dark">
                      <tr>
                        <th className="name__style">Profiles</th>
                        <th>Profession</th>
                        <th>Combined Affordability</th>
                        <th style={{ width: "180px" }}>Declaration</th>
                        <th>Preferred Move-in</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td className="border__invited">
                          {/* <div className="default_profile">
                              <img
                                src="https://rentoncloud.s3.eu-west-2.amazonaws.com/1614685696299-living-coral-color-year-2019-260nw-1250940526.webp"
                                alt="User Profile Avatar"
                              />
                            </div> */}
                          <Avatar.Group
                            maxCount={2}
                            size="large"
                            maxStyle={{
                              color: "#f56a00",
                              backgroundColor: "#fde3cf",
                              verticalAlign: "middle",
                            }}
                          >
                            <Tooltip title="View Profile" placement="top">
                              <Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                onClick={() =>
                                  interfaceDispatch({
                                    type: "OPEN_VIEW_PROFILE_MODAL",
                                  })
                                }
                              />
                            </Tooltip>
                            <Avatar
                              onClick={() =>
                                interfaceDispatch({
                                  type: "OPEN_VIEW_PROFILE_MODAL",
                                })
                              }
                              style={{ backgroundColor: "#f56a00" }}
                            >
                              K
                            </Avatar>
                            <Tooltip
                              onClick={() =>
                                interfaceDispatch({
                                  type: "OPEN_VIEW_PROFILE_MODAL",
                                })
                              }
                              title="Ant User"
                              placement="top"
                            >
                              <Avatar
                                style={{ backgroundColor: "#87d068" }}
                                icon={
                                  <UserOutlined
                                    style={{ verticalAlign: "middle" }}
                                  />
                                }
                              />
                            </Tooltip>
                            <Avatar
                              onClick={() =>
                                interfaceDispatch({
                                  type: "OPEN_VIEW_PROFILE_MODAL",
                                })
                              }
                              style={{ backgroundColor: "#1890ff" }}
                              icon={
                                <AntDesignOutlined
                                  style={{ verticalAlign: "middle" }}
                                />
                              }
                            />
                          </Avatar.Group>
                        </td>
                        <td>
                          <div className="bold__txt">
                            {/* {get(prop, "title", "Sample Title")} */}
                            Lorem Ipsum
                          </div>
                        </td>
                        <td>
                          <div>£ 1500 pm</div>
                        </td>
                        <td>
                          <div className="declaration_tag">
                            <p className="mr-4 mb-0 d-inline-block">
                              <i
                                className="mr-1 mdi mdi-dog-side"
                                aria-hidden="true"
                              ></i>
                              Pets
                            </p>
                            <p className="mr-4 mb-0 d-inline-block">
                              <i
                                className="mr-1 mdi mdi-smoking"
                                aria-hidden="true"
                              ></i>
                              Smoking
                            </p>
                            <p className="mr-4 mb-0 d-inline-block">
                              <i
                                className="mr-1 mdi mdi-car"
                                aria-hidden="true"
                              ></i>
                              Vehicles
                            </p>
                            <p className="mr-4 mb-0 d-inline-block">
                              <i
                                className="mr-1 mdi mdi-wheelchair-accessibility"
                                aria-hidden="true"
                              ></i>
                              Disable
                            </p>
                            <p className="mr-4 mb-0 d-inline-block">
                              <i
                                className="mr-1 mdi mdi-account-supervisor"
                                aria-hidden="true"
                              ></i>
                              Income Support
                            </p>
                          </div>
                        </td>
                        <td>
                          <span className="fas fa-calendar-check mr-2" />
                          {moment(new Date()).format(dateFormat)}
                        </td>
                        <td className="application--actions_hover">
                          <Tooltip
                            title="Manage Activity"
                            aria-label="manage-activity"
                          >
                            <EditOutlined
                              className="mr-2"
                              style={{ verticalAlign: "middle" }}
                            />
                            <p className="d-inline-block">Manage Activity</p>
                          </Tooltip>

                          <i
                            className="ml-5 p-2 fa fa-check"
                            aria-hidden="true"
                          ></i>
                          <i className="p-2 fa fa-close" aria-hidden="true"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Tabs>
      {/* <Pagination defaultCurrent={1} total={50} /> */}

      {openViewProfileModal && <ViewProfile />}
    </>
  );
};

export default withRouter(ApplicationDashboard);
