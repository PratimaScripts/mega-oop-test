/* eslint-disable array-callback-return */
import React, { useState, useRef, useContext } from "react";
import { Table, Tag, Input, Button, Popconfirm, Tooltip } from "antd";
import {
  SearchOutlined, VerticalAlignBottomOutlined,
  FileExcelFilled, UserDeleteOutlined, ExclamationOutlined,
  StopOutlined
} from "@ant-design/icons";
import moment from "moment";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Highlighter from "react-highlight-words";
import { CSVLink } from "react-csv";
// import { Spin } from "antd";
import { DatePicker } from "antd";
import showNotification from "config/Notification";
import { useQuery, useMutation } from "@apollo/react-hooks";
import AdminQueries from "config/queries/admin";
import { UserDataContext } from "store/contexts/UserContext";


const { RangePicker } = DatePicker;

let headers = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Signed Up As", key: "role" },
  { label: "Gender", key: "gender" },
  { label: "Signed Up On", key: "createdOn" }
];
const UsersList = () => {
  const { state } = useContext(UserDataContext)
  const [users, setUsers] = useState([]);
  const extraArUsr = useRef([]);
  const userArCsv = useRef([]);
  // const [inProgress, setProgress] = useState(false)
  // const [isFilter, setFilter] = useState(false)
  const [loading, setLoading] = useState(true)
  const downloadSheet = useRef()
  const [searchText, setSearchText] = useState("")

  const accountSetting = state.accountSettings
  let dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat") + " hh:mm a"
    : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;


  useQuery(
    AdminQueries.userList, {
    onCompleted: ({ userList }) => {
      if (userList.success && userList.data) {
        setUsers(userList.data)
        extraArUsr.current = userList.data
      }
      setLoading(false)
    },
    onError: (error) => {
      setLoading(false)
    }
  })


  const createUserAr = async () => {
    setLoading(true)

    userArCsv.current = await users?.map((user) => {
      return {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.defaultRole,
        gender: user.gender,
        createdOn: String(moment(user.createdAt).format("DD-MM-YYYY h:m:s a"))
      };
    });
    // console.log()

    setLoading(false)
  };

  const filterByDate = (date) => {
    date === 'all' ? setUsers(extraArUsr.current) :
      setUsers(extraArUsr.current.filter(user => moment(user.createdAt).isBetween(date[0]._d, date[1]._d)))
  }

  const [userAction] = useMutation(AdminQueries.userActionQuery, {
    onCompleted: ({ updateUserAccountSetting }) => {
      if (updateUserAccountSetting.success) {
        showNotification("success", "User Updated!", updateUserAccountSetting.message)
      } else {
        showNotification("error", "An error occured", updateUserAccountSetting.message)
      }
      setLoading(false)
    },
    onError: (error) => {
      showNotification("error", "An error occured", "")
      setLoading(false)
    }
  })

  const [deleteUser] = useMutation(AdminQueries.deleteUser, {
    onCompleted: ({ deleteUserById }) => {
      if (deleteUserById.success) {
        setUsers(deleteUserById.data)
        extraArUsr.current = deleteUserById.data
        showNotification(
          "success",
          "User Deleted!",
          "User has been deleted successfully!"
        );
      } else {
        showNotification(
          "error",
          "An Error Occured",
          deleteUserById.message
        );
      }
      setLoading(false)
    },
    onError: (error) => {
      showNotification(
        "error",
        "An Error Occured",
        ""
      );
      setLoading(false)
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
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
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

  const resetFilter = () => {
    setLoading(true)
    setUsers(extraArUsr.current)
    userArCsv.current = []
    setLoading(false)
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
      title: "Blocked",
      dataIndex: "isBlocked",
      key: "isBlocked",
      ...getColumnSearchProps("isBlocked"),
      render: data => {
        return <p>{data ? "Yes" : "No"}</p>;
      }
    },
    {
      title: "Deactivated",
      dataIndex: "isDeactivate",
      key: "isDeactivate",
      render: data => {
        return <p>{data ? "Yes" : "No"}</p>;
      },
      ...getColumnSearchProps("isDeactivate")
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
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        moment(a.createdAt).format("YYYYMMDD") -
        moment(b.createdAt).format("YYYYMMDD"),
      ...getColumnSearchProps("createdAt"),
      render: createdAt => (
        <p>{moment(createdAt).format(dateFormat)}</p>
      )
    },
    {
      title: "Action",
      key: "action",
      render: record => (
        <span>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => {
              setLoading(true)
              deleteUser({ variables: { userId: record._id } });
              // setFilter(false);
            }}
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete User">
              {/* <Icon style={{ fontSize: "1rem" }} type="user-delete" /> */}
              <UserDeleteOutlined style={{ fontSize: "1rem" }} />
            </Tooltip>
          </Popconfirm>
          &nbsp;&nbsp;
          <Popconfirm
            title="Are you sure to block this user?"
            onConfirm={() => {
              setLoading(true)
              userAction({
                variables:
                {
                  status: !record["isBlocked"],
                  userId: record._id,
                  actionType: "isBlocked"
                }
              });
              // setFilter(false);
            }}
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Block User">
              {/* <Icon style={{ fontSize: "1rem" }} type="stop" /> */}
              <StopOutlined style={{ fontSize: "1rem" }} />
            </Tooltip>
          </Popconfirm>
          &nbsp;&nbsp;
          <Popconfirm
            title="Are you sure to deactivate this user?"
            onConfirm={() => {
              setLoading(true)
              userAction({
                variables: {
                  status: !record["isDeactivate"],
                  userId: record._id,
                  actionType: "isDeactivate"
                }
              })
            }
            }
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Dectivate User">
              {/* <Icon style={{ fontSize: "1rem" }} type="exclamation" /> */}
              <ExclamationOutlined style={{ fontSize: "1rem" }} />
            </Tooltip>
          </Popconfirm>
        </span>
      )
    }
  ];

  return (
    <>
      <RangePicker onChange={value => filterByDate(value)} showToday={true} />
      <Button onClick={resetFilter}>Reset</Button>
      {isEmpty(userArCsv.current) && !loading && (
        <Tooltip placement="bottom" title="Export as excel">
          {/* <Icon
                style={{ fontSize: "40px", color: "#08c" }}
                onClick={() => createUserAr()}
                type="file-excel"
                theme="filled"
              /> */}
          <FileExcelFilled style={{ fontSize: "40px", color: "#08c" }}
            onClick={() => createUserAr()} />
        </Tooltip>
      )}
      {!isEmpty(userArCsv.current) && (
        <CSVLink
          ref={downloadSheet}
          data={userArCsv.current}
          headers={headers}
          filename={"AdminUsers.csv"}
        >
          <VerticalAlignBottomOutlined style={{ fontSize: "40px" }} />
        </CSVLink>
      )}

      <Table rowKey="_id" columns={columns} dataSource={users} loading={loading} />
    </>
  );
}

export default UsersList;
