import React, { useState } from "react";
import get from "lodash/get";
import {
  useMutation,
  useLazyQuery,
  useSubscription
} from "@apollo/react-hooks";

import isEmpty from "lodash/isEmpty";
import { gql } from "apollo-boost";
import ChatContainer from "./ChatContainer";
import "./styles.scss";

const CONVERSATION_SUBSCRIPTION = gql`
  subscription getTaskOfferMessage($offerId: String!) {
    getTaskOfferMessage(offerId: $offerId) {
      success
      message
      data
    }
  }
`;

const IS_TYPING_DISPATCH = gql`
  query userIsTyping($conversationId: String!) {
    userIsTyping(conversationId: $conversationId)
  }
`;

const SEND_MESSAGE = gql`
  mutation sendTaskOfferMessage($offerId: String!, $message: String!) {
    sendTaskOfferMessage(offerId: $offerId, message: $message) {
      success
      message
    }
  }
`;

const ChatMain = props => {
  const [isTyping] = useState(false);
  const [chatList] = useState(get(props, "offers", []));
  const [currentSelected, selectChat] = useState({});

  const [dispatchIsTyping] = useLazyQuery(IS_TYPING_DISPATCH, {
    variables: {
      conversationId: currentSelected._id
    }
  });

  // const [selectedConversations, setSelectedConversations] = useState(
  //   get(result, "data.getConversation.data.messages", [])
  // );

  // const userLst = useQuery(FETCH_CHATLIST);

  // console.log("userLstuserLstuserLstuserLst", userLst);

  const showData = data => {
    let newMessage = get(
      data,
      "subscriptionData.data.getTaskOfferMessage.data"
    );

    // console.log("datadatadatadatadatadata", data, newMessage);

    selectChat(newMessage);

    // let newAr = selectedConversations;
    // newAr.push(newMessage);
    // setSelectedConversations(newAr);
    // forceUpdate();
  };

  useSubscription(CONVERSATION_SUBSCRIPTION, {
    variables: {
      // offerId: "5e1c21815ef3e430e3cc266e"
      offerId: currentSelected._id
    },
    shouldResubscribe: true,
    onSubscriptionData: showData
  });

  // useSubscription(IS_TYPING_SUBSCRIPTION, {
  //   variables: {
  //     conversationId: currentSelected._id
  //   },
  //   shouldResubscribe: true,
  //   onSubscriptionData: isTypingEvent
  // });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  // useEffect(() => {
  //   setSelectedConversations(
  //     get(result, "data.getConversation.data.messages", [])
  //   );
  //   setChatList(get(userLst, "data.getConversations.data", ["1"]));
  // }, [result, userLst]);

  const setSelect = chat => {
    selectChat(chat);
  };

  return (
    <div className={get(props, "responsiveClasses", "")}>
      <div className="chat__wrapper">
        <div className="row">
          <div className="col-md-4">
            <div className="msg_list">
              <div className="input_wrappers">
                <div className="input__search mb-3">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search Messenger"
                  />
                  <button className="btn" type="submit">
                    <i className="mdi mdi-magnify"></i>
                  </button>
                </div>
              </div>

              <div className="msg_preview-parent">
                {!isEmpty(chatList) &&
                  chatList.map((chat, i) => {
                    return (
                      <div
                        className={`msg_preview ${currentSelected._id ===
                          chat._id && "active"}`}
                        key={i}
                        onClick={() => {
                          setSelect(chat);
                        }}
                      >
                        <div className="d-flex">
                          <div className="user__image_wrap">
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                              alt="userImage"
                            />
                          </div>
                          <div className="msg_view">
                            <div className="d-flex justify-content-between p-1">
                              <div className="name_user">
                                {`${get(chat, "user.firstName", "User")} ${get(
                                  chat,
                                  "user.lastName",
                                  ""
                                )}`}
                              </div>
                              <div className="time__date new_chat_time">
                                10:20 AM
                              </div>
                            </div>
                            <div className="msg_content new__chat">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit, sed do eiusmod tempor incidid.
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div id="chats_main" className="chats_main">
              <ChatContainer
                {...props}
                dispatchIsTyping={dispatchIsTyping}
                sendMessage={sendMessage}
                currentSelected={currentSelected}
              />

              {isTyping && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMain;
