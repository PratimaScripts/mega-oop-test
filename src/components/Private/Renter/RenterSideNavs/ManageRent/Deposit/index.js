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
  ExclamationCircleOutlined,
  ExportOutlined,
  EuroOutlined,
} from "@ant-design/icons";
import { Tab, Tabs, TabList } from "react-tabs";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { isEqual, get } from "lodash";
import { pdf } from "@react-pdf/renderer";

import { RenterDepositContext } from "./renterDepositContexts";
// import CreateTransactionDrawer from "./CreateDepositDrawer";
import DepositDetailModal from "./DepositDetailModal";
// import DepositPaymentModal from "./DepositPaymentModal";
import "./styles.scss";
// import TransactionQuery from "config/queries/transaction";
import menuIcon from "img/ellipsis-vertical-circle.svg";
import {
  getRenterDepositList,
  markDepositPaidByRenter,
  markDepositUnpaidByRenter,
  makeDepositReleaseRequest,
} from "config/queries/rentalDeposit";
import DepositPDF from "components/Private/Landlord/LandlordSideNavs/Accounting/RentalDeposit/DepositPDF";
import showNotification from "config/Notification";

const RentarDeposit = (props) => {
  // const { Option } = Select;
  const { dispatch, state } = useContext(RenterDepositContext);
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

  const { depositsIn, depositsOut } = state;

  const currentDeposit = useRef();

  const { loading: depositLoading, error: depositError } = useQuery(
    getRenterDepositList,
    {
      onCompleted: ({ getRenterDepositList }) => {
        if (get(getRenterDepositList, "success", false)) {
          console.log("deposits", getRenterDepositList?.data);
          dispatch({
            type: "GET_DEPOSITS",
            payload: getRenterDepositList?.data,
          });
        }
      },
    }
  );

  const [markDepositPaidByRenterMutation] = useMutation(
    markDepositPaidByRenter,
    {
      onCompleted: ({ markDepositPaidByRenter }) => {
        if (get(markDepositPaidByRenter, "success", false)) {
          dispatch({
            type: "UPDATE_DEPOSIT",
            payload: markDepositPaidByRenter.data,
          });
          showNotification(
            "success",
            "Deposit requested to be marked as paid",
            ""
          );
        } else {
          showNotification(
            "error",
            "Failed to request deposit as marked as paid",
            get(markDepositPaidByRenter, "message", "")
          );
        }
      },
      onError: (error) => {
        showNotification(
          "error",
          "Failed to request deposit as marked as paid",
          "Reload the page and try again!"
        );
      },
    }
  );

  const [markDepositUnpaidByRenterMutation] = useMutation(
    markDepositUnpaidByRenter,
    {
      onCompleted: ({ markDepositUnpaidByRenter }) => {
        if (get(markDepositUnpaidByRenter, "success", false)) {
          dispatch({
            type: "UPDATE_DEPOSIT",
            payload: markDepositUnpaidByRenter.data,
          });
          showNotification(
            "success",
            "Deposit requested to be marked as unpaid",
            ""
          );
        } else {
          showNotification(
            "error",
            "Failed to request deposit as marked as unpaid",
            get(markDepositUnpaidByRenter, "message", "")
          );
        }
      },
      onError: (error) => {
        showNotification(
          "error",
          "Failed to request deposit as marked as unpaid",
          "Reload the page and try again!"
        );
      },
    }
  );

  const [makeDepositReleaseRequestMutation] = useMutation(
    makeDepositReleaseRequest,
    {
      onCompleted: ({ makeDepositReleaseRequest }) => {
        if (get(makeDepositReleaseRequest, "success", false)) {
          dispatch({
            type: "UPDATE_DEPOSIT",
            payload: makeDepositReleaseRequest.data,
          });
          showNotification(
            "success",
            "Deposit requested to be marked as unpaid",
            ""
          );
        } else {
          showNotification(
            "error",
            "Failed to mark deposit as paid",
            get(makeDepositReleaseRequest, "message", "")
          );
        }
      },
      onError: (error) => {
        showNotification(
          "error",
          "Failed to mark deposit as paid",
          "Reload the page and try again!"
        );
      },
    }
  );

  // console.log("Transactions", deposits)
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

  const generatePdfDocument = async (deposit) => {
    const blob = await pdf(<DepositPDF deposit={deposit} />).toBlob();
    const file = new Blob([blob], { type: "application/pdf" });
    window.open(window.URL.createObjectURL(file), "_blank");
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
        console.log("row", row, index);
        return row.markPaidRequested ? (
          <Tooltip placement="rightTop" title={"Payment Made Requested"}>
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
      title: "Landlord Name",
      align: "left",
      dataIndex: ["transaction", "userId"],
      // ...getColumnSearchProps("propertyId.title"),
      render: (user) => (
        <Space>
          <span>
            {user?.firstName} {user?.lastName}
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
              <>
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      currentDeposit.current = deposit;
                      dispatch({
                        type: "OPEN_DEPOSIT_MODAL",
                        payload: deposit,
                      });
                    }}
                  >
                    <EyeOutlined />
                    View
                  </Menu.Item>
                  <Menu.Item onClick={() => generatePdfDocument(deposit)}>
                    <ExportOutlined />
                    Export as PDF
                  </Menu.Item>
                  {deposit.markPaidRequested ? (
                    <Menu.Item
                      onClick={() =>
                        confirmModal({
                          message:
                            "Are you sure want to request this deposit to be marked as unpiad?",
                          onOKFunction: () =>
                            markDepositUnpaidByRenterMutation({
                              variables: { depositId: deposit._id },
                            }),
                        })
                      }
                    >
                      <EuroOutlined /> Unpaid Request
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      onClick={() =>
                        confirmModal({
                          message:
                            "Are you sure want to request this deposit to be marked as paid?",
                          onOKFunction: () =>
                            markDepositPaidByRenterMutation({
                              variables: { depositId: deposit._id },
                            }),
                        })
                      }
                    >
                      <EuroOutlined /> Paid Request
                    </Menu.Item>
                  )}

                  {deposit.depositIncomeType === "deposit-in" && (
                    <Menu.Item
                      onClick={() =>
                        confirmModal({
                          message:
                            "Are you sure want to request this deposit to be released?",
                          onOKFunction: () =>
                            makeDepositReleaseRequestMutation({
                              variables: { depositId: deposit._id },
                            }),
                        })
                      }
                    >
                      <EuroOutlined /> Release Request
                    </Menu.Item>
                  )}
                </Menu>
              </>
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
              <div className="import__wrapper">
                <ul>
                  <li>
                    <div className="tabs__wrap">
                      <Tabs>
                        <TabList>
                          <Tab
                            onClick={() => setTransactionType("businessIncome")}
                          >
                            Deposit-In
                          </Tab>
                          <Tab
                            onClick={() =>
                              setTransactionType("businessExpenses")
                            }
                          >
                            Deposit-Out
                          </Tab>
                        </TabList>
                      </Tabs>
                    </div>
                  </li>
                  <li>
                    <div className="btns__wrapper">
                      {/* <button className="btn btn_csv">Import from CSV</button> */}
                      {/* <div className="form-group property_width">
                      <Select
                        placeholder="All Property"
                        defaultValue='all'
                        className="w-100"
                        size="large"
                        loading={propertyLoading}
                        // onChange={(value) => filterInvoiceByProperty(value)}

                  >
                    <Option key={1} value='all'>All Property</Option>
                    {!propertyError && propertyData && propertyData.fetchProperty.success && propertyData.fetchProperty.data.map(property => (property.address &&
                      <Option
                        key={property.propertyId}
                        value={property.title}
                      >{property.title}</Option>
                    ))}
                  </Select>
                      </div> */}
                    </div>
                  </li>
                </ul>
              </div>
              <br />
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
      <DepositDetailModal />
      {/* <CreateTransactionDrawer />
      
      <DepositPaymentModal depositDetail={currentDeposit.current}/> */}
    </>
  );
};

export default RentarDeposit;
