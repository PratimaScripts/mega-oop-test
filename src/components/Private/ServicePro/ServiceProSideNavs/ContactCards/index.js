import React, { useState } from "react";
import ContactsSearch from "./ContactsSearch";
import { withRouter } from "react-router-dom";
import ContactsQuery from "config/queries/contacts";
import { useQuery, useMutation } from "@apollo/react-hooks";
import isEmpty from "lodash/isEmpty";
import { Popconfirm, Tag } from "antd";
import get from "lodash/get";

import "./styles.scss";

// const { Meta } = Card;

const tagColor = {
  landlord: "#2db7f5",
  renter: "#f50",
  servicepro: "#87d068"
};

const ContactCard = props => {
  const [contacts, setContacts] = useState([]);
  // console.log('Contact service pro props', props)
  const updateContactList = data => {
    setContacts(get(data, "getContactList.data"));
  };

  const [deleteContact] = useMutation(ContactsQuery.removeContact, {
    onCompleted: d => setContacts(get(d, "removeContact.data"))
  });

  useQuery(ContactsQuery.getContactList, {
    onCompleted: updateContactList,
    notifyOnNetworkStatusChange: true
  });

  let contactCards =
    !isEmpty(contacts) &&
    contacts.reverse().map((contact, i) => {
      return (
        <tr key={contact.roleId}>
          <td className={`border__${get(contact, "role")}`}>
            <div className="user-img">
              <img
                alt="example"
                src={get(
                  contact,
                  "avatar",
                  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                )}
              />
            </div>
          </td>
          <td>
            <div className="user-info">
              <div className="user-name">
                {get(contact, "firstName", "No Name Specified yet")
                  ? get(contact, "firstName", "No Name Specified yet")
                  : "No Name"}{" "}
                {get(contact, "lastName", "No Name Specified yet")}
              </div>
            </div>
          </td>
          <td>
            <div className="user-email">{get(contact, "email")}</div>
          </td>
          <td>
            <div className="user-role">
              <Tag color={tagColor[get(contact, "role")]}>
                {get(contact, "role")}
              </Tag>
            </div>
          </td>
          <td>
            <span
              onClick={() =>
                props.history.push(
                  `/servicepro/messenger/${get(contact, "role")}/${get(contact, "userId")}`
                )
              }
              className="msg-user"
            >
              <i className="far fa-comments" title="Message"></i>
            </span>
            <Popconfirm
              title="Are you sure to remove this contact?"
              onConfirm={() =>
                deleteContact({
                  variables: { contactId: contact.contactId }
                })
              }
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <span className="del-user">
                <i className="fas fa-user-slash" title="Delete"></i>
              </span>
            </Popconfirm>
          </td>
        </tr>
        // <div className="col-md-2">
        //   <div className="contact-card">
        //     <div className="user-img">
        //       <img
        //         alt="example"
        //         src={get(
        //           contact,
        //           "avatar",
        //           "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        //         )}
        //       />
        //     </div>
        //     <div className="user-info">
        //       <Meta
        //         title={
        //           <div className="user-name">
        //             {get(contact, "firstName", "No Name Specified yet")
        //               ? get(contact, "firstName", "No Name Specified yet")
        //               : "No Name"}{" "}
        //             {get(contact, "lastName", "No Name Specified yet")}
        //           </div>
        //         }
        //         description={
        //           <div className="user-email">{get(contact, "email")}</div>
        //         }
        //       />
        //     </div>
        //     <div className="user-activity">
        //       <ul>
        //         <li className="msg-user">
        //           <i className="far fa-comments"></i> <br /> Message
        //         </li>
        //         <Popconfirm
        //           title="Are you sure to remove this contact?"
        //           onConfirm={() =>
        //             deleteContact({
        //               variables: { contactId: contact.contactId }
        //             })
        //           }
        //           // onCancel={cancel}
        //           okText="Yes"
        //           cancelText="No"
        //         >
        //           <li className="del-user">
        //             <i className="fas fa-user-slash"></i> <br /> Delete
        //           </li>
        //         </Popconfirm>
        //       </ul>
        //     </div>
        //     <div className="card_footer">
        //       <ul>
        //         <li>
        //           <div className="user-role">
        //             <Tag color={tagColor[get(contact, "role")]}>
        //               {get(contact, "role")}
        //             </Tag>
        //           </div>
        //         </li>
        //         <li>
        //           <div className="view-info">
        //             <span>
        //               View <i className="fas fa-arrow-right"></i>
        //             </span>
        //           </div>
        //         </li>
        //       </ul>
        //     </div>
        //   </div>
        // </div>
      );
    });

  return (
    <>
      <div className="head_wrap">
        <div>
          <h4>Search Contacts here</h4>
          <ContactsSearch
            updateContactList={data => setContacts(data)}
            {...props}
          />
        </div>
        <div className="text-right">
          <button className="btn btn_addcontact">Add Contact</button>
        </div>
      </div>

      {/* <div className="row">{contactCards}</div> */}
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="thead-dark">
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{contactCards}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(ContactCard);
