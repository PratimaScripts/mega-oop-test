/* eslint-disable array-callback-return */
import React, { useState, useEffect, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Slider from "react-slick";
import { withRouter } from "react-router-dom";
import PropertyLocationMap from "../../Maps";
// import {
//   CardElement,
//   injectStripe
//   //   CardNumberElement,
//   //   CardExpiryElement,
//   //   CardCVCElement
// } from "react-stripe-elements";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import {
  Modal,
  Drawer,
  message,
  Collapse,
  List,
  Avatar,
  Input,
  Spin,
  Popconfirm,
  Button,
} from "antd";

import { CaretRightOutlined } from "@ant-design/icons";
import get from "lodash/get";
import filter from "lodash/filter";
import TaskQueries from "../../../../config/queries/tasks";
import {
  useMutation,
  useSubscription,
  // useLazyQuery
} from "@apollo/react-hooks";
import MyNumberInput from "../../../../config/CustomNumberInput";
import isEmpty from "lodash/isEmpty";
// import TaskChat from "../TaskMessaging";
// import useForceUpdate from "use-force-update";
import ReactPlayer from "react-player";
import ProfileCard from "../../Card";
import { Rate } from "antd";
import { gql } from "apollo-boost";
import { Elements } from "@stripe/react-stripe-js";
import "./style.scss";

import { StoreContext } from "../../../../store/store.js";
import { UserDataContext } from "store/contexts/UserContext";

import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import showNotification from "config/Notification";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

//test

const { TextArea } = Input;

const { Panel } = Collapse;

