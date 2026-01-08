/* eslint-disable array-callback-return */
import React, { useState, useContext, useRef, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import {
  Drawer,
  Spin,
  Modal,
  message,
  Dropdown,
  Select,
  Menu,
  Slider,
  Button,
  Input,
  Pagination,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import TaskDetails from "./TaskDetails";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import axios from "axios";
import LocationMap from "../../../Landlord/LandlordSideNavs/Properties/Maps";
import moment from "moment";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import TaskQueries from "config/queries/tasks";
import AdminQueries from "config/queries/admin";
import UserRoleQueries from "config/queries/userRole";
import "./style.scss";
import useForceUpdate from "use-force-update";
import { UserDataContext } from "store/contexts/UserContext";
import styled from "styled-components";
import CategoryDropDown from "../MyServices/CreateOrEdit/DropDown";
import { Link } from "react-router-dom";
import showNotification from "config/Notification";

const { TextArea } = Input;

const marks = {
  0: {
    style: {
      color: "#000",
    },
    label: <strong>£2000</strong>,
  },
  100: {
    style: {
      color: "#000",
    },
    label: <strong>£4500</strong>,
  },
};
const locationRange = {
  0: {
    style: {
      color: "#000",
    },
    label: <strong>5 Mi</strong>,
  },
  100: {
    style: {
      color: "#000",
    },
    label: <strong>100+ Mi</strong>,
  },
};
const { Option } = Select;

const FindIt = (props) => {
  const BACKEND_SERVER = process.env.REACT_APP_SERVER;
  const { state: userState } = useContext(UserDataContext);
  const { userData } = userState;
  const forceUpdate = useForceUpdate();
  const adminRates = useRef(0);
  const [viewPropertyLocationMap, togglePropertyLocationView] = useState(false);
  const [currentTaskToViewOnMap, selectTaskToViewInMap] = useState({});
  const [isLeaveReviewModalVisible, setLeaveReviewModal] = useState(false);
  const [isSavingReview, setReviewSaving] = useState(false);
  const [visible, setVisible] = useState(false);
  const [taskOfferValue, setTaskOfferValue] = useState(0);
  const [taskOfferDescription, setTaskOfferDescription] = useState("");
  const [offerModalLoader, toggleOfferModalLoader] = useState(false);
  const [payType, setPayType] = useState(false);
  const [completeConnectAcc, setCompleteConnectAcc] = useState(false);
  const accountSetting = userState.accountSettings;

  const dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat")
    : process.env.REACT_APP_DATE_FORMAT;

  const [viewTaskDetails, toggleTaskDetails] = useState(false);
  const [isMakeOfferModalVisible, toggleMakeOfferModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [isUpdateOfferVisible, toggleUpdateOfferModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState("all");
  const [changeFilter, setChangeFilter] = useState("");

  const [subCategories, setSubCategories] = useState([]);

  const [searchInputs, setSearchInputs] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categoryData, called } = useQuery(
    AdminQueries.getTaskCategories
  );

  const categories = categoryData?.getTaskCategories?.data;

  const [executeFetchTaskQuery, { loading, data }] = useLazyQuery(
    searchFilter === "all"
      ? TaskQueries.getTasksList
      : TaskQueries.getTaskOffers,
    {
      onCompleted: (tasks) => {
        if (tasks.getTasksList) {
          setTaskLists(get(tasks, "getTasksList.data"));
          setTotalRecords(tasks.getTasksList.totalRecords);
          setCurrentPage(tasks.getTasksList.currentPage);
        } else if (tasks.getTaskOffers !== null) {
          setTaskLists(get(tasks, "getTaskOffers.data"));
          setTotalRecords(tasks.getTaskOffers.totalRecords);
          setCurrentPage(tasks.getTaskOffers.currentPage);
        }
      },
    }
  );

  useEffect(() => {
    executeFetchTaskQuery({
      variables: {
        searchTaskInput: searchInputs,
        page: String(currentPage),
      },
    });
    // getPayType();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchFilter]);

  useEffect(() => {
    executeFetchTaskQuery({
      variables: {
        searchTaskInput: searchInputs,
        page: String(currentPage),
      },
    });
    // getPayType();

    //eslint-disable-next-line
  }, [changeFilter]);

  const [taskLists, setTaskLists] = useState(
    get(data, "getTasksList.data", [])
  );

  const handleCategoryChange = (category) => {
    setSearchInputs({ ...searchInputs, category });
    const index = categories.findIndex((cat) => cat.name === category);
    if (index !== -1) {
      setSubCategories(categories[index].subCategory);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubcategoryChange = (subCategory) => {
    setSearchInputs({ ...searchInputs, subCategory });
  };

  const [setTaskOffer] = useMutation(TaskQueries.makeTaskOffer, {
    onCompleted: (data) => {
      toggleOfferModalLoader(false);

      if (!data?.makeTaskOffer?.success) {
        showNotification(
          "error",
          data?.makeTaskOffer?.message || "Something went wrong!"
        );

        return;
      }

      setTaskOfferValue(0);
      message.success("Your Offer has been sent successfully!");
      setTaskLists(get(data, "makeTaskOffer.data", []));
      toggleMakeOfferModal(false);
      executeFetchTaskQuery({
        variables: {
          searchTaskInput: searchInputs,
          page: String(currentPage),
        },
      });
    },
  });

  useQuery(AdminQueries.fetchAdminRates, {
    onCompleted: (data) => {
      adminRates.current = get(data, "fetchAdminRates.data");
    },
  });

  useQuery(UserRoleQueries.getUserPaymentType, {
    onCompleted: (data) => {
      if (data.getUserPaymentType.paymentType === "bank") {
        setPayType(true);
      }
      if (data.getUserPaymentType.paymentType === "stripe") {
        getStripeAccData(data.getUserPaymentType.stripeConnectAccId);
      }
    },
    onError: (error) => {
      showNotification("error", "An error occurred!");
    },
  });

  const [createConversation] = useMutation(TaskQueries.createConversation, {
    onCompleted: (data) => {
      if (get(data, "createConversation.success", false)) {
        message.success("Your message has been sent successfully!");

        setLeaveReviewModal(false);
      }
    },
  });

  const [filterDrawer, setFilterDrawer] = useState(false);

  const showDrawer = () => {
    setFilterDrawer(true);
  };

  const onClose = () => {
    setFilterDrawer(false);
  };

  const [updateTaskOffer] = useMutation(TaskQueries.updateTaskOffer, {
    onCompleted: (updatedTasks) => {
      setTaskOfferValue(0);
      setTaskOfferDescription("");
      toggleOfferModalLoader(false);
      // setTaskLists(get(updatedTasks, "updateTaskOffer.data", []));
      toggleUpdateOfferModal(false);
      executeFetchTaskQuery({
        variables: {
          searchTaskInput: searchInputs,
          page: String(currentPage),
        },
      });
    },
  });

  const getStripeAccData = async (id) => {
    await axios({
      method: "POST",
      url: `${BACKEND_SERVER}/api/stripe/get-connected-account-details`,
      data: {
        accId: id,
      },
    })
      .then((res) => {
        // console.log(res.data.accDetails.requirements.disabled_reason);
        if (res.data.accDetails.requirements.disabled_reason !== null) {
          setCompleteConnectAcc(false);
        }

        if (res.data.accDetails.requirements.disabled_reason === null) {
          setPayType(true);
          setCompleteConnectAcc(true);
        }
      })

      .catch((err) => {
        // console.log(err);
        showNotification("error", "An error occurred!");
      });
  };

  const selectCurrentTask = (task, type) => {
    setSelectedTask(task);
    if (task && task.myOffer !== undefined) {
      setTaskOfferValue(task.myOffer.amount);
      setTaskOfferDescription(task.myOffer.description);
    }

    (type === "offer" && toggleMakeOfferModal(true)) ||
      (type === "update" && toggleUpdateOfferModal(true)) ||
      (type === "detail" && toggleTaskDetails(true));

    forceUpdate();
  };

  let calculatedServiceFee = (
    (get(adminRates.current, "serviceCharge", 10) * Number(taskOfferValue)) /
    100
  ).toFixed(2);

  let calculatedVat = (
    (get(adminRates.current, "vat", 20) * calculatedServiceFee) /
    100
  ).toFixed(2);

  const menu = (
    <Menu className="filterMenu">
      <div className="filter_dropdown">
        <ul>
          <li className="p-1">
            <label className="labels__global">Availability</label>

            <Select
              placeholder="Day Availability"
              dropdownMatchSelectWidth={false}
              className="input__globe"
              value={searchInputs?.dayAvailability}
              onChange={(dayAvailability) =>
                setSearchInputs({ ...searchInputs, dayAvailability })
              }
            >
              <Option value="" disabled>
                Choose
              </Option>
              <Option value="Weekdays">Weekdays</Option>
              <Option value="All Day">All Day</Option>
              <Option value="Weekend">Weekend</Option>
            </Select>
          </li>
          <li className="p-1">
            <p className="m-0">
              <label className="labels__global">Task Status</label>
            </p>

            <Dropable
              // defaultValue={get(values, "taskStatus", "Open")}
              placeholder="Please Select Status"
              className="input__globe"
              onChange={(status) => {
                setSearchInputs({ ...searchInputs, status });
              }}
            >
              <Option value="Open">Open</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Draft">Draft</Option>
              <Option value="Accepted">Accepted</Option>
              <Option value="Task Resolved">Task Resolved</Option>
              <Option value="Other Offer Selected">Other Offer Selected</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Archived">Archived</Option>
              <Option value="Reject">Reject</Option>
            </Dropable>
          </li>
          <li className="p-1">
            <label className="labels__global">Posted Date</label>
            <Select
              value={searchInputs?.postedOn}
              placeholder="Posted date"
              dropdownMatchSelectWidth={false}
              className="input__globe"
              onChange={(postedOn) => {
                setSearchInputs({ ...searchInputs, postedOn });
              }}
            >
              <Option value={""}>Added anytime</Option>
              <Option value={"24h"}>Last 24 hours</Option>
              <Option value={"7d"}>Last 7 days</Option>
              <Option value={"30d"}>Last 30 days</Option>
            </Select>
          </li>
        </ul>
      </div>
    </Menu>
  );
  return (
    <>
      <div className="list_grid__view--wrapper">
        <div className="container p-0">
          <div className="sub_header mb-3 px-0">
            <div
              class="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              {/* FOR UI: Note: Selected Item should be className: "btn-primary"
              while not selected "btn-outline-primary bg-white" */}
              <button
                type="button"
                class={`btn px-3 ${
                  searchFilter === "all" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setSearchFilter("all");
                  setSearchInputs({ ...searchInputs, userId: null });
                }}
              >
                All
              </button>

              <button
                type="button"
                className={`btn 
                ${
                  searchFilter === "myoffers"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }
                    px-3`}
                onClick={() => {
                  setSearchFilter("myoffers");
                  setSearchInputs({ ...searchInputs, userId: userData._id });
                }}
              >
                My Offer
              </button>
            </div>
            <div className="btn__wrapper">
              {/* <div className="btn save_wishlist">
                <i className="fa fa-heart" aria-hidden="true"></i> Save Wishlist
              </div> */}
              <button
                type="button"
                onClick={showDrawer}
                className="btn btn-outline-dark ml-2"
              >
                <i className="fas fa-filter" /> Filter
              </button>
            </div>
          </div>

          <Drawer
            title="Filter"
            width={320}
            onClose={onClose}
            visible={filterDrawer}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <Button
                  onClick={() => {
                    setSearchInputs({});
                    setCurrentPage(1);
                    onClose();
                  }}
                  style={{ marginRight: 8 }}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    setCurrentPage(1);
                    setChangeFilter(Math.random());
                  }}
                  type="primary"
                >
                  <i className="fas fa-filter" /> Apply
                </Button>
              </div>
            }
          >
            <Formik
              enableReinitialize
              initialValues={{}}
              onSubmit={(values, { setSubmitting }) => {
                props.setFilterObj(values);
                props.fetchSearchedTasks({
                  variables: {
                    search: get(props, "searchQuery"),
                    filter: values,
                  },
                });
              }}
            >
              {({ isSubmitting, errors, setFieldValue, values }) => (
                <Form>
                  <div className="setting__results m-0 row">
                    <div className="col-12 mb-3 p-0">
                      <p className="m-0">
                        <label htmlFor="">Location</label>
                      </p>

                      <Field
                        name="location"
                        type="text"
                        className="form-control input__global"
                        placeholder="e.g. Bristol SW6"
                        onChange={(e) =>
                          setSearchInputs({
                            ...searchInputs,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12 mb-3 p-0">
                      <p className="m-0">
                        <label htmlFor="">Category</label>
                      </p>

                      {called && categories && (
                        <CategoryDropDown
                          data={categories}
                          value={searchInputs.category}
                          onChange={handleCategoryChange}
                          title="Category"
                        />
                      )}
                    </div>
                    <div className="col-12 mb-3 p-0">
                      <p className="m-0">
                        <label htmlFor="">Sub Category</label>
                      </p>

                      <CategoryDropDown
                        data={subCategories}
                        value={searchInputs.subCategory}
                        onChange={handleSubcategoryChange}
                        fetchFromString
                        title="Sub-Category"
                      />
                    </div>
                    <div className="col-12 mb-3 p-0 sliker">
                      <p className="m-0">
                        <label htmlFor="">Mileage range</label>
                      </p>

                      <CustomSlider
                        onChange={(e) => {
                          setSearchInputs({
                            ...searchInputs,
                            startMile: e[0],
                            endMile: e[1],
                          });
                        }}
                        //     marks={[
                        //       get(props, "ranges.monthlyRentMin"),
                        //       get(props, "ranges.monthlyRentMax"),
                        //     ]}
                        marks={locationRange}
                        step={10}
                        values={[get(0), get(100)]}
                        min={get(props, "ranges.monthlyRentMin")}
                        max={get(props, "ranges.monthlyRentMax")}
                        range
                        defaultValue={[get(props, "ranges.monthlyRentMin"), 10]}
                      />
                    </div>

                    <div className="col-12 mb-3 p-0 sliker">
                      <p className="m-0">
                        <label htmlFor="">Task Budget (approx)</label>
                      </p>

                      <CustomSlider
                        onChange={(e) => {
                          setSearchInputs({
                            ...searchInputs,
                            minBudget: e[0],
                            maxBudget: e[1],
                          });
                          setFieldValue("rentRang.min", e[0]);
                          setFieldValue("rentRang.max", e[1]);
                        }}
                        //     marks={[
                        //       get(props, "ranges.monthlyRentMin"),
                        //       get(props, "ranges.monthlyRentMax"),
                        //     ]}
                        marks={marks}
                        step={10}
                        values={[
                          get(props, "ranges.monthlyRentMin"),
                          get(props, "ranges.monthlyRentMax"),
                        ]}
                        min={get(props, "ranges.monthlyRentMin")}
                        max={get(props, "ranges.monthlyRentMax")}
                        range
                        defaultValue={[get(props, "ranges.monthlyRentMin"), 10]}
                      />
                    </div>

                    <div className="col-12 mb-3 p-0">
                      <p className="m-0">
                        <label htmlFor="">Advance Filter</label>
                      </p>
                      <DropDownButton>
                        <Dropdown
                          overlay={menu}
                          // overlayClassName="dropdown-overlay"
                          // onVisibleChange={handleVisibleChange}
                          // visible={visible}
                          // handleVisibleChange={(flag) => setVisible(flag)}
                          // placement="bottomCenter"
                        >
                          <Button
                            class="btnFilter"
                            onClick={() => setVisible(!visible)}
                            placeholder="Filter"
                          >
                            Filter
                            <DownOutlined className="pull-right outline-icon" />
                          </Button>
                        </Dropdown>
                      </DropDownButton>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Drawer>
          <div className="px-0 mt-4">
            <h4>
              Searched result for{" "}
              <span className="searched_for">
                {get(props, "searchQuery", "All")}
              </span>{" "}
              <span className="searched_quantity">
                (found {totalRecords} tasks)
              </span>
            </h4>
          </div>
        </div>
      </div>
      <Spin spinning={loading} size="large" tip="Fetching tasks...">
        <div>
          <div className="row">
            <div className="searchtask-grid">
              <div className="searchtask__wrapper">
                <div className="container">
                  <div className="row">
                    <div className="main_wrap">
                      <div className="public_search_task">
                        <div className="container">
                          <div className="row">
                            {!isEmpty(taskLists) &&
                              taskLists.map((task, i) => {
                                let offerExists = false;
                                !isEmpty(task.offers)
                                  ? get(task, "offers").map((ofr, i) => {
                                      if (ofr.user) {
                                        if (userData._id === ofr.user._id) {
                                          offerExists = true;
                                          task.myOffer = ofr;
                                        }
                                      }
                                    })
                                  : (offerExists = false);

                                return (
                                  <>
                                    <div className="col-md-6">
                                      <div className="wrapper">
                                        <div className="sub_wrap">
                                          <p className="heading">
                                            {get(task, "title", "No title")
                                              .length > 50
                                              ? get(
                                                  task,
                                                  "title",
                                                  "No title"
                                                ).slice(0, 50) + "..."
                                              : get(task, "title", "No title")}
                                          </p>
                                          <p className="cost_content">
                                            <i className="fas fa-coins"></i>£{" "}
                                            {get(task, "budgetAmount")}
                                          </p>
                                        </div>
                                        <div className="sub_wrap">
                                          <p className="task_category">
                                            {" "}
                                            {get(task, "category")} {">"}{" "}
                                            {get(task, "subCategory")}
                                          </p>
                                          <p className="address">
                                            <i className="fa fa-map-marker"></i>
                                            {get(
                                              task,
                                              "property.address.City",
                                              ""
                                            )}
                                            ,{" "}
                                            {
                                              get(
                                                task,
                                                "property.address.zip",
                                                ""
                                              ).split(" ")[0]
                                            }{" "}
                                            <small
                                              onClick={() => {
                                                selectTaskToViewInMap(task);
                                                togglePropertyLocationView(
                                                  true
                                                );
                                              }}
                                            >
                                              view in map
                                            </small>
                                          </p>
                                        </div>
                                        <div className="sub_wrap">
                                          <p className="date_info">
                                            Posted on
                                            <i className="fa fa-calendar-alt"></i>
                                            {moment(
                                              get(task, "createdAt", new Date())
                                            ).format(dateFormat)}
                                          </p>
                                          <p className="days_info">
                                            {" "}
                                            {get(
                                              task,
                                              "dayAvailability",
                                              ""
                                            )} -{" "}
                                            {
                                              get(
                                                task,
                                                "timeAvailabupdateility",
                                                "  "
                                              ).split(" ")[0]
                                            }
                                          </p>
                                        </div>
                                        <div className="sub_wrap">
                                          <button className="btn_open">
                                            {" "}
                                            {get(task, "status", "")}
                                          </button>
                                          <div>
                                            <img
                                              onClick={() => {
                                                setSelectedTask(task);
                                                setLeaveReviewModal(true);
                                              }}
                                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.webp"
                                              alt="send message"
                                            />
                                          </div>
                                        </div>
                                        <div className="sub_wrap">
                                          <div className="user_wrap">
                                            <img
                                              className="user_img"
                                              src={get(
                                                task,
                                                "postedBy.avatar",
                                                "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578926398/images/prof-2.jpg"
                                              )}
                                              alt=""
                                            />
                                            <p className="user_name">
                                              Posted By <br />
                                              <span>
                                                {" "}
                                                {get(
                                                  task,
                                                  "postedBy.firstName"
                                                )}{" "}
                                                {get(task, "postedBy.lastName")}
                                              </span>
                                            </p>
                                          </div>
                                          <div className="info_user d-flex flex-grow-1 justify-content-end">
                                            <button className="btn_verified">
                                              Verified{" "}
                                              <i className="fa fa-check"></i>
                                            </button>
                                            <p className="ratings">
                                              {" "}
                                              <i className="fa fa-star"></i> 4.5
                                            </p>
                                            <p className="followers">(1k+)</p>
                                          </div>
                                        </div>
                                        <div className="details__wrap">
                                          <button
                                            onClick={() => {
                                              selectCurrentTask(task, "detail");
                                            }}
                                            className="btn btn-primary"
                                          >
                                            Task Detail
                                          </button>
                                          {offerExists ? (
                                            <button
                                              onClick={() =>
                                                selectCurrentTask(
                                                  task,
                                                  "update"
                                                )
                                              }
                                              className="btn btn-outline-warning"
                                              disabled={
                                                get(task, "status", "") ===
                                                "Open"
                                                  ? false
                                                  : true
                                              }
                                            >
                                              Update Offer
                                            </button>
                                          ) : (
                                            <button
                                              // disabled={
                                              //   task.postedBy._id ===
                                              //   userData._id
                                              // }
                                              onClick={() =>
                                                selectCurrentTask(task, "offer")
                                              }
                                              className="btn btn-outline-warning"
                                            >
                                              Make an Offer
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Pagination
            current={currentPage}
            total={totalRecords}
            pageSize={20}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
        <Drawer
          title="Quick Viewer"
          placement="right"
          closable={false}
          className="width_drawer_findit"
          onClose={() => toggleTaskDetails(false)}
          visible={viewTaskDetails}
        >
          <TaskDetails
            {...props}
            selectedTask={selectedTask}
            toggleUpdateOfferModal={() => {
              toggleTaskDetails(false);
              toggleUpdateOfferModal(true);
            }}
            makeOffer={(task) => selectCurrentTask(task, "offer")}
          />
        </Drawer>

        {payType ? (
          <Modal
            title="Make an Offer"
            className="modal-offer-form"
            visible={isMakeOfferModalVisible}
            footer={null}
            maskClosable={false}
            closable={!offerModalLoader}
            destroyOnClose
            onCancel={() => {
              setTaskOfferValue("");
              toggleMakeOfferModal(false);
            }}
            width={700}
          >
            <Spin
              spinning={offerModalLoader}
              size="large"
              tip="Fetching tasks..."
            >
              <form
                id="makeOfferForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  toggleOfferModalLoader(true);
                  let bidAmount = Number(taskOfferValue).toFixed(2);
                  setTaskOfferValue("");
                  setTaskOffer({
                    variables: {
                      taskId: selectedTask.taskId,
                      amount: Number(bidAmount),
                      description: e.target[1].value,
                    },
                  });
                }}
              >
                <div className="text-center">
                  <h3>Your Offer</h3>
                  <div className="form-group">
                    <div className="date__flex--makeorder">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="mdi mdi-currency-gbp" />
                        </div>
                      </div>
                      <input
                        type="number"
                        value={taskOfferValue}
                        placeholder="Enter an amount"
                        min={1}
                        onChange={(e) => setTaskOfferValue(e.target.value)}
                        required
                        className="form-control select----global"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <table className="table table-hover table-borderless">
                    <tbody>
                      <tr>
                        <td>Service Fee</td>
                        <td>
                          - <i className="mdi mdi-currency-gbp" />{" "}
                          {calculatedServiceFee}
                        </td>
                      </tr>
                      <tr>
                        <td>VAT</td>
                        <td>
                          - <i className="mdi mdi-currency-gbp" />{" "}
                          {calculatedVat}
                        </td>
                      </tr>
                      <tr className="recieved_amount">
                        <td>You will recieve</td>
                        <td>
                          <i className="mdi mdi-currency-gbp" />{" "}
                          {(
                            Number(taskOfferValue) -
                            calculatedServiceFee -
                            calculatedVat
                          ).toFixed(2) < 0
                            ? 0
                            : (
                                Number(taskOfferValue) -
                                calculatedServiceFee -
                                calculatedVat
                              ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="bestforjob">
                    Why are you the best person for this task ?
                    {completeConnectAcc ? "complete" : "incomplete"}
                  </p>
                  <p>
                    For your safety, please do not share personal infomation,
                    example- email, phone or address.
                  </p>
                  <div className="form-group">
                    <textarea
                      className="form-control textarea"
                      placeholder="I'll be great for this task. I have the necessary experience, skills and equipment required to get this task done."
                      name="description"
                      spellCheck="false"
                    ></textarea>
                    <p className="character_remain">
                      1500 Characters remaining
                    </p>
                  </div>
                </div>
                <div>
                  <p> Find out how your service fee is calculated </p>
                  <p>
                    As soon as offer is accepted, contact details will be shared{" "}
                  </p>
                  <div className="btn_wrap_modal">
                    <button type="submit" className="btn btn-warning">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </Spin>
          </Modal>
        ) : (
          <Modal
            title="How do you want to get paid ?"
            visible={isMakeOfferModalVisible}
            footer={null}
            onOk={() => toggleMakeOfferModal(false)}
            onCancel={() => toggleMakeOfferModal(false)}
            onClose={() => toggleMakeOfferModal(false)}
          >
            <>
              <span>
                Please select an option to confirm how you want to get paid.
                Options can be found in{" "}
              </span>
              <u>
                <Link to="/servicepro/settings/info">Settings Menu</Link>
              </u>
              <span>
                {" "}
                under <b>Bank & Card tab</b>
              </span>

              <p style={{ color: "grey", marginTop: "2%" }}>
                <i>
                  (If you have chosen Automatic as the payement method, please
                  complete the Stripe Connect Account Onboarding process to make
                  an offer.)
                </i>
              </p>
            </>
          </Modal>
        )}

        <Modal
          title="Update Offer"
          visible={isUpdateOfferVisible}
          className="modal-offer-form"
          footer={null}
          destroyOnClose
          maskClosable={false}
          closable={!offerModalLoader}
          // onOk={this.handleOk}
          onCancel={() => {
            setTaskOfferValue(0);
            toggleUpdateOfferModal(false);
          }}
        >
          <Spin
            spinning={offerModalLoader}
            size="large"
            tip="Updating task offer..."
          >
            {/* <h2>Update your offer - {get(selectedTask, "myOffer.amount")}</h2> */}
            <div className="current_offer">
              <p>
                Your current offer is <i className="mdi mdi-currency-gbp" />
                {get(selectedTask, "myOffer.amount")}{" "}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                let bidAmount = Number(taskOfferValue).toFixed(2);
                toggleOfferModalLoader(true);
                // console.log(selectedTask)
                // console.log({
                //   variables: {
                //     offerId: get(selectedTask, "myOffer._id"),
                //     amount: Number(bidAmount),
                //     description: taskOfferDescription,
                //   },
                // })
                updateTaskOffer({
                  variables: {
                    offerId: get(selectedTask, "myOffer._id"),
                    amount: Number(bidAmount),
                    description: taskOfferDescription,
                  },
                });
              }}
            >
              <>
                <div className="text-center">
                  <h3>Update Your Offer</h3>
                  <div className="form-group">
                    <div className="date__flex--makeorder">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="mdi mdi-currency-gbp" />
                        </div>
                      </div>
                      <input
                        type="number"
                        name="bidAmount"
                        value={taskOfferValue}
                        placeholder="Add an amount"
                        onChange={(e) => setTaskOfferValue(e.target.value)}
                        // min={get(selectedTask, "budgetAmount")}
                        className="form-control select----global"
                        required
                      />
                    </div>

                    <div>
                      <table className="table table-hover table-borderless">
                        <tbody>
                          <tr>
                            <td>Service Fee</td>
                            <td>
                              - <i className="mdi mdi-currency-gbp" />{" "}
                              {calculatedServiceFee}
                            </td>
                          </tr>
                          <tr>
                            <td>VAT</td>
                            <td>
                              - <i className="mdi mdi-currency-gbp" />{" "}
                              {calculatedVat}
                            </td>
                          </tr>
                          <tr className="recieved_amount">
                            <td>You will recieve</td>
                            <td>
                              <i className="mdi mdi-currency-gbp" />{" "}
                              {(
                                Number(taskOfferValue) -
                                calculatedServiceFee -
                                calculatedVat
                              ).toFixed(2) < 0
                                ? 0
                                : (
                                    Number(taskOfferValue) -
                                    calculatedServiceFee -
                                    calculatedVat
                                  ).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <TextArea
                      placeholder="Add your description"
                      value={taskOfferDescription}
                      onChange={(e) => setTaskOfferDescription(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-warning">
                  {" "}
                  Submit{" "}
                </button>
              </>
            </form>
          </Spin>
        </Modal>

        <Modal
          title={null}
          footer={null}
          wrapClassName={"map---modal"}
          visible={viewPropertyLocationMap}
          onCancel={() => togglePropertyLocationView(false)}
        >
          <LocationMap propertyData={get(currentTaskToViewOnMap, "property")} />
        </Modal>
      </Spin>
      <Modal
        title={`Send a message to ${get(selectedTask, "postedBy.firstName")}!`}
        footer={null}
        closable={true}
        maskClosable={false}
        visible={isLeaveReviewModalVisible}
        onCancel={() => setLeaveReviewModal(false)}
        destroyOnClose
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setReviewSaving(true);
            // get(task, "postedBy._id")
            createConversation({
              variables: {
                receiverId: get(selectedTask, "postedBy._id"),
                role: get(selectedTask, "postedBy.role"),
                message: `For Task #${get(selectedTask, "identity")}:  ${
                  e.target[0].value
                }`,
                type: "text",
              },
            });
          }}
        >
          <div>
            <label className="label__modal_review">
              Please write your message.
            </label>
            <textarea
              name="rating"
              placeholder="Hi! I wanted to know more about this task"
              className="form-control textarea__modal_review"
              id="rating"
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div className="text-right mt-3">
            <button
              disabled={isSavingReview}
              className="btn btn-primary"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default FindIt;
const Dropable = styled(Select)`
  width: 100% !important;
  .ant-select {
  }
  .ant-select-selector {
    border: 1px solid #ddd;
    box-shadow: none;
    padding: 5px 12px 10px !important;
    border-radius: 4px !important;
    height: 42px !important;
  }
`;

export const DropDownButton = styled.div`
  .ant-dropdown-trigger {
    width: 100%;
    border: 1px solid #ddd;
    box-shadow: none;
    padding: 9px 12px 10px !important;
    border-radius: 4px !important;
    height: 42px !important;
    text-align: left;
  }
`;
export const CustomSlider = styled(Slider)`
  :hover {
    .ant-slider-handle {
      border: 2px solid #f28e1d !important;
      box-shadow: 0 0 0 5px rgb(95 56 11 / 12%) !important;
    }
    .ant-slider-track {
      background-color: #f28e1d;
    }
  }
  .ant-slider-handle {
    border: 2px solid #f28e1d !important;
    box-shadow: 0 0 0 5px rgb(95 56 11 / 12%) !important;
    :hover {
      border: 2px solid #f28e1d !important;
    }
  }
  .ant-slider-track {
    background-color: #f28e1d;
  }
`;
