/* eslint-disable array-callback-return */
import React, { useContext, useState } from "react";
import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import { Tabs, Table, Input, Button, Popconfirm, Tooltip } from "antd";
import { CloseCircleTwoTone, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import Highlighter from "react-highlight-words";
// import get from "lodash/get";
// import isEmpty from "lodash/isEmpty";
import VerifyEmail from "config/ValidateEmail";
import filter from "lodash/filter";
import "./style.scss";
import { useMutation, useQuery } from "react-apollo";
import showNotification from "config/Notification";
import UserRoleQuery from "config/queries/userRole";
import AccountQueries from "config/queries/account";
import { UserDataContext } from "store/contexts/UserContext";

const { TabPane } = Tabs;

const UserRole = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const [openCollapse, setOpenCollapse] = useState("");
  // const accountSetting = userState.accountSettings
  // let dateFormat = !isEmpty(accountSetting)
  //   ? get(accountSetting, "dateFormat", process.env.REACT_APP_DATE_FORMAT) + " hh:mm a"
  //   : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;

  const [loading, setLoading] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [roleInvites, setRoleInvites] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [inviteEmailVal, setInviteEmailVal] = useState("");

  // console.log("user roles", userRoles);

  useQuery(UserRoleQuery.fetchUserRoles, {
    onCompleted: ({ getAccessRoles }) => {
      if (getAccessRoles.success) {
        setUserRoles(getAccessRoles.data);
      }
    },
  });

  useQuery(AccountQueries.fetchUserRoleInvites, {
    onCompleted: ({ getInvites }) => {
      if (getInvites.success) {
        setRoleInvites(getInvites.data);
      }
    },
  });

  const [revokeRoleAccess] = useMutation(AccountQueries.revokeRoleAccess, {
    onCompleted: ({ revokeRoleAccess }) => {
      if (revokeRoleAccess.success) {
        showNotification(
          "success",
          "Access Revoked!",
          "User Access was successfully revoked!"
        );
      } else {
        showNotification("error", "", revokeRoleAccess.message);
      }
    },
  });

  // Search Functions

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => node}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
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
    filterIcon: (filtered) => (
      // <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] &&
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text}
      />
    ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // Search Functions End

  const [inviteUserQuery] = useMutation(UserRoleQuery.inviteUser, {
    onCompleted: ({ sendInvitation }) => {
      if (sendInvitation.success) {
        showNotification("success", "Invitation was sent successfully", "");
      } else {
        showNotification("error", "Error Occured", sendInvitation.message);
      }
      setLoading(false);
    },
    onError: (error) => showNotification("error", "Error Occured", ""),
  });

  const inviteUser = async (data) => {
    // props.contextData.startLoading();
    const role = data.role;
    const email = data.event.target[0].value;
    setLoading(true);

    if (userState.userData.email === data.event.target[0].value?.trim()) {
      setLoading(false);

      return showNotification("error", `You can't invite yourself !`, "");
    }

    const isValidEmail = await VerifyEmail({ email });

    if (isValidEmail) {
      inviteUserQuery({
        variables: { name: role.name, email: email, roleId: role._id },
      });
    }

    if (!isValidEmail) {
      // props.contextData.endLoading();
      setLoading(false);

      showNotification("error", `${email} is not a valid email id!`, "");
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Status",
      // dataIndex: "status",
      // key: "status",
      render: (record) => (
        <p>
          {(record.status === 0 && "Pending") ||
            (record.status === 1 && "Rejected") ||
            (record.status === 2 && "Cancelled") ||
            (record.status === 3 && "Accepted") ||
            (record.status === 4 && "Access revoked")}
        </p>
      ),
      // ...getColumnSearchProps("status")
    },
    {
      title: "Invited On",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: (createdAt) => (
        <p>
          {createdAt && moment(parseInt(createdAt)).format("DD-MM-YYYY h:mm a")}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          <Popconfirm
            title="Are you sure to perform this action?"
            onConfirm={() => revokeRoleAccess({ variables: { inviteId: record.inviteId } })}
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Revoke Permission">
              {/* <Icon
                  style={{ fontSize: "1.5rem" }}
                  type="close-circle"
                  theme="twoTone"
                  twoToneColor="#eb2f96"
                /> */}
              <CloseCircleTwoTone
                style={{ fontSize: "1.5rem" }}
                twoToneColor="#eb2f96"
              />
            </Tooltip>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const userData = userState.userData;

  return (
    <>
      <div className="role">
        <div className="">
          <div className="">
            <div className="box box-form-wrapper">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="mt-4 mb-4 text-center text_head">
                    Invite or enable a new user to access your account on
                    rentoncloud
                  </h3>
                  <div
                    className="d-flex"
                    style={{ marginBottom: "35px", marginTop: "35px" }}
                  >
                    <img
                      src={
                        "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification3.png"
                      }
                      alt="img"
                    />
                    <div className="details">
                      <h4>{`${userData.firstName} ${userData.lastName}`}</h4>
                      <label className="admin admin__orange">
                        ADMINISTRATOR
                      </label>
                      <br></br>
                      <label className="email admin__blue">
                        {userData.email}
                      </label>
                    </div>
                  </div>

                  {userRoles.map((role, i) => {
                    return (
                      <Card key={role.name} style={{ marginBottom: "1rem" }}>
                        <CardHeader
                          onClick={() => setOpenCollapse(openCollapse === `open${role.name}` ? '' : `open${role.name}`)}
                          data-type="collapseLayout"
                          className="card__title"
                        >
                          <div className="d-flex">
                            <img
                              src={
                                "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification2.png"
                              }
                              alt="img"
                            />
                            <div className="details">
                              <h4>{role.name}</h4>
                              <span>{role.title}</span>
                              <br></br>
                            </div>
                          </div>
                          {openCollapse === `open${role.name}` ? (
                            <div className="details__icons active">
                              <i className="mdi mdi-chevron-up"></i>
                            </div>
                          ) : (
                            <div className="details__icons">
                              <i className="mdi mdi-chevron-down"></i>
                            </div>
                          )}
                        </CardHeader>
                        <Collapse isOpen={openCollapse === `open${role.name}`}>
                          <CardBody className="no_top_bottom_pad">
                            <Tabs defaultActiveKey="1">
                              <TabPane tab="Invite" key="1">
                                <div className="wrapper_table">
                                  <div className="d-flex">
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        setInviteEmailVal("");
                                        inviteUser({
                                          role,
                                          event: e,
                                        });
                                      }}
                                      className="form-inline"
                                    >
                                      <input
                                        type="email"
                                        onChange={(e) =>
                                          setInviteEmailVal(e.target.value)
                                        }
                                        value={role.name === 'Support' ? 'support@rentoncloud.com' : inviteEmailVal}
                                        className="form-control cardinput"
                                        disabled={role.name === 'Support'}
                                        placeholder="Enter Email Address"
                                        required
                                      />

                                      <input
                                        disabled={loading}
                                        className="btn btn-warning text-white mr-5"
                                        type="submit"
                                        value="Invite User"
                                      />
                                    </form>
                                  </div>
                                </div>
                              </TabPane>
                              <TabPane tab="Previous Invitations" key="2">
                                <Table
                                  rowKey="email"
                                  columns={columns}
                                  dataSource={filter(roleInvites, {
                                    roleName: role.name,
                                  })}
                                />
                              </TabPane>
                            </Tabs>
                          </CardBody>
                        </Collapse>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRole;
