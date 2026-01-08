import React, { useState } from "react";
import { Modal, AutoComplete, Tag, message } from "antd";
import ContactsQuery from "../../../../../../../config/queries/contacts";
import { UserOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "react-apollo";
import showNotification from "config/Notification";
const { confirm } = Modal;

const ContactSearch = ({ updateContactList }) => {
  const [suggestions, setSuggestions] = useState([]);

  const [executeQuery] = useLazyQuery(ContactsQuery.fetchContactList, {
    onCompleted: (data) => {
      if (data && data.fetchContactList && data.fetchContactList.data) {
        const _data = data.fetchContactList.data;
        setSuggestions(_data.map((item, index) => renderItem(item, index)));
      }
    },
  });

  const [executeMutation] = useMutation(ContactsQuery.createContact, {
    onCompleted: (data) => {
      if (data) updateContactList();
    },
  });

  const renderItem = (item, index) => ({
    value: `${item.firstName} ${item.lastName}-#${index}`,
    item,
    label: (
      <div
        key={`${item.userId}-${item.email}-${index}`}
        className="d-flex justify-content-between"
      >
        <span>
          <UserOutlined /> {`${item.firstName} ${item.lastName}`}
        </span>
        <span>
          <Tag>{item.role}</Tag>
        </span>
      </div>
    ),
  });

  const getSuggestionValue = (suggestion) => {
    try {
      confirm({
        title: "Are you sure you want to add this user to your contacts?",
        content: `${suggestion.firstName} ${suggestion.lastName} will be added to your contacts.`,
        async onOk() {
          executeMutation({
            variables: {
              contact: {
                userId: suggestion.userId,
                role: suggestion.role,
                email: suggestion.email,
              },
            },
          });
        },
        onCancel() {
          // console.log("Cancel");
          showNotification("error", "An error occurred!")
        },
      });
    } catch (error) {
      message.error("Something went wrong, please try again later!");
    }
  };

  const getSuggestions = async (value) => {
    const inputValue = value ? value.trim().toLowerCase() : "";
    const inputLength = inputValue ? inputValue.length : 0;
    if (inputLength !== 0 && inputLength > 4) {
      executeQuery({ variables: { filter: value } });
    }
  };

  const onSelect = (_, option) => getSuggestionValue(option.item);

  return (
    <AutoComplete
      size={"large"}
      allowClear
      options={suggestions}
      className="w-100"
      onSelect={onSelect}
      onSearch={getSuggestions}
      placeholder="Search by email"
    />
  );
};

export default ContactSearch;
