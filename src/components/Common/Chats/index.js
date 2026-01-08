import React, { useState, useContext, useRef, useEffect } from "react";
import { Skeleton, Popover, Result, Tag, Space } from "antd";
import get from "lodash/get";
import filter from "lodash/filter";
import useForceUpdate from "use-force-update";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import moment from "moment";
import {
  useQuery,
  useMutation,
  useLazyQuery,
  useSubscription,
} from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
// import ChatContainer from "./ChatContainer";
import "./styles.scss";
import { UserDataContext } from "store/contexts/UserContext";
import AssetPreview from "../AssetPreview";
import AssetUploader from "./AssetUploader";
import styled from "styled-components";
import showNotification from "config/Notification";
import {
  fetchChatlist,
  fetchConversations,
  sendMessage,
  createConversation,
  // isTypingDispatch,
  conversationSubscription,
  isTypingSubscription,
  readMessageSubscription,
  markMessagesAsRead,
} from "config/queries/messenger";
// import userRole from "config/queries/userRole";
import { Picker } from "emoji-mart";

const ChatMain = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const messageInputRef = useRef();
  const { userData, accountSetting } = userState;
  const { receiverRole, receiverId } = useParams();
  // xconst {emptyConversation, setEmptyConversation} = useState({_id: "12345Hunter", email: "", firstName})
  // console.log("role", receiverRole, "id", receiverId)

  const forceUpdate = useForceUpdate();
  const dateFormat =
    accountSetting && accountSetting["dateFormat"]
      ? accountSetting["dateFormat"]
      : process.env.REACT_APP_DATE_FORMAT;

  // const [isTyping, setTypingStatus] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [chatListInitial, setChatListInitial] = useState([]);
  // const [selectedAssets, setSelectedAssets] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [windowDimensions, setWindowDimensions] = useState(0);
  const [isEmojiPickerVisible, setEmojiPickerVisibility] = useState(false);

  useEffect(() => {
    setWindowDimensions(window.innerWidth);
    function handleResize() {
      setWindowDimensions(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentSelected, selectChat] = useState({});

  // const [fetchUserInfoQuery] = useLazyQuery(userRole.getUserInformationById)

  const tagColor = {
    landlord: "#2db7f5",
    renter: "#f50",
    servicepro: "#87d068",
  };

  const [createConversationMutation] = useMutation(createConversation, {
    onCompleted: ({ createConversation }) => {
      if (get(createConversation, "success", false)) {
        // console.log("createConversation", createConversation)
        // message.success("Your message has been sent successfully!");
        // setLeaveReviewModal(false);
      }
    },
  });

  const [markMessagesAsSeen] = useMutation(markMessagesAsRead, {
    onCompleted: ({ markMessagesAsRead }) => {
      if (get(markMessagesAsRead, "success", false)) {
      }
    },
  });

  const [
    fetchConversationsQuery,
    { loading: fetchConversationsLoading, data },
  ] = useLazyQuery(fetchConversations, {
    onCompleted: ({ getConversation }) => {
      let messages = get(getConversation, "data.messages", []);
      setSelectedConversations(messages);
      let messageIds = [];
      messages.map((message) => {
        if (!message?.read && message.receiverId === userData._id) {
          messageIds.push(message._id);
        }
        return 0;
      });
      if (currentSelected._id) {
        markMessagesAsSeen({
          variables: {
            messageIds,
            conversationId: currentSelected._id,
            senderId: currentSelected?.participant?.userId || "",
          },
        });
      }
      // setSelectedAssets(get(getConversation, "data.assets"));
    },
  });

  // const [dispatchIsTyping] = useLazyQuery(isTypingDispatch, {
  //   variables: {
  //     conversationId: currentSelected._id,
  //   },
  // });

  const [selectedConversations, setSelectedConversations] = useState(
    get(data, "getConversation.data.messages", [])
  );

  useEffect(() => {
    let chatArea = document.querySelector(".msg__conversation");
    if (chatArea && chatArea?.lastElementChild) {
      chatArea.lastElementChild.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversations]);

  useQuery(fetchChatlist, {
    onCompleted: async ({ getConversations }) => {
      if (!isEmpty(get(getConversations, "data"))) {
        setChatListInitial(get(getConversations, "data", []));
        setChatList(get(getConversations, "data", []));
        const filt = await filter(get(getConversations, "data"), {
          participant: { userId: receiverId, role: receiverRole },
        });
        // console.log("filt", filt, filt.length, filt[0])
        if (filt.length > 0) {
          selectChat(filt[0]);
          filt[0]._id &&
            fetchConversationsQuery({
              variables: { conversationId: filt[0]._id },
            });
        } else if (filt.length === 0 && receiverId && receiverRole) {
          createConversationMutation({
            variables: { receiverId, role: receiverRole },
          });
        } else {
          // debugger
          const firstConversation = get(getConversations, "data", [])[0];
          // selectChat(firstConversation);
          firstConversation._id &&
            fetchConversationsQuery({
              variables: { conversationId: firstConversation._id },
            });
        }
      }
    },
  });

  const readMessages = (data) => {
    if (
      data?.subscriptionData?.data?.readMessageSubscription?.success &&
      data?.subscriptionData?.data?.readMessageSubscription?.messageIds?.length
    ) {
      let seenMessages =
        data?.subscriptionData?.data?.readMessageSubscription?.messageIds;
      let chatList = selectedConversations.map((chat) => {
        if (seenMessages.includes(chat._id)) {
          return { ...chat, read: true };
        }
        return { ...chat };
      });
      setSelectedConversations(chatList);
    }
  };

  const showData = (data) => {
    let newMessage = get(
      data,
      "subscriptionData.data.getConversationChat.data"
    );

    let newAr = selectedConversations;
    newAr.push(newMessage);
    setSelectedConversations(newAr);
    if (
      newMessage.receiverId === userData._id &&
      !newMessage.read &&
      currentSelected._id
    ) {
      markMessagesAsSeen({
        variables: {
          messageIds: [newMessage._id],
          conversationId: currentSelected._id,
          senderId: currentSelected?.participant?.userId || "",
        },
      });
    }
    forceUpdate();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessageText({ type: "text" });
    }
  };

  const isTypingEvent = (data) => {
    // setTypingStatus(true);
    // setTimeout(() => {
    //   setTypingStatus(false);
    // }, 10000);
  };

  // ------------------------- Subscriptions ------------------------- //

  useSubscription(readMessageSubscription, {
    variables: {
      conversationId: currentSelected._id,
      userId: userData._id,
    },
    onSubscriptionData: readMessages,
  });

  useSubscription(conversationSubscription, {
    variables: {
      conversationId: currentSelected._id,
    },
    shouldResubscribe: true,
    onSubscriptionData: showData,
  });

  useSubscription(isTypingSubscription, {
    variables: {
      conversationId: currentSelected._id,
    },
    shouldResubscribe: true,
    onSubscriptionData: isTypingEvent,
  });

  // ------------------------- ------------------------- //

  const sendMessageText = ({ type }) => {
    if (currentSelected._id && messageToSend) {
      messageInputRef.current.disabled = true;
      sendMessageMutation({
        variables: {
          conversationId: currentSelected._id,
          message: messageToSend,
          type,
        },
      });
    }
  };

  const [sendMessageMutation, { loading: sendMessageLoading }] = useMutation(
    sendMessage,
    {
      onCompleted: ({ sendMessage }) => {
        if (sendMessage.success) {
          setMessageToSend("");
        } else {
          showNotification(
            "error",
            "Failed to send message",
            get(sendMessage, "message", "")
          );
        }
        messageInputRef.current.disabled = false;
      },
      onError: ({ graphQLErrors, networkError }) => {
        messageInputRef.current.disabled = false;
        showNotification("error", "Failed to send message", "Try Again");
      },
    }
  );

  // useEffect(() => {
  //   setSelectedConversations(
  //     get(data, "getConversation.data.messages", [])
  //   );

  // setChatListInitial(get(userLst, "data.getConversations.data", ["1"]));
  // setChatList(get(userLst, "data.getConversations.data", ["1"]));
  // }, [data, userLst]);

  const setSelect = (chat) => {
    selectChat(chat);
    setSelectedConversations([]);
    chat._id &&
      fetchConversationsQuery({ variables: { conversationId: chat._id } });
  };

  const filterChats = async (filterText) => {
    let initial = chatListInitial;

    if (filterText === "") {
      setChatList(initial);
    } else {
      let filtered = await chatListInitial.filter((str) => {
        let firstName = get(str, "firstName", "category");
        let lastName = get(str, "lastName", "category");
        let email = get(str, "email", "category");

        return (
          (firstName &&
            firstName.toLowerCase().includes(filterText.toLowerCase())) ||
          (lastName &&
            lastName.toLowerCase().includes(filterText.toLowerCase())) ||
          (email && email.toLowerCase().includes(filterText.toLowerCase()))
        );
      });

      await Promise.all(filtered);

      setChatList(filtered);
    }
  };

  return (
    <div className={get(props, "responsiveClasses", "")}>
      <div className="chat__wrapper" style={{ minHeight: 300, height: "100%" }}>
        <div className="row m-0 h-100 flex-grow-1">
          {windowDimensions > 1026 || currentSelected._id === undefined ? (
            <div className="col-md-4 bg-white border-right">
              <div className="msg_list">
                {/* <div className="input_wrappers"></div> */}
                <div className="main_chat_wrap">
                  <div className="msg_preview-parent">
                    <ChatContactContainer>
                      {/* <h2>Messages</h2> */}
                      <SearchArea>
                        <div className="icon_holder">
                          {" "}
                          <i className="mdi mdi-magnify"></i>
                        </div>
                        <div className="input_holder">
                          <input
                            onChange={(e) => filterChats(e.target.value)}
                            type="text"
                            placeholder="Search Users"
                          />
                        </div>
                      </SearchArea>
                      {/* <div className="input__search mb-3">
                      <button className="btn" type="submit">
                        <i className="mdi mdi-magnify"></i>
                      </button>
    </div> */}

                      {!isEmpty(chatList) &&
                        chatList.map((chat, i) => {
                          return (
                            get(chat, "firstName") && (
                              <ContactCard
                                key={chat._id}
                                active={currentSelected._id === chat._id}
                                onClick={() => setSelect(chat)}
                              >
                                <div className="profile">
                                  <img
                                    src={get(chat, "avatar")}
                                    alt="userImage"
                                  />
                                </div>
                                <div
                                  className="pl-3"
                                  style={{ maxWidth: "calc(100% - 55px)" }}
                                >
                                  <div className="profile_body">
                                    {currentSelected._id !== chat._id ? (
                                      // <Space size="large">
                                      <>
                                        <span
                                          className="font-weight-bold inline  d-inline-block text-truncate text-capitalize"
                                          style={{ width: "65%" }}
                                        >
                                          {get(chat, "firstName")}{" "}
                                          {get(chat, "lastName")} <br />
                                        </span>
                                        <Tag
                                          color={
                                            tagColor[get(chat, "role", "")]
                                          }
                                        >
                                          {get(chat, "role", "")}
                                        </Tag>
                                      </>
                                    ) : (
                                      // </Space>
                                      <span
                                        className="font-weight-bold d-inline-block text-truncate text-capitalize"
                                        style={{ width: "65%" }}
                                      >
                                        {get(chat, "firstName")}{" "}
                                        {get(chat, "lastName")} <br />
                                      </span>
                                    )}
                                    <span
                                      className="text-white font-weight-normal f10 "
                                      style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 15,
                                        textShadow:
                                          "0 0 6px #000, 0px 0px 10px #000, 0px 0px 15px #000",
                                      }}
                                    >
                                      {get(chat, "messages.createdAt") &&
                                        moment(
                                          get(chat, "messages.createdAt")
                                        ).fromNow()}
                                      {/* {moment(
                                      get(chat, "messages.createdAt")
                                        ? get(chat, "messages.createdAt")
                                        : Date.now()
                                    ).format(
                                      accountSetting.dateFormat
                                        ? accountSetting.dateFormat.toUpperCase()
                                        : "DD-MM-YYYY"
                                    )} */}
                                    </span>
                                  </div>
                                  <div style={{ maxWidth: "calc(100%)" }}>
                                    <small className="color-secondary text-truncate mt-1">
                                      {get(chat, "messages.body")}
                                    </small>
                                  </div>
                                </div>
                              </ContactCard>
                            )
                          );
                        })}
                    </ChatContactContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {windowDimensions > 1026 || currentSelected._id ? (
            <div className="col-md-8 p-0">
              {currentSelected.firstName ? (
                <ChatContainer>
                  <div className="chat_header border-bottom">
                    <div className="profile_area justify-content-center">
                      <div className="profile_picture">
                        <img
                          src={get(currentSelected, "avatar")}
                          alt="userImage"
                        />
                      </div>
                      <div className="profile_detail pl-3 d-flex flex-column justify-content-center">
                        <Space size="large">
                          <p className="m-0 font-weight-bold">
                            {" "}
                            Chat with{" "}
                            <span className="text-capitalize">
                              {get(currentSelected, "firstName", "")}{" "}
                              {get(currentSelected, "lastName", "")}
                            </span>
                          </p>
                          <Tag
                            color={tagColor[get(currentSelected, "role", "")]}
                          >
                            {get(currentSelected, "role", "")}
                          </Tag>
                        </Space>
                        <small>
                          {get(currentSelected, "isOnline", false)
                            ? "Online"
                            : "Offline"}
                        </small>
                      </div>
                    </div>
                    <div className="row m-0">
                      {/* <div className="col text-center p-0 d-flex flex-column justify-content-center">
                        <button className="btn text-secondary btn-oultine-light p-0">
                          <i className="fas fa-search" />
                        </button>
                      </div> */}
                      <div className="col text-center p-0 d-flex flex-column justify-content-center">
                        {currentSelected.role !== "renter" && (
                          <a
                            className="btn text-secondary btn-oultine-light p-0"
                            href={`${process.env.REACT_APP_PUBLIC_URL}/${get(
                              currentSelected,
                              "role",
                              ""
                            )}/${currentSelected?.userId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fas fa-user-circle" />
                          </a>
                        )}
                      </div>
                      {windowDimensions < 1025 && (
                        <div className="col text-center p-0 d-flex flex-column justify-content-center">
                          <button
                            className="btn btn-danger px-0"
                            onClick={() => selectChat({})}
                          >
                            <i className="fas fa-times" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="chat_area">
                    {fetchConversationsLoading ? (
                      <Skeleton
                        tip="Fetching Conversation ..."
                        active
                        loading={fetchConversationsLoading}
                      />
                    ) : (
                      <TransitionGroup className="msg__conversation">
                        {!isEmpty(selectedConversations) &&
                          selectedConversations.map((chat, i) => {
                            return (
                              <CSSTransition
                                id="chatMessages"
                                key={chat._id}
                                timeout={2500}
                                classNames="itemchat"
                              >
                                <div
                                  className={`w-100 my-2 ${
                                    get(chat, "author", "123") === userData._id
                                      ? "justify-content-end"
                                      : "justify-content-start"
                                  }`}
                                >
                                  <div
                                    className={`d-flex flex-row align-items-end ${
                                      get(chat, "author", "123") ===
                                      userData._id
                                        ? "w-100"
                                        : "justify-content-start"
                                    }`}
                                    style={{}}
                                  >
                                    {get(chat, "author", "123") !==
                                      userData._id && (
                                      <div className="user_profile border">
                                        <div className="user_profile">
                                          <img
                                            src={get(
                                              currentSelected,
                                              "avatar",
                                              "https://picsum.photos/200"
                                            )}
                                            alt="Name Here"
                                          />
                                        </div>
                                      </div>
                                    )}
                                    {get(chat, "author", "123") ===
                                      userData._id && <div className="col" />}

                                    <div
                                      className={`user_profile_chat ${
                                        get(chat, "author", "123") ===
                                        userData._id
                                          ? "sender-me text-right px-3"
                                          : "sender-other px-3"
                                      }`}
                                    >
                                      {" "}
                                      {/* <p>{chat.body}</p> */}
                                      {chat.body.includes("https://") ? (
                                        <div className="row user_profile_chat_relate px-3 pb-4">
                                          <AssetPreview file={chat.body} />
                                        </div>
                                      ) : (
                                        <p>{chat.body}</p>
                                      )}
                                      <p className="time m-0 text-secondary">
                                        {moment(chat.createdAt).isSame(
                                          new Date(),
                                          "day"
                                        )
                                          ? moment(chat.createdAt).format(
                                              "hh:mm A"
                                            )
                                          : moment(chat.createdAt).format(
                                              dateFormat
                                            )}
                                        {chat.author === userData._id ? (
                                          chat.read ? (
                                            <img
                                              className="ml-1"
                                              src="/assets/icons/doubleCheck.svg"
                                              alt="single-check"
                                            />
                                          ) : (
                                            <img
                                              className="ml-1"
                                              src="/assets/icons/check.svg"
                                              alt="single-check"
                                            />
                                          )
                                        ) : null}
                                      </p>
                                    </div>
                                    {get(chat, "author", "123") ===
                                      userData._id && (
                                      <div className="user_profile border">
                                        <img
                                          src={
                                            userData.avatar &&
                                            userData.avatar.includes("http")
                                              ? userData.avatar
                                              : "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578492529/images/avatar.jpg"
                                          }
                                          alt="Name Here"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CSSTransition>
                            );
                          })}
                      </TransitionGroup>
                    )}
                  </div>
                  <div className="chat_footer">
                    <div className="d-flex flex-row justify-content-center chat_footer_container">
                      <div className="row m-0 chat_footer_buttons">
                        {isEmojiPickerVisible && (
                          <Picker
                            title=""
                            showPreview={false}
                            showSkinTones={false}
                            color="#2189FF"
                            onSelect={(emoji) => {
                              setMessageToSend(messageToSend + emoji.native);
                            }}
                            style={{ position: "absolute", bottom: 85 }}
                          />
                        )}
                        <div className="col text-center d-flex justify-content-center chat_footer_button chat_footer_button_one">
                          <button className="p-0 btn btn-link text-secondary outline-none shadow-none"></button>
                          <Popover
                            title={"Drop something to upload here!"}
                            // className="p-0 btn btn-outline-light text-secondary"
                            content={
                              <AssetUploader
                                fileUploaded={(data) => {
                                  sendMessageMutation({
                                    variables: {
                                      message: data,
                                      conversationId: currentSelected._id,
                                      type: "file",
                                    },
                                  });
                                }}
                              />
                            }
                            trigger="click"
                          >
                            <button className="p-0 btn btn-link text-secondary outline-none shadow-none">
                              <i className="fas fa-paperclip" />
                            </button>
                          </Popover>
                        </div>
                        <div className="col text-center  d-flex justify-content-center chat_footer_button chat_footer_button_two">
                          <button
                            className={`p-0 btn btn-link outline-none shadow-none ${
                              isEmojiPickerVisible
                                ? "text-black"
                                : "text-secondary"
                            }`}
                            onClick={() =>
                              setEmojiPickerVisibility(!isEmojiPickerVisible)
                            }
                          >
                            <i className="fas fa-laugh" />
                          </button>
                        </div>
                      </div>
                      <div className="input_container flex-grow-1 d-flex justify-content-center">
                        <input
                          type="text"
                          className="w-100"
                          ref={messageInputRef}
                          placeholder="Write a message..."
                          value={messageToSend}
                          onChange={(e) => setMessageToSend(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e)}
                        />
                      </div>
                      <div className="row m-0 chat_footer_buttons">
                        {/* <div className="col text-center d-flex justify-content-center chat_footer_button chat_footer_button_three">
                          <button className="p-0 btn btn-outline-light text-secondary">
                            <i className="fas fa-microphone" />
                          </button>
                        </div> */}
                        <div className="col text-center d-flex justify-content-center align-items-center chat_footer_button chat_footer_button_four">
                          <button
                            className="p-0 btn btn-outline-light submit text-white"
                            disabled={sendMessageLoading}
                            onClick={() => {
                              sendMessageText({
                                message: messageToSend,
                                conversationId: currentSelected._id,
                              });
                              // setMessageToSend("");
                            }}
                          >
                            <i className="fas fa-paper-plane" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ChatContainer>
              ) : (
                <div
                  className="d-flex align-items-center w-100 justify-content-center"
                  style={{ height: "calc(100vh - 140px)" }}
                >
                  <Result
                    icon={<i className="fas fa-comments fa-5x" />}
                    title="Send private messages, files to your contact!"
                    // extra={<Button type="primary">Next</Button>}
                  />
                </div>
              )}
              <div className="chats_main">
                {/* <ChatContainer
                {...props}
                selectedConversations={selectedConversations}
                dispatchIsTyping={dispatchIsTyping}
                sendMessageMutation={sendMessageMutation}
                selectedAssets={selectedAssets}
                currentSelected={currentSelected}
              />

              {isTyping && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )} */}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMain;

const ChatContactContainer = styled.div`
  padding: 15px;
  h2 {
    font-size: 20px;
  }
  .profile_body {
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
    align-items: center;
  }
`;

const ContactCard = styled.div`
  border-radius: 15px;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  border: ${(props) =>
    props.active ? "2px solid #edf1fe;" : "2px solid #e5e5e5"};
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  background-color: ${(props) => (props.active ? "#EDF1FE" : "#fff")};
  position: relative;
  :hover {
    border: 2px solid #edf1fe;
    background-color: #edf1fe;
  }
  .color-secondary {
    color: #a5a7b4;
  }
  .profile {
    border-radius: 15px;
    overflow: hidden;
    height: 45px;
    min-width: 45px;
    max-width: 45px;
    img {
      height: 45px;
      width: 45px;
      object-fit: cover;
    }
  }
  p {
    margin: 0;
    font-size: 14px;
  }
  small {
    display: block;
  }
  .cover {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 250px;
    /* height: 1.3em; */
    white-space: nowrap;
  }
  .notif_area {
    height: 20px;
    width: 20px;
    color: #fff;
    background: #f65164;
    font-size: 9px;
    border-radius: 50%;
    position: absolute;
    bottom: 15px;
    right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .f10 {
    font-size: 10px;
  }
`;

const SearchArea = styled.div`
  border-radius: 15px;
  border: 2px solid #e5e5e5;
  display: flex;
  flex-direction: row;
  padding: 8px 15px;
  margin: 10px 0;
  .icon_holder {
    min-width: 30px;
    max-width: 30px;
    text-align: center;
    display: flex;
    align-items: center;
    .mdi {
      font-size: 16px;
    }
  }
  .input_holder {
    flex: 1;
    input {
      width: 100%;
      border: none;
      outline: none;
      width: 100%;
      padding: 5px 0;
    }
  }
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 140px);
  @media only screen and (max-width: 768px) {
    max-height: calc(100vh - 140px);
  }
  .chat_header {
    min-height: 80px;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 1rem;
    @media only screen and (max-width: 400px) {
      padding: 0px;
      .ant-space {
        gap: 0px !important;
      }
      .ant-tag {
        margin-right: 0px;
      }
    }
    .profile_area {
      flex: 1;
      display: flex;
      align-items: center;
      height: auto;
      .profile_picture {
        border-radius: 15px;
        overflow: hidden;
        height: 45px;
        min-width: 45px;
        max-width: 45px;
        img {
          height: 45px;
          width: 45px;
          object-fit: cover;
        }
      }
      .profile_detail {
        flex: 1;
        min-height: 80px;
      }
    }
    .row {
      min-width: 130px;
      max-width: 130px;
      font-size: 14px;
    }
  }
  .chat_area {
    flex: 1 1 100%;
    overflow: auto;
    padding: 20px;
    height: 100%;
    @media only screen and (max-width: 425px) {
      padding: 0px;
    }
    .user_profile {
      border-radius: 12px;
      overflow: hidden;
      height: 40px;
      min-width: 40px;
      max-width: 40px;
      img {
        height: 40px;
        width: 40px;
        object-fit: cover;
      }
    }
    .sender-other {
      background-color: #fff;
      border: 2px solid #e5e5e5;
    }
    .sender-me {
      background-color: #edf1fe;
    }
    .user_profile_chat {
      min-width: 90px;
      max-width: 600px;
      border-radius: 15px;
      position: relative;
      margin: 0px 15px 0;
      padding: 15px 15px 10px;
      overflow-wrap: break-word;
    }
    .user_profile_chat_relate {
      width: 300px;
      .type_img {
        max-width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 7px;
      }
    }
    .time {
      font-size: 10px;
      position: absolute;
      right: 10px;
      bottom: 5px;
    }
  }
  .div {
    height: 300vh;
    width: 30px;
    background-color: #333;
  }
  .chat_footer {
    max-height: 75px;
    min-height: 75px;
    padding: 0 20px 20px;
    .chat_footer_container {
      border-radius: 15px;
      border: 2px solid #e5e5e5;
      height: 50px;
    }
    .submit {
      background: #4f75f6;
      height: 35px;
      width: 35px;
      border-radius: 50%;
    }
    .input_container {
      input {
        outline: none;
        border: none;
      }
    }
  }
`;
