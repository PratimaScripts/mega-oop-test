import React from "react";
import { Card, Row, Avatar, Button, Tag, Popconfirm } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router";
import get from "lodash/get";
import NProgress from "nprogress";

import ContactsQuery from "config/queries/contacts";
import showNotification from "config/Notification";

const GridContactCard = ({
  item,
  showActions = true,
  currentRole = "landlord",
  setContacts = (f) => f,
}) => {
  const history = useHistory();

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

  const getActions = () => {
    const forAll = [
      <Popconfirm
        title="Are you sure to remove this contact?"
        onConfirm={() => {
          NProgress.start();
          deleteContact({
            variables: { contactId: item.contactId },
          });
        }}
        // onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button type="text" size="small" className="mb-3">
          <i className="fas fa-user-slash mr-2"></i>
          <br />
          Delete
        </Button>
      </Popconfirm>,
    ];
    if (!item.userId) {
      return forAll;
    } else {
      return [
        <Button
          size="small"
          type="text"
          className="mb-3"
          onClick={() =>
            history.push(
              `/${currentRole}/messenger/${get(item, "role")}/${get(
                item,
                "userId"
              )}`
            )
          }
        >
          <i className="mdi mdi-send list-icon"></i>
          <br />
          Message
        </Button>,
        ...forAll,
      ];
    }
  };

  return (
    <Card
      style={{ minWidth: 280, borderRadius: "4px" }}
      // cover={
      //     <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>{item.firstName.substring(0, 2).toUpperCase()}</Avatar>
      // }
      actions={showActions && getActions()}
    >
      <Row justify="end">
        {" "}
        <Tag
          color={
            item.role === "landlord"
              ? "#65cd5c"
              : item.role === "renter"
              ? "#712e97"
              : "#2ec3d7"
          }
        >
          {item.role === "landlord"
            ? "Home Owner"
            : item.role === "renter"
            ? "Renter"
            : "ServicePro"}
        </Tag>
      </Row>

      <Row justify="center">
        {" "}
        <Avatar size="large" style={{ backgroundColor: "#1890ff" }}>
          {item.firstName.substring(0, 2).toUpperCase()}
        </Avatar>
      </Row>

      <Row justify="center">
        <h6 style={{ color: "#1890ff", marginTop: "10px" }}>{`${
          item.firstName
        } ${item.middleName ? item.middleName : ""} ${item.lastName}`}</h6>
      </Row>
      <Row justify="center">
        <p>{item.email}</p>
      </Row>
      {item.userId ? (
        <Row justify="center">
         { item.role !== "renter" &&
          <a
            href={`${process.env.REACT_APP_PUBLIC_URL}/${item.role}/${item.userId}`}
            target="_blank"
            rel="noreferrer"
            className="btn-profile"
          >
            Profile
          </a>
         } 
        </Row>
      ) : (
        <Row justify="center">
          <Button className="btn-invite">Invite</Button>
        </Row>
      )}
    </Card>
  );
};

export default GridContactCard;
