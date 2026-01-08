import React, { useRef, useState, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useQuery } from "@apollo/react-hooks";
import { Spin } from "antd";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import ScreeningQuery from "config/queries/screening";
import { withRouter } from "react-router-dom";
import { UserDataContext } from "store/contexts/UserContext";
import moment from "moment"

// import { Pagination } from "antd";

import "./styles.scss";
// const { Option } = Select;
// const { Search } = Input;

const ScreeningDashboard = props => {
  // const [searchContent, setSearchContent] = useState({
  //   type: "SearchBy",
  //   text: ""
  // });
  const { state } = useContext(UserDataContext)


  const accountSetting = state.accountSettings
  let dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat") + " hh:mm a"
    : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;

  const userData = state.userData;
  const screeningOrders = useRef({
    requested: [],
    inProgress: [],
    processed: [],
    archived: []
  });


  const [loading, setLoading] = useState(true)

  useQuery(
    ScreeningQuery.getScreeningHistory, {
    onCompleted: ({ getScreeningHistory }) => {
      if (getScreeningHistory.success) {
        let allOrders = getScreeningHistory.data;

        let obj = {
          requested: filter(allOrders, { status: "Request" }),
          inProgress: filter(allOrders, { status: "In Progress" }),
          processed: filter(allOrders, { status: "Processed" }),
          archived: filter(allOrders, { status: "Archived" })
        };
        screeningOrders.current = obj;
      }
      setLoading(false)
    },
    onError: (error) => setLoading(false)
  }
  );

  const getScreeningReport = data => {
    props.history.push(`/servicepro/screening/report/${data._id}`);
  };




  let OrderStrRequest =
    !isEmpty(screeningOrders.current.requested) &&
    screeningOrders.current.requested.map((order, i) => {
      let ord = order.invite;
      return (
        <tr key={i}>
          <td className="border__invited">
            <span className="profile__default">
              <img
                src={
                  order.type === "Self"
                    ? get(userData, "avatar")
                    : get(ord, "avatar")
                }
                alt="User Profile Avatar"
              />
            </span>
            <span className="bold__txt">
              {order.type === "Self"
                ? `${userData.firstName} ${userData.lastName}`
                : `${ord && ord.firstName} ${ord && ord.lastName}`}
            </span>
          </td>
          <td className="bold__txt">zyPass Landlord Screening</td>
          <td>
            <button className="btn__global btn__invited">{order.status}</button>
          </td>
          <td>
            <span className="fas fa-calendar-check" />
            &nbsp;&nbsp;&nbsp;
            {moment(order.createdAt).format(dateFormat)}
          </td>
          <td onClick={() => getScreeningReport(order)}>
            <i className="fas fa-paper-plane" /> Re-send
          </td>
        </tr>
      );
    });

  let OrderStrInProgress =
    !isEmpty(screeningOrders.current.inProgress) &&
    screeningOrders.current.inProgress.map((order, i) => {
      let ord = order.invite;
      return (
        <tr key={i}>
          <td className="border__invited">
            <span className="profile__default">
              <img
                src={
                  order.type === "Self"
                    ? get(userData, "avatar")
                    : get(ord, "avatar")
                }
                alt="User Profile Avatar"
              />
            </span>
            <span className="bold__txt">
              {order.type === "Self"
                ? `${userData.firstName} ${userData.lastName}`
                : `${ord && ord.firstName} ${ord && ord.lastName}`}
            </span>
          </td>
          <td className="bold__txt">zyPass Landlord Screening</td>
          <td>
            <button className="btn__global btn__inprogress">
              {order.status}
            </button>
          </td>
          <td>
            <span className="fas fa-calendar-check" />
            &nbsp;&nbsp;&nbsp;
            {moment(order.createdAt).format(dateFormat)}
          </td>
          <td onClick={() => getScreeningReport(order)}>
            <i className="fas fa-paper-plane" /> Re-send
          </td>
        </tr>
      );
    });

  let OrderStrInProcessed =
    !isEmpty(screeningOrders.current.processed) &&
    screeningOrders.current.processed.map((order, i) => {
      let ord = order.invite;
      return (
        <tr key={i}>
          <td className="border__invited">
            <span className="profile__default">
              <img
                src={
                  order.type === "Self"
                    ? get(userData, "avatar")
                    : get(ord, "avatar")
                }
                alt="User Profile Avatar"
              />
            </span>
            <span className="bold__txt">
              {order.type === "Self"
                ? `${userData.firstName} ${userData.lastName}`
                : `${ord && ord.firstName} ${ord && ord.lastName}`}
            </span>
          </td>
          <td className="bold__txt">zyPass Landlord Screening</td>
          <td>
            <button className="btn__global btn__processed">
              {order.status}
            </button>
          </td>
          <td>
            <span className="fas fa-calendar-check" />
            &nbsp;&nbsp;&nbsp;
            {moment(order.createdAt).format(dateFormat)}
          </td>
          <td>
            <i className="fas fa-paper-plane" /> Re-send
          </td>
        </tr>
      );
    });

  let OrderStrArchived =
    !isEmpty(screeningOrders.current.archived) &&
    screeningOrders.current.archived.map((order, i) => {
      let ord = order.invite;
      return (
        <tr key={i}>
          <td className="border__invited">
            <span className="profile__default">
              <img
                src={
                  order.type === "Self"
                    ? get(userData, "avatar")
                    : get(ord, "avatar")
                }
                alt="User Profile Avatar"
              />
            </span>
            <span className="bold__txt">
              {order.type === "Self"
                ? `${get(userData, "firstName", "No")} ${get(
                  userData,
                  "lastName",
                  "Name"
                )}`
                : `${ord && ord.firstName} ${ord && ord.lastName}`}
            </span>
          </td>
          <td className="bold__txt">zyPass Landlord Screening</td>
          <td>
            <button className="btn__global btn__archived">
              {order.status}
            </button>
          </td>
          <td>
            <span className="fas fa-calendar-check" />
            &nbsp;&nbsp;&nbsp;
            {moment(order.createdAt).format(dateFormat)}
          </td>
          <td>
            <i className="fas fa-paper-plane" /> Re-send
          </td>
        </tr>
      );
    });

  // const selectBefore = (
  //   <Select
  //     defaultValue={searchContent["type"]}
  //     onChange={e => {
  //       searchContent["type"] = e;
  //       setSearchContent(searchContent);
  //     }}
  //   >
  //     <Option value="SearchBy">Search By</Option>
  //     <Option value="text">Text</Option>
  //     <Option value="date">Date</Option>
  //   </Select>
  // );

  return (
    <>
      <Tabs defaultIndex={"0"}>
        <div className="screening__tables">
          <div className="row">
            <div className="col-md-12">
              <div className="profile__menu--details screening__wrapper">
                <div className="profile__details--left screening__top--left">
                  <TabList>
                    <Tab>Requested</Tab>
                    <Tab>In Progress</Tab>
                    <Tab>Processed</Tab>
                    <Tab>Archived</Tab>
                  </TabList>
                </div>
                <div
                  onClick={() => {
                    localStorage.setItem("isOriginCorrect", true);
                    props.history.push("screening/review");
                  }}
                  className="screening__top--right"
                >
                  <button className="btn btn__new--order">+ New Order</button>
                </div>
              </div>
              {/* <Search
                addonBefore={selectBefore}
                placeholder="input search text"
                onSearch={value => console.log(value)}
              /> */}
            </div>
          </div>
        </div>
        <div className="clearfix" />

        <Spin tip="Loading..." spinning={loading}>
          <div className="screening__tables">
            <div className="row">
              <div className="col-md-12">
                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th className="name__style">Name</th>
                          <th>Report</th>
                          <th>Status</th>
                          <th>Order Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{OrderStrRequest}</tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th className="name__style">Name</th>
                          <th>Report</th>
                          <th>Status</th>
                          <th>Order Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{OrderStrInProgress}</tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th className="name__style">Name</th>
                          <th>Report</th>
                          <th>Status</th>
                          <th>Order Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{OrderStrInProcessed}</tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th className="name__style">Name</th>
                          <th>Report</th>
                          <th>Status</th>
                          <th>Order Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{OrderStrArchived}</tbody>
                    </table>
                  </div>
                </TabPanel>
              </div>
            </div>
          </div>
        </Spin>
      </Tabs>
      {/* <Pagination defaultCurrent={1} total={50} /> */}
    </>
  );
};

export default withRouter(ScreeningDashboard);