const CONVERSATION_SUBSCRIPTION = gql`
  subscription getTaskOfferMessage($offerId: String!) {
    getTaskOfferMessage(offerId: $offerId) {
      success
      message
      data
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendTaskOfferMessage($offerId: String!, $message: String!) {
    sendTaskOfferMessage(offerId: $offerId, message: $message) {
      success
      message
      data {
        _id
        propertyId
        identity
        status
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
            email
            role
          }
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          role
          firstName
          avatar
          lastName
        }
        property {
          propertyId: _id
          address
          isVerify
          location
          status
          photos
          propertyType
          title
          subType
          numberOfBed
          numberOfBath
          numberOfReception
          sizeInSquareFeet
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const customPanelStyle = {
  background: "#f7f7f7",
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: "hidden",
};

const AddressComp = (props) => {
  const BACKEND_SERVER = process.env.REACT_APP_SERVER;
  const { state, dispatch } = useContext(StoreContext);
  const { state: userState } = useContext(UserDataContext);

  const { closeStripeModal } = state;

  const stripe = useStripe();
  const elements = useElements();

  let screenWidth = window.screen.width;
  // const forceUpdate = useForceUpdate();
  const [selectedOffer, selectOfferCurrent] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [cardStatus, setCardStatus] = useState(false);
  // const [paymentIntent, setPaymentIntentData] = useState({});
  const [collapseMessage, setCollapseMessage] = useState("");
  const [currentSelectedRating, setRating] = useState(0);
  const [isSavingReview, setReviewSaving] = useState(false);
  const [isLeaveReviewModalVisible, setLeaveReviewModal] = useState(false);
  const [openPostedByDrawer, togglePostedByDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewPropertyLocationMap, togglePropertyLocationView] = useState(false);
  const [viewVideoModalOn, toggleviewVideoModal] = useState(false);
  const [releasePaymentModalOn, toggleReleasePaymentModal] = useState(false);

  const userDetails = userState.userData;
  const userSettings = userState.accountSetting;

  const userRole = userDetails.role;
  const [budgetData, setBudgetData] = useState(
    get(props, "location.state", {})
  );

  const taskUpdated = (data) => {
    let allTasks = get(data, "updateTaskStatus.data");

    props.history.push(`/${userRole}/fixit`, allTasks);
  };

  let isViewMode = window.location.href.includes("offer") ? true : false;
  let isRole = window.location.href.includes("landlord") ? true : false;

  const [isBudgetEditable, setBudgetStatus] = useState(false);
  const [updateTask] = useMutation(TaskQueries.updateTask, {
    onCompleted: (resdata) =>
      // props.contextData.setUserTasks(get(resdata, "updateTask.data")),
      // console.log("Update Task", resdata)
      showNotification("success", "Update successfully!"),
  });
  const [updateTaskStatus] = useMutation(TaskQueries.updateTaskStatus, {
    onCompleted: taskUpdated,
  });

  const [flagTaskOffer] = useMutation(TaskQueries.flagTaskOffer, {
    onCompleted: (data) => {
      let allTasks = get(data, "flagTaskOffer.data");

      props.history.push(`/${userRole}/fixit`, allTasks);
    },
  });

  const [sendOfferMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      if (get(data, "sendTaskOfferMessage.success")) {
        setBudgetData(get(data, "sendTaskOfferMessage.data"));
      }
    },
  });

  const [leaveReview] = useMutation(TaskQueries.ratingOnTask, {
    onCompleted: (data) => {
      if (get(data, "ratingOnTask.success")) {
        setLeaveReviewModal(false);
        message.success("Thank you for your review!");

        props.history.push(`/${userRole}/fixit`, allTasks);
      }
    },
  });

  const [refundTaskEscrow] = useMutation(TaskQueries.refundCharges, {
    onCompleted: (data) => {
      if (get(data, "refundCharges.success")) {
        message.success("The Escrow has been refunded!");
      }
    },
  });

  const [releasePayment] = useMutation(TaskQueries.releasePayment, {
    onCompleted: (dat) => {
      if (get(dat, "releasePayment.success")) {
        setLoading(false);
        setLeaveReviewModal(true);
        setAllTasks(get(dat, "releasePayment.data"));

        // props.contextData.updateSingleTask(get(dat, "releasePayment.data[0]"));
      } else {
        message.error(get(dat, "releasePayment.message"));
      }
    },
  });

  const [likeDislike] = useMutation(TaskQueries.likeAndDislikeOffer);
  const [acceptRejectOffer] = useMutation(TaskQueries.acceptRejectOffer, {
    onCompleted: (data) => {
      if (get(data, "acceptRejectTaskOffer.success", false)) {
        setBudgetData(get(data, "acceptRejectTaskOffer.data"));
      } else {
        message.error(get(data, "acceptRejectTaskOffer.message"));
      }
    },
  });

  let acceptedOffer = filter(budgetData.offers, {
    status: "Accepted",
  });

  // const [createPaymentIntent] = useLazyQuery(TaskQueries.createPaymentIntent, {
  //   variables: {
  //     amount: (get(acceptedOffer, "[0].amount") * 40) / 100
  //   },
  //   onCompleted: pi => setPaymentIntentData(get(pi, "createPaymentIntent.data"))
  // });

  let otherOffers = filter(budgetData.offers, (o) => {
    return o.status !== "Accepted";
  });

  const likeDislikeFunc = (offer, type, index) => {
    let data = budgetData;
    if (type) {
      data.offers[index].like = true;
      data.offers[index].dislike = false;
    }

    if (!type) {
      data.offers[index].like = false;
      data.offers[index].dislike = true;
    }

    setBudgetData(data);
    // forceUpdate();

    likeDislike({
      variables: { offerId: offer._id, type: type ? "like" : "dislike" },
    });
  };

  let images = get(budgetData, "images", []);
  useSubscription(CONVERSATION_SUBSCRIPTION, {
    variables: {
      offerId:
        !isEmpty(selectedOffer) &&
        get(budgetData, "offers")[selectedOffer] &&
        get(budgetData, "offers")[selectedOffer]._id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (data) =>
      get(data, "subscriptionData.data.getTaskOfferMessage.success") &&
      setBudgetData(
        get(data, "subscriptionData.data.getTaskOfferMessage.data")
      ),
  });

  let settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: isEmpty(images)
      ? get(budgetData, "videoUrl", " ") && 1
      : images.length < 2
      ? 1
      : 2,
    slidesToScroll: 1,
  };

  let settingsTwo = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow:
      get(budgetData, "photos", []) && get(budgetData, "photos", []).length < 2
        ? 1
        : 2,
    slidesToScroll: 1,
  };

  const saveBudget = () => {
    let obj = { ...budgetData };
    delete obj["_id"];

    updateTask({
      variables: {
        taskId: budgetData.taskId,
        task: { budgetAmount: obj.budgetAmount, propertyId: obj.propertyId },
      },
    });
    setBudgetStatus(false);
  };

  let taskImages =
    !isEmpty(images) &&
    images.map((img, i) => {
      return <img key={i} className="mr-3" src={img.image} alt="" />;
    });

  useEffect(() => {
    setBudgetData(get(props, "location.state", {}));
    if (!props.location?.state) {
      props.history.push(`/${userRole}/fixit`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNumber = (num) => {
    if (num) {
      return String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
  };

  let tOwner = get(budgetData, "payOwnedBy");

  // context

  // console.log(closeStripeModal);

  // console.log(budgetData.offers)

  // const { refetch, data: {getTasks: {data: statusData} = {}} = {} , loading: statusLoading} = useQuery(TaskQueries.getTasks)
  // // console.log("statusData", data)

  // const [yes, setYes] = useState(false)
  // const [currentStatus, setCurrentStatus] = useState("Open")

  // let testCon;

  // if (statusData) {
  //   statusData.map((openTask) => {
  //     if (openTask.taskId === budgetData.taskId) {
  //       testCon = openTask;
  //       console.log("easily", testCon);
  //     }
  //   });
  // } else {
  //   console.log("no data");
  // }

  // return testCon;

  // const [taskStatus, setTaskStatus] = useState("")

  // let tempStatus = []
  // let payStatus;

  // const callMe = () => {
  //   tempStatus = "In Progress"
  // }

  // if (paymentStatus === "success") {
  //   tempStatus.push("In Progress")
  //   console.log("array", tempStatus)
  // }

  // if (paymentStatus === "success") {
  //   payStatus = "success"
  // }

  // let yeahMan = tempStatus.includes("In Progress");

  // console.log("array her", tempStatus)

  //release task money
  const payoutMoney = async (acceptedOffer, budgetData) => {
    await axios({
      method: "POST",
      url: `${BACKEND_SERVER}/api/stripe/release`,
      data: {
        offer: acceptedOffer,
        task: budgetData,
      },
    })
      .then(function (response) {
        // console.log(response);

        if (response.data.success) {
          setConfirmLoading(false);
          setPayoutSuccess(true);
        }
      })
      .catch(function (error) {
        // console.log(error);
        showNotification("error", "An error occurred!");
      });
  };

  const [isPayoutModalVisible, setIsPayoutModalVisible] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // const showPayoutModal = () => {
  //   setIsPayoutModalVisible(true);
  // };

  const handlePayoutOk = (acceptedOffer, budgetData) => {
    // setIsPayoutModalVisible(false);
    setConfirmLoading(true);
    payoutMoney(acceptedOffer, budgetData);
  };

  const handlePayoutCancel = () => {
    setIsPayoutModalVisible(false);
  };

  const [sendOfferId, setSendOfferId] = useState("");
  const [sendOfferAmount, setSendOfferAmount] = useState("");
  const [sendOfferUserName, setSendOfferUserName] = useState("");
  const [sendOfferUserId, setSendOfferUserId] = useState("");

  let taskPayOwn = budgetData.payOwnedBy === "Landlord" ? "landlord" : "renter";
  let currentTaskStatus = budgetData.status;

  return (
    <Spin spinning={loading}>
      <div
        className={
          props.responsiveClasses ||
          (screenWidth <= 767 && " roc__desktop--responsive")
        }
      >
        <div className="content">
          <div className="container-fluid">
            <div className="tab-content">
              <div className="row">
                {/* <button onClick={currentTaskData}>me</button> */}
                <div className="task_id">
                  TASK ID #{get(budgetData, "identity")}
                </div>
                {screenWidth <= 767 || props.responsiveClasses !== "" ? (
                  <div
                    onClick={() => togglePostedByDrawer(true)}
                    className="posted_by"
                  >
                    <i
                      className="fa fa-user-circle"
                      aria-hidden="true"
                      title="Posted By"
                    ></i>
                  </div>
                ) : (
                  <div className="posted_by">POSTED BY</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="offer__left_wrap ">
          <div className="wrapper--task">
            <div className="row">
              <div className="col-md-12">
                <div className="content">
                  <div className="budget-task">
                    <div className="form-group">
                      <h3>{get(budgetData, "title")}</h3>
                      <ul>
                        <li>
                          <div className="task--info">
                            <i
                              className="fa fa-home fa-lg"
                              aria-hidden="true"
                            ></i>
                            {/* <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578926350/images/householdnew.webp"
                            alt="loading..."
                          /> */}
                            <p>
                              {get(budgetData, "category")} {">"}{" "}
                              {get(budgetData, "subCategory")}
                            </p>
                          </div>
                        </li>
                        <li>
                          <div className="task--info">
                            <i className="fas fa-map-marker-alt fa-lg"></i>
                            {/* <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578926318/images/cal2.webp"
                            alt="loading..."
                          /> */}
                            <p>
                              {get(budgetData, "property.address.City", "")},{" "}
                              {
                                get(
                                  budgetData,
                                  "property.address.PostalCode",
                                  ""
                                ).split(" ")[0]
                              }{" "}
                              <small>
                                <span
                                  onClick={() =>
                                    togglePropertyLocationView(true)
                                  }
                                >
                                  View in map
                                </span>
                              </small>
                            </p>
                          </div>
                        </li>
                        <li>
                          <div className="task--info">
                            <i className="fas fa-calendar-check fa-lg"></i>
                            {/* <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dishwasher.png"
                            alt="loading..."
                          /> */}
                            <p>
                              Posted on{" "}
                              {moment(
                                get(budgetData, "createdAt", new Date())
                              ).format("dddd, MMMM D YYYY")}
                            </p>
                          </div>
                        </li>
                        <li>
                          <div className="task--info">
                            <i className="fas fa-clock fa-lg"></i>
                            {/* <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dishwasher.png"
                            alt="loading..."
                          /> */}
                            <p>
                              {" "}
                              {get(budgetData, "dayAvailability")},{" "}
                              {get(budgetData, "timeAvailability") &&
                                get(budgetData, "timeAvailability").split(
                                  " "
                                )[0]}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="form-group">
                      <div className="tab-content">
                        <h6>
                          <i className="fas fa-coins"></i>&nbsp;TASK BUDGET
                        </h6>
                        {/* {((get(budgetData, "status") === ("Open" || "Pending")))? */}
                        <h3>
                          <i className="fas fa-pound-sign"></i>
                          &nbsp;
                          <span>
                            {formatNumber(
                              get(budgetData, "budgetAmount", "1234")
                            )}
                          </span>
                          &nbsp;&nbsp;
                          {/* editing the budget amount */}
                          {/* who should be able to edit the budget */}
                          {((tOwner === "Landlord" && isRole) ||
                            (tOwner === "Renter" && !isRole)) &&
                            (get(budgetData, "status") === "Open" ||
                              get(budgetData, "status") === "Pending") && (
                              <>
                                <i
                                  onClick={() => setBudgetStatus(true)}
                                  className="fas fa-edit"
                                ></i>
                                <Drawer
                                  title={null}
                                  placement="right"
                                  closable={true}
                                  className="ant_slider_review"
                                  onClose={() => setBudgetStatus(false)}
                                  visible={isBudgetEditable}
                                  getContainer={false}
                                  width={200}
                                  style={{
                                    position: "absolute",
                                    overflow: "hidden",
                                  }}
                                >
                                  <MyNumberInput
                                    placeholder="Update Budget"
                                    allowNegative={false}
                                    className="form-control select__global"
                                    thousandSeparator={true}
                                    value={get(budgetData, "budgetAmount")}
                                    onValueChange={(val) => {
                                      budgetData["budgetAmount"] =
                                        val.floatValue;
                                      setBudgetData(budgetData);
                                    }}
                                  />
                                  <i
                                    onClick={saveBudget}
                                    className="fas fa-save"
                                  ></i>
                                </Drawer>
                              </>
                            )}
                        </h3>
                        {/*                         
                        : <h3>
                          <i className="fas fa-pound-sign"></i>
                          &nbsp;
                          <span>
                            {formatNumber(
                              get(budgetData, "budgetAmount", "1234")
                            )} 
                          </span>
                          &nbsp;&nbsp;
                          </h3>}
 */}
                        {/* renter post a task with pay owned by landlord - landlord screen */}
                        {get(budgetData, "status") === "Pending" && isRole && (
                          <button
                            onClick={async () =>
                              await updateTaskStatus({
                                variables: {
                                  taskId: budgetData.taskId,
                                  status: userRole === "landlord" && "Open",
                                },
                              })
                            }
                            className="btn btn-warning"
                          >
                            Review & Post
                          </button>
                        )}
                        {/* renter post a task with pay owned by landlord - renter screen */}
                        {get(budgetData, "status") === "Pending" && !isRole && (
                          <button disabled className="btn btn-warning">
                            Pending Approval
                          </button>
                        )}
                        {/* {get(budgetData, "status") === "In Progress" ||
                          (get(budgetData, "status") === "Task Resolved" && (
                            <button disabled className="btn btn-warning">
                              Assigned
                            </button>
                          ))} */}

                        {get(budgetData, "status") === "Open" && (
                          <button
                            disabled
                            className="btn btn-warning-mad"
                            // style={{ backgroundColor: "#2DC4D4" }}
                          >
                            Make an Offer
                          </button>
                        )}
                        {get(budgetData, "status") === "Draft" &&
                          userRole === taskPayOwn && (
                            <button
                              onClick={async () =>
                                await updateTaskStatus({
                                  variables: {
                                    taskId: budgetData.taskId
                                      ? budgetData.taskId
                                      : budgetData._id,
                                    status: userRole === taskPayOwn && "Open",
                                  },
                                })
                              }
                              className="btn btn-warning"
                            >
                              Review & Post
                            </button>
                          )}

                        {get(budgetData, "status") === "In Progress" && (
                          <button disabled className="btn btn-warning">
                            Assigned
                          </button>
                        )}

                        {get(budgetData, "status") === "Task Resolved" && (
                          <button disabled className="btn btn-warning-resolved">
                            Resolved
                          </button>
                        )}

                        {(get(budgetData, "status") === "Completed" ||
                          get(budgetData, "status") === "Task Completed") && (
                          <button
                            disabled
                            className="btn btn-warning-completed"
                          >
                            Completed
                          </button>
                        )}
                      </div>
                      <a href="test">
                        <i className="fas fa-share-alt"></i>&nbsp;Share or
                        invite
                      </a>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                  <hr></hr>
                  <div className="notify--taskList">
                    <div className="row">
                      <div className="col-md-3 text-left reviewstatus__pile">
                        <button
                          className={`btn ${
                            get(budgetData, "status", "Draft") === "In Progress"
                              ? "inprogress"
                              : get(budgetData, "status", "Draft").toLowerCase()
                          }_pile`}
                          style={
                            get(budgetData, "status", "") === "Task Resolved"
                              ? { backgroundColor: "#047BFE", color: "white" }
                              : undefined
                          }
                        >
                          {get(budgetData, "status", "")}
                        </button>
                      </div>
                      <div className="col-md-6 text-center message-fixit-offers">
                        <label>
                          <span>
                            {get(budgetData, "offers", []) &&
                              !isEmpty(budgetData, "offers", []) &&
                              get(budgetData, "offers", []).length}
                          </span>{" "}
                          Offers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                          <span>
                            {get(budgetData, "taskOfferMessageCount", 0)}
                          </span>{" "}
                          Messages
                        </label>
                        {/* <a href="test">
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                            alt=""
                          /> 
                          <i className="fas fa-envelope"></i>
                        </a>*/}
                        {/*<a href="test">
                           <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                            alt=""
                          /> 
                          <i className="fas fa-flag"></i>
                        </a>*/}
                      </div>
                      {/* <div className="col-md-3 text-center">
                        <div className="row">
                          <div className="col-md-10">
                            <input
                              className="form-control w-100"
                              placeholder="More Action"
                            />
                          </div>
                          <div className="col-md-2">
                            <i className="fas fa-ellipsis-v"></i>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab--list--details">
              <Tabs defaultIndex={isViewMode ? 2 : 0}>
                <TabList>
                  <Tab>Details</Tab>
                  <Tab>
                    Messages ({get(budgetData, "taskOfferMessageCount", 0)})
                  </Tab>
                  <Tab>
                    Offers(
                    {get(budgetData, "offers", []) &&
                      !isEmpty(budgetData, "offers", []) &&
                      get(budgetData, "offers", []).length}
                    )
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="row">
                    <div className="col-md-8">
                      <p>{get(budgetData, "description")}</p>
                    </div>
                    <div className="col-md-4">
                      <Slider {...settings}>
                        {taskImages}
                        {get(budgetData, "videoUrl") && (
                          <div className="mr-3 slider_img_modal">
                            {" "}
                            <ReactPlayer
                              playing={false}
                              className="react-player-lochan"
                              url={get(budgetData, "videoUrl")}
                            />
                            <button
                              className="react-player__button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleviewVideoModal(true);
                              }}
                            >
                              <i className="fas fa-play-circle"></i>
                            </button>
                          </div>
                        )}
                      </Slider>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="messages--taskList">
                    <div className="col-md-12">
                      <h3>
                        Connect your Social profile to build your online social
                        reputation.
                      </h3>
                    </div>
                    <p>Messages</p>
                    <Collapse
                      bordered={false}
                      onChange={(e) => selectOfferCurrent(e)}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                    >
                      {!isEmpty(get(budgetData, "offers", [])) &&
                        get(budgetData, "offers", []).map((ofr, j) => {
                          return (
                            <Panel
                              header={
                                <>
                                  <img
                                    className="avatar__taskchat"
                                    src={get(
                                      ofr,
                                      "user.avatar",
                                      "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                                    )}
                                    alt=""
                                  />
                                  {`${get(ofr, "user.firstName", "User")} ${get(
                                    ofr,
                                    "user.lastName",
                                    ""
                                  )}`}
                                </>
                              }
                              key={j}
                              style={customPanelStyle}
                            >
                              <List
                                itemLayout="horizontal"
                                dataSource={get(ofr, "messages", [])}
                                renderItem={(item) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          alt="user avatar"
                                          src={
                                            item.userId === get(ofr, "user._id")
                                              ? get(ofr, "user.avatar")
                                              : get(
                                                  userDetails,
                                                  "avatar",
                                                  "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                                )
                                          }
                                        />
                                      }
                                      title={
                                        item.userId === get(ofr, "user._id")
                                          ? `${get(
                                              ofr,
                                              "user.firstName"
                                            )} ${get(ofr, "user.lastName")}`
                                          : `${get(
                                              userDetails,
                                              "firstName"
                                            )} ${get(userDetails, "lastName")}`
                                      }
                                      description={item.message}
                                    />
                                  </List.Item>
                                )}
                              />

                              <form
                                id="sendOfferMessageForm"
                                onSubmit={(e) => {
                                  e.preventDefault();

                                  document
                                    .querySelector("#sendOfferMessageForm")
                                    .reset();

                                  setCollapseMessage("");
                                  sendOfferMessage({
                                    variables: {
                                      offerId: ofr._id,
                                      message: e.target[0].value,
                                    },
                                  });
                                }}
                              >
                                <TextArea
                                  name="text_message"
                                  value={collapseMessage}
                                  onChange={(e) =>
                                    setCollapseMessage(e.target.value)
                                  }
                                  placeholder={"Enter your message!"}
                                  rows={4}
                                />
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                >
                                  Send
                                </button>
                              </form>
                              {/* <p>{!isEmpty(get(ofr, "messages", [])) && get(ofr, "messages", []).map((msg, i) => {
                              
                            })}</p> */}
                            </Panel>
                          );
                        })}
                    </Collapse>
                    {/* <TaskChat offers={get(budgetData, "offers", [])} {...props} /> */}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="offers--taskList">
                    {/* <label className="btn btn-offer">Accepted Offer</label> */}
                    {!isEmpty(acceptedOffer) && (
                      <>
                        {/* {console.log("accepted offer", acceptedOffer)} */}
                        <label className="btn btn-offer">Accepted Offer</label>
                        <div className="offers-list">
                          <div className="card">
                            <div className="row">
                              <div className="col-md-9">
                                <div className="offer--info">
                                  <p className="name_user">
                                    <img
                                      src={get(
                                        acceptedOffer,
                                        "[0].user.avatar",
                                        "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                                      )}
                                      alt=""
                                      className="mr-3"
                                    />
                                    {get(acceptedOffer, "[0].user.firstName")}{" "}
                                    {get(acceptedOffer, "[0].user.lastName")}
                                  </p>
                                </div>
                                <p>
                                  {get(
                                    acceptedOffer,
                                    "[0].description",
                                    "lorem ipsum"
                                  )}
                                </p>
                              </div>
                              <div className="col-md-3">
                                <h4 className="text-right">
                                  <i className="fas fa-pound-sign"></i>
                                  &nbsp;{formatNumber(acceptedOffer[0].amount)}
                                  &nbsp;&nbsp;
                                  {/* <i className="fas fa-edit"></i> */}
                                </h4>
                                <div>
                                  {get(acceptedOffer, "[0].status") ===
                                    "Accepted" &&
                                    get(budgetData, "status") ===
                                      "In Progress" &&
                                    get(budgetData, "comment") !== "" && (
                                      <>
                                        <div>
                                          <button
                                            disabled
                                            className="btn btn-Change"
                                          >
                                            Task In Progress
                                          </button>
                                        </div>
                                      </>
                                    )}

                                  {get(budgetData, "status") ===
                                    "Task Resolved" &&
                                    get(budgetData, "comment") &&
                                    get(acceptedOffer, "[0].status") ===
                                      "Accepted" && (
                                      <>
                                        <div>
                                          <button
                                            onClick={() => {
                                              Modal.info({
                                                title:
                                                  "This is a notification message",
                                                content: (
                                                  <div>
                                                    <div>
                                                      <h4> Comment :- </h4>
                                                      {get(
                                                        budgetData,
                                                        "comment"
                                                      )}{" "}
                                                    </div>
                                                    <div>
                                                      <h4> Images Uploaded:</h4>
                                                      {!isEmpty(
                                                        get(
                                                          budgetData,
                                                          "photos",
                                                          []
                                                        )
                                                      ) && (
                                                        <Slider
                                                          {...settingsTwo}
                                                        >
                                                          {get(
                                                            budgetData,
                                                            "photos",
                                                            []
                                                          ).map((pic) => {
                                                            return (
                                                              <img
                                                                src={pic}
                                                                alt={pic}
                                                              />
                                                            );
                                                          })}
                                                        </Slider>
                                                      )}
                                                    </div>

                                                    {!isEmpty(
                                                      get(
                                                        budgetData,
                                                        "videos[0]"
                                                      ),
                                                      {}
                                                    ) && (
                                                      <div>
                                                        <h4>Video:</h4>
                                                        <ReactPlayer
                                                          url={get(
                                                            budgetData,
                                                            "videos[0]"
                                                          )}
                                                          controls
                                                          youtubeConfig={{
                                                            playerVars: {
                                                              showinfo: 1,
                                                            },
                                                          }}
                                                          width="100%"
                                                          height="100%"
                                                        />
                                                      </div>
                                                    )}
                                                  </div>
                                                ),
                                                onOk() {},
                                              });
                                            }}
                                            className="btn btn-Change"
                                          >
                                            View Task Completion Data
                                          </button>
                                          <button
                                            onClick={() => {
                                              message.loading(
                                                "Please wait while we process your request..."
                                              );
                                              refundTaskEscrow({
                                                variables: {
                                                  taskId: budgetData.taskId,
                                                },
                                              });
                                            }}
                                            className="btn btn-Change"
                                          >
                                            Flag
                                          </button>

                                          <button
                                            className="btn btn-Release"
                                            onClick={() => {
                                              // console.log(acceptedOffer);
                                              setIsPayoutModalVisible(true);
                                            }}
                                          >
                                            {/* with one offer */}
                                            Release Payment
                                          </button>

                                          <Modal
                                            onCancel={handlePayoutCancel}
                                            // onOk={() => handlePayoutOk(acceptedOffer, budgetData)}
                                            footer={null}
                                            okText="Confirm"
                                            closable={true}
                                            maskClosable={false}
                                            visible={isPayoutModalVisible}
                                            destroyOnClose
                                            confirmLoading={confirmLoading}
                                            width={400}
                                          >
                                            {!payoutSuccess && (
                                              <div>
                                                <h6
                                                  style={{
                                                    textAlign: "center",
                                                    marginTop: "8%",
                                                  }}
                                                >
                                                  Please confirm £
                                                  {get(
                                                    acceptedOffer,
                                                    "[0].amount"
                                                  )}{" "}
                                                  payment release to <br />
                                                  {get(
                                                    acceptedOffer,
                                                    "[0].user.firstName"
                                                  )}{" "}
                                                  {get(
                                                    acceptedOffer,
                                                    "[0].user.lastName"
                                                  )}
                                                </h6>

                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  <Button
                                                    className="accBtn"
                                                    style={{ marginTop: "3%" }}
                                                    type="primary"
                                                    onClick={() =>
                                                      handlePayoutOk(
                                                        acceptedOffer,
                                                        budgetData
                                                      )
                                                    }
                                                  >
                                                    Confirm
                                                  </Button>
                                                </div>
                                              </div>
                                            )}

                                            {payoutSuccess && (
                                              <div>
                                                <h4
                                                  style={{
                                                    textAlign: "center",
                                                    marginTop: "8%",
                                                  }}
                                                >
                                                  Payment released successfully!
                                                </h4>
                                                <div className="sucBtnDiv">
                                                  <Button
                                                    className="accBtn"
                                                    type="primary"
                                                  >
                                                    <Link to="/landlord/accounting/rental-transaction">
                                                      View Accounts
                                                    </Link>
                                                  </Button>

                                                  <Button className="taskBtn">
                                                    <Link to="/landlord/fixit">
                                                      Return to Tasks
                                                    </Link>
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </Modal>
                                        </div>
                                      </>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <p className="info--offers">
                            {moment(
                              get(acceptedOffer, "[0].createdAt")
                            ).fromNow()}
                            &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                            {/* Like Icon */}
                            <div
                              className={`icon-wrapper ${
                                get(acceptedOffer, "[0].like", null)
                                  ? "anim"
                                  : ""
                              }`}
                              // onClick={() => likeDislikeFunc(acceptedOffer[0], true, i)}
                            >
                              <span className="icon">
                                <i
                                  className={`fa fa-thumbs-up ${
                                    get(acceptedOffer, "[0].like", null)
                                      ? "thumbs__up-active"
                                      : ""
                                  }`}
                                ></i>
                              </span>
                              <div className="border">
                                <span></span>
                              </div>
                              <div className="satellite">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                            &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                            {/* Dislike Icon */}
                            <div
                              className={`icon-wrapper ${
                                get(acceptedOffer, "[0].dislike", null)
                                  ? "anim"
                                  : ""
                              }`}
                              // onClick={() => likeDislikeFunc(acceptedOffer[0], false, i)}
                            >
                              {/* <span className="icon">
                                <i
                                  className={`fa fa-thumbs-down ${
                                    get(acceptedOffer, "[0].dislike", null)
                                      ? "thumbs__down-active"
                                      : ""
                                  }`}
                                  aria-hidden="true"
                                ></i>{" "}
                              </span> */}

                              <div className="border">
                                <span></span>
                              </div>
                              <div className="satellite">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                            &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                            <span>
                              <i className="fa fa-envelop"></i>
                              {/* send message */}
                            </span>
                          </p>
                        </div>

                        <div className="col-md-12">
                          <label className="btn btn-other">Other Offers</label>
                        </div>
                      </>
                    )}

                    {!isEmpty(otherOffers) &&
                      otherOffers.map((offer, i) => {
                        return (
                          <>
                            {offer.status !== "Accepted" && (
                              <>
                                <div className="offers-list">
                                  <div className="card">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="offer--info">
                                          <p>
                                            <img
                                              src={get(
                                                offer,
                                                "user.avatar",
                                                "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                                              )}
                                              alt=""
                                              className="mr-3"
                                            />
                                            {get(offer, "user.firstName")}{" "}
                                            {get(offer, "user.lastName")}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <h3 className="text-right">
                                          <i className="fas fa-pound-sign"></i>
                                          &nbsp;{formatNumber(offer.amount)}
                                          &nbsp;
                                        </h3>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-9">
                                        <p>
                                          {get(
                                            offer,
                                            "description",
                                            "lorem ipsum"
                                          )}
                                        </p>
                                      </div>
                                      {get(budgetData, "status") === "Open" &&
                                        get(budgetData, "postedBy._id") ===
                                          userDetails._id && (
                                          <>
                                            {userRole === taskPayOwn &&
                                              currentTaskStatus === "Open" && (
                                                <div className="col-md-3">
                                                  {/* ----------stripe element------------- */}
                                                  <button
                                                    className="btn btn-Change"
                                                    onClick={() => {
                                                      dispatch({
                                                        type: "CLOSE_STRIPE_MODAL",
                                                        payload: "flex",
                                                      });

                                                      setSendOfferId(offer._id);
                                                      setSendOfferAmount(
                                                        offer.amount
                                                      );
                                                      setSendOfferUserName(
                                                        offer.user.firstName
                                                      );
                                                      setSendOfferUserId(
                                                        offer.user._id
                                                      );
                                                    }}
                                                  >
                                                    {/* accept offer second */}
                                                    Accept Offer
                                                  </button>

                                                  <div
                                                    style={{
                                                      display:
                                                        closeStripeModal ===
                                                        undefined
                                                          ? "none"
                                                          : closeStripeModal,
                                                    }}
                                                  >
                                                    <Elements
                                                      stripe={stripePromise}
                                                    >
                                                      <CheckoutForm
                                                        userData={userDetails}
                                                        taskData={budgetData}
                                                        amount={sendOfferAmount}
                                                        name={sendOfferUserName}
                                                        offerId={sendOfferId}
                                                        offerUserId={
                                                          sendOfferUserId
                                                        }
                                                        setTaskData={
                                                          setBudgetData
                                                        }
                                                      />
                                                    </Elements>
                                                  </div>

                                                  <button
                                                    onClick={() =>
                                                      acceptRejectOffer({
                                                        variables: {
                                                          offerId: offer._id,
                                                          status: "Reject",
                                                        },
                                                      })
                                                    }
                                                    className="btn btn-Release"
                                                  >
                                                    Reject Offer
                                                  </button>
                                                </div>
                                              )}

                                            {userRole !== taskPayOwn &&
                                              currentTaskStatus === "Open" && (
                                                <div className="col-md-3">
                                                  <button
                                                    className="btn btn-Change"
                                                    style={{
                                                      cursor: "default",
                                                    }}
                                                  >
                                                    Awaiting{" "}
                                                    {budgetData.payOwnedBy}{" "}
                                                    Approval
                                                  </button>
                                                </div>
                                              )}
                                          </>
                                        )}

                                      {get(offer, "status") === "Accepted" &&
                                        get(budgetData, "status") ===
                                          "In Progress" &&
                                        get(budgetData, "comment") !== "" && (
                                          <>
                                            <div className="col-md-3">
                                              <button
                                                disabled
                                                className="btn btn-Change"
                                              >
                                                Task In Progress
                                              </button>
                                            </div>
                                          </>
                                        )}

                                      {get(budgetData, "status") ===
                                        "Task Resolved" &&
                                        get(offer, "status") ===
                                          "In Progress" &&
                                        get(offer, "status") ===
                                          "Task Completed" && (
                                          <>
                                            <div className="col-md-3">
                                              <button
                                                onClick={() => {
                                                  Modal.info({
                                                    title:
                                                      "Payment Release Request",
                                                    content: (
                                                      <div>
                                                        <div>
                                                          <h4> Comment :- </h4>
                                                          {get(
                                                            budgetData,
                                                            "comment"
                                                          )}{" "}
                                                        </div>
                                                        <div>
                                                          <h4>
                                                            {" "}
                                                            Images Uploaded:
                                                          </h4>
                                                          {!isEmpty(
                                                            get(
                                                              budgetData,
                                                              "photos",
                                                              []
                                                            )
                                                          ) && (
                                                            <Slider
                                                              {...settings}
                                                            >
                                                              {get(
                                                                budgetData,
                                                                "photos",
                                                                []
                                                              ).map((pic) => {
                                                                return (
                                                                  <img
                                                                    src={pic}
                                                                    alt={pic}
                                                                  />
                                                                );
                                                              })}
                                                            </Slider>
                                                          )}
                                                        </div>

                                                        {!isEmpty(
                                                          get(
                                                            budgetData,
                                                            "videos[0]"
                                                          ),
                                                          {}
                                                        ) && (
                                                          <div>
                                                            <h4>Video:</h4>
                                                            <ReactPlayer
                                                              url={get(
                                                                budgetData,
                                                                "videos[0]"
                                                              )}
                                                              controls
                                                              youtubeConfig={{
                                                                playerVars: {
                                                                  showinfo: 1,
                                                                },
                                                              }}
                                                              width="100%"
                                                              height="100%"
                                                            />
                                                          </div>
                                                        )}
                                                      </div>
                                                    ),
                                                    onOk() {},
                                                  });
                                                }}
                                                className="btn btn-Change"
                                              >
                                                View Task Completion Data
                                              </button>
                                              <button
                                                onClick={() => {
                                                  flagTaskOffer({
                                                    variables: {
                                                      offerId: offer._id,
                                                      description:
                                                        "Hi, there are some difficulties with this task",
                                                    },
                                                  });
                                                }}
                                                className="btn btn-Change"
                                              >
                                                Flag
                                              </button>
                                              <button
                                                onClick={() => {
                                                  alert("Being developed!");
                                                  // message.loading(
                                                  //   "Processing your request, please wait..."
                                                  // );
                                                  // releasePayment({
                                                  //   variables: {
                                                  //     offerId: offer._id,
                                                  //     status: "Release Payment",
                                                  //   },
                                                  // });
                                                }}
                                                className="btn btn-Release"
                                              >
                                                Release Payment
                                              </button>
                                            </div>
                                          </>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                {/* END */}
                                <div className="col-md-12 mt-3 mb-3">
                                  <p className="info--offers">
                                    {moment(offer.createdAt).fromNow()}
                                    &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                                    {/* Like Icon */}
                                    <div
                                      className={`icon-wrapper ${
                                        get(offer, "like", null) ? "anim" : ""
                                      }`}
                                      onClick={() =>
                                        likeDislikeFunc(offer, true, i)
                                      }
                                    >
                                      <span className="icon">
                                        <i
                                          className={`fa fa-thumbs-up ${
                                            get(offer, "like", null)
                                              ? "thumbs__up-active"
                                              : ""
                                          }`}
                                        ></i>
                                      </span>
                                      <div className="border">
                                        <span></span>
                                      </div>
                                      <div className="satellite">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                      </div>
                                    </div>
                                    &nbsp; &nbsp;&nbsp;
                                    {/* Dislike Icon */}
                                    {/* <div
                                      className={`icon-wrapper ${
                                        get(offer, "dislike", null)
                                          ? "anim"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        likeDislikeFunc(offer, false, i)
                                      }
                                    >
                                      <span className="icon">
                                        <i
                                          className={`fa fa-thumbs-down ${
                                            get(offer, "dislike", null)
                                              ? "thumbs__down-active"
                                              : ""
                                          }`}
                                          aria-hidden="true"
                                        ></i>{" "}
                                      </span>
                                      <div className="border">
                                        <span></span>
                                      </div>
                                      <div className="satellite">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                      </div>
                                    </div> */}
                                    <span>
                                      {/* <i className="fa fa-comment-dots"></i>{" "}
                                      send message */}
                                      <i className="fa fa-envelope text-primary"></i>
                                    </span>
                                  </p>
                                </div>
                              </>
                            )}
                          </>
                        );
                      })}
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
        {screenWidth <= 767 || props.responsiveClasses !== "" ? (
          <Drawer
            title={"Posted By"}
            placement="right"
            closable={true}
            width={400}
            onClose={() => togglePostedByDrawer(false)}
            visible={openPostedByDrawer}
          >
            <ProfileCard
              // contextData={props.contextData}
              accountSetting={userSettings}
              // showProfileCompletenessModal={() => console.log("hi")}
              // fetchProfileCompleteness={this.fetchProfileCompleteness}
              currentUserData={userDetails}
              {...props}
            />
          </Drawer>
        ) : (
          <div className="offer__right_wrap">
            <ProfileCard
              // contextData={props.contextData}
              accountSetting={userSettings}
              // showProfileCompletenessModal={() => console.log("hi")}
              // fetchProfileCompleteness={this.fetchProfileCompleteness}
              currentUserData={userDetails}
              {...props}
            />
          </div>
        )}

        <Modal
          title={null}
          footer={null}
          wrapClassName={"map---modal"}
          visible={viewPropertyLocationMap}
          onCancel={() => togglePropertyLocationView(false)}
        >
          <PropertyLocationMap
            place={get(budgetData, "property.address.fullAddress", "")}
          />
        </Modal>

        <Modal
          title={"Leave a Review!"}
          footer={null}
          closable={false}
          maskClosable={false}
          visible={isLeaveReviewModalVisible}
          onCancel={() => setLeaveReviewModal(false)}
          destroyOnClose
        >
          <label className="label__modal_review">
            {" "}
            How would you rate the task done by{" "}
            {get(acceptedOffer, "[0]user.firstName")}{" "}
            {get(acceptedOffer, "[0]user.lastName")}?{" "}
          </label>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setReviewSaving(true);
              leaveReview({
                variables: {
                  rating: currentSelectedRating,
                  taskOfferId: acceptedOffer[0]._id,
                  review: e.target[0].value,
                },
              });
            }}
          >
            <div className="rating_review">
              <Rate onChange={(e) => setRating(e)} />
            </div>
            <div>
              <label className="label__modal_review">
                Please write your review.
              </label>
              <textarea
                placeholder="Please write your review here"
                name="rating"
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
      </div>
      <Modal
        title={null}
        className="view__Task_video"
        visible={viewVideoModalOn}
        onOk={null}
        footer={null}
        maskClosable={true}
        onCancel={() => toggleviewVideoModal(false)}
        destroyOnClose
      >
        <ReactPlayer url={get(budgetData, "videoUrl")} controls />
      </Modal>

      <Modal
        title={null}
        className="stripe__payment-release"
        visible={releasePaymentModalOn}
        onOk={null}
        footer={null}
        maskClosable={false}
        closable={false}
        onCancel={() => toggleReleasePaymentModal(!releasePaymentModalOn)}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <div className="wrapper">
            <form
              onSubmit={async (e) => {
                // We don't want to let default form submission happen here, which would refresh the page.
                e.preventDefault();
                setLoading(true);

                const cardElement = elements.getElement(CardElement);
                const result = await stripe.confirmCardPayment(
                  // get(paymentIntent, "client_secret"),
                  {
                    payment_method: {
                      card: cardElement,
                    },
                  }
                );

                let pi = get(result, "paymentIntent");
                let paymentMethod = await stripe.createPaymentMethod({
                  type: "card",
                  card: cardElement,
                });

                releasePayment({
                  variables: {
                    offerId: acceptedOffer[0]._id,
                    status: "Release Payment",
                    paymentIntent: pi,
                    paymentMethod: get(paymentMethod, "paymentMethod"),
                  },
                });
              }}
              id="payment-form"
            >
              <label for="card-element">Credit or debit card</label>
              <CardElement
                onChange={(status) => setCardStatus(get(status, "complete"))}
                options={{
                  hidePostalCode: true,
                  iconStyle: "solid",
                }}
                className="input_field"
              />
              <div className="row mt-5">
                <div className="col-md-6">
                  <button disabled={!cardStatus} className="btn-Stripe">
                    Release £
                    {String(
                      (get(acceptedOffer, "[0].amount") * 40) / 100
                    ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                  </button>
                </div>
                <Popconfirm
                  title="Are you sure you want to leave this modal?"
                  onConfirm={() => toggleReleasePaymentModal(false)}
                  okText="Yes"
                  cancelText="No"
                >
                  <div className="col-md-6">
                    <button
                      disabled={loading}
                      className="btn btn-secondary w-100"
                    >
                      Cancel
                    </button>
                  </div>
                </Popconfirm>
              </div>
            </form>
          </div>

          {/* <form>
          
            <div id="card-errors" role="alert"></div>
            <button disabled={!cardStatus}>Confirm order</button>
          </form> */}
        </Spin>
      </Modal>
    </Spin>
  );
};
export default withRouter(AddressComp);
