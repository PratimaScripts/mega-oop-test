import React, { useState, useContext } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Input, Drawer } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import { UserDataContext } from "store/contexts/UserContext"

const { Search } = Input;
const ChatsMain = (props) => {
  const { state } = useContext(UserDataContext)
  const [showDocs, setShowDocs] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const { userData } = state
  const accountSetting = state.accountSettings
  let dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat", process.env.REACT_APP_DATE_FORMAT) + " hh:mm a"
    : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;


  return (
    <>
      <div className="chat__head">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          <div
          onClick={() => setShowDocs(true)}
          className="btn btn-primary open__drawer"
        >
          Open
          </div>
      </div>
      <hr />
      <div
        style={{ overflow: "auto !important" }}
        className="msg__conversation"
      >
        <TransitionGroup className="todo-list">
          <>
            {!isEmpty(props.selectedConversations) &&
              props.selectedConversations.map((c, i) => {
                return (
                  <CSSTransition key={i} timeout={500} classNames="itemchat">
                    <>
                      {c.userId !== get(userData, "_id") ? (
                        <div className="admin_chat">
                          <div className="d-flex text-right pull-right">
                            <div className="msg_view">
                              <div className="name_user">You</div>
                              <div className="time__date">
                                {moment(c.createdAt).format(dateFormat)}
                              </div>
                              <div className="msg_content">{c.message}</div>
                            </div>
                            <div className="user__image_wrap">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                                alt="userImage"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={i} className="msg_preview width__msg mb-2">
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
                              <div className="msg_content">{c.message}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      <hr />
                    </>
                  </CSSTransition>
                );
              })}
          </>
        </TransitionGroup>
        {/* <hr /> */}
      </div>
      <div className="input-group input__fields mt-3">
        <Search
          suffix={<PaperClipOutlined />}
          placeholder="Type message here and press enter to send."
          enterButton="Search"
          value={searchValue}
          // onFocus={() => props.dispatchIsTyping()}
          onChange={e => setSearchValue(e.target.value)}
          onSearch={value => {
            setSearchValue("");
            props.sendMessage({
              variables: {
                message: value,
                offerId: props.currentSelected._id
              }
            });
          }}
        />
      </div>
      <Drawer
        title="Attachments"
        placement="right"
        closable={false}
        onClose={() => setShowDocs(true)}
        visible={showDocs}
        width={500}
        getContainer={false}
      >
        <p>Some contents...</p>
      </Drawer>
    </>
  );
}

export default ChatsMain;
