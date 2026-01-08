import React, { useState, useEffect, useContext, useRef } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import { Modal, Collapse, List, Avatar, Input, Tag } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PropertyLocationMap from "../../../Landlord/LandlordSideNavs/Properties/Maps";
import moment from "moment"
import Slider from "react-slick";
import { gql } from "apollo-boost";
import FlagComponent from "./FlagComp";
import ReactPlayer from "react-player";
import "./style.scss";
import { UserDataContext } from "store/contexts/UserContext";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

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

const { TextArea } = Input;

const { Panel } = Collapse;

const AddressComp = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const { userData } = userState;
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };
  const [viewPropertyLocationMap, togglePropertyLocationView] = useState(false);
  const [selectedTask, setSelectedTask] = useState(
    get(props, "selectedTask", {})
  );

  const formatNumber = (num) => {
    if (num) {
      return String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
  };

  let acceptedOffer = filter(selectedTask.offers, {
    status: "Accepted",
  });

  const [viewVideoModalOn, toggleviewVideoModal] = useState(false);

  let images = get(selectedTask, "images", []);

  let taskImages =
    !isEmpty(images) &&
    images.map((img, i) => {
      return (
        <img key={i} className="mr-3 slider_img_modal" src={img.image} alt="" />
      );
    });
  let settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: isEmpty(images)
      ? get(selectedTask, "videoUrl", "") && 1
      : images.length < 2
        ? 1
        : 2,
    slidesToScroll: 1,
  };
  const [selectedOffer, selectOfferCurrent] = useState([]);

  const [collapseMessage, setCollapseMessage] = useState("");

  const [sendOfferMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      if (get(data, "sendTaskOfferMessage.success")) {
        setSelectedTask(get(data, "sendTaskOfferMessage.data"));
      }
    },
  });

  useEffect(() => {
    setSelectedTask(get(props, "selectedTask", {}));
  }, [props]);

  useSubscription(CONVERSATION_SUBSCRIPTION, {
    variables: {
      offerId:
        !isEmpty(selectedOffer) &&
        get(selectedTask, "offers")[selectedOffer] &&
        get(selectedTask, "offers")[selectedOffer]._id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (data) =>
      get(data, "subscriptionData.data.getTaskOfferMessage.success") &&
      setSelectedTask(
        get(data, "subscriptionData.data.getTaskOfferMessage.data")
      ),
  });


  return (
    <div>
      <div className="content">
        <div className="container-fluid">
          <div className="tab-content">
            <div className="row">
              <div className="col-md-8">
                TASK ID #{get(selectedTask, "identity")}
              </div>
              <div className="col-md-4">
                <div className="sub_wrap">
                  <div className="user_wrap">
                    <img
                      className="user_img"
                      src={get(
                        props,
                        "selectedTask.postedBy.avatar",
                        "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578926398/images/prof-2.jpg"
                      )}
                      alt=""
                    />
                    <p className="user_name">
                      Posted By <br />
                      <span className="text-capitalize">
                        {" "}
                        {get(selectedTask, "postedBy.firstName")}{" "}
                        {get(selectedTask, "postedBy.lastName")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper--task">
        <div className="row">
          <div className="col-md-12">
            <div className="content">
              <div className="budget-task space_between">
                <div className="form-group">
                  <h3>{get(selectedTask, "title", "")}</h3>
                  <ul>
                    <li>
                      <div className="task--info">
                        <i className="fa fa-home fa-lg" aria-hidden="true"></i>
                        <p>
                          {get(selectedTask, "category", "")}{" "}
                          {get(selectedTask, "subCategory", "")}
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="task--info">
                        <i className="fas fa-map-marker-alt fa-lg"></i>
                        <p>
                          {get(props, "selectedTask.property.address.City", "")}
                          ,{" "}
                          {
                            get(
                              props,
                              "selectedTask.property.address.zip",
                              ""
                            ).split(" ")[0]
                          }{" "}
                          {/* <small
                            onClick={() => togglePropertyLocationView(true)}
                          >
                            <span>View in map</span>
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
                            get(selectedTask, "createdAt", new Date())
                          ).format("dddd, MMMM D YYYY")}
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="task--info">
                        <i className="fas fa-clock fa-lg"></i>
                        <p>
                          {get(selectedTask, "dayAvailability", "")} -{" "}
                          {
                            get(selectedTask, "timeAvailability", "  ").split(
                              " "
                            )[0]
                          }
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
                      {formatNumber(get(selectedTask, "budgetAmount", ""))}{" "}
                      &nbsp;&nbsp;
                    </h3>
                    {/* toggleUpdateOfferModal */}
                    {selectedTask.status !== "Completed" && <React.Fragment>
                      {!isEmpty(get(selectedTask, "myOffer", {})) ? (
                        <button
                          onClick={() => props.toggleUpdateOfferModal()}
                          className="btn btn-warning"
                        >
                          Update your offer
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            props.makeOffer(get(props, "selectedTask", {}))
                          }
                          className="btn btn-warning"
                        >
                          Make an offer
                        </button>
                      )}
                    </React.Fragment>}
                  </div>
                  {console.log(selectedTask)}
                  {/* <a
                    href="#"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://www.rentoncloud.com/task/${selectedTask.taskId}`
                      )
                    }
                  >
                    <i className="fas fa-share-alt"></i>&nbsp;Share or invite
                  </a> */}
                  <div ref={ref}>
                    <button
                      className="btn btn-sm text-primary"
                      onClick={handleClick}
                    >
                      <i className="fas fa-share-alt"></i>&nbsp;Share or invite
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
                                `${process.env.REACT_APP_PUBLIC_URL}/task/${selectedTask.taskId}`
                              )
                            }
                          >
                            <i className="far fa-copy" />
                          </button>
                          <button
                            className="btn btn-light border mx-2"
                            onClick={() =>
                              window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=https%3A//www.rentoncloud.com/task/${selectedTask.taskId}`
                              )
                            }
                          >
                            <i className="fab fa-facebook-f" />
                          </button>
                          <button
                            className="btn btn-light border mx-2"
                            onClick={() =>
                              window.open(
                                `https://twitter.com/intent/tweet?text=https%3A//www.rentoncloud.com/task/${selectedTask.taskId}`
                              )
                            }
                          >
                            <i className="fab fa-twitter" />
                          </button>
                          <button
                            className="btn btn-light border mx-2"
                            onClick={() =>
                              window.open(
                                `https://www.linkedin.com/sharing/share-offsite/?url=https://www.rentoncloud.com/task/${selectedTask.taskId}`
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
                    <Tag color="default">{get(selectedTask, "status")}</Tag>
                  </div>
                  <div className="col-md-6 text-center">
                    <label>
                      <span>{get(selectedTask, "offers", []).length}</span>{" "}
                      Offers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    </label>
                    {/* <a href="test">
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                        alt="mail"
                      /> 
                    </a>*/}
                    {/* <a href="test">
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                        alt="favourite"
                      />
                    </a> */}
                  </div>
                  <div className="col-md-3 text-center">
                    <div className="row flex-row-reverse m-0">
                      {/* <div className="col-md-10">
                        <input
                          className="form-control w-100"
                          placeholder="More Action"
                        /> 
                      </div>*/}
                      <FlagComponent selectedTask={selectedTask} />
                      {/* <div className="col-md-2">
                        <i className="fas fa-ellipsis-v"></i>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab--list--details">
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>
                Messages ({get(selectedTask, "myOffer.messages", []).length})
              </Tab>
              <Tab>Offers ({get(selectedTask, "offers", []).length})</Tab>
            </TabList>
            <TabPanel>
              <div className="row">
                <div className="col-md-8">
                  <p>
                    {get(
                      props,
                      "selectedTask.description",
                      "No description here."
                    )}
                  </p>
                </div>
                <div className="col-md-4 slider_img_wrap">
                  <Slider {...settings}>
                    {taskImages}
                    {get(selectedTask, "videoUrl") && (
                      <div className="mr-3 slider_img_modal">
                        {" "}
                        <ReactPlayer
                          playing={false}
                          className="react-player-lochan"
                          url={get(selectedTask, "videoUrl")}
                        />
                        <button
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
              {!isEmpty(get(selectedTask, "offers")) &&
                get(selectedTask, "offers").map((ofr, i) => {
                  return (
                    <>
                      {ofr.user._id === userData._id && (
                        <Collapse
                          bordered={false}
                          onChange={(e) => selectOfferCurrent(e)}
                          expandIcon={({ isActive }) => (
                            // <Icon
                            //   type="caret-right"
                            //   rotate={isActive ? 90 : 0}
                            // />
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                          )}
                        >
                          {!isEmpty(get(selectedTask, "myOffer")) && (
                            <Panel
                              header={
                                <>
                                  <img
                                    className="avatar__taskchat"
                                    src={get(
                                      props,
                                      "selectedTask.myOfferuser.avatar",
                                      "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                                    )}
                                    alt=""
                                  />
                                  {`${get(
                                    props,
                                    "selectedTask.myOffer.user.firstName",
                                    "User"
                                  )} ${get(
                                    props,
                                    "selectedTask.myOffer.user.lastName",
                                    ""
                                  )}`}
                                </>
                              }
                              style={customPanelStyle}
                            >
                              <List
                                itemLayout="horizontal"
                                dataSource={get(
                                  props,
                                  "selectedTask.myOffer.messages",
                                  []
                                )}
                                renderItem={(item) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          alt="user avatar"
                                          src={
                                            item.userId ===
                                              get(
                                                selectedTask,
                                                "myOffer.user._id"
                                              )
                                              ? get(
                                                props,
                                                "selectedTask.myOffer.user.avatar"
                                              )
                                              : get(
                                                userData,
                                                "avatar",
                                                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                              )
                                          }
                                        />
                                      }
                                      title={
                                        item.userId ===
                                          get(selectedTask, "myOffer.user._id")
                                          ? `${get(
                                            props,
                                            "selectedTask.myOffer.user.firstName"
                                          )} ${get(
                                            props,
                                            "selectedTask.myOffer.user.lastName"
                                          )}`
                                          : `${get(
                                            userData,
                                            "firstName"
                                          )} ${get(userData, "lastName")}`
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
                                      offerId: get(
                                        selectedTask,
                                        "myOffer.offerId"
                                      ),
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
                          )}
                        </Collapse>
                      )}
                    </>
                  );
                })}
            </TabPanel>
            <TabPanel>
              <div className="offers--taskList">
                {!isEmpty(acceptedOffer) && (
                  <>
                    <label className="btn btn-offer">Accepted Offer</label>
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
                                {get(acceptedOffer, "[0].user.firstName")}{" "}
                                {get(acceptedOffer, "[0].user.lastName")}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <h3 className="text-right">
                              <i className="fas fa-pound-sign"></i>
                              &nbsp;{formatNumber(acceptedOffer[0].amount)}
                              &nbsp;
                            </h3>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-9">
                            <p>
                              {get(
                                acceptedOffer,
                                "[0].description",
                                "lorem ipsum"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 mt-3 mb-3">
                      <p className="info--offers">
                        3hours ago &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                        {/* Like Icon */}
                        <div
                          className={`icon-wrapper ${get(acceptedOffer, "[0].like", null) ? "anim" : ""
                            }`}
                        // onClick={() => likeDislikeFunc(acceptedOffer[0], true, i)}
                        >
                          <span className="icon">
                            <i
                              className={`fa fa-thumbs-up ${get(acceptedOffer, "[0].like", null)
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
                          className={`icon-wrapper ${get(acceptedOffer, "[0].dislike", null)
                            ? "anim"
                            : ""
                            }`}
                        // onClick={() => likeDislikeFunc(acceptedOffer[0], false, i)}
                        >
                          <span className="icon">
                            <i
                              className={`fa fa-thumbs-down ${get(acceptedOffer, "[0].dislike", null)
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
                        <span>
                          <i className="far fa-comment-dots"></i> send message
                        </span>
                      </p>
                    </div>

                    <div className="col-md-12">
                      <label className="btn btn-other">Other Offers</label>
                    </div>
                  </>
                )}

                {!isEmpty(get(selectedTask, "offers")) &&
                  get(selectedTask, "offers").map((offer, i) => {
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
                                      &nbsp;{formatNumber(offer.amount)}&nbsp;
                                    </h3>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-9">
                                    <p>
                                      {get(offer, "description", "lorem ipsum")}
                                    </p>
                                  </div>

                                  {get(offer, "status") === "Accepted" &&
                                    get(selectedTask, "status") ===
                                    "In Progress" &&
                                    get(selectedTask, "comment") !== "" && (
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
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12 mt-3 mb-3">
                              <p className="info--offers">
                                3hours ago &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                                &nbsp;
                                {/* Like Icon */}
                                <div
                                  className={`icon-wrapper ${get(offer, "like", null) ? "anim" : ""
                                    }`}
                                // onClick={() =>
                                //   likeDislikeFunc(offer, true, i)
                                // }
                                >
                                  <span className="icon">
                                    <i
                                      className={`fa fa-thumbs-up ${get(offer, "like", null)
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
                                  className={`icon-wrapper ${get(offer, "dislike", null) ? "anim" : ""
                                    }`}
                                // onClick={() =>
                                //   likeDislikeFunc(offer, false, i)
                                // }
                                >
                                  <span className="icon">
                                    <i
                                      className={`fa fa-thumbs-down ${get(offer, "dislike", null)
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
                                <span>
                                  <i className="far fa-comment-dots"></i> send
                                  message
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
      <Modal
        title={null}
        footer={null}
        wrapClassName={"map---modal"}
        visible={viewPropertyLocationMap}
        onCancel={() => togglePropertyLocationView(false)}
      >
        <PropertyLocationMap propertyData={get(selectedTask, "property", "")} />
      </Modal>

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
        <ReactPlayer url={get(selectedTask, "videoUrl")} controls />
      </Modal>
    </div>
  );
};
export default AddressComp;
