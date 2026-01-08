import React, { useState, useEffect, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useLazyQuery } from "@apollo/react-hooks";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import ScreeningQuery from "../../../../../config/queries/screening";
import { UserDataContext } from "store/contexts/UserContext"
import { withRouter } from "react-router-dom";
// import { Pagination } from "antd";
import moment from "moment";

import "./styles.scss";
// const { Option } = Select;
// const { Search } = Input;

const ScreeningDashboard = props => {
  // const [searchContent, setSearchContent] = useState({
  //   type: "SearchBy",
  //   text: ""
  // });
  const { state: userState } = useContext(UserDataContext)
  const { userData, accountSetting } = userState

  let dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat").toUpperCase() + " hh:mm a"
    : "DD-MM-YY hh:mm a";

  const [screeningOrders, setScreeningOrders] = useState({
    requested: [],
    inProgress: [],
    processed: [],
    archived: []
  });

  const [loadScreeningOrders, { loading, data }] = useLazyQuery(
    ScreeningQuery.getScreeningHistory
  );

  // const ScreeningOrders = useQuery(ScreeningQuery.getScreeningHistory);

  const getScreeningReport = data => {
    props.history.push(`/renter/screening/report/${data._id}`);
  };

  useEffect(() => {
    loadScreeningOrders();
    if (!loading) {
      let allOrders = get(data, "getScreeningHistory.data");

      let obj = {
        requested: filter(allOrders, { status: "Request" }),
        inProgress: filter(allOrders, { status: "In Progress" }),
        processed: filter(allOrders, { status: "Processed" }),
        archived: filter(allOrders, { status: "Archived" })
      };

      setScreeningOrders(obj);
    }
  }, [data, loadScreeningOrders, loading]);

  let OrderStrRequest =
    !isEmpty(screeningOrders.requested) &&
    screeningOrders.requested.map((order, i) => {
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
    !isEmpty(screeningOrders.inProgress) &&
    screeningOrders.inProgress.map((order, i) => {
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
          <td>
            <i className="fas fa-paper-plane" /> Re-send
          </td>
        </tr>
      );
    });

  let OrderStrInProcessed =
    !isEmpty(screeningOrders.processed) &&
    screeningOrders.processed.map((order, i) => {
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
    !isEmpty(screeningOrders.archived) &&
    screeningOrders.archived.map((order, i) => {
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
                  onClick={() => props.history.push("screening/order")}
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
      </Tabs>
      {/* <Pagination defaultCurrent={1} total={50} /> */}
    </>
  );
};

export default withRouter(ScreeningDashboard);
