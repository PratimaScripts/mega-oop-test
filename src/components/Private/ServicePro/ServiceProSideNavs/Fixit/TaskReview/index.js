import React, {
  useState,
  useCallback,
  useContext,
  useRef,
  useEffect,
} from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import VideoUpload from "../../../../../Common/VideoUpload/VideoUpload";
import Slider from "react-slick";
import { withRouter } from "react-router-dom";
import {
  Modal,
  Drawer,
  Collapse,
  List,
  Avatar,
  Input,
  Button,
  Tag,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GMap from "../../../../Landlord/LandlordSideNavs/Properties/Maps";
import moment from "moment";
import { Progress, Spin } from "antd";
import get from "lodash/get";
import filter from "lodash/filter";
import TaskQueries from "../../../../../../config/queries/tasks";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import MyNumberInput from "../../../../../../config/CustomNumberInput";
import isEmpty from "lodash/isEmpty";
// import TaskChat from "../TaskMessaging";
import useForceUpdate from "use-force-update";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import cookie from "react-cookies";
import { gql } from "apollo-boost";
import ProfileCard from "../../../../../Common/Card";
import { Link } from "react-router-dom";

import { UserDataContext } from "store/contexts/UserContext";
import "./style.scss";
import showNotification from "config/Notification";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

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

// resolvedTask

const AddressComp = (props) => {
  // let adminRates = get(props, "contextData.adminRates");
  const { state: userState } = useContext(UserDataContext);
  const { userData, accountSetting } = userState;
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  const dateFormat =
    accountSetting && accountSetting["dateFormat"]
      ? accountSetting["dateFormat"]
      : process.env.REACT_APP_DATE_FORMAT;

  const forceUpdate = useForceUpdate();
  const [viewPropertyLocationMap, togglePropertyLocationView] = useState(false);
  const [selectedOffer, selectOfferCurrent] = useState([]);
  const [offerAmount, updateOfferAmount] = useState("");
  const [markAsDoneSuccess, setMarkAsDoneSuccess] = useState(false);
  const [offerID, setOfferID] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const [sendOfferMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      if (get(data, "sendTaskOfferMessage.success")) {
        setBudgetData(get(data, "sendTaskOfferMessage.data"));
      }
    },
  });
  const [taskCompletePhotos, setTaskCompletePhotos] = useState([]);
  const [taskCompleteVideo, setTaskCompleteVideo] = useState([]);
  const [collapseMessage, setCollapseMessage] = useState("");

  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      let existingFiles = taskCompletePhotos ? taskCompletePhotos : [];
      setIsUploadingImages(true);
      setProgressPercent(progressPercent + 5);
      // Do something with the files
      let setPreview = acceptedFiles.map(async (file, i) => {
        let preview = await getBase64(file);
        file.preview = preview;
        existingFiles.push(file);
        setProgressPercent((prevState) => prevState + 15);
      });

      await Promise.all(setPreview);
      setProgressPercent(100);
      setIsUploadingImages(false);
      setTaskCompletePhotos(existingFiles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progressPercent]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const currentRole = userData.role;

  const [isUpdateOfferVisible, toggleUpdateOfferModal] = useState(false);

  const [requestTaskResolve] = useMutation(TaskQueries.resolvedTask, {
    onCompleted: (data) => {
      setLoading(false);
      setMarkAsDoneSuccess(true);
    },
  });

  const [isMarkAsCompleteModalOn, markAsCompleteModal] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [actionType, setActionType] = useState(null);

  const taskUpdated = (data) => {
    let allTasks = get(data, "updateTaskStatus.data");

    props.history.push(`/${currentRole}/fixit`, allTasks);
  };

  const [budgetData, setBudgetData] = useState(
    get(props, "location.state", {})
  );

  let isViewMode = window.location.href.includes("offer") ? true : false;
  const [isBudgetEditable, setBudgetStatus] = useState(false);
  const [updateTask] = useMutation(TaskQueries.updateTask);
  const [updateTaskStatus] = useMutation(TaskQueries.updateTaskStatus, {
    onCompleted: taskUpdated,
  });

  const [
    updateTaskOffer,
    // { loading }
  ] = useMutation(TaskQueries.updateTaskOffer, {
    onCompleted: (updatedTasks) => {
      const objIndex = budgetData.offers.findIndex(
        (obj) => String(obj._id) === offerID
      );
      budgetData.offers[objIndex].amount = offerAmount;

      updateOfferAmount("");
      setOfferID("");
      toggleUpdateOfferModal(false);
    },
  });

  const [likeDislike] = useMutation(TaskQueries.likeAndDislikeOffer);

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
    forceUpdate();

    setActionType(type);
    likeDislike({
      variables: { offerId: offer._id, type: type ? "like" : "dislike" },
    });
  };
  let images = get(budgetData, "images", []);

  let settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: images.length <= 3 ? images.length : 3,
    slidesToScroll: 1,
  };

  // let settingsTwo = {
  //   dots: false,
  //   arrows: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow:
  //     taskCompletePhotos.length <= 3 ? taskCompletePhotos.length : 3,
  //   slidesToScroll: 1
  // };

  let acceptedOffer = filter(budgetData.offers, {
    status: "Accepted",
  });

  let otherOffers = filter(budgetData.offers, (o) => {
    return o.status !== "Accepted";
  });

  const saveBudget = () => {
    let obj = { ...budgetData };
    delete obj["_id"];
    updateTask({
      variables: {
        taskId: budgetData._id,
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

  const formatNumber = (num) => {
    if (num) {
      return String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
  };

  const removeImage = (index) => {
    let photos = taskCompletePhotos;
    photos.splice(index, 1);

    setTaskCompletePhotos(photos);
    forceUpdate();
  };

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
  useEffect(() => {
    if (!props.location?.state) {
      props.history.push(`/${currentRole}/fixit`);
    }
    //eslint-disable-next-line
  }, []);
  let calculatedServiceFee = (10 * Number(offerAmount)) / 100;
  // (get(adminRates, "serviceCharge", 10) * Number(offerAmount)) / 100;

  let calculatedVat = (10 * calculatedServiceFee) / 100;
  // (get(adminRates, "vat", 10) * calculatedServiceFee) / 100;

  let screenWidth = window.screen.width;

  const [openPostedByDrawer, togglePostedByDrawer] = useState(false);

  return (
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

      <div className="offer__left_wrap">
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
                          <p>
                            {get(budgetData, "category")}{" "}
                            {get(budgetData, "subCategory")}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="task--info">
                          <i className="fas fa-map-marker-alt fa-lg"></i>
                          <p>
                            {get(budgetData, "property.address.City", "")},{" "}
                            {
                              get(
                                budgetData,
                                "property.address.PostalCode",
                                ""
                              ).split(" ")[0]
                            }{" "}
                            {/* <small>
                              <span
                                onClick={() => togglePropertyLocationView(true)}
                              >
                                View in map
                              </span>
                            </small> */}
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="task--info">
                          <i className="fas fa-calendar-check fa-lg"></i>
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
                          <p>
                            {" "}
                            {get(budgetData, "dayAvailability")},{" "}
                            {get(budgetData, "timeAvailability") &&
                              get(budgetData, "timeAvailability").split(" ")[0]}
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
                      <h3>
                        <i className="fas fa-pound-sign"></i>
                        &nbsp;
                        <span>
                          {formatNumber(
                            get(budgetData, "budgetAmount", "not-found")
                          )}
                        </span>
                        &nbsp;&nbsp;
                        {!isViewMode && (
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
                                  budgetData["budgetAmount"] = val.floatValue;
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
                      {!isViewMode && (
                        <button
                          onClick={() =>
                            updateTaskStatus({
                              variables: {
                                taskId: budgetData._id,
                                status:
                                  currentRole === "renter" ? "Pending" : "Open",
                              },
                            })
                          }
                          className="btn btn-warning"
                        >
                          Review & Post
                        </button>
                      )}

                      {/* {!["Completed", "Task Completed", "Open"].includes(
                        get(budgetData, "status")
                      ) ? (
                        <button disabled className="btn btn-warning">
                          Assigned
                        </button>
                      ) : (
                        ""
                      )} */}

                      {get(budgetData, "status") === "Open" && (
                        <button disabled className="btn btn-warning">
                          Make an Offer
                        </button>
                      )}

                      {get(budgetData, "status") === "In Progress" && (
                        <button disabled className="btn btn-warning">
                          Assigned
                        </button>
                      )}

                      {get(budgetData, "status") === "Task Resolved" && (
                        <button
                          disabled
                          className="btn"
                          style={{ backgroundColor: "#047BFE", color: "white" }}
                        >
                          Resolved
                        </button>
                      )}

                      {(get(budgetData, "status") === "Completed" ||
                        get(budgetData, "status") === "Task Completed") && (
                        <button disabled className="btn btn-warning">
                          Completed
                        </button>
                      )}
                    </div>
                    {/* <a href="#" onClick={() => navigator.clipboard.writeText(`https://www.rentoncloud.com/task/${budgetData._id}`)}>
                      <i className="fas fa-share-alt"></i>&nbsp;Share or invite
                    </a> */}
                    <div ref={ref}>
                      <button
                        className="btn btn-sm text-primary"
                        onClick={handleClick}
                      >
                        <i className="fas fa-share-alt"></i>&nbsp;Share or
                        invite
                      </button>

                      <Overlay
                        show={show}
                        target={target}
                        placement="bottom"
                        container={ref.current}
                        containerPadding={20}
                      >
                        <Popover id="popover-contained">
                          <Popover.Title as="h5">Share Link</Popover.Title>
                          <Popover.Content>
                            <button
                              className="btn btn-light border mx-2"
                              onClick={() =>
                                window.open(
                                  `https://www.rentoncloud.com/task/${budgetData._id}`
                                )
                              }
                            >
                              <i className="far fa-copy" />
                            </button>
                            <button
                              className="btn btn-light border mx-2"
                              onClick={() =>
                                window.open(
                                  `https://www.facebook.com/sharer/sharer.php?u=https%3A//www.rentoncloud.com/task/${budgetData._id}`
                                )
                              }
                            >
                              <i className="fab fa-facebook-f" />
                            </button>
                            <button
                              className="btn btn-light border mx-2"
                              onClick={() =>
                                window.open(
                                  `https://twitter.com/intent/tweet?text=https%3A//www.rentoncloud.com/task/${budgetData._id}`
                                )
                              }
                            >
                              <i className="fab fa-twitter" />
                            </button>
                            <button
                              className="btn btn-light border mx-2"
                              onClick={() =>
                                window.open(
                                  `https://www.linkedin.com/sharing/share-offsite/?url=https://www.rentoncloud.com/task/${budgetData._id}`
                                )
                              }
                            >
                              <i className="fab fa-linkedin" />
                            </button>
                          </Popover.Content>
                        </Popover>
                      </Overlay>
                    </div>
                  </div>
                </div>
                <div className="clearfix"></div>
                <hr></hr>
                <div className="notify--taskList">
                  <div className="row">
                    <div className="col-md-3 text-left">
                      <Tag
                        color="default"
                        // style={get(budgetData, "status", "") === "Task Resolved" && {backgroundColor: "#047BFE", color: "white"}}
                      >
                        {get(budgetData, "status", "")}
                      </Tag>
                    </div>
                    <div className="col-md-6 text-center">
                      <label>
                        <span>{get(budgetData, "offers", []).length}</span>{" "}
                        Offers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                        <span>
                          {get(budgetData, "taskOfferMessageCount", 0)}
                        </span>{" "}
                        Messages
                      </label>
                      <a href="test">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                          alt=""
                        />
                      </a>
                      {/* <a href="test">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                          alt=""
                        />
                      </a> */}
                    </div>
                    <div className="col-md-3 text-center">
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
                    </div>
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
                  {!isEmpty(budgetData, "offers", []) &&
                    get(budgetData, "offers", []) &&
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
                    <Slider {...settings}>{taskImages}</Slider>
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
                      // <Icon type="caret-right" rotate={isActive ? 90 : 0} />
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
                              dataSource={
                                get(ofr, "messages", [])
                                  ? get(ofr, "messages", [])
                                  : []
                              }
                              renderItem={(item) => (
                                <List.Item>
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar
                                        alt="user avatar"
                                        src={
                                          item.userId !== get(ofr, "user._id")
                                            ? get(budgetData, "postedBy.avatar")
                                            : get(
                                                userData,
                                                "avatar",
                                                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                              )
                                        }
                                      />
                                    }
                                    title={
                                      item.userId === get(ofr, "user._id")
                                        ? `${get(userData, "firstName")} ${get(
                                            userData,
                                            "lastName"
                                          )}`
                                        : `${get(
                                            budgetData,
                                            "postedBy.firstName"
                                          )} ${get(
                                            budgetData,
                                            "postedBy.lastName"
                                          )}`
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
                              <button className="btn btn-primary" type="submit">
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
                  {!isEmpty(acceptedOffer) &&
                    acceptedOffer.map((ofr, i) => {
                      let isMyOffer =
                        get(ofr, "_id", "") ===
                        get(budgetData, "myOffer._id", "")
                          ? true
                          : false;
                      return (
                        <>
                          <label className="btn btn-offer">
                            Accepted Offer
                          </label>

                          <div className="offers-list">
                            <div className="card">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="offer--info">
                                    <p>
                                      <img
                                        src={get(
                                          acceptedOffer,
                                          "[0].user.avatar",
                                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                                        )}
                                        alt=""
                                        className="mr-3"
                                      />
                                      {isMyOffer ? (
                                        "Your Offer"
                                      ) : (
                                        <>
                                          {get(
                                            acceptedOffer,
                                            "[0].user.firstName"
                                          )}{" "}
                                          {get(
                                            acceptedOffer,
                                            "[0].user.lastName"
                                          )}
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <h3 className="text-right">
                                    <i className="fas fa-pound-sign"></i>
                                    &nbsp;{acceptedOffer[0].amount}&nbsp;
                                  </h3>
                                  {isMyOffer && budgetData.status === "Open" && (
                                    <button
                                      onClick={() =>
                                        toggleUpdateOfferModal(true)
                                      }
                                      className="btn btn-primary pull-right"
                                    >
                                      <i className="fa fa-edit mr-1"></i>
                                      Update Offer
                                    </button>
                                  )}
                                </div>
                                {/* {isMyOffer && budgetData.status === "Open" && ( */}
                                {/* <button
                                  onClick={() => toggleUpdateOfferModal(true)}
                                  className="btn btn-primary"
                                >
                                  Update Offer
                                </button> */}
                                {/* )} */}
                              </div>
                              <div className="row">
                                <div className="col-md-9">
                                  <p>
                                    {get(
                                      acceptedOffer,
                                      "[0].description",
                                      `
                                 Lorem ipsum dolor sit amet, consectetur
                                 adipisicing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua.
                                 Ut enim ad minim veniam, quis nostrud
                                 exercitation ullamco laboris nisi ut aliquip
                                 ex ea commodo consequat.
                                `
                                    )}
                                  </p>
                                </div>
                                <div className="col-md-3">
                                  {/* <button className="btn btn-Change">
                                  Change to Fix
                                </button>
                                <button className="btn btn-Release">
                                  Release Payment
                                </button> */}
                                  {isMyOffer &&
                                    get(budgetData, "status") !== "Completed" &&
                                    get(budgetData, "status") !==
                                      "Task Resolved" &&
                                    get(budgetData, "status") !== "Open" &&
                                    get(ofr, "status") === "Accepted" &&
                                    get(ofr, "user._id") ===
                                      get(userData, "_id") && (
                                      <button
                                        onClick={() =>
                                          markAsCompleteModal(true)
                                        }
                                        className="btn btn-primary"
                                        style={{
                                          marginLeft: "50px",
                                          textAlign: "center",
                                        }}
                                      >
                                        Mark task as done
                                      </button>
                                    )}
                                  {isMyOffer &&
                                    get(budgetData, "status") ===
                                      "Task Resolved" &&
                                    get(budgetData, "status") !== "Open" &&
                                    get(ofr, "status") === "Accepted" &&
                                    get(ofr, "user._id") ===
                                      get(userData, "_id") && (
                                      <button
                                        className="btn btn-primary"
                                        disabled
                                        style={{
                                          marginLeft: "0px",
                                          textAlign: "center",
                                        }}
                                      >
                                        Awaiting Payment Release
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 mt-3 mb-3">
                            <p className="info--offers">
                              {moment(ofr.createdAt).format(dateFormat)} &nbsp;
                              &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                              {/* Like Icon */}
                              <div
                                className={`icon-wrapper ${
                                  get(acceptedOffer, "[0].like", null)
                                    ? "anim"
                                    : ""
                                }`}
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
                              >
                                <span className="icon">
                                  <i
                                    className={`fa fa-thumbs-down ${
                                      get(acceptedOffer, "[0].dislike", null)
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
                              </div>
                              &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                              {/* <a href="test">
                              <i className="far fa-comment-dots"></i> send
                              message
                            </a> */}
                            </p>
                          </div>
                          <div className="col-md-12">
                            <label className="btn btn-other">
                              Other Offers
                            </label>
                          </div>
                        </>
                      );
                    })}

                  {!isEmpty(otherOffers) &&
                    otherOffers.map((offer, i) => {
                      let isMyOffer =
                        get(offer, "_id", "") ===
                        get(budgetData, "myOffer._id", "")
                          ? true
                          : false;

                      return (
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
                                      {isMyOffer ? (
                                        "Your Offer"
                                      ) : (
                                        <>
                                          {get(offer, "user.firstName")}{" "}
                                          {get(offer, "user.lastName")}
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <h3 className="text-right">
                                    <i className="fas fa-pound-sign"></i>
                                    &nbsp;{offer.amount}&nbsp;
                                  </h3>
                                  {isMyOffer && budgetData.status === "Open" && (
                                    <button
                                      onClick={() =>
                                        toggleUpdateOfferModal(true)
                                      }
                                      className="btn btn-primary pull-right"
                                    >
                                      <i className="fa fa-edit mr-1"></i>
                                      Update Offer
                                    </button>
                                  )}
                                </div>
                                {/* {isMyOffer && budgetData.status === "Open" && ( */}
                                {/* <button
                                  onClick={() => toggleUpdateOfferModal(true)}
                                  className="btn btn-primary"
                                >
                                  Update Offer
                                </button> */}
                                {/* )} */}
                              </div>
                              <div className="row">
                                <div className="col-md-9">
                                  <p>
                                    {get(
                                      offer,
                                      "description",
                                      `
                                 Lorem ipsum dolor sit amet, consectetur
                                 adipisicing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua.
                                 Ut enim ad minim veniam, quis nostrud
                                 exercitation ullamco laboris nisi ut aliquip
                                 ex ea commodo consequat.
                                `
                                    )}
                                  </p>
                                </div>
                                <div className="col-md-3">
                                  {/* <button className="btn btn-Change">
                                  Change to Fix
                                </button>
                                <button className="btn btn-Release">
                                  Release Payment
                                </button> */}
                                  {isMyOffer &&
                                    get(budgetData, "status") !== "Completed" &&
                                    get(budgetData, "status") !== "Open" &&
                                    get(offer, "status") === "Accepted" &&
                                    get(offer, "user._id") ===
                                      get(userData, "_id") && (
                                      <button
                                        onClick={() =>
                                          markAsCompleteModal(true)
                                        }
                                        className="btn btn-primary"
                                      >
                                        Marrrrrrk task as done
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 mt-3 mb-3">
                            <p className="info--offers">
                              {moment(offer.createdAt).format(dateFormat)}{" "}
                              &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                              {/* Like Icon */}
                              <div
                                className={`icon-wrapper ${
                                  get(offer, "like", null) ? "anim" : ""
                                }`}
                                onClick={() => likeDislikeFunc(offer, true, i)}
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
                              &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                              {/* Dislike Icon */}
                              <div
                                className={`icon-wrapper ${
                                  get(offer, "dislike", null) ? "anim" : ""
                                }`}
                                onClick={() => likeDislikeFunc(offer, false, i)}
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
                              </div>
                              &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                              {/* <a href="test">
                              <i className="far fa-comment-dots"></i> send
                              message
                            </a> */}
                            </p>
                          </div>
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
            accountSetting={accountSetting}
            showProfileCompletenessModal={() => console.log("hi")}
            // fetchProfileCompleteness={this.fetchProfileCompleteness}
            currentUserData={get(budgetData, "postedBy")}
            {...props}
          />
        </Drawer>
      ) : (
        <div className="offer__right_wrap">
          <ProfileCard
            // contextData={props.contextData}
            accountSetting={accountSetting}
            showProfileCompletenessModal={() => console.log("hi")}
            // fetchProfileCompleteness={this.fetchProfileCompleteness}
            currentUserData={get(budgetData, "postedBy")}
            {...props}
          />
        </div>
      )}

      <Modal
        title="Update Offer"
        className="modal-offer-form"
        visible={isUpdateOfferVisible}
        footer={null}
        onCancel={() => {
          document.querySelector("#updateOfferFormServicePro").reset();

          toggleUpdateOfferModal(false);
        }}
      >
        <div className="current_offer">
          <p>
            Your current offer is <i className="mdi mdi-currency-gbp" />
            {formatNumber(get(budgetData, "myOffer.amount"))}{" "}
          </p>
        </div>
        <form
          id="updateOfferFormServicePro"
          onSubmit={(e) => {
            e.preventDefault();
            let bidAmount = Number(offerAmount).toFixed(2);
            setOfferID(get(budgetData, "myOffer._id"));
            document.querySelector("#updateOfferFormServicePro").reset();
            updateTaskOffer({
              variables: {
                offerId: get(budgetData, "myOffer._id"),
                amount: Number(bidAmount),
                description: "test",
              },
            });
          }}
        >
          <>
            <div className="text-center">
              <h3>Update Your Offer</h3>
              <div className="form-group">
                <div className="date__flex">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="mdi mdi-currency-gbp" />
                    </div>
                  </div>
                  <input
                    type="number"
                    name="bidAmount"
                    value={offerAmount}
                    onChange={(e) => updateOfferAmount(e.target.value)}
                    placeholder="35.00"
                    // min={get(budgetData, "budgetAmount")}
                    className="form-control select__global"
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
                            Number(offerAmount) -
                            calculatedServiceFee -
                            calculatedVat
                          ).toFixed(2) < 0
                            ? 0
                            : (
                                Number(offerAmount) -
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
                <textarea
                  className="form-control textarea"
                  placeholder="Add a Description!"
                  name="description"
                  spellcheck="false"
                ></textarea>
              </div>
            </div>
            <button type="submit" className="btn btn-warning">
              {" "}
              Submit{" "}
            </button>
          </>
        </form>
      </Modal>

      <Modal
        title={
          !markAsDoneSuccess ? (
            <div>
              <b>Resolved Task:</b> Attach pictures of fix to release payment
            </div>
          ) : (
            false
          )
        }
        visible={isMarkAsCompleteModalOn}
        footer={null}
        maskClosable={false}
        onCancel={() => markAsCompleteModal(false)}
        width={!markAsDoneSuccess ? 700 : 400}
        destroyOnClose
      >
        <Spin spinning={isLoading}>
          {!markAsDoneSuccess && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                setLoading(true);
                let taskId = budgetData._id;
                let photos = [];
                let videos = [];
                let description = e.target[2].value;

                let uploadPhotos =
                  taskCompletePhotos &&
                  !isEmpty(taskCompletePhotos) &&
                  taskCompletePhotos.map(async (pic, i) => {
                    var frmData = new FormData();
                    frmData.append("file", pic);
                    frmData.append("filename", pic.name);
                    // for what purpose the file is uploaded to the server.
                    frmData.append("uploadType", "Task");
                    let uploadedFile = await axios.post(
                      `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
                      frmData,
                      {
                        headers: {
                          authorization: cookie.load(
                            process.env.REACT_APP_AUTH_TOKEN
                          ),
                        },
                      }
                    );

                    if (!uploadedFile.data.success)
                      return showNotification(
                        "error",
                        "An error occurred",
                        uploadedFile.data.message
                      );

                    photos.push(get(uploadedFile, "data.data"));
                  });

                let uploadVideos = [];

                if (!isEmpty(taskCompleteVideo)) {
                  var frmData = new FormData();
                  frmData.append("file", taskCompleteVideo);
                  frmData.append("filename", taskCompleteVideo.name);
                  // for what purpose the file is uploaded to the server.
                  frmData.append("uploadType", "Task");
                  let uploadedFile = await axios.post(
                    `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
                    frmData,
                    {
                      headers: {
                        authorization: cookie.load(
                          process.env.REACT_APP_AUTH_TOKEN
                        ),
                      },
                    }
                  );
                  if (!uploadedFile.data.success)
                    return showNotification(
                      "error",
                      "An error occurred",
                      uploadedFile.data.message
                    );

                  videos.push(get(uploadedFile, "data.data"));
                }

                typeof uploadPhotos !== "boolean" &&
                  (await Promise.all(uploadPhotos));
                typeof uploadVideos !== "boolean" &&
                  (await Promise.all(uploadVideos));

                // console.log(taskId, photos, videos, description);
                requestTaskResolve({
                  variables: { taskId, photos, videos, comment: description },
                });
              }}
            >
              <label className="label-modal">
                Upload Photo of the completed Task
              </label>
              <div
                tabIndex="0"
                className="upload_img text-center"
                {...getRootProps({ multiple: true })}
              >
                {isUploadingImages ? (
                  <Progress
                    width={80}
                    type="circle"
                    percent={progressPercent}
                  />
                ) : (
                  <>
                    <input {...getInputProps()} />
                    {isEmpty(taskCompletePhotos) && (
                      <>
                        <i className="far fa-images"></i>
                        <p>
                          Drop files here or Click here to upload (max. 30MB )
                        </p>
                      </>
                    )}
                  </>
                )}

                <div className="markasdone__slider">
                  <ul>
                    {!isEmpty(taskCompletePhotos) &&
                      taskCompletePhotos.map((img, i) => {
                        return (
                          <li>
                            <div>
                              {/* <input id={i} {...getInputProps()} /> */}

                              <div>
                                <img
                                  key={i}
                                  src={get(img, "preview", img)}
                                  alt={img.name}
                                />
                                <i
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(i);
                                  }}
                                  className="fas fa-times-circle"
                                ></i>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>

                {/* <Slider  {...settingsTwo}>
                
                {" "}
                {!isEmpty(taskCompletePhotos) &&
                  taskCompletePhotos.map((img, i) => {
                    return (
                      <div  className="img_upload">
                        <img
                          key={i}
                          src={get(img, "preview", img)}
                          alt={img.name}
                        />

                        <i
                          onClick={e => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                          className="fa fa-times-circle delete"
                        ></i>
                        
                      </div>
                    );
                  })}
              </Slider> */}
              </div>

              <label className="label-modal">
                Upload Video of the completed task
              </label>
              <div className="video-upload">
                <video controls="" className="video-preview">
                  <source id="videoSource" type="video/mp4" />
                </video>

                <div className="video-edit">
                  <label>
                    <i className="fa fa-video">
                      <VideoUpload
                        videoFile={taskCompleteVideo}
                        setVideoFile={setTaskCompleteVideo}
                      />
                    </i>
                  </label>
                </div>
              </div>
              <div>
                <label className="label-modal">Message/Comments</label>
                <div className="form-group">
                  <textarea
                    className="form-control textarea-modal"
                    placeholder="I have completed this assigned task and attached here necessary evidences. Request you to please release the payment and share your feedback / reference on my profile page. Thanks for your business."
                    name="description"
                    spellcheck="false"
                    required
                  ></textarea>
                </div>
              </div>
              <button
                disabled={
                  isEmpty(taskCompleteVideo) && isEmpty(taskCompletePhotos)
                }
                type="submit"
                className="btn btn-warning"
              >
                {" "}
                Request Sign-Off{" "}
              </button>
            </form>
          )}

          {markAsDoneSuccess && (
            <div>
              <h4>Task data submitted successfully!</h4>
              <div className="sucBtnDiv">
                <Button className="accBtn" type="primary">
                  <Link to="/servicepro/findit">Go to FindIt</Link>
                </Button>

                <Button className="taskBtn">
                  <Link to="/servicepro/fixit">Return to Tasks</Link>
                </Button>
              </div>
            </div>
          )}
        </Spin>
      </Modal>

      <Modal
        title={null}
        footer={null}
        wrapClassName={"map---modal"}
        visible={viewPropertyLocationMap}
        onCancel={() => togglePropertyLocationView(false)}
      >
        <GMap propertyData={get(budgetData, "property")} />
      </Modal>
    </div>
  );
};
export default withRouter(AddressComp);
