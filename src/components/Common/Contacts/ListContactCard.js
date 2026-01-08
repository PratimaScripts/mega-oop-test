import React from "react";
import get from "lodash/get";
import { useHistory } from "react-router";
import { Tag, Popconfirm } from "antd";
import { useMutation } from "@apollo/react-hooks";
import NProgress from "nprogress";
import { Checkbox } from "antd";

import ContactsQuery from "config/queries/contacts";
import showNotification from "config/Notification";

import "./listContactStyle.scss";

const ListContactCard = ({
  item,
  isArchived,
  currentRole = "landlord",
  setContacts = (f) => f,
  archiveContact = (f) => f,
  setViewProfileDrawer = (f) => f,
}) => {
  const contact = item;
  const history = useHistory();
  const tagColor = {
    landlord: "#2db7f5",
    renter: "#f50",
    servicepro: "#87d068",
  };

  const [deleteContact] = useMutation(ContactsQuery.removeContact, {
    onCompleted: ({ removeContact }) => {
      if (removeContact.success) {
        setContacts(get(removeContact, "data", []));
      } else {
        showNotification("error", "Failed to remove contact", "");
      }
      NProgress.done();
    },
    onError: ({ graphQLErrors, networkError }) => {
      // setLoading(false)
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      NProgress.done();
    },
  });
  return (
    <tr key={contact.roleId}>
      <td className={`border__${get(contact, "role")}`}>
        <div className="user-img d-flex align-items-center">
          <Checkbox
            className="mr-2"
            checked={isArchived}
            onChange={() => archiveContact(contact.contactId)}
          />
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
        <div className="d-flex align-items-center" style={{ gap: "14px" }}>
          {contact.userId ? (
            <i
              className="far fa-user"
              title="Profile"
              onClick={() =>
                setViewProfileDrawer({
                  userParam: contact.userId,
                  role: get(contact, "role"),
                })
              }
            ></i>
          ) : (
            <span className="">
              <i
                className="mdi mdi-account-plus list-icon m-0"
                title="Invite"
              ></i>
            </span>
          )}
          <span
            onClick={() =>
              history.push(
                `/${currentRole}/messenger/${get(contact, "role")}/${get(
                  contact,
                  "userId"
                )}`
              )
            }
            className=""
          >
            <i className="far fa-comments" title="Message"></i>
          </span>
          <Popconfirm
            title="Are you sure to remove this contact?"
            onConfirm={() =>
              deleteContact({
                variables: { contactId: contact.contactId },
              })
            }
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <span className="">
              <i className="fas fa-user-slash" title="Delete"></i>
            </span>
          </Popconfirm>
        </div>
      </td>
    </tr>
  );
};

export default ListContactCard;
