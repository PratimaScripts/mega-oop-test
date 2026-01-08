/* eslint-disable array-callback-return */
import React, { useState, useContext, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Modal,
  Space,
  Tooltip,
  Badge,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  EuroOutlined,
  UndoOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Tab, Tabs, TabList } from "react-tabs";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { isEqual, get } from "lodash";
import { pdf } from "@react-pdf/renderer";

import { DepositContext } from "./rentalDepositContexts";
import CreateTransactionDrawer from "./CreateDepositDrawer";
import DepositDetailModal from "./DepositDetailModal";
import DepositPaymentModal from "./DepositPaymentModal";
import "./styles.scss";
// import TransactionQuery from "config/queries/transaction";
import { getRentalDepositList } from "config/queries/rentalDeposit";
import menuIcon from "img/ellipsis-vertical-circle.svg";
import showNotification from "config/Notification";
// import PropertiesQuery from "config/queries/property";
import {
  releaseDeposit,
  markDepositUnpaid,
  deleteDeposit,
} from "config/queries/rentalDeposit";
import DepositPDF from "./DepositPDF";

const RentalDeposit = (props) => {
  // const { Option } = Select;
  const { dispatch, state } = useContext(DepositContext);
  const [transactionType, setTransactionType] = useState("businessIncome");
  const searchInput = useRef(null);

  const fromDashboard = props.location.fromDashboard;
  const [isFromDashBoard, setIsFromDashboard] = useState(false);
  if (fromDashboard !== undefined && fromDashboard && !isFromDashBoard) {
    setIsFromDashboard(true);
    dispatch({
      type: "OPEN_CREATE_DEPOSIT_DRAWER",
      payload: "businessExpenses",
    });
  }

  const {
    // deposits, loading,
    depositsIn,
    depositsOut,
  } = state;
  // const allTransactions = useRef(deposits);
  const currentDeposit = useRef();

  const { loading: depositLoading, error: depositError } = useQuery(
    getRentalDepositList,
    {
      onCompleted: ({ getRentalDepositList }) => {
        if (get(getRentalDepositList, "success", false)) {
          console.log("deposits", getRentalDepositList?.data);
          dispatch({
            type: "GET_DEPOSITS",
            payload: getRentalDepositList?.data,
          });
        }
      },
    }
  );

  // console.log("Transactions", deposits)
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState();
  // const depositType = transactionType === 'businessIncome' ? 'Security Deposit In' : 'Security Deposit Out';

  // const {
  //   loading: propertyLoading,
  //   error: propertyError,
  //   data: propertyData,
  // } = useQuery(PropertiesQuery.fetchProperty);

  useMutation(releaseDeposit, {
    onCompleted: ({ releaseDeposit }) => {
      if (get(releaseDeposit, "success", false)) {
        showNotification("success", "Deposit Released Successfully", "");
      } else {
        showNotification(
          "error",
          "Failed to release deposit",
          get(releaseDeposit, "message", "")
        );
      }
    },
    onError: (error) => {
      showNotification(
        "error",
        "Failed to release deposit",
        "Reload the page and try again!"
      );
    },
  });

  const [markDepositUnpaidMutation] = useMutation(markDepositUnpaid, {
    onCompleted: ({ markDepositUnpaid }) => {
      if (get(markDepositUnpaid, "success", false)) {
        dispatch({ type: "UPDATE_DEPOSIT", payload: markDepositUnpaid.data });
        showNotification("success", "Deposit marked as unpaid", "");
      } else {
        showNotification(
          "error",
          "Failed to mark deposit as unpaid",
          get(markDepositUnpaid, "message", "")
        );
      }
    },
    onError: (error) => {
      showNotification(
        "error",
        "Failed to mark deposit as unpaid",
        "Reload the page and try again!"
      );
    },
  });

  const [deleteDepositMutation] = useMutation(deleteDeposit, {
    onCompleted: ({ deleteDeposit }) => {
      if (get(deleteDeposit, "success", false)) {
        dispatch({ type: "DELETE_DEPOSIT", payload: deleteDeposit.data });
        showNotification("success", "Deposit deleted successfully", "");
      } else {
        showNotification(
          "error",
          "Failed to mark deposit as unpaid",
          get(deleteDeposit, "message", "")
        );
      }
    },
    onError: (error) => {
      showNotification(
        "error",
        "Failed to mark deposit as unpaid",
        "Reload the page and try again!"
      );
    },
  });

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

  const generatePdfDocument = async (deposit) => {
    const blob = await pdf(<DepositPDF deposit={deposit} />).toBlob();
    const file = new Blob([blob], { type: "application/pdf" });
    window.open(window.URL.createObjectURL(file), "_blank");
  };

  const handleCreateDepositBtnClick = (type) => {
    dispatch({ type: "OPEN_CREATE_DEPOSIT_DRAWER", payload: type });
  };

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

  const paidStatusElement = (status) => (
    <span
      className={
        status === "Paid" ? "status_wrap--positive" : "status_wrap--negative"
      }
    >
      {status}
    </span>
  );

  const columns = [
    {
      title: "Status",
      dataIndex: ["transaction", "status"],
      align: "center",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (status, row, index) => {
        // console.log("row", row, index);
        return row.markPaidRequested ? (
          <Tooltip
            placement="rightTop"
            title={"Payment Made Request By Renter"}
          >
            <Badge dot>{paidStatusElement(status)}</Badge>
          </Tooltip>
        ) : (
          paidStatusElement(status)
        );
      },
    },
    {
      title: "Date",
      dataIndex: ["transaction", "transactionDate"],
      align: "left",
      // ...getColumnSearchProps("transactionDate"),
      render: (transactionDate) => new Date(transactionDate).toDateString(),
    },
    {
      title: "Reference Id",
      dataIndex: "referenceId",
      align: "left",
    },
    {
      title: "Property",
      dataIndex: ["transaction", "propertyId", "title"],
      align: "left",
      ...getColumnSearchProps(["propertyId", "title"]),
      // render: property => <span style={{ color: "blue" }} >{property.title}</span>
    },
    {
      title: "Renter Name",
      align: "left",
      dataIndex: ["transaction", "contactId"],
      // ...getColumnSearchProps("propertyId.title"),
      render: (contact) => (
        <Space>
          <span>
            {contact?.firstName} {contact?.lastName}
          </span>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: ["transaction", "accountId", "accountName"],
      align: "left",
      ...getColumnSearchProps(["accountId", "accountName"]),
      // render: account => <span style={{ color: "blue" }} >{account.accountName}</span>
    },
    {
      title: "Type",
      dataIndex: "depositType",
      align: "left",
    },
    {
      title: "Protection Scheme",
      dataIndex: "depositProtectionScheme",
      align: "left",
    },
    {
      title: "Amount",
      dataIndex: ["transaction", "amount"],
      align: "left",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, row) =>
        row.depositReleaseRequested ? (
          <Tooltip placement="rightTop" title={"Deposit Release Requested"}>
            <Badge dot>{`£ ${amount}`}</Badge>
          </Tooltip>
        ) : (
          `£ ${amount}`
        ),
    },
    {
      title: "Action",
      align: "left",
      render: (deposit) => (
        <>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    currentDeposit.current = deposit;
                    dispatch({
                      type: "OPEN_DEPOSIT_MODAL",
                      payload: deposit,
                    });
                  }}
                  icon={<EyeOutlined />}
                >
                  View
                </Menu.Item>

                {transactionType !== "businessExpenses" && (
                  <Menu.Item
                    onClick={() =>
                      confirmModal({
                        message: "Are you sure want to release this deposit?",
                        onOKFunction: () =>
                          dispatch({
                            type: "INITIATE_RELEASE_DEPOSIT",
                            payload: deposit,
                          }),
                      })
                    }
                    icon={<EditOutlined />}
                  >
                    {deposit.depositReleaseRequested ? (
                      <Tooltip
                        placement="rightTop"
                        title={"Deposit mark paid requested"}
                      >
                        <Badge dot>Release Deposit</Badge>
                      </Tooltip>
                    ) : (
                      "Release Deposit"
                    )}
                  </Menu.Item>
                )}

                <Menu.Item
                  onClick={() =>
                    dispatch({
                      type: "OPEN_CREATE_DEPOSIT_DRAWER_IN_EDIT_MODE",
                      payload: deposit,
                    })
                  }
                  icon={<EditOutlined />}
                >
                  Edit
                </Menu.Item>

                <Menu.Item
                  onClick={() => {
                    currentDeposit.current = deposit;
                    dispatch({
                      type: "OPEN_EDIT_PAYMENT_MODAL",
                      payload: deposit,
                    });
                  }}
                  icon={<EuroOutlined />}
                >
                  {deposit.markPaidRequested ? (
                    <Tooltip
                      placement="rightTop"
                      title={"Deposit mark paid requested"}
                    >
                      <Badge dot>Mark as paid</Badge>
                    </Tooltip>
                  ) : (
                    "Mark as paid"
                  )}
                </Menu.Item>

                <Menu.Item
                  onClick={() =>
                    confirmModal({
                      message:
                        "Are you sure want to mark this payment as unpaid?",
                      onOKFunction: () =>
                        markDepositUnpaidMutation({
                          variables: { depositId: deposit._id },
                        }),
                    })
                  }
                  icon={<UndoOutlined />}
                >
                  Mark as unpaid
                </Menu.Item>

                <Menu.Item
                  onClick={() => generatePdfDocument(deposit)}
                  icon={<ExportOutlined />}
                >
                  Export as PDF
                </Menu.Item>

                <Menu.Item
                  onClick={() =>
                    confirmModal({
                      message: "Are you sure want to delete?",
                      onOKFunction: () =>
                        deleteDepositMutation({
                          variables: { depositId: deposit._id },
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
              <div className="import__wrapper d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex align-items-center flex-grow-1 mr-2">
                  <Tabs>
                    <TabList>
                      <Tab onClick={() => setTransactionType("businessIncome")}>
                        Deposit-In
                      </Tab>
                      <Tab
                        onClick={() => setTransactionType("businessExpenses")}
                      >
                        Deposit-Out
                      </Tab>
                    </TabList>
                  </Tabs>
                </div>
                <div className="btns__wrapper">
                  <button
                    onClick={() =>
                      handleCreateDepositBtnClick("businessIncome")
                    }
                    className="btn btn_in ml-0"
                  >
                    {" "}
                    + Deposit In
                  </button>
                  <button
                    onClick={() =>
                      handleCreateDepositBtnClick("businessExpenses")
                    }
                    className="btn btn_out mr-0"
                  >
                    {" "}
                    - Deposit Out
                  </button>
                </div>
              </div>
              <Table
                locale={{ emptyText: "No Data!" }}
                columns={columns}
                loading={depositLoading}
                dataSource={
                  depositError
                    ? []
                    : transactionType === "businessIncome"
                    ? depositsIn
                    : depositsOut
                }
                rowkey="_id"
              />
            </div>
          </div>
        </div>
      </div>
      <CreateTransactionDrawer />
      <DepositDetailModal />
      <DepositPaymentModal depositDetail={currentDeposit.current} />
    </>
  );
};

export default RentalDeposit;
