import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  DatePicker,
  Menu,
  Space,
  Modal,
  Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  EuroOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  // SendOutlined,
} from "@ant-design/icons";
// import { CSVLink } from "react-csv";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { pdf } from "@react-pdf/renderer";
import EditPaymentModal from "./Invoice/EditInvoicePaymentModal";
import moment from "moment";
// import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import useForceUpdate from "use-force-update";
import NProgress from "nprogress";

import "./rentalstyle.scss";

import Invoice from "./Invoice/Invoice";
import { InvoiceContext } from "store/contexts/invoiceContexts";
// import { GetInvoices } from 'store/actions/InvoiceActions';
import "./styles.scss";
import InvoiceQuery from "config/queries/invoice";
import menuIcon from "img/ellipsis-vertical-circle.svg";
import showNotification from "config/Notification";
import InvoicePDF from "./Invoice/InvoicePDF";
import InvoiceView from "./Invoice/InvoiceView";
import PropertiesQuery from "config/queries/property";
import { useHistory } from "react-router-dom";

const Rental = () => {
  const history = useHistory();

  const { dispatch, state } = useContext(InvoiceContext);
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const { loading } = useQuery(InvoiceQuery.getRentalInvoices, {
    onCompleted: ({ getRentalInvoices }) => {
      if (getRentalInvoices.success) {
        let payload = getRentalInvoices.data || [];

        payload = payload.map((invoice) => {
          let children = [];
          if (invoice?.recurringInvoices?.length) {
            children = invoice.recurringInvoices.map((recurringInvoice) => ({
              ...invoice,
              ...recurringInvoice,
            }));
          }
          return { ...invoice, ...(children?.length ? { children } : {}) };
        });

        dispatch({
          type: "GET_INVOICES",
          payload,
        });
      }
    },
    onError: (error) => showNotification("error", error.message),
  });

  const {
    invoices,
    openCreateInvoiceModal,

    openInvoiceModal,
  } = state;
  const [searchText, setSearchText] = useState("");

  const invoiceList = useRef([]);

  const amountDetails = useRef({
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    overdueAmount: 0,
  });

  const forceUpdate = useForceUpdate();

  const [invoiceNum, setInvoiceNum] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    invoiceList.current = [...invoices];

    if (Array.isArray(invoiceList.current) && invoiceList.current.length > 0) {
      dispatch({ type: "SET_LOADING", payload: true });
      let paidAmount = 0;
      let unpaidAmount = 0;
      let overdueAmount = 0;
      let totalAmount = 0;
      let invoiceNumArr = [];
      invoiceList.current.forEach((item) => {
        invoiceNumArr.push(item.invoiceNum);
        if (item.status === "Paid") {
          paidAmount += item.amount;
          totalAmount += item.amount;
        } else if (item.status === "Overdue") {
          overdueAmount += item.amount;
          unpaidAmount += item.amount;
          totalAmount += item.amount;
        } else {
          unpaidAmount += item.amount;
          totalAmount += item.amount;
        }
      });

      setInvoiceNum(invoiceNumArr?.join(","));

      amountDetails.current = {
        totalAmount,
        paidAmount,
        unpaidAmount,
        overdueAmount,
      };
      dispatch({ type: "SET_LOADING", payload: false });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices]);

  useQuery(
    InvoiceQuery.emailInvoiceByInvoiceNumber,
    {
      variables: {
        invoiceNum,
      },
    },
    {
      onCompleted: ({ emailInvoiceByInvoiceNumber }) => {
        if (get(emailInvoiceByInvoiceNumber, "success", false)) {
          showNotification("success", "Invoice sent successfully", "");
        } else {
          showNotification("info", "Failed to send email", "Try Again!");
        }
        NProgress.done();
      },
      onError: (error) => {
        NProgress.done();
        showNotification(
          "error",
          "Failed to change status of Booking",
          "Reload the page and Try again"
        );
      },
    }
  );

  const {
    loading: propertyLoading,
    error: propertyError,
    data: propertyData,
  } = useQuery(PropertiesQuery.fetchProperty);

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => node}
          placeholder={`Search ${title}`}
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

  const generatePdfDocument = async (invoiceId) => {
    showNotification("info", "Generating the pdf...");
    setGeneratingPDF(true);
    getInvoiceById({ variables: { invoiceId } });
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

  const [deleteRentalInvoice] = useMutation(InvoiceQuery.deleteRentalInvoice, {
    onCompleted: ({ deleteRentalInvoice }) => {
      if (deleteRentalInvoice.success) {
        dispatch({
          type: "DELETE_INVOICE",
          payload: deleteRentalInvoice.data,
        });
        showNotification("success", deleteRentalInvoice.message, "");
      } else {
        showNotification("error", "Failed to delete the transaction", "");
      }
    },
    onError: (error) => {
      showNotification("error", `Failed to delete the transaction`, "");
    },
  });

  const filterInvoiceByProperty = (propertyTitle) => {
    propertyTitle === "all"
      ? (invoiceList.current = invoices.data)
      : (invoiceList.current = invoices.data?.filter(
          (invoice) => invoice?.propertyId?.title === propertyTitle
        ));
    forceUpdate();
  };

  const filterInvoiceByStatus = (status) => {
    if (status === "Recurring") {
      invoiceList.current = invoices.data?.filter(
        (invoice) => invoice.hasAutoRecurring
      );
    } else {
      status === "all"
        ? (invoiceList.current = invoices.data)
        : (invoiceList.current = invoices.data?.filter(
            (invoice) => invoice.status === status
          ));
    }
    forceUpdate();
  };

  const filterInvoiceByDate = (date) => {
    date === "all"
      ? (invoiceList.current = invoices.data)
      : (invoiceList.current = invoices.data?.filter((invoice) =>
          moment(invoice.transactionDate).isBetween(date[0]._d, date[1]._d)
        ));
    forceUpdate();
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (status) => (
        <span
          className={`${
            ["paid", "submitted", "active"].includes(status.toLocaleLowerCase())
              ? "status_wrap--positive"
              : "status_wrap--negative"
          } text-capitalize`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      align: "left",
      render: (invoiceDate) => moment(invoiceDate).format("YYYY-MM-DD"),
    },
    {
      title: "Invoice",
      dataIndex: "invoiceNum",
      align: "left",
      ...getColumnSearchProps("invoiceNum", "Invoice #"),
      render: (_id) => <span style={{ color: "blue" }}>{_id}</span>,
    },
    {
      title: "Property",
      dataIndex: ["property", "title"],
      align: "center",
      ...getColumnSearchProps(["property", "title"]),
      render: (property) => <span style={{ color: "blue" }}>{property}</span>,
    },
    {
      title: "Party Name",
      align: "center",
      dataIndex: ["contact"],
      render: (contact) => (
        <Space>
          <span>
            {contact?.user?.firstName} {contact?.user?.lastName}
          </span>
        </Space>
      ),
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
      render: (transaction, row) => (
        <>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    if (
                      transaction.hasAutoRecurring &&
                      transaction.paymentMethod === "automatic"
                    ) {
                      history.push("/landlord/recurring-invoice/" + row._id);
                    } else {
                      dispatch({
                        type: "OPEN_INVOICE_MODAL",
                      });
                      getInvoiceById({ variables: { invoiceId: row._id } });
                    }
                  }}
                  icon={<EyeOutlined />}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    dispatch({
                      type: "UPDATE_INVOICE",
                      payload: {},
                    });
                    getInvoiceById({ variables: { invoiceId: row._id } });
                  }}
                  icon={<EditOutlined />}
                >
                  Edit
                </Menu.Item>
                {transaction.paymentMethod !== "automatic" && (
                  <Menu.Item
                    onClick={() =>
                      dispatch({
                        type: "OPEN_EDIT_PAYMENT_MODAL",
                        payload: transaction,
                      })
                    }
                    disabled={transaction.doneByLandlordOn}
                    icon={<EuroOutlined />}
                  >
                    Mark as paid
                  </Menu.Item>
                )}
                <Menu.Item
                  onClick={() => generatePdfDocument(row._id)}
                  icon={<ExportOutlined />}
                >
                  Export as PDF
                </Menu.Item>

                <Menu.Item
                  onClick={() =>
                    confirmModal({
                      message: "Are you sure want to delete?",
                      onOKFunction: () =>
                        deleteRentalInvoice({
                          variables: {
                            id: transaction._id,
                          },
                        }),
                    })
                  }
                  icon={<DeleteOutlined />}
                  disabled={Boolean(
                    transaction.gocardlessPayment ||
                      transaction.gocardlessSubscription ||
                      ["Paid", "Active"].includes(transaction.status) ||
                      transaction.isChild
                  )}
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

  const handleCreateInvoiceBtnClick = () => {
    dispatch({
      type: "OPEN_CREATE_TRANSACTION_DRAWER",
      payload: "businessIncome",
    });
  };

  const [getInvoiceById] = useLazyQuery(InvoiceQuery.getRentalInvoiceById, {
    onCompleted: async ({ getRentalInvoiceById }) => {
      if (getRentalInvoiceById.success) {
        if (generatingPDF) {
          setGeneratingPDF(false);
          const blob = await pdf(
            <InvoicePDF invoice={getRentalInvoiceById.data} />
          ).toBlob();
          const file = new Blob([blob], { type: "application/pdf" });
          window.open(window.URL.createObjectURL(file), "_blank");
        }
        dispatch({
          type: "VIEW_INVOICE_DETAILS",
          payload: getRentalInvoiceById.data,
        });
      } else {
        if (generatingPDF) {
          setGeneratingPDF(false);
        }
        showNotification(
          "error",
          getRentalInvoiceById.message || "Something went wrong!"
        );
        dispatch({
          type: "CLOSE_INVOICE_MODAL",
        });
      }
    },
  });

  return (
    <>
      <div className="accounting-rental_invoice_transaction">
        <div className="container">
          <div className="row">
            <div className="main_wrap w-100">
              <div className="detailed_info mb-3">
                <ul>
                  <li className="detail_item">
                    <div className="d-flex">
                      <div className="pounds_icon">
                        <i className="fas fa-pound-sign"></i>
                      </div>
                      <div className="details">
                        <h4 className="status">Total</h4>
                        <h4 className="amount">
                          £ {amountDetails.current.totalAmount}
                        </h4>
                      </div>
                    </div>
                  </li>
                  <li className="detail_item">
                    <div className="d-flex">
                      <div className="pounds_icon">
                        <i className="fas fa-pound-sign"></i>
                      </div>
                      <div className="details">
                        <h4 className="status">PAID</h4>
                        <h4 className="amount">
                          £ {amountDetails.current.paidAmount}
                        </h4>
                      </div>
                    </div>
                  </li>
                  <li className="detail_item">
                    <div className="d-flex">
                      <div className="pounds_icon">
                        <i className="fas fa-pound-sign"></i>
                      </div>
                      <div className="details">
                        <h4 className="status">UNPAID</h4>
                        <h4 className="amount">
                          £ {amountDetails.current.unpaidAmount}
                        </h4>
                      </div>
                    </div>
                  </li>
                  <li className="detail_item">
                    <div className="d-flex">
                      <div className="pounds_icon">
                        <i className="fas fa-pound-sign"></i>
                      </div>
                      <div className="details">
                        <h4 className="status">OVERDUE</h4>
                        <h4 className="amount">
                          £ {amountDetails.current.overdueAmount}
                        </h4>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="search__wrappers">
                <div className="d-flex">
                  <div className="form-group property_width">
                    <Select
                      placeholder="All Property"
                      defaultValue="all"
                      className="w-100"
                      size="large"
                      loading={propertyLoading}
                      onChange={(value) => filterInvoiceByProperty(value)}
                    >
                      <Option key={1} value="all">
                        All Property
                      </Option>
                      {!propertyError &&
                        propertyData &&
                        propertyData.fetchProperty.success &&
                        propertyData.fetchProperty.data.map(
                          (property) =>
                            property.address && (
                              <Option
                                key={property.propertyId}
                                value={property.title}
                              >
                                {property.title}
                              </Option>
                            )
                        )}
                    </Select>
                  </div>

                  <div className="form-group status_width">
                    <Select
                      placeholder="All Status"
                      defaultValue="all"
                      size="large"
                      onChange={(value) => filterInvoiceByStatus(value)}
                    >
                      <Option key={1} value="all">
                        All
                      </Option>
                      <Option key={2} value="Paid">
                        Paid
                      </Option>
                      <Option key={3} value="Due">
                        Due
                      </Option>
                      <Option key={4} value="Overdue">
                        Overdue
                      </Option>
                      <Option key={5} value="Recurring">
                        Recurring
                      </Option>
                    </Select>
                  </div>

                  <div className="form-group from_to_width">
                    <div className="d-flex mb-3">
                      <RangePicker
                        size="large"
                        onChange={(value) => filterInvoiceByDate(value)}
                      />
                    </div>
                  </div>

                  <div className="btn__wrapper">
                    <Button
                      size="large"
                      icon={<PlusCircleOutlined />}
                      style={{
                        background: "#4bb821",
                        color: "#fff",
                        borderRadius: "0.25em",
                      }}
                      onClick={() => handleCreateInvoiceBtnClick()}
                    >
                      Create Invoice
                    </Button>
                  </div>
                </div>
              </div>
              <Table
                locale={{ emptyText: "No Data!" }}
                columns={columns}
                dataSource={invoiceList.current ? invoiceList.current : []}
                loading={loading}
                rowKey="_id"
              />
            </div>
          </div>
        </div>
      </div>
      {openCreateInvoiceModal && <Invoice />}
      {openInvoiceModal && <InvoiceView />}
      <EditPaymentModal />
    </>
  );
};

export default Rental;
