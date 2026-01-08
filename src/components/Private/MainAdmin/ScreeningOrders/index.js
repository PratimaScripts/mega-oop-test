import React, { useState, useContext } from "react";
import {
  Table,
  // Modal,
  Input,
  Button,
  Popconfirm,
  Tooltip,
  Tag,
} from "antd";
import {
  SearchOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

import moment from "moment";
import Highlighter from "react-highlight-words";
import { useMutation, useQuery } from "react-apollo";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import "./style.scss";
import AdminQueries from "config/queries/admin";
import showNotification from "config/Notification";
import { UserDataContext } from "store/contexts/UserContext";


const ScreeningOrders = () => {
  const [screeningOrders, setScreeningOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { screeningOrders } = props;
  const [searchText, setSearchText] = useState('');
  // const getFileExtension3 = filename => {
  //   return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  // };
  const { state } = useContext(UserDataContext)
  const accountSetting = state.accountSettings
  let dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat") + " hh:mm a"
    : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;
  // const getFileExtension3 = filename => {
  //   return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  // };

  useQuery(AdminQueries.fetchScreeningList, {
    onCompleted: ({ fetchScreeningList }) => {
      if (fetchScreeningList.success) {
        setScreeningOrders(fetchScreeningList.data);
      }
      setLoading(false);
    },
  });

  const [updateDocStatusMutation] = useMutation(
    AdminQueries.changeScreeningStatus,
    {
      onCompleted: ({ changeScreeningStatus }) => {
        if (changeScreeningStatus.success) {
          showNotification("success", "Order Status Updated!", "");
          setScreeningOrders(
            screeningOrders.map((order) =>
              order._id === changeScreeningStatus.data._id
                ? changeScreeningStatus.data
                : order
            )
          );
        } else {
          showNotification(
            "error",
            "An error occured",
            changeScreeningStatus.message
          );
        }
      },
    }
  );

  // const previewDocument = async document => {
  //   let url = get(document, "supportingDocuments.documentUrl");
  //   let type = await getFileExtension3(url);
  //   // console.log(type, url);
  //   Modal.info({
  //     title: get(document, "supportingDocuments.document"),
  //     width: 900,
  //     content: (
  //       <>
  //         {(type === "png" || type === "jpg" || type === "jpeg") && (
  //           <img src={url} alt="preview of doc" />
  //         )}
  //       </>
  //     ),
  //     onOk() { }
  //   });
  // };

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
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "black" }} />
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

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      ...getColumnSearchProps("role"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status) =>
        status === "Pending" ? (
          <Tag color="red">{status}</Tag>
        ) : (
          <Tag color="green">{status}</Tag>
        ),
    },
    {
      title: "Report Summery",
      dataIndex: "reportSummery",
      key: "reportSummery",
      ...getColumnSearchProps("reportSummery"),
      render: (reportSummery) =>
        reportSummery === "Fail" ? (
          <Tag color="red">{reportSummery}</Tag>
        ) : reportSummery === "Caution" ? (
          <Tag color="blue">{reportSummery}</Tag>
        ) : (
          <Tag color="green">{reportSummery}</Tag>
        ),
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      align: "center",
      render: createdAt => (
        <>{createdAt && moment(createdAt).format(dateFormat)}</>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          <Popconfirm
            title="Are you sure to approve this Screening Order?"
            onConfirm={() =>
              updateDocStatusMutation({
                variables: {
                  screeningId: record._id,
                  status: "Pass",
                },
              })
            }
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Approve Order">
              {/* <Icon
                  theme="twoTone"
                  twoToneColor="#52c41a"
                  style={{ fontSize: "1.5rem" }}
                  type="check-circle"
                /> */}
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "1.5rem" }}
              />
            </Tooltip>
          </Popconfirm>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Popconfirm
            title="Are you sure to reject this Screening Order??"
            onConfirm={() =>
              updateDocStatusMutation({
                variables: {
                  screeningId: record._id,
                  status: "Fail",
                },
              })
            }
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Reject Order">
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

  // console.log(
  //   "screeningOrdersscreeningOrdersscreeningOrders",
  //   screeningOrders
  // );
  return (
    <>
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={screeningOrders}
        rowClassName={(record, index) =>
          !isEmpty(record.supportingDocuments) && "highlight__coral"
        }
        expandedRowRender={(record) => (
          <>
            {!isEmpty(record.supportingDocuments) && (
              <>
                {record.supportingDocuments.map((doc, i) => {
                  return (
                    <>
                      <div className="id__wrap">
                        <p>
                          <b>{get(doc, "documentNumber")}</b>
                        </p>
                        <a href={get(doc, "documentUrl")}>
                          {get(doc, "document", "No URL available")}
                        </a>
                        <span>
                          <Popconfirm
                            title="Are you sure to approve this document?"
                            onConfirm={() =>
                              updateDocStatusMutation({
                                variables: {
                                  screeningId: record._id,
                                  status: "Approved",
                                },
                              })
                            }
                            onCancel={null}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Tooltip title="Approve Document">
                              {/* <Icon
                                  theme="twoTone"
                                  twoToneColor="#52c41a"
                                  style={{ fontSize: "1.5rem" }}
                                  type="check-circle"
                                /> */}
                              <CheckCircleTwoTone
                                twoToneColor="#52c41a"
                                style={{ fontSize: "1.5rem" }}
                              />
                            </Tooltip>
                          </Popconfirm>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <Popconfirm
                            title="Are you sure to reject this document?"
                            onConfirm={() =>
                              updateDocStatusMutation({
                                variables: {
                                  screeningId: record._id,
                                  status: "Reject",
                                },
                              })
                            }
                            onCancel={null}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Tooltip title="Reject Document">
                              {/* <Icon
                                  style={{ fontSize: "1.5rem" }}
                                  type="close-circle"
                                  theme="twoTone"
                                  twoToneColor="#eb2f96"
                                /> */}

                              <CloseCircleTwoTone
                                twoToneColor="#eb2f96"
                                style={{ fontSize: "1.5rem" }}
                              />
                            </Tooltip>
                          </Popconfirm>
                        </span>
                        <hr />
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </>
        )}
      />
    </>
  );
};

export default ScreeningOrders;
