import React, { useState, useEffect, useContext } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
// import filter from "lodash/filter";
import { Modal, Collapse, List, Avatar, Input, Tag } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PropertyLocationMap from "../../Landlord/LandlordSideNavs/Properties/Maps";
import moment from "moment";
import Slider from "react-slick";
import { gql } from "apollo-boost";
import "./style.scss";
import { UserDataContext } from "store/contexts/UserContext"

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
  overflow: "hidden"
};

const { TextArea } = Input;

const { Panel } = Collapse;

const AddressComp = (props) => {
  const { state: userState } = useContext(UserDataContext)
  const { userData } = userState
  const [viewPropertyLocationMap, togglePropertyLocationView] = useState(false);
  const [selectedTask, setSelectedTask] = useState(
    get(props, "selectedTask", {})
  );

  const formatNumber = num => {
    if (num) {
      return String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
  };

  // let acceptedOffer = filter(selectedTask.offers, {
  //   status: "Accepted"
  // });

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
    slidesToShow: !isEmpty(images) && images.length < 2 ? 1 : 2,
    slidesToScroll: 1
  };
  const [selectedOffer, selectOfferCurrent] = useState([]);

  const [collapseMessage, setCollapseMessage] = useState("");


  const [sendOfferMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: data => {
      if (get(data, "sendTaskOfferMessage.success")) {
        setSelectedTask(get(data, "sendTaskOfferMessage.data"));
      }
    }
  });

  useEffect(() => {
    setSelectedTask(get(props, "selectedTask", {}));
  }, [props]);

  useSubscription(CONVERSATION_SUBSCRIPTION, {
    variables: {
      offerId:
        !isEmpty(selectedOffer) &&
        get(selectedTask, "offers")[selectedOffer] &&
        get(selectedTask, "offers")[selectedOffer]._id
    },
    shouldResubscribe: true,
    onSubscriptionData: data =>
      get(data, "subscriptionData.data.getTaskOfferMessage.success") &&
      setSelectedTask(
        get(data, "subscriptionData.data.getTaskOfferMessage.data")
      )
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
                      <span>
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
                          {get(selectedTask, "category", "")} {" "}
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
                          <small
                            onClick={() => togglePropertyLocationView(true)}
                          >
                            <span>View in map</span>
                          </small>
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
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
              <hr></hr>
              <div className="notify--taskList">
                <div className="row">
                  <div className="col-md-3 text-left">
                    <Tag color="default">
                      {get(selectedTask, "status")}
                    </Tag>
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
                    </a>
                    <a href="test">
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                        alt="favourite"
                      />
                    </a> */}
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
                  <Slider {...settings}>{taskImages}</Slider>
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
                          onChange={e => selectOfferCurrent(e)}
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
                                renderItem={item => (
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
                                onSubmit={e => {
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
                                      message: e.target[0].value
                                    }
                                  });
                                }}
                              >
                                <TextArea
                                  name="text_message"
                                  value={collapseMessage}
                                  onChange={e =>
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
    </div>
  );
};
export default AddressComp;
