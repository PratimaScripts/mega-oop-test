import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  DatePicker,
  Menu,
  Space,
  Tag,
  Select,
  Modal,
} from "antd";
import {
  EyeOutlined,
  EuroOutlined,
  SearchOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { pdf } from "@react-pdf/renderer";
import EditPaymentModal from "components/Private/Landlord/LandlordSideNavs/Accounting/Invoice/EditInvoicePaymentModal";
import moment from "moment";
// import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import useForceUpdate from "use-force-update";
import { getRentedProperties } from "config/queries/renter";
import { initiateThePayment } from "config/queries/gocardless";

import Invoice from "components/Private/Landlord/LandlordSideNavs/Accounting/Invoice/Invoice";
import { InvoiceContext } from "store/contexts/invoiceContexts";
// import { GetInvoices } from 'store/actions/InvoiceActions';
import "./styles.scss";
import InvoiceQuery from "config/queries/invoice";
import menuIcon from "img/ellipsis-vertical-circle.svg";
import showNotification from "config/Notification";
import InvoicePDF from "components/Private/Landlord/LandlordSideNavs/Accounting/Invoice/InvoicePDF";
import InvoiceView from "components/Private/Landlord/LandlordSideNavs/Accounting/Invoice/InvoiceView";
import { CALLED_API, UserDataContext } from "store/contexts/UserContext";
import { useHistory, useLocation } from "react-router-dom";
import GoCardlessLogo from "../../../../../../img/gocardless/GoCardless_Logo_Positive_RGB.svg";

const PaymentDetailsTable = ({ invoiceDetails }) => (
  <table className="table table-sm table-borderless mt-3 paymentDetails">
    <tr>
      <th colSpan={2} style={{ textAlign: "center" }}>
        Payment Details
      </th>
    </tr>
    <tr>
      <td>Amount:</td>
      <td>£ {invoiceDetails.amount}</td>
    </tr>
    {invoiceDetails.hasAutoRecurring && (
      <tr>
        <td>Payment Interval:</td>
        <td>{invoiceDetails.paymentScheduleType}</td>
      </tr>
    )}
    {invoiceDetails.hasAutoRecurring || invoiceDetails.isChild ? (
      <tr>
        <td>
          {!invoiceDetails.isChild
            ? "Recurring Invoice Start Date"
            : "Next Recurring Invoice Date"}
          :
        </td>
        <td>
          {moment(
            !invoiceDetails.isChild
              ? invoiceDetails.paymentStartDate
              : invoiceDetails.nextPaymentOn
          ).format("DD-MM-YYYY")}
        </td>
      </tr>
    ) : null}
    <tr>
      <td>Payment Method:</td>
      <td>
        {invoiceDetails.paymentMethod === "automatic" ? (
          <div className="d-flex">
            <img
              className="p-0 m-0"
              src={GoCardlessLogo}
              alt="GoCardlessLogo"
            />
            *
          </div>
        ) : (
          invoiceDetails.paymentMethod
        )}
      </td>
    </tr>
    {invoiceDetails.paymentMethod === "automatic" ? (
      <tr>
        <td colSpan={2} className="terms_condition">
          <i>* You will be charged from your existing GoCardless mandate.</i>
        </td>
      </tr>
    ) : null}
  </table>
);

const ManageRent = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(useLocation().search);

  const { dispatch, state } = useContext(InvoiceContext);
  const {
    state: { userData, calledAPI },
    dispatch: userDispatch,
  } = useContext(UserDataContext);

  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [openManualPaymentModal, setOpenManualPaymentModal] = useState(false);

  const [currentInvoice, setCurrentInvoice] = useState({
    pending: false,
    amount: "",
    sortCode: "",
    renterId: "",
    mandateId: "",
    landlordId: "",
    propertyId: "",
    propertyName: "",
    accountNumber: "",
    transactionId: "",
    invoiceNumber: "",
  });

  const tagColor = {
    landlord: "#2db7f5",
    renter: "#f50",
    servicepro: "#87d068",
  };

  const { refetch: refetchRentalInvoices } = useQuery(
    InvoiceQuery.getRentalInvoices,
    {
      onCompleted: ({ getRentalInvoices }) => {
        let payload = getRentalInvoices.data || [];

        payload = payload.map((invoice) => {
          let children = [];
          if (invoice?.recurringInvoices?.length) {
            children = invoice.recurringInvoices.map((recurringInvoice) => ({
              ...invoice,
              ...recurringInvoice,
            }));
          }
          return {
            ...invoice,
            ...(children?.length ? { children } : {}),
            status:
              invoice.status === "Pending"
                ? moment().format("YYYY-MM-DD") >
                  moment(
                    invoice[invoice.isChild ? "dueDate" : "paymentStartDate"]
                  ).format("YYYY-MM-DD")
                  ? "Overdue"
                  : invoice.status
                : invoice.status,
          };
        });

        dispatch({
          type: "GET_INVOICES",
          payload,
        });

        let invoiceId = searchParams.get("invoiceId");

        if (!calledAPI && invoiceId) {
          if (getRentalInvoices?.data?.length) {
            let invoice = null;
            for (let i = 0; i < getRentalInvoices.data.length; i++) {
              let parentInvoice = getRentalInvoices.data[i];
              if (parentInvoice._id === invoiceId) {
                invoice = parentInvoice;
                break;
              } else {
                if (parentInvoice?.recurringInvoices?.length) {
                  let childInvoice = parentInvoice.recurringInvoices.filter(
                    (invoice) => invoice._id === invoiceId
                  );
                  if (childInvoice?.length) {
                    setOpenManualPaymentModal(true);
                  }
                }
              }
            }

            if (invoice) {
              setCurrentInvoice({ transactionId: invoice._id });

              if (invoice.status === "cancelled") {
                showInfoModal(
                  `Your ${
                    invoice.hasAutoRecurring ? "subscription" : "payment"
                  } for invoice ${invoice.invoiceNum} has been cancelled.`
                );
              } else if (invoice.status !== "Pending") {
                showInfoModal(
                  `Your ${
                    invoice.hasAutoRecurring ? "subscription" : "payment"
                  } for invoice ${invoice.invoiceNum} is in progress.`
                );
              } else {
                showConfirmationModal("", {
                  ...invoice,
                  rentalInvoiceId: invoice._id,
                });
              }
              searchParams.delete("invoiceId");
              history.replace({ search: searchParams.toString() });
            }
          }
          userDispatch({ type: CALLED_API, payload: true });
        }
      },
    }
  );

  const {
    invoices,
    loading = true,
    openCreateInvoiceModal,
    openEditPaymentModal,
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

  useEffect(() => {
    invoiceList.current = invoices;

    if (Array.isArray(invoiceList.current) && invoiceList.current.length > 0) {
      dispatch({ type: "SET_LOADING", payload: true });
      let paidAmount = 0;
      let unpaidAmount = 0;
      let overdueAmount = 0;
      let totalAmount = 0;
      invoiceList.current.forEach((item) => {
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

  const {
    loading: propertyLoading,
    error: propertyError,
    data: propertyData,
  } = useQuery(getRentedProperties);

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

  const filterInvoiceByProperty = (propertyTitle) => {
    debugger;
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
        : status === "Pending"
        ? (invoiceList.current = invoices.data?.filter(
            (invoice) => invoice.mandate.length && !invoice.mandate[0].created
          ))
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

  const onPayNow = async (transaction) => {
    if (
      transaction.paymentMethod !== "manual" &&
      transaction?.mandate?.created
    ) {
      setCurrentInvoice({
        ...currentInvoice,
        amount: transaction.amount,
        invoiceNumber: transaction.invoiceNum,
        landlordId: transaction.contact.user._id,
        mandateId: transaction.mandate._id,
        transactionId: transaction._id,
      });
      let isPaymentFailed = transaction.status === "failed";

      // if transaction is cancelled
      if (transaction.status === "cancelled") {
        showInfoModal("Payment cancelled!");
        return;
      }

      // if landlord has initiated recurring subscription
      if (
        transaction.hasAutoRecurring &&
        !transaction?.gocardlessSubscription
      ) {
        showConfirmationModal(
          isPaymentFailed
            ? "Failed to initiate recurring subscription! Please try again."
            : "",
          {
            ...transaction,
            rentalInvoiceId: transaction._id,
          },
          <p className="m-0">
            Landlord has initiated auto recurring invoice.
            <br />
            You will be charged from the existing mandate.
          </p>
        );
        // Dynamic model: retry the payment if it's failed OR approve the payment (initiate the payment)
      } else if (
        isPaymentFailed ||
        (!transaction?.gocardlessPayment && !transaction.hasAutoRecurring)
      ) {
        showConfirmationModal(
          isPaymentFailed ? "Payment failed! Please try again" : "",
          {
            ...transaction,
            rentalInvoiceId: transaction._id,
          }
        );
        // payment in progress
      } else {
        let isInProgress =
          (transaction?.gocardlessPayment?.status &&
            transaction?.gocardlessPayment?.status !== "paid_out") ||
          transaction?.gocardlessSubscription?.status !== "finished";
        showInfoModal(
          isInProgress
            ? `Your ${
                transaction.hasAutoRecurring ? "subscription" : "payment"
              } is in progress.`
            : ""
        );
      }

      return;
    }

    if (
      transaction.paymentMethod === "manual" &&
      transaction.hasAutoRecurring &&
      !transaction.isChild
    ) {
      if (transaction.status === "Active") {
        return showInfoModal("Your subscription is in progress.");
      }
      if (transaction.status === "cancelled") {
        return showInfoModal("Your subscription has been cancelled.");
      }

      return showConfirmationModal("", {
        ...transaction,
        rentalInvoiceId: transaction._id,
      });
    }

    setCurrentInvoice({
      ...currentInvoice,
      transactionId: transaction._id,
      renterId: userData._id,
      landlordId: transaction.contact.user._id,
      propertyId: transaction.property._id,
      propertyName: transaction.property.title,
      pending:
        !transaction?.mandate?.created &&
        transaction.paymentMethod === "automatic",
      accountNumber: transaction.accountNumber,
      sortCode: transaction.sortCode,
    });
    transaction.status !== "Paid" &&
      dispatch({
        type: "OPEN_EDIT_PAYMENT_MODAL",
        payload: transaction,
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

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (status, invoice) => (
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
      align: "left",
      ...getColumnSearchProps(["property", "title"]),
      render: (property) => <span style={{ color: "blue" }}>{property}</span>,
    },
    {
      title: "Created By",
      align: "left",
      dataIndex: ["contact"],
      render: (contact) => (
        <Space>
          <span>
            {contact?.user?.firstName || ""} {contact?.user?.lastName || ""}
          </span>
          <Tag color={tagColor[get(contact.user, "role", "")]}>
            {contact?.user?.role}
          </Tag>
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
      render: (transaction, invoice) => (
        <>
          <Dropdown
            overlay={
              <>
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      if (
                        transaction.hasAutoRecurring &&
                        transaction.paymentMethod === "automatic"
                      ) {
                        history.push(
                          "/" +
                            userData.role +
                            "/recurring-invoice/" +
                            invoice._id
                        );
                      } else {
                        dispatch({
                          type: "OPEN_INVOICE_MODAL",
                        });
                        getInvoiceById({
                          variables: { invoiceId: invoice._id },
                        });
                      }
                    }}
                    icon={<EyeOutlined />}
                  >
                    View
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => onPayNow(transaction)}
                    style={{
                      cursor: `${transaction.status === "Paid" && "no-drop"}`,
                    }}
                    icon={<EuroOutlined />}
                  >
                    Pay Now
                  </Menu.Item>

                  <Menu.Item
                    onClick={() => generatePdfDocument(invoice._id)}
                    icon={<ExportOutlined />}
                  >
                    Export as PDF
                  </Menu.Item>
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

  const [makePayment, { loading: initiatingPayment }] =
    useMutation(initiateThePayment);

  const onOk = (invoiceDetails, close) => {
    makePayment({
      variables: {
        rentalInvoiceId: invoiceDetails.rentalInvoiceId,
      },
    }).then(({ data }) => {
      if (data?.initiateThePayment?.success) {
        close();
        showNotification(
          "success",
          data.initiateThePayment.message || "Rent paid successfully."
        );
        refetchRentalInvoices();
      } else {
        showNotification(
          "error",
          data?.initiateThePayment?.message ||
            "Failed pay the rent. Please try again after some time."
        );
      }
    });
  };

  const showConfirmationModal = (title, invoiceDetails, content = "") =>
    Modal.confirm({
      width: 500,
      title:
        title ||
        `Please authorize the ${
          invoiceDetails.hasAutoRecurring ? "subscription" : "payment"
        } for invoice ${invoiceDetails.invoiceNum}`,
      content: content || (
        <PaymentDetailsTable invoiceDetails={invoiceDetails} />
      ),
      okButtonProps: { loading: initiatingPayment },
      onOk: (close) => onOk(invoiceDetails, close),
    });

  const showInfoModal = (title) =>
    Modal.info({ title: title || "Payment has already been paid" });

  return (
    <>
      <div className="accounting-rental_invoice_transaction">
        <div className="container">
          <div className="row">
            <div className="main_wrap w-100">
              <div className="detailed_info mb-3">
                <div className="row">
                  <div className="col-12 col-sm-6 col-lg-3 py-2">
                    <div className="detail_item">
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
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3 py-2">
                    <div className="detail_item">
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
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3 py-2">
                    <div className="detail_item">
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
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3 py-2">
                    <div className="detail_item">
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
                    </div>
                  </div>
                </div>
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
                        propertyData.getRentedProperties &&
                        propertyData.getRentedProperties?.map(
                          (property) =>
                            property.address && (
                              <Option
                                key={property.propertyId}
                                value={property.privateTitle}
                              >
                                {property.privateTitle}
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
                      <Option key={4} value="Recurring">
                        Recurring
                      </Option>
                      <Option key={4} value="Pending">
                        Pending Mandates
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
      {openInvoiceModal && <InvoiceView disableEditing={true} />}
      {(openEditPaymentModal || openManualPaymentModal) && (
        <EditPaymentModal
          visible={openManualPaymentModal}
          changeVisibility={setOpenManualPaymentModal}
          pending={currentInvoice.pending}
          transactionDetails={{
            accountNumber: currentInvoice.accountNumber,
            sortCode: currentInvoice.sortCode,
          }}
        />
      )}
    </>
  );
};

export default ManageRent;
