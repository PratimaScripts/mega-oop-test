import React, { useState, useContext } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { Drawer, Popover, Card } from "antd";
import { PaperClipOutlined } from "@ant-design/icons"
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AssetUploader from "./AssetUploader";
import AssetPreview from "../AssetPreview";
import { UserDataContext } from "store/contexts/UserContext"

const ChatsMain = (props) => {
  const { state } = useContext(UserDataContext)
  // const [selectedAssets, setSelectedAssets] = useState([])
  const [showDocs, setShowDocs] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { userData, accountSetting } = state
  
  const dateFormat = (accountSetting && accountSetting["dateFormat"]
  ? accountSetting["dateFormat"]
  : process.env.REACT_APP_DATE_FORMAT) + " hh:mm a"


  document.querySelector(".final__chat-message") &&
    document.querySelector(".final__chat-message").scrollIntoView(true);
  return (
    <>
      {!isEmpty(props.selectedConversations) && (
        <div className="chat__head">
          Chat with {get(props, "currentSelected.firstName", "")}{" "}
          {get(props, "currentSelected.lastName", "")}
          <div
            onClick={() => setShowDocs(true)}
            className="btn btn-primary open__drawer"
          >
            Media Files
            </div>
        </div>
      )}

      <hr />
      <div className="main_chat_wrap">
        <TransitionGroup className="msg__conversation">
          {!isEmpty(props.selectedConversations) &&
            props.selectedConversations.map((c, i) => {
              return (
                <CSSTransition
                  key={c._id}
                  timeout={2500}
                  classNames="itemchat"
                >
                  <>
                    {get(c, "author", "123") === get(userData, "_id") ? (
                      <div
                        className={`admin_chat ${i === props.selectedConversations.length - 1 ? "final__chat-message" : ""
                          }`}
                      >
                        <div className="d-flex text-right pull-right">
                          <div className="msg_view">
                            <div className="name_user">You</div>
                            <div className="time__date">
                              {moment(c.createdAt).format(dateFormat)}
                            </div>
                            <div className="msg_content">
                              {c.body.includes("https://") ? (
                                <AssetPreview file={c.body} />
                              ) : (
                                c.body
                              )}
                            </div>
                          </div>
                          <div className="user__image_wrap">
                            <img
                              src=""
                              alt="userImage"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`msg_preview width__msg mb-2 ${i === props.selectedConversations.length - 1 ? "final__chat-message" : ""
                          }`}
                      >
                        <div className="d-flex">
                          <div className="user__image_wrap">
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                              alt="userImage"
                            />
                          </div>
                          <div className="msg_view">
                            <div className="name_user">
                              {get(c, "user.firstName")}
                            </div>
                            <div className="time__date">
                              {moment(c.createdAt).format(dateFormat)}
                            </div>
                            <div className="msg_content">
                              {c.body.includes("https://") ? (
                                <AssetPreview file={c.body} />
                              ) : (
                                c.body
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <hr />
                  </>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </div>
      <div className="input_wrap_chat">
        <div className="input_wrap_chat1">
          <div className="input-group input__fields">
            <textarea
              value={searchValue}
              name="chatsearch"
              onChange={e => setSearchValue(e.target.value)}
              className="form-control type_msg"
              placeholder="Type your message..."
            ></textarea>
            <div className="input-group-append">
              <span className="input-group-text attach_btn">
                <Popover
                  title={"Drop something to upload here!"}
                  content={
                    <AssetUploader
                      fileUploaded={data => {
                        props.sendMessage({
                          variables: {
                            message: data,
                            conversationId: props.currentSelected._id,
                            type: "file"
                          }
                        });
                      }}
                    />
                  }
                  trigger="click"
                >
                  <PaperClipOutlined />
                </Popover>
              </span>
            </div>
            <div
              onClick={() => {
                setSearchValue("");
                props.sendMessage({
                  variables: {
                    message: searchValue,
                    conversationId: props.currentSelected._id
                  }
                });
              }}
              className="input-group-append"
            >
              <span className="input-group-text send_btn">Send</span>
            </div>
          </div>
        </div>

        {/* <div className="input-group mb-3"> 
           <Search
            className="input__fields textarea"
              suffix={
                <Popover
                  title={"Drop something to upload here!"}
                  content={
                    <AssetUploader
                      fileUploaded={data => {
                        props.sendMessage({
                          variables: {
                            message: data,
                            conversationId: props.currentSelected._id,
                            type: "file"
                          }
                        });
                      }}
                    />
                  }
                  trigger="click"
                >
                  <Icon type="paper-clip" />
                </Popover>
              }
              placeholder="Type message here and press enter to send."
              enterButton="Send"
              value={searchValue}
              // onFocus={() => props.dispatchIsTyping()}
              onChange={e => setState({ searchValue: e.target.value })}
              onSearch={value => {
                setState({ searchValue: "" });
                props.sendMessage({
                  variables: {
                    message: value,
                    conversationId: props.currentSelected._id
                  }
                });
              }}
            /> 
          {/* </div> */}
      </div>
      <Drawer
        title="Attachments"
        placement="right"
        closable={false}
        zIndex={99999999999999999999}
        onClose={() => setShowDocs(false)}
        visible={showDocs}
        width={500}
        getContainer={false}
      >
        {isEmpty(get(this, "props.selectedAssets", [])) ? (
          <p>
            <i className="fa fa-folder-open" aria-hidden="true"></i>
              Nothing Uploaded Yet!
          </p>
        ) : (
          get(this, "props.selectedAssets", []).map((asset, i) => {
            return (
              <Card
                title={<img width="100" src={asset.body} alt="test" />}
                style={{ width: 300 }}
                key={i}
              >
                <a href={asset.body} download>
                  <button>Download</button>
                </a>
              </Card>
            );
          })
        )}
      </Drawer>
    </>
  );
}

export default ChatsMain;
