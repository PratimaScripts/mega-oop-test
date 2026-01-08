import React, { useState } from "react";
import { Table, Tag, Input, Button, Popconfirm, Tooltip } from "antd";
import { SearchOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import moment from "moment"
import Highlighter from "react-highlight-words";
import { useMutation, useQuery } from "react-apollo";
import AdminQueries from "config/queries/admin";
import showNotification from "config/Notification";

const UsersList = () => {
  const [deleteRequests, setDeleteRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('');


  useQuery(AdminQueries.deleteRequests, {
    onCompleted: ({ getDeleteRequestList }) => {
      if (getDeleteRequestList.success) {
        setDeleteRequests(getDeleteRequestList.data)
      }
      setLoading(false)
    }
  })

  const [deleteUserMutation] = useMutation(AdminQueries.deleteUser, {
    onCompleted: ({ deleteUserById }) => {
      if (deleteUserById.success) {
        setDeleteRequests(deleteUserById.data)
        showNotification("success",
          "User Deleted!",
          "User has been deleted successfully!")
      } else {
        showNotification(
          "error",
          "An Error Occured",
          deleteUserById.message
        );
      }
    }
  })



  const [denyRequestMutation] = useMutation(AdminQueries.rejectUserAccountDeleteRequest, {
    onCompleted: ({ rejectUserAccountDeleteRequest }) => {
      if (rejectUserAccountDeleteRequest.success) {
        setDeleteRequests(rejectUserAccountDeleteRequest.data)
        showNotification(
          "success",
          "User Deleted!",
          "User has been deleted successfully!"
        );
      } else {
        showNotification(
          "error",
          "An Error Occured",
          rejectUserAccountDeleteRequest.message
        );
      }
    }
  })

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => node}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      // <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "black" }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] &&
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // setTimeout(() => searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text}
      />
    )
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };




  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      ...getColumnSearchProps("firstName")
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      ...getColumnSearchProps("lastName")
    },
    {
      title: "Signed Up As",
      dataIndex: "defaultRole",
      key: "defaultRole",
      ...getColumnSearchProps("defaultRole"),
      render: defaultRole => (
        <Tag
          color={
            (defaultRole === "landlord" && "#548999") ||
            (defaultRole === "renter" && "coral") ||
            (defaultRole === "servicepro" && "lightseagreen")
          }
          key={"invitedRole"}
        >
          {defaultRole.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email")
    },
    {
      title: "Signed Up On",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: createdAt => <p>{moment(createdAt).format("DD-MM-YYYY h:m:s a")}</p>
    },
    {
      title: "Action",
      key: "action",
      render: record => (
        <span>
          <Popconfirm
            title="This will delete the user's account, are you sure?"
            onConfirm={() => deleteUserMutation({ variables: { userId: record._id } })}
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Approve Request">
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "1.5rem" }}
              />
              {/* <Icon
                  theme="twoTone"
                  twoToneColor="#52c41a"
                  style={{ fontSize: "1.5rem" }}
                  type="check-circle"
                /> */}
            </Tooltip>
          </Popconfirm>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Popconfirm
            title="Are you sure to perform this action?"
            onConfirm={() => denyRequestMutation({ variables: { userId: record._id } })}
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Reject Request">
              <CloseCircleTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: "1.5rem" }}
              />
              {/* <Icon
                  style={{ fontSize: "1.5rem" }}
                  type="close-circle"
                  theme="twoTone"
                  twoToneColor="#eb2f96"
                /> */}
            </Tooltip>
          </Popconfirm>
        </span>
      )
    }
  ];

  return (
    <>
      <Table rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={deleteRequests} />
    </>
  );
}

export default UsersList;
