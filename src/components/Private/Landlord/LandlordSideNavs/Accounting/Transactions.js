/* eslint-disable array-callback-return */
import React, { useState, useContext, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Spin,
  Alert,
  Modal,
  Space,
  Tag,
  Tooltip,
  // Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EuroOutlined,
  UndoOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Tab, Tabs, TabList } from "react-tabs";
import { SearchOutlined } from "@ant-design/icons";
import {
  // useQuery,
  useMutation,
} from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { isEqual, get } from "lodash";

import { GetTransactions } from "store/actions/TransactionActions";
import { TransactionContext } from "store/contexts/transactionContexts";
import CreateTransactionDrawer from "./CreateTransactionDrawer";
import TransactionDetailModal from "./TransactionDetailModal";
import EditPaymentModal from "./EditPaymentModal";
import "./styles.scss";
import TransactionQuery from "config/queries/transaction";
import menuIcon from "img/ellipsis-vertical-circle.svg";
import showNotification from "config/Notification";
// import PropertiesQuery from "config/queries/property";

const Transactions = (props) => {
  // const { Option } = Select;
  const { dispatch, state } = useContext(TransactionContext);
  const [transactionType, setTransactionType] = useState("businessIncome");
  const searchInput = useRef(null);

  const fromDashboard = props.location.fromDashboard;
  const [isFromDashBoard, setIsFromDashboard] = useState(false);
  if (fromDashboard !== undefined && fromDashboard && !isFromDashBoard) {
    setIsFromDashboard(true);
    dispatch({
      type: "OPEN_CREATE_TRANSACTION_DRAWER",
      payload: "businessExpenses",
    });
  }

  const tagColor = {
    landlord: "#2db7f5",
    renter: "#f50",
    servicepro: "#87d068",
  };

  GetTransactions(dispatch);

  const { transactions, loading } = state;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState();

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
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
    onFilter: (value, record) => {
      // console.log("filter", record, dataIndex, value.toLowerCase())
      return get(record, dataIndex)
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.select());
      }
    },
    render: (text) => {
      return isEqual(searchedColumn, dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      );
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleCreateTransactionBtnClick = (type) => {
    dispatch({ type: "OPEN_CREATE_TRANSACTION_DRAWER", payload: type });
  };

  const [markPaymentUnpaid] = useMutation(TransactionQuery.markPaymentUnpaid, {
    onCompleted: ({ markPaymentUnpaid }) => {
      if (markPaymentUnpaid.success) {
        dispatch({ type: "UPDATE_TRANSACTION", payload: markPaymentUnpaid });
        showNotification(
          "success",
          "Successfully Marked Transaction as Unpaid",
          ""
        );
      } else {
        showNotification("error", "Failed to update transaction as unpaid", "");
      }
    },
    onError: (error) => {
      showNotification(
        "error",
        `Failed to update the transaction as unpaid`,
        ""
      );
    },
  });

  function confirmModal({
    message = "Are you sure?",
    onOKFunction = (f) => f,
  }) {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: "Ok",
      onOk: onOKFunction,
      cancelText: "Cancel",
    });
  }

  const [deleteTransaction] = useMutation(TransactionQuery.deleteTransaction, {
    onCompleted: ({ deleteTransaction }) => {
      if (deleteTransaction.success) {
        dispatch({
          type: "DELETE_TRANSACTION",
          payload: deleteTransaction,
        });
        showNotification("success", "Transaction is deleted successfully", "");
      } else {
        showNotification("error", "Failed to delete the transaction", "");
      }
    },
    onError: (error) => {
      showNotification("error", `Failed to delete the transaction`, "");
    },
  });

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (status, record) => (
        <span
          className={
            status === "Paid"
              ? "status_wrap--positive"
              : "status_wrap--negative"
          }
        >
          {status}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      align: "left",
      render: (transactionDate) =>
        transactionDate ? new Date(transactionDate).toDateString() : "N/A",
    },
    {
      title: "Property",
      dataIndex: ["propertyId", "title"],
      align: "left",
      ...getColumnSearchProps(["propertyId", "title"]),
      // render: property => <span style={{ color: "blue" }} >{property.title}</span>
    },
    {
      title: "Party Name",
      align: "left",
      dataIndex: ["contactId", "receiverId"],
      render: (contact, record) => (
        <Space>
          <span>
            {contact?.firstName ||
              record?.contactId?.profileData?.firstName ||
              ""}{" "}
            {contact?.lastName ||
              record?.contactId?.profileData?.lastName ||
              ""}
          </span>
          <Tag
            color={
              tagColor[
                get(
                  contact,
                  "defaultRole",
                  record?.contactId?.receiverRole || ""
                )
              ]
            }
          >
            {get(contact, "defaultRole", record?.contactId?.receiverRole || "")}
          </Tag>
          {!Boolean(contact?.firstName || contact?.lastName) ? (
            <Tooltip title="The renter is not a member of the ROC">
              <InfoCircleOutlined />
            </Tooltip>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: ["accountId", "accountName"],
      align: "left",
      ...getColumnSearchProps(["accountId", "accountName"]),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "left",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `£ ${amount}`,
    },
    {
      title: "Action",
      align: "left",
      render: (transaction) => (
        <>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() =>
                    dispatch({
                      type: "OPEN_TRANSACTION_MODAL",
                      payload: transaction,
                    })
                  }
                  icon={<EyeOutlined />}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    dispatch({
                      type: "OPEN_CREATE_TRANSACTION_DRAWER_IN_EDIT_MODE",
                      payload: transaction,
                    })
                  }
                  icon={<EditOutlined />}
                >
                  Edit
                </Menu.Item>
                {!["paid", "submitted", "active"].includes(
                  transaction.status.toLocaleLowerCase()
                ) || transaction.paymentMethod !== "automatic" ? (
                  <Menu.Item
                    onClick={() =>
                      dispatch({
                        type: "OPEN_EDIT_PAYMENT_MODAL",
                        payload: transaction,
                      })
                    }
                    icon={<EuroOutlined />}
                  >
                    Mark as paid
                  </Menu.Item>
                ) : null}
                <Menu.Item
                  disabled={transaction.paymentMethod === "automatic"}
                  onClick={() =>
                    confirmModal({
                      message:
                        "Are you sure want to mark this payment as unpaid?",
                      onOKFunction: () =>
                        markPaymentUnpaid({
                          variables: { id: transaction._id },
                        }),
                    })
                  }
                  icon={<UndoOutlined />}
                >
                  Mark as unpaid
                </Menu.Item>

                <Menu.Item
                  disabled={["paid", "submitted", "active"].includes(
                    transaction.status.toLocaleLowerCase()
                  )}
                  onClick={() =>
                    confirmModal({
                      message: "Are you sure want to delete?",
                      onOKFunction: () =>
                        deleteTransaction({
                          variables: { id: transaction._id },
                        }),
                    })
                  }
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <img
              src={menuIcon}
              style={{
                width: "30px",
                height: "30px",
              }}
              alt="menu"
            />
          </Dropdown>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="accounting-rental_invoice_transaction transaction__wrapper ">
        <div className="container">
          <div className="row">
            <div className="main_wrap w-100">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="tabs__wrap d-flex align-items-center flex-grow-1">
                  <Tabs className="mr-2">
                    <TabList>
                      <Tab onClick={() => setTransactionType("businessIncome")}>
                        Incomes
                      </Tab>
                      <Tab
                        onClick={() => setTransactionType("businessExpenses")}
                      >
                        Expenses
                      </Tab>
                    </TabList>
                  </Tabs>
                </div>
                <div className="btns__wrapper d-flex align-items-center justify-content-sm-end justify-content-start flex-grow-1">
                  <button
                    onClick={() =>
                      handleCreateTransactionBtnClick("businessIncome")
                    }
                    className="btn btn_in ml-0"
                  >
                    {" "}
                    + Money In
                  </button>
                  <button
                    onClick={() =>
                      handleCreateTransactionBtnClick("businessExpenses")
                    }
                    className="btn btn_out"
                  >
                    {" "}
                    - Money Out
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="loading-div">
                  <Spin size="large" />
                </div>
              ) : transactions && transactions.success ? (
                <Table
                  locale={{ emptyText: "No Data!" }}
                  columns={columns}
                  dataSource={transactions.data[transactionType]}
                  rowkey="_id"
                />
              ) : (
                <Alert message="Unable to fetch data" type="error" />
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateTransactionDrawer />
      <TransactionDetailModal />
      <EditPaymentModal />
    </>
  );
};

export default Transactions;
