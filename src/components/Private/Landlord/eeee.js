import React, { useState, useEffect } from "react";
import get from "lodash/get";
import { Drawer } from "antd";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";

import isEmpty from "lodash/isEmpty";
import { gql } from "apollo-boost";
import ChatContainer from "./ChatContainer";
import "./styles.scss";

const FETCH_CHATLIST = gql`
  {
    getConversations {
      success
      message
      data
    }
  }
`;

const FETCH_CONVERSATIONS = gql`
  query getConversation($conversationId: String!) {
    getConversation(conversationId: $conversationId) {
      success
      message
      data
    }
  }
`;

const CONVERSATION_SUBSCRIPTION = gql`
  subscription getConversationChat($conversationId: String!) {
    getConversationChat(conversationId: $conversationId) {
      success
      message
      data
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($conversationId: String!, $message: String!) {
    sendMessage(conversationId: $conversationId, message: $message) {
      success
      data
      message
    }
  }
`;

const ChatMain = props => {
  const [showDocs, setShowDocs] = useState(false);
  const [currentSelected, selectChat] = useState({});
  const userLst = useQuery(FETCH_CHATLIST);

  const [addComment, { data }] = useMutation(SEND_MESSAGE);
  const [subscribeToMore, result] = useLazyQuery(FETCH_CONVERSATIONS);
  const [selectedConversations, setSelectedConversations] = useState({});
  // updateTodo({ variables: { id, type: input.value } });

  // console.log("resultresultresultresultresultresultresult", userLst);
  useEffect(() => {
    // fetchChatList();
    // subscribeToMore();
    setSelectedConversations(result);
  }, [result]);

  // const { subscribeToMore, ...result } = useQuery(COMMENT_QUERY, {
  //   variables: { comment: "CHAL JA BC" }
  // });

  // console.log("resultresultresultresultresultresult", result);
  const setSelect = chat => {
    subscribeToMore({
      variables: { conversationId: chat._id }
    });
  };

  return (
    <div className={get(props, "responsiveClasses", "")}>
      <div
        className="chat__wrapper"
        style={{
          overflow: "hidden",
          position: "relative"
        }}
      >
        <button onClick={() => setShowDocs(true)}>open</button>
        <Drawer
          title="Attachments"
          placement="right"
          closable={false}
          onClose={() => setShowDocs(false)}
          visible={showDocs}
          width={800}
          getContainer={false}
          style={{ position: "absolute" }}
        >
          <p>Some contents...</p>
        </Drawer>
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

              {!isEmpty(get(userLst, "data.getConversations.data", ["1"])) &&
                get(userLst, "data.getConversations.data", ["1"]).map(
                  (chat, i) => {
                    return (
                      <div
                        className={`msg_preview ${currentSelected._id ===
                          chat._id && "active"}`}
                        key={i}
                        onClick={() => {
                          selectChat(chat);

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
                              <div className="name_user">User Name {i}</div>
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
                  }
                )}
            </div>
          </div>

          <div className="col-md-8">
            <div className="chats_main">
              <ChatContainer
                selectedConversations={selectedConversations}
                subscribeToNewComments={() => {
                  // console.log("FUNCTOPN CALLING", currentSelected._id);
                  subscribeToMore({
                    document: CONVERSATION_SUBSCRIPTION,
                    variables: { conversationId: currentSelected._id },
                    updateQuery: (prev, { subscriptionData }) => {
                      // console.log("ALLLLLLLMAOOOO", subscriptionData);
                      // if (!subscriptionData.data) return prev;
                      // const newFeedItem = subscriptionData.data.commentAdded;

                      // // return Object.assign({}, prev, {
                      // //   entry: {
                      // //     comments: [newFeedItem, ...prev.entry.comments]
                      // //   }
                      // // });
                    }
                  });
                }}
              />
              <div className="input-group input__fields mb-3">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addComment({
                      variables: {
                        message: e.target[0].value,
                        conversationId: currentSelected._id
                      }
                    });

                    // input.value = '';
                  }}
                >
                  {/* <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div> */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type message here and press enter to send."
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMain;
