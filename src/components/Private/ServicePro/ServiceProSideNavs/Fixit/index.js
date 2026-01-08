/* eslint-disable array-callback-return */
import React, { useState, useEffect, useContext } from "react";
import TaskQueries from "../../../../../config/queries/tasks";
import { withRouter } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useQuery } from "@apollo/react-hooks";
import { Spin, Dropdown, Menu, Badge } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import moment from "moment"
import filter from "lodash/filter";
import { UserDataContext } from "store/contexts/UserContext"

import "./style.scss";

const classObj = {
  Draft: "draft_pile",
  Open: "open_pile",
  "In Progress": "inprogress_pile",
  Pending: "pending_pile",
  "Task Resolved": "pending_pile",
  Completed: "completed_pile",
  "Task Completed": "completed_pile",
  "Invoice Generated": "invoice_pile",
  Archived: "archived_pile"
};

// getTasks
const TaskDash = props => {
  const { state: userState } = useContext(UserDataContext)
  const { userData, accountSetting } = userState

  const { data, loading } = useQuery(TaskQueries.fetchServiceProvideTasks);
  const [finalData, setFinalData] = useState(
    get(data, "fetchServiceProvideTasks.data", [])
  );

  const [dateRaisedActive, setDateRaisedActive] = useState(false);
  const [currentPriority, setPriority] = useState(false);

  let initialData = get(data, "fetchServiceProvideTasks.data");

  const dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat") + " hh:mm a"
    : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;

  useEffect(() => {

    setFinalData(
      !isEmpty(get(props, "location.state", {}))
        ? get(props, "location.state")
        : get(data, "fetchServiceProvideTasks.data")
    );
  }, [data, props]);

  const filterData = async filterText => {
    let filtered;
    if (filterText === "") {
      filtered = initialData;
    } else {
      filtered = await initialData.filter(str => {
        let category = get(str, "category", "category");
        let subCategory = get(str, "subCategory", "subCategory");
        let title = get(str, "title", "title");
        return (
          (category &&
            category.toLowerCase().includes(filterText.toLowerCase())) ||
          (subCategory &&
            subCategory.toLowerCase().includes(filterText.toLowerCase())) ||
          (title && title.toLowerCase().includes(filterText.toLowerCase()))
        );
      });
    }
    setFinalData(filtered);
  };

  let listStr =
    !isEmpty(finalData) &&
    finalData.reverse().map((task, i) => {
      !isEmpty(task.offers) &&
        get(task, "offers").map((ofr, i) => {
          if (ofr.user) {
            if (userData._id === ofr.user._id) {
              task.myOffer = ofr;
            }
          }
        });
      let isOpen = get(task, "status") === "Open" ? true : false;
      let severity =
        get(task, "priority") === "Medium" ? "normal" : get(task, "priority");
      severity = severity.toLowerCase();

      return (
        <tr key={i}>
          <td
            onClick={() => props.history.push(`fixit/task/offers`, task)}
            className={`border__${severity}`}
          >
            <b>{get(task, "title").slice(0, 15) + "..."}</b>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            {get(task, "category")} - {get(task, "subCategory")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            £ {get(task, "budgetAmount")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-map-marker"></i>{" "}
            {get(task, "property.address.city")},{" "}
            {get(task, "property.address.zip") &&
              get(task, "property.address.zip").split(" ")[0]}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-calendar-alt"></i>{" "}
            {moment(get(task, "createdAt")).format(dateFormat)}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <span className={`${severity}_pile`}>{get(task, "priority")}</span>
          </td>
          <td>
            <i className="far fa-clock"></i> {get(task, "dayAvailability")} -{" "}
            {get(task, "timeAvailability").split(" ")[0]}
          </td>
          <td>
            <span
              // className={`${
              //   get(task, "status") === "Accepted" ||
              //   get(task, "status") === "Pending Post"
              //     ? "inprogress"
              //     : get(task, "status").toLowerCase()
              // }_pile`}
              className={classObj[get(task, "status")]}
            >
              {get(task, "status")}
            </span>
          </td>

          <Dropdown
            overlay={
              <>
                <Menu>
                  <Menu.Item
                    disabled={!isOpen}
                    onClick={() =>
                      props.history.push(`fixit/task/offers`, task)
                    }
                  >
                    View Offer
                  </Menu.Item>
                </Menu>
              </>
            }
            trigger={["click"]}
          >
            <td>
              <Badge
                dot={
                  get(task, "offers", []) &&
                  get(task, "offers", []).length > 0 &&
                  task.status === "Open"
                }
              >
                <i className="fa fa-ellipsis-v"></i>
              </Badge>
            </td>
          </Dropdown>
        </tr>
      );
    });

  let archivedTasks = filter(finalData, { status: "Archived" });

  let listStrArchived =
    !isEmpty(archivedTasks) &&
    archivedTasks.map((task, i) => {
      !isEmpty(task.offers) &&
        get(task, "offers").map((ofr, i) => {
          if (ofr.user) {
            if (userData._id === ofr.user._id) {
              task.myOffer = ofr;
            }
          }
        });
      let isOpen = get(task, "status") === "Open" ? true : false;
      let severity =
        get(task, "priority") === "Medium" ? "normal" : get(task, "priority");
      severity = severity.toLowerCase();
      return (
        <tr key={i}>
          <td
            onClick={() => props.history.push(`fixit/task/offers`, task)}
            className={`border__${severity}`}
          >
            <b>{get(task, "title").slice(0, 15) + "..."}</b>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            {get(task, "category")} - {get(task, "subCategory")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            £ {get(task, "budgetAmount")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-map-marker"></i>{" "}
            {get(task, "property.address.city")},{" "}
            {get(task, "property.address.zip") &&
              get(task, "property.address.zip").split(" ")[0]}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-calendar-alt"></i>{" "}
            {moment(get(task, "createdAt")).format(dateFormat)}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <span className={`${severity}_pile`}>{get(task, "priority")}</span>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="far fa-clock"></i> {get(task, "dayAvailability")}
          </td>
          <td>
            <span
              // className={`${
              //   get(task, "status") === "Accepted" ||
              //   get(task, "status") === "Pending Post"
              //     ? "inprogress"
              //     : get(task, "status").toLowerCase()
              // }_pile`}
              className={classObj[get(task, "status")]}
            >
              {get(task, "status")}
            </span>
          </td>

          <Dropdown
            overlay={
              <>
                <Menu>
                  <Menu.Item
                    disabled={!isOpen}
                    onClick={() =>
                      props.history.push(`fixit/task/offers`, task)
                    }
                  >
                    View Offer
                  </Menu.Item>
                </Menu>
              </>
            }
            trigger={["click"]}
          >
            <td>
              <Badge
                dot={
                  get(task, "offers", []) &&
                  get(task, "offers", []).length > 0 &&
                  task.status === "Open"
                }
              >
                <i className="fa fa-ellipsis-v"></i>
              </Badge>
            </td>
          </Dropdown>
        </tr>
      );
    });

  let completedTasks = filter(finalData, o => {
    return (
      o.status === "Task Resolved" ||
      o.status === "Task Completed" ||
      o.status === "Completed"
    );
  });

  let listStrCompleted =
    !isEmpty(completedTasks) &&
    completedTasks.map((task, i) => {
      !isEmpty(task.offers) &&
        get(task, "offers").map((ofr, i) => {
          if (ofr.user) {
            if (userData._id === ofr.user._id) {
              task.myOffer = ofr;
            }
          }
        });
      let isOpen = get(task, "status") === "Open" ? true : false;
      let severity =
        get(task, "priority") === "Medium" ? "normal" : get(task, "priority");
      severity = severity.toLowerCase();
      return (
        <tr key={i}>
          <td
            onClick={() => props.history.push(`fixit/task/offers`, task)}
            className={`border__${severity}`}
          >
            <b>{get(task, "title").slice(0, 15) + "..."}</b>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            {get(task, "category")}  {get(task, "subCategory")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            £ {get(task, "budgetAmount")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-map-marker"></i>{" "}
            {get(task, "property.address.city")},{" "}
            {get(task, "property.address.zip") &&
              get(task, "property.address.zip").split(" ")[0]}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-calendar-alt"></i>{" "}
            {moment(get(task, "createdAt")).format(dateFormat)}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <span className={`${severity}_pile`}>{get(task, "priority")}</span>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="far fa-clock"></i> {get(task, "dayAvailability")}
          </td>
          <td>
            <span
              // className={`${
              //   get(task, "status") === "Accepted" ||
              //   get(task, "status") === "Pending Post"
              //     ? "inprogress"
              //     : get(task, "status").toLowerCase()
              // }_pile`}
              className={classObj[get(task, "status")]}
            >
              {get(task, "status")}
            </span>
          </td>

          <Dropdown
            overlay={
              <>
                <Menu>
                  <Menu.Item
                    disabled={!isOpen}
                    onClick={() =>
                      props.history.push(`fixit/task/offers`, task)
                    }
                  >
                    View Offer
                  </Menu.Item>
                </Menu>
              </>
            }
            trigger={["click"]}
          >
            <td>
              <Badge
                dot={
                  get(task, "offers", []) &&
                  get(task, "offers", []).length > 0 &&
                  task.status === "Open"
                }
              >
                <i className="fa fa-ellipsis-v"></i>
              </Badge>
            </td>
          </Dropdown>
        </tr>
      );
    });

  let todoTasks = filter(finalData, o => {
    return (
      o.status === "Draft" || o.status === "Open" || o.status === "Pending Post"
    );
  });

  let listStrTodo =
    !isEmpty(todoTasks) &&
    todoTasks.map((task, i) => {
      !isEmpty(task.offers) &&
        get(task, "offers").map((ofr, i) => {
          if (ofr.user) {
            if (userData._id === ofr.user._id) {
              task.myOffer = ofr;
            }
          }
        });
      // let isOpen = get(task, "status") === "Open" ? true : false;
      let severity =
        get(task, "priority") === "Medium" ? "normal" : get(task, "priority");
      severity = severity.toLowerCase();
      return (
        <tr key={i}>
          <td
            onClick={() => props.history.push(`fixit/task/offers`, task)}
            className={`border__${severity}`}
          >
            <b>{get(task, "title").slice(0, 15) + "..."}</b>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            {get(task, "category")}  {get(task, "subCategory")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            £ {get(task, "budgetAmount")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-map-marker"></i>{" "}
            {get(task, "property.address.city")},{" "}
            {get(task, "property.address.zip") &&
              get(task, "property.address.zip").split(" ")[0]}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-calendar-alt"></i>{" "}
            {moment(get(task, "createdAt")).format(dateFormat)}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <span className={`${severity}_pile`}>{get(task, "priority")}</span>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="far fa-clock"></i> {get(task, "dayAvailability")}
          </td>
          <td>
            <span
              // className={`${
              //   get(task, "status") === "Accepted" ||
              //   get(task, "status") === "Pending Post"
              //     ? "inprogress"
              //     : get(task, "status").toLowerCase()
              // }_pile`}
              className={classObj[get(task, "status")]}
            >
              {get(task, "status")}
            </span>
          </td>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => props.history.push(`fixit/task/offers`, task)}
                >
                  View Task
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <td>
              <Badge
                dot={
                  get(task, "offers", []) &&
                  get(task, "offers", []).length > 0 &&
                  task.status === "Open"
                }
              >
                <i className="fa fa-ellipsis-v"></i>
              </Badge>
            </td>
          </Dropdown>
        </tr>
      );
    });

  let acceptedTasks = filter(finalData, o => {
    return o.status === "In Progress";
  });

  let acceptedTasksListing =
    !isEmpty(acceptedTasks) &&
    acceptedTasks.map((task, i) => {
      // let isOpen = get(task, "status") === "Open" ? true : false;
      let severity =
        get(task, "priority") === "Medium" ? "normal" : get(task, "priority");
      severity = severity.toLowerCase();
      return (
        <tr key={i}>
          <td
            onClick={() => props.history.push(`fixit/task/offers`, task)}
            className={`border__${severity}`}
          >
            <b>{get(task, "title").slice(0, 15) + "..."}</b>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            {get(task, "category")}  {get(task, "subCategory")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            £ {get(task, "budgetAmount")}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-map-marker"></i>{" "}
            {get(task, "property.address.city")},{" "}
            {get(task, "property.address.zip") &&
              get(task, "property.address.zip").split(" ")[0]}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="fa fa-calendar-alt"></i>{" "}
            {moment(get(task, "createdAt")).format(dateFormat)}{" "}
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <span className={`${severity}_pile`}>{get(task, "priority")}</span>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            <i className="far fa-clock"></i> {get(task, "dayAvailability")}
          </td>
          <td>
            <span className={classObj[get(task, "status")]}>
              {get(task, "status")}
            </span>
          </td>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => props.history.push(`fixit/task/offers`, task)}
                >
                  View Offer
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <td>
              <i className="fa fa-ellipsis-v"></i>
            </td>
          </Dropdown>
        </tr>
      );
    });

  const setHighLowPriority = async data => {
    let highAr = [];
    let lowAr = [];
    let mediumAr = [];

    let sortEmAll = finalData.map((task, i) => {
      if (task.priority === "High") {
        highAr.push(task);
      }
      if (task.priority === "Low") {
        lowAr.push(task);
      }
      if (task.priority === "Medium") {
        mediumAr.push(task);
      }
    });

    await Promise.all(sortEmAll);

    if (!currentPriority) {
      setFinalData([...highAr, ...mediumAr, ...lowAr]);
    }
    if (currentPriority) {
      setFinalData([...lowAr, ...mediumAr, ...highAr]);
    }
  };

  const reverseDateAr = async () => {
    let reversedAr = await finalData.reverse();
    setFinalData(reversedAr);
    setDateRaisedActive(!dateRaisedActive);
  };

  return (
    <>
      <Tabs defaultIndex={"0"}>
        <div className="container screening__tables">
          <div className="row">
            <div className="col-md-12">
              <div className="profile__menu--details screening__wrapper d-flex">
                <div className="taskListingServicePro profile__details--left screening__top--left">
                  <TabList>
                    <Tab>All({!isEmpty(finalData) ? finalData.length : 0})</Tab>
                    <Tab>
                      To-Do(
                      {!isEmpty(todoTasks) ? todoTasks.length : 0})
                    </Tab>
                    <Tab>In-Progress({acceptedTasks.length})</Tab>
                    <Tab>
                      Completed(
                      {!isEmpty(completedTasks) ? completedTasks.length : 0})
                    </Tab>
                    <Tab>
                      Archived(
                      {!isEmpty(listStrArchived) ? listStrArchived.length : 0})
                    </Tab>
                  </TabList>
                </div>
                <div className="search__tab">
                  <input
                    className="form-control mb-1"
                    type="text"
                    onChange={e => filterData(e.target.value)}
                    placeholder="Search here..."
                    aria-label="Search"
                  />
                </div>
                {/* <div
                  onClick={() => props.history.push("fixit/raisetask")}
                  className="screening__top--right"
                >
                  <button className="btn btn__new--order">+ Add Task</button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix" />

        <Spin tip="Loading..." spinning={loading}>
          <div className="container screening__tables">
            <div className="row">
              <div className="col-md-12">
                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th>Task Name</th>
                          <th>Category</th>
                          <th>Budget(£)</th>
                          <th>Location</th>
                          <th onClick={reverseDateAr}>
                            Date Raised &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th
                            onClick={() => {
                              setHighLowPriority();
                              setPriority(!currentPriority);
                            }}
                          >
                            Priority &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${currentPriority &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!currentPriority &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th>Availability</th>
                          <th>Status</th>
                          <th className="last_th_value"></th>
                        </tr>
                      </thead>
                      <tbody>{listStr}</tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th>Task Name</th>
                          <th>Category</th>
                          <th>Budget(£)</th>
                          <th>Location</th>
                          <th onClick={reverseDateAr}>
                            Date Raised &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th
                            onClick={() => {
                              setHighLowPriority();
                              setPriority(!currentPriority);
                            }}
                          >
                            Priority &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${currentPriority &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!currentPriority &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th>Availability</th>
                          <th>Status</th>
                          <th className="last_th_value"></th>
                        </tr>
                      </thead>
                      <tbody>{listStrTodo}</tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th>Task Name</th>
                          <th>Category</th>
                          <th>Budget(£)</th>
                          <th>Location</th>
                          <th onClick={reverseDateAr}>
                            Date Raised &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th
                            onClick={() => {
                              setHighLowPriority();
                              setPriority(!currentPriority);
                            }}
                          >
                            Priority &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${currentPriority &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!currentPriority &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th>Availability</th>
                          <th>Status</th>
                          <th className="last_th_value"></th>
                        </tr>
                      </thead>
                      <tbody>{acceptedTasksListing}</tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th>Task Name</th>
                          <th>Category</th>
                          <th>Budget(£)</th>
                          <th>Location</th>
                          <th onClick={reverseDateAr}>
                            Date Raised &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th
                            onClick={() => {
                              setHighLowPriority();
                              setPriority(!currentPriority);
                            }}
                          >
                            Priority &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${currentPriority &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!currentPriority &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th>Availability</th>
                          <th>Status</th>
                          <th className="last_th_value"></th>
                        </tr>
                      </thead>
                      <tbody>{listStrCompleted}</tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead className="thead-dark">
                        <tr>
                          <th>Task Name</th>
                          <th>Category</th>
                          <th>Budget(£)</th>
                          <th>Location</th>
                          <th onClick={reverseDateAr}>
                            Date Raised &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!dateRaisedActive &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th
                            onClick={() => {
                              setHighLowPriority();
                              setPriority(!currentPriority);
                            }}
                          >
                            Priority &nbsp;
                            <i
                              className={`fas fa-long-arrow-alt-up ${currentPriority &&
                                "isInActive"}`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${!currentPriority &&
                                "isInActive"}`}
                            ></i>
                          </th>
                          <th>Availability</th>
                          <th>Status</th>
                          <th className="last_th_value"></th>
                        </tr>
                      </thead>
                      <tbody>{listStrArchived}</tbody>
                    </table>
                  </div>
                </TabPanel>
              </div>
            </div>
          </div>
        </Spin>
      </Tabs>
    </>
  );
};

export default withRouter(TaskDash);
