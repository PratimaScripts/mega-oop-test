/* eslint-disable array-callback-return */
import React, { useState, useRef, useContext } from "react";
import TaskQueries from "config/queries/tasks";
import { withRouter } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Spin, Dropdown, Menu, Select, Badge } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import moment from "moment";
import { UserDataContext } from "store/contexts/UserContext";

import "./styles.scss";
import useForceUpdate from "use-force-update";
import showNotification from "config/Notification";
import MenuItem from "antd/lib/menu/MenuItem";

const { Option } = Select;

const classObj = {
  Draft: "draft_pile",
  Open: "open_pile",
  "In Progress": "inprogress_pile",
  Pending: "pending_pile",
  "Task Resolved": "pending_pile",
  Completed: "completed_pile",
  "Task Completed": "completed_pile",
  "Invoice Generated": "invoice_pile",
  Archived: "archived_pile",
};

// getTasks
const TaskDash = (props) => {
  const [finalData, setFinalData] = useState([]);
  const initialData = useRef([]);
  const forceUpdate = useForceUpdate();

  const { state } = useContext(UserDataContext);
  const accountSetting = state.accountSetting;

  const [dateRaisedActive, setDateRaisedActive] = useState(false);
  const [currentPriority, setPriority] = useState(false);

  const dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat", process.env.REACT_APP_DATE_FORMAT)
    : process.env.REACT_APP_DATE_FORMAT;

  const { loading, refetch: refetchTasks } = useQuery(TaskQueries.getTasks, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      initialData.current = get(data, "getTasks.data", []);
      setFinalData(initialData.current);
      // props.contextData.setUserTasks(get(data, "getTasks.data", []));
    },
    fetchPolicy: "cache-and-network",
  });

  const [updateTaskStatus, { loading: updatingTaskStatus }] = useMutation(
    TaskQueries.updateTaskStatus,
    {
      onCompleted: ({ updateTaskStatus }) => {
        if (updateTaskStatus?.success) {
          refetchTasks();
        } else {
          showNotification(
            "error",
            updateTaskStatus?.message || "Something went wrong!"
          );
        }
      },
    }
  );

  const filterData = async (filterText) => {
    // setSearchingStatus(true);
    let filtered;
    if (filterText === "") {
      filtered = initialData.current;
      // setSearchingStatus(false);
    } else {
      filtered = await initialData.current.filter((str) => {
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

  const filterDataByStatus = async (filterText) => {
    // setSearchingStatus(true);
    let filtered;
    if (filterText === "") {
      filtered = initialData.current;
    } else {
      filtered = await initialData.current.filter((str) => {
        let status = get(str, "status", "");

        return (
          status && status.toLowerCase().includes(filterText.toLowerCase())
        );
      });
    }

    setFinalData(filtered);
  };

  const handleOpenLiveLink = (taskId) => {
    const url =
      process.env.NODE_ENV !== "development"
        ? `${process.env.REACT_APP_ROC_PUBLIC}/task/${taskId}`
        : `http://localhost:5050/task/${taskId}`;
    window.open(url, "_blank");
  };

  // const autoReverse = async (data) => {
  //   let reverseAll = await data.reverse();
  //   setFinalData(reverseAll);
  //   setDateRaisedActive(!dateRaisedActive);
  //   // forceUpdate();
  // };

  // useEffect(() => {
  //   autoReverse(finalData);
  // }, [finalData]);

  let listStr =
    !isEmpty(finalData) &&
    finalData.map((task, i) => {
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
            <b>{get(task, "title").slice(0, 30)}</b>
            <br />
            <b>{get(task, "title").slice(30, 50)}</b>
            <b>{get(task, "title").length > 50 && "..."}</b>
          </td>
          <td onClick={() => props.history.push(`fixit/task/offers`, task)}>
            {get(task, "category")} {">"} {get(task, "subCategory")}{" "}
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
              {/* dashboard */}
              {get(task, "status")}
            </span>
          </td>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => handleOpenLiveLink(task.taskId)}>
                  Preview Task
                </Menu.Item>
                {get(task, "status") === "Archived" ? (
                  <MenuItem
                    onClick={() =>
                      updateTaskStatus({
                        variables: {
                          taskId: task.taskId,
                          status: "Unarchive",
                        },
                      })
                    }
                  >
                    Unarchive
                  </MenuItem>
                ) : null}
                {(get(task, "status") === "Pending Post" && (
                  <>
                    <Menu.Item
                      onClick={() =>
                        props.history.push(`fixit/task/offers`, task)
                      }
                    >
                      View Task
                    </Menu.Item>
                  </>
                )) ||
                  (get(task, "status") === "Accepted" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Task Resolved" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Draft" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                      >
                        Delete
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "In Progress" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Pending" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Awaiting Landlord Conformation" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  //task having status open and some offers ,need this to redirect to offers directly after bug fix
                  (task.status === "Open" &&
                    get(task, "offers", []).length > 0 && (
                      <>
                        <Menu.Item
                          disabled={!isOpen}
                          onClick={() =>
                            props.history.push(`fixit/task/offers`, task)
                          }
                        >
                          View Offers
                        </Menu.Item>
                      </>
                    )) ||
                  (get(task, "status") === "Open" && (
                    <>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                      >
                        Delete
                      </Menu.Item>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                      >
                        Archive
                      </Menu.Item>
                    </>
                  ))}
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

  let archivedTasks = filter(finalData, { status: "Archived" });

  let listStrArchived =
    !isEmpty(archivedTasks) &&
    archivedTasks.map((task, i) => {
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
            {get(task, "category")} {">"} {get(task, "subCategory")}{" "}
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
                {get(task, "status") === "Archived" ? (
                  <MenuItem
                    onClick={() =>
                      updateTaskStatus({
                        variables: {
                          taskId: task.taskId,
                          status: "Unarchive",
                        },
                      })
                    }
                  >
                    Unarchive
                  </MenuItem>
                ) : null}
                {(get(task, "status") === "Pending" && (
                  <>
                    <Menu.Item
                      onClick={() =>
                        props.history.push(`fixit/task/offers`, task)
                      }
                    >
                      View Task
                    </Menu.Item>
                  </>
                )) ||
                  (get(task, "status") === "Accepted" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Task Resolved" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Draft" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                      >
                        Delete
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "In Progress" && (
                    <>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                        disabled={!isOpen}
                      >
                        Cancel
                      </Menu.Item>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Pending" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Awaiting Landlord Conformation" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Open" && (
                    <>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  ))}
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

  let completedTasks = filter(finalData, (o) => {
    return (
      o.status === "Task Resolved" ||
      o.status === "Task Completed" ||
      o.status === "Completed"
    );
  });

  let listStrCompleted =
    !isEmpty(completedTasks) &&
    completedTasks.map((task, i) => {
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
            {get(task, "category")} {">"} {get(task, "subCategory")}{" "}
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
                <Menu.Item onClick={() => handleOpenLiveLink(task.taskId)}>
                  Preview Task
                </Menu.Item>
                {(get(task, "status") === "Pending Post" && (
                  <>
                    <Menu.Item
                      onClick={() =>
                        props.history.push(`fixit/task/offers`, task)
                      }
                    >
                      View Task
                    </Menu.Item>
                  </>
                )) ||
                  (get(task, "status") === "Accepted" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Task Resolved" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Draft" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                      >
                        Delete
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "In Progress" && (
                    <>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                        disabled={!isOpen}
                      >
                        Cancel
                      </Menu.Item>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Pending" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Awaiting Landlord Conformation" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Open" && (
                    <>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  ))}
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

  let todoTasks = filter(finalData, (o) => {
    return (
      o.status === "Draft" || o.status === "Open" || o.status === "Pending Post"
    );
  });

  let listStrTodo =
    !isEmpty(todoTasks) &&
    todoTasks.map((task, i) => {
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
            {get(task, "category")} {">"} {get(task, "subCategory")}{" "}
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
                <Menu.Item onClick={() => handleOpenLiveLink(task.taskId)}>
                  Preview Task
                </Menu.Item>
                {(get(task, "status") === "Pending Post" && (
                  <>
                    <Menu.Item
                      onClick={() =>
                        props.history.push(`fixit/task/offers`, task)
                      }
                    >
                      View Task
                    </Menu.Item>
                  </>
                )) ||
                  (get(task, "status") === "Accepted" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Task Resolved" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Draft" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                      >
                        Delete
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "In Progress" && (
                    <>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                        disabled={!isOpen}
                      >
                        Cancel
                      </Menu.Item>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Pending" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Awaiting Landlord Conformation" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Open" && (
                    <>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  ))}
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

  let acceptedTasks = filter(finalData, (o) => {
    return o.status === "Accepted" || o.status === "In Progress";
  });

  let acceptedTasksListing =
    !isEmpty(acceptedTasks) &&
    acceptedTasks.map((task, i) => {
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
            {get(task, "category")} {">"} {get(task, "subCategory")}{" "}
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
                {(get(task, "status") === "Pending Post" && (
                  <>
                    <Menu.Item
                      onClick={() =>
                        props.history.push(`fixit/task/offers`, task)
                      }
                    >
                      View Task
                    </Menu.Item>
                  </>
                )) ||
                  (get(task, "status") === "Accepted" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Task Resolved" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Draft" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                      >
                        Delete
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "In Progress" && (
                    <>
                      <Menu.Item
                        onClick={() => {
                          updateTaskStatus({
                            variables: {
                              taskId: task.taskId,
                              status: "Archived",
                            },
                          });
                        }}
                        disabled={!isOpen}
                      >
                        Cancel
                      </Menu.Item>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Pending" && (
                    <>
                      <Menu.Item
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Task
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Awaiting Landlord Conformation" && (
                    <>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() => props.history.push(`fixit/update`, task)}
                      >
                        {" "}
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        disabled={isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/review`, task)
                        }
                      >
                        Review and Post
                      </Menu.Item>
                    </>
                  )) ||
                  (get(task, "status") === "Open" && (
                    <>
                      <Menu.Item
                        disabled={!isOpen}
                        onClick={() =>
                          props.history.push(`fixit/task/offers`, task)
                        }
                      >
                        View Offer
                      </Menu.Item>
                    </>
                  ))}
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

  const setHighLowPriority = async (data) => {
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
    forceUpdate();
  };

  return (
    <>
      <Tabs defaultIndex={"0"} className="fixitlist__container">
        <div className="screening__tables">
          <div className="row">
            <div className="col-md-12">
              <div className="profile__menu--details screening__wrapper d-flex">
                <div className="tabs__tasks">
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
                    onChange={(e) => filterData(e.target.value)}
                    placeholder="Search here..."
                    aria-label="Search"
                  />
                </div>
                <div
                  onClick={() => props.history.push("fixit/raisetask")}
                  className="screening__top--right"
                >
                  <button className="btn btn__new--order">+ Add Task</button>
                </div>
              </div>
            </div>
          </div>
          <Select
            dropdownClassName={"dropdown_uploadtask"}
            onChange={(sel) => filterDataByStatus(sel)}
            placeholder="Filter By Status"
          >
            <Option value="Draft">Drafts</Option>
            <Option value="Archived">Archived</Option>
            <Option value="Open">Open</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>

            <Option value="Pending Post">Pending Post</Option>
            <Option value="">All</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </div>
        <div className="clearfix" />

        <Spin tip="Loading..." spinning={loading || updatingTaskStatus}>
          <div className="screening__tables">
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
                              className={`fas fa-long-arrow-alt-up ${
                                dateRaisedActive && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !dateRaisedActive && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                currentPriority && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !currentPriority && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                dateRaisedActive && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !dateRaisedActive && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                currentPriority && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !currentPriority && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                dateRaisedActive && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !dateRaisedActive && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                currentPriority && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !currentPriority && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                dateRaisedActive && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !dateRaisedActive && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                currentPriority && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !currentPriority && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                dateRaisedActive && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !dateRaisedActive && "isInActive"
                              }`}
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
                              className={`fas fa-long-arrow-alt-up ${
                                currentPriority && "isInActive"
                              }`}
                            ></i>
                            <i
                              className={`fas fa-long-arrow-alt-down ${
                                !currentPriority && "isInActive"
                              }`}
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
