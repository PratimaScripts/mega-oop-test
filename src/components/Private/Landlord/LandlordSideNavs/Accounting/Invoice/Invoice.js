import React, { useState, useContext, useEffect } from "react";
import {
  Tag,
  Space,
  Badge,
  Modal,
  Select,
  Row,
  Col,
  DatePicker,
  Radio,
  Input,
  Switch,
  Tooltip,
  Spin,
  Button,
} from "antd";
// import moment from 'moment';
import styles from "./Invoice.module.scss";
import LineItems from "./LineItems";
import PropertiesQuery from "config/queries/property";
import ContactsQuery from "config/queries/contacts";
import { InvoiceContext } from "store/contexts/invoiceContexts";
import { checkCustomerVerified } from "config/queries/gocardless";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";
import InvoiceQuery from "config/queries/invoice";
import showNotification from "config/Notification";
import { useHistory } from "react-router-dom";
import get from "lodash/get";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import AddContact from "components/Common/Contacts/AddContact";
import { PaymentTypeEnum } from "constants/payment";

import { getAccessToken } from "config/queries/gocardless";
import { InfoCircleOutlined } from "@ant-design/icons";
import ComingSoonWrapper from "components/Common/ComingSoonWrapper";

const dateFormat = "YYYY-MM-DD";

const Invoice = () => {
  const { push } = useHistory();
  const locale = "en-us";
  const currency = "GBP";
  const { Option } = Select;

  const tagColor = {
    landlord: "#2db7f5",
    renter: "#f50",
    servicepro: "#87d068",
  };

  const [lineItems, setLineItems] = useState([
    {
      id: "initial", // react-beautiful-dnd unique key
      accountId: "",
      description: "",
      quantity: 1,
      rate: 0.0,
    },
  ]);
  const { dispatch, state } = useContext(InvoiceContext);
  const { state: interfaceState, dispatch: interfaceDispatch } =
    useContext(InterfaceContext);

  const { openAddContactModal } = interfaceState;
  const [contactsData, setContacts] = useState([]);
  const {
    openCreateInvoiceModal,
    editInvoice,
    transactionDetail,
    fetchingInvoiceById,
  } = state;

  const [newContactAdded, setNewContactAdded] = useState(false);

  const handleDueDateChange = (date) => {
    setInvoiceMeta({ ...invoiceMeta, dueDate: date._d });
  };
  const handleInvoiceDateChange = (date) => {
    setInvoiceMeta({ ...invoiceMeta, invoiceDate: date._d });
  };

  const [gocardlessVerified, setGocardlessVerified] = useState(false);
  const [isInReview, setIsInReview] = useState(false);
  const [disableForm, setDisableForm] = useState(false);

  useQuery(checkCustomerVerified, {
    onCompleted: (data) => {
      if (data?.checkCustomerVerified?.message === "in_review") {
        setIsInReview(true);
      }
      setGocardlessVerified(data?.checkCustomerVerified?.verified);
    },
  });

  const [rentalInvoiceId, setRentalInvoiceId] = useState("");
  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceDate: new Date(),
    transactionType: "Business Income",
    dueDate: new Date(),
    propertyId: "",
    taxRate: 0,
    amount: 0, //totalAmount excluding tax
    paymentMethod: "",
    accountNumber: "",
    sortCode: "",
    hasAutoRecurring: false,
    paymentScheduleType: "",
    paymentStartDate: null,
    subscriptionCreated: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (
      editInvoice &&
      transactionDetail &&
      Object.keys(transactionDetail).length
    ) {
      setDisableForm(
        Boolean(
          (transactionDetail.paymentMethod === PaymentTypeEnum.AUTOMATIC &&
            transactionDetail.status !== "Pending") ||
            transactionDetail.status === "Paid" ||
            transactionDetail.isChild
        )
      );
      setRentalInvoiceId(transactionDetail._id);
      setPaymentMethod(
        transactionDetail.paymentMethod === PaymentTypeEnum.AUTOMATIC
          ? PaymentTypeEnum.AUTOMATIC
          : PaymentTypeEnum.MANUAL
      );
      setLineItems(
        transactionDetail.transactions.map((transaction) => ({
          ...transaction,
          accountId: transaction.accountDetails._id,
          id: transaction._id,
        }))
      );
      setInvoiceMeta({
        ...invoiceMeta,
        invoiceNum: transactionDetail.invoiceNum,
        status: transactionDetail.status,
        paymentDate: transactionDetail.paymentDate,
        paymentMethod:
          transactionDetail.paymentMethod === PaymentTypeEnum.AUTOMATIC
            ? PaymentTypeEnum.AUTOMATIC
            : PaymentTypeEnum.MANUAL,
        contactId: transactionDetail.contact._id,
        propertyId: transactionDetail.property._id,
        taxRate: transactionDetail.taxPercent
          ? parseFloat(transactionDetail.taxPercent)
          : 0,
        amount: transactionDetail.amount,
        accountNumber: transactionDetail.accountNumber || "",
        sortCode: transactionDetail.sortCode || "",
        hasAutoRecurring: transactionDetail.hasAutoRecurring || false,
        paymentScheduleType: transactionDetail.paymentScheduleType || "",
        paymentStartDate: transactionDetail.paymentStartDate || undefined,
        subscriptionCreated: Boolean(
          transactionDetail?.gocardlessSubscription?.length
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editInvoice, transactionDetail]);

  const [getGocardlessCode] = useMutation(getAccessToken);

  const params = new URLSearchParams(window.location.href.split("?")[1]);
  const goCardlessCode = params.get("code");

  useEffect(() => {
    (async () => {
      if (goCardlessCode !== null) {
        debugger;
        const res = await getGocardlessCode({
          variables: {
            code: goCardlessCode,
          },
        });

        console.log(res);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goCardlessCode]);

  const handleLineItemChange = (event, elementIndex) => {
    if (event) {
      let items = lineItems.map((item, i) => {
        if (elementIndex !== i) return item;
        return {
          ...item,
          [event.target.name]:
            event.target.name === "description"
              ? event.target.value
              : parseFloat(event.target.value),
        };
      });
      setLineItems([...items]);
    }
  };

  const handleLineItemNameChange = (value, elementIndex) => {
    let items = lineItems.map((item, i) => {
      if (elementIndex !== i) return item;
      return {
        ...item,
        accountId: value,
      };
    });
    setLineItems([...items]);
  };

  const handleAddLineItem = (event) => {
    setLineItems(
      // use optimistic uuid for drag drop; in a production app this could be a database id
      lineItems.concat([
        {
          id: Math.random().toString(36).substring(7),
          accountId: "",
          quantity: 1,
          rate: 0.0,
        },
      ])
    );
  };

  const handleRemoveLineItem = (elementIndex) => (event) => {
    setLineItems(
      lineItems.filter((item, i) => {
        return elementIndex !== i;
      })
    );
  };

  const handleReorderLineItems = (newLineItems) => {
    setLineItems(newLineItems);
  };

  const handleFocusSelect = (event) => {
    event.target.select();
  };

  const [createInvoice, { loading: creatingInvoice }] = useMutation(
    InvoiceQuery.createInvoice,
    {
      onCompleted: ({ createInvoice }) => {
        if (createInvoice.success) {
          dispatch({ type: "CLOSE_CREATE_TRANSACTION_DRAWER" });
          dispatch({
            type: "CREATE_INVOICE",
            payload: createInvoice.data || [],
          });
          showNotification(
            "success",
            "Successfully created the new transaction",
            ""
          );
          setLineItems({
            id: "initial", // react-beautiful-dnd unique key
            accountId: "",
            description: "",
            quantity: 1,
            rate: 0.0,
          }); //reset data
        } else {
          showNotification("error", "Failed to create the new transaction", "");
        }
      },
      onError: (error) => {
        showNotification("error", `Failed to create the transaction`, "");
      },
    }
  );

  const [updateInvoice, { loading: updatingInvoice }] = useMutation(
    InvoiceQuery.updateInvoice,
    {
      onCompleted: ({ updateInvoice }) => {
        if (updateInvoice.success) {
          dispatch({ type: "CLOSE_CREATE_TRANSACTION_DRAWER" });
          dispatch({
            type: "GET_INVOICES",
            payload: updateInvoice?.data || [],
          });
          showNotification("success", "Successfully updated the invoice", "");
        } else {
          showNotification(
            "info",
            updateInvoice?.message || "Failed to update the transaction",
            ""
          );
        }
      },
      onError: (error) => {
        showNotification(
          "error",
          error?.message || `Failed to update the transaction`,
          ""
        );
      },
    }
  );

  const validForm = () => {
    if (!paymentMethod) {
      showNotification("error", "Please specify the payment method.");
      return false;
    }
    if (paymentMethod === PaymentTypeEnum.AUTOMATIC && !gocardlessVerified) {
      showNotification("error", "Verify your GoCardless account to get paid.");
      return false;
    }
    if (
      paymentMethod === PaymentTypeEnum.MANUAL &&
      (!invoiceMeta.accountNumber || !invoiceMeta.sortCode)
    ) {
      showNotification("error", "Please fill the bank details");
      return false;
    }
    if (invoiceMeta.hasAutoRecurring && !invoiceMeta.paymentScheduleType) {
      showNotification("error", "Please select payment schedule type");
      return false;
    }
    if (invoiceMeta.hasAutoRecurring && !invoiceMeta.paymentStartDate) {
      showNotification("error", "Please select rental invoice date");
      return false;
    }
    return true;
  };

  const handleInvoiceSubmit = () => {
    if (!validForm()) return;

    if (editInvoice) {
      if (rentalInvoiceId) {
        updateInvoice({
          variables: {
            ...invoiceMeta,
            invoiceItems: lineItems.map((lineItem) => {
              return {
                id: lineItem.id,
                accountId: lineItem.accountId,
                description: lineItem.description,
                quantity: lineItem.quantity,
                rate: lineItem.rate,
              };
            }),
            rentalInvoiceId,
          },
        });
      }
    } else {
      const property = propertyData.fetchProperty.data.filter(
        (property) => property.propertyId === invoiceMeta.propertyId
      );
      createInvoice({
        variables: {
          ...invoiceMeta,
          invoiceItems: lineItems,
          propertyTitle: !property.length
            ? ""
            : property[0].privateTitle
            ? property[0].privateTitle
            : property[0].title,
        },
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calcLineItemsTotal = () => {
    const amount = lineItems.reduce(
      (prev, cur) => prev + cur.quantity * cur.rate,
      0
    );
    return amount;
  };

  const calcTaxTotal = () => {
    return calcLineItemsTotal() * (parseFloat(invoiceMeta.taxRate) / 100);
  };

  const calcGrandTotal = () => {
    return calcLineItemsTotal() + calcTaxTotal();
  };

  const { loading: propertyLoading, data: propertyData } = useQuery(
    PropertiesQuery.fetchProperty
  );

  const { loading: contactsLoading, refetch: refetchTheContactList } = useQuery(
    ContactsQuery.getContactList,
    {
      variables: {
        filterString: JSON.stringify({
          receiverRole: ["renter"],
        }),
      },
      onCompleted: ({ getContactList }) => {
        if (get(getContactList, "success", false)) {
          setContacts(
            getContactList.data.filter((contact) => contact.role === "renter")
          );
        }
      },
    }
  );

  useEffect(() => {
    if (newContactAdded) {
      refetchTheContactList();
    }
  }, [newContactAdded, refetchTheContactList]);

  const onCancel = () => {
    dispatch({ type: "CLOSE_CREATE_TRANSACTION_DRAWER" });
    setLineItems([
      {
        id: "initial", // react-beautiful-dnd unique key
        accountId: "",
        description: "",
        quantity: 1,
        rate: 0.0,
      },
    ]);
  };

  const onContactChange = (value) => {
    if (value === "addContact") {
      setNewContactAdded(false);
      interfaceDispatch({ type: "OPEN_ADD_CONTACT_MODAL" });
    } else {
      setInvoiceMeta({ ...invoiceMeta, contactId: value });
    }
  };

  const handleOnPaymentTypeChange = async (paymentMethod) => {
    if (paymentMethod === PaymentTypeEnum.AUTOMATIC && isInReview) {
      showNotification(
        "info",
        "Your GoCardless account is under review. You'll not able to charge the renter automatically right now."
      );
    }
    setInvoiceMeta({ ...invoiceMeta, paymentMethod });
  };

  const handleInvoiceMetaOnChange = (key, value) =>
    setInvoiceMeta((prevState) => ({ ...prevState, [key]: value }));

  const disabledDate = (current) =>
    !moment().subtract(1, "day").endOf("day").isBefore(current);

  return (
    <>
      <Modal
        title={editInvoice ? "Update Invoice" : "Create New Invoice"}
        onCancel={() => onCancel()}
        visible={openCreateInvoiceModal}
        width={1200}
        okText={editInvoice ? "Update" : "Create"}
        onOk={() => handleInvoiceSubmit()}
        okButtonProps={{
          loading: updatingInvoice || creatingInvoice,
          disabled: updatingInvoice || creatingInvoice || disableForm,
        }}
        cancelButtonProps={{ disabled: updatingInvoice || creatingInvoice }}
        maskClosable={false}
        style={{ top: 10 }}
        destroyOnClose={true}
      >
        {editInvoice && fetchingInvoiceById ? (
          <div className="d-flex justify-content-center my-5">
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.invoice}>
            <div className={styles.addresses}>
              {/* <Tag color="blue">Customer Details</Tag> */}
              <div>
                <Badge.Ribbon placement="start" text="Customer Details">
                  <div
                    className={`${styles.detailTable} ${styles.customerDetail} ${styles.to}`}
                  >
                    <br />
                    <div className={styles.row}>
                      <div className={styles.label}>Name</div>
                      {/* <div className={styles.value}> */}

                      <Select
                        placeholder="Select Payer Name"
                        className="w-100"
                        size="large"
                        required={true}
                        loading={contactsLoading}
                        defaultValue={
                          editInvoice && transactionDetail?.contact?._id
                            ? transactionDetail?.contact?._id
                            : undefined
                        }
                        onChange={(value) => onContactChange(value)}
                        disabled={disableForm}
                      >
                        {contactsData?.map(
                          (contact) =>
                            contact?.firstName &&
                            contact?.userId && (
                              <Option
                                key={contact.contactId}
                                value={contact.contactId}
                              >
                                <Space>
                                  <span>
                                    {contact?.firstName} {contact?.lastName}
                                  </span>
                                  <Tag
                                    color={tagColor[get(contact, "role", "")]}
                                  >
                                    {contact?.role}
                                  </Tag>
                                </Space>
                              </Option>
                            )
                        )}
                        <Option key="addContact" value="addContact">
                          Add Contact
                        </Option>
                      </Select>
                      {/* </div> */}
                    </div>

                    <div className={styles.row}>
                      <div className={styles.label}>Property Name</div>
                      <Select
                        placeholder="Select Property"
                        className="w-100"
                        size="Large"
                        required={true}
                        loading={propertyLoading}
                        defaultValue={
                          editInvoice && transactionDetail?.property?._id
                            ? transactionDetail?.property?._id
                            : undefined
                        }
                        onChange={(value) => {
                          if (value !== "new") {
                            setInvoiceMeta({
                              ...invoiceMeta,
                              propertyId: value,
                            });
                          }
                          if (value === "new") {
                            push("/landlord/property/add");
                          }
                        }}
                        disabled={disableForm}
                      >
                        {propertyData?.fetchProperty?.data?.map(
                          (property) =>
                            property.address && (
                              <Option
                                key={property.propertyId}
                                value={property.propertyId}
                              >
                                {property.privateTitle
                                  ? property.privateTitle
                                  : property.title}
                              </Option>
                            )
                        )}
                        <Option value="new">Add New Property</Option>
                      </Select>
                    </div>
                  </div>
                </Badge.Ribbon>
              </div>

              <div>
                <Badge.Ribbon text="Invoice Details">
                  <div
                    className={`${styles.detailTable} ${styles.invoiceDetail} ${styles.to} ${styles.invoiceDetails}`}
                  >
                    <br />
                    <div className={styles.row}>
                      <div className={styles.label}>Date</div>
                      <DatePicker
                        size="large"
                        disabledDate={disabledDate}
                        className="w-100 my-2"
                        required={true}
                        onChange={handleInvoiceDateChange}
                        defaultValue={moment(
                          editInvoice && transactionDetail
                            ? new Date(transactionDetail.invoiceDate)
                            : new Date(),
                          dateFormat
                        )}
                        disabled={disableForm}
                      />
                    </div>
                    <div className={styles.row}>
                      <div className={styles.label}>Due Date</div>
                      <DatePicker
                        size="large"
                        disabledDate={disabledDate}
                        className="w-100 my-2"
                        required={true}
                        defaultValue={moment(
                          editInvoice && transactionDetail
                            ? new Date(transactionDetail.dueDate)
                            : new Date(),
                          dateFormat
                        )}
                        onChange={handleDueDateChange}
                        disabled={disableForm}
                      />
                    </div>
                  </div>
                </Badge.Ribbon>
                <div className="my-5" />
                <Badge.Ribbon text="Payment Method" color="lime">
                  <div
                    className={`${styles.detailTable} ${styles.invoiceDetail} ${styles.to}`}
                  >
                    <div className={styles.row}>
                      <Row>
                        <Col span={12}>
                          <Radio.Group
                            disabled={
                              invoiceMeta.subscriptionCreated || disableForm
                            }
                            value={invoiceMeta.paymentMethod}
                            onChange={(e) => {
                              setPaymentMethod(e.target.value);
                              handleOnPaymentTypeChange(e.target.value);
                            }}
                          >
                            <Space direction="horizontal">
                              <Radio
                                disabled
                                className="radioBtn"
                                value={PaymentTypeEnum.AUTOMATIC}
                              >
                                Automatic
                              </Radio>

                              <Radio
                                defaultChecked
                                className="radioBtn"
                                value={PaymentTypeEnum.MANUAL}
                              >
                                Manual
                              </Radio>
                            </Space>
                          </Radio.Group>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Badge.Ribbon>
                {paymentMethod === PaymentTypeEnum.AUTOMATIC ? (
                  gocardlessVerified ? null : (
                    <ComingSoonWrapper>
                      <Button
                        type="primary"
                        disabled
                        onClick={() =>
                          window.open(
                            `https://connect-sandbox.gocardless.com/oauth/authorize?scope=read_write&client_id=r8qPJaK5FlJ0ksnuB73ri6k6-46j-GXeEh5rRtG5wypWM64qILC6Lxdrs23vJG0O&redirect_uri=${process.env.REACT_APP_GOCARDLESS_REDIRECT_URI}/landlord/accounting/rental-invoice&response_type=code`
                          )
                        }
                      >
                        Connect GoCardless
                      </Button>
                    </ComingSoonWrapper>
                  )
                ) : (
                  <>
                    {paymentMethod === PaymentTypeEnum.MANUAL && (
                      <Badge.Ribbon text="Bank account details" color="lime">
                        <div
                          className={`mt-4 ${styles.detailTable} ${styles.invoiceDetail} ${styles.to}`}
                        >
                          <br />
                          <div className={`${styles.row} p-2 pt-3 d-flex`}>
                            <div className="p-0 w-100">
                              <strong className="d-block mb-1">
                                Account number
                              </strong>
                              <Input
                                type="number"
                                name="accountNumber"
                                value={invoiceMeta.accountNumber}
                                onChange={({ target: { name, value } }) =>
                                  handleInvoiceMetaOnChange(name, value)
                                }
                                placeholder="Account Number *"
                                style={{ textAlign: "left" }}
                                disabled={disableForm}
                              />
                            </div>
                          </div>
                          <div className={`${styles.row} p-2 d-flex`}>
                            <div className="p-0 w-100">
                              <strong className="d-block mb-1">
                                Sort code
                              </strong>
                              <Input
                                type="number"
                                name="sortCode"
                                value={invoiceMeta.sortCode}
                                onChange={({ target: { name, value } }) =>
                                  handleInvoiceMetaOnChange(name, value)
                                }
                                placeholder="Sort Code *"
                                style={{ textAlign: "left" }}
                                disabled={disableForm}
                              />
                            </div>
                          </div>
                        </div>
                      </Badge.Ribbon>
                    )}
                  </>
                )}
                <ComingSoonWrapper>
                  <Badge.Ribbon text="Recurring Invoice">
                    <div
                      className={`mt-4 ${styles.detailTable} ${styles.invoiceDetail} ${styles.to}`}
                    >
                      <br />
                      <div className="m-2 mt-3 d-flex align-items-center">
                        <strong className={`mr-2 ${styles.label}`}>
                          Enable auto-recurring Rental invoice
                        </strong>
                        <Switch
                          size="small"
                          checked={invoiceMeta.hasAutoRecurring}
                          onChange={(value) => {
                            handleInvoiceMetaOnChange(
                              "hasAutoRecurring",
                              value
                            );
                            if (!value) {
                              handleInvoiceMetaOnChange(
                                "paymentScheduleType",
                                ""
                              );
                            }
                          }}
                          disabled={disableForm}
                        />
                      </div>
                      <hr className="my-0" />
                      <div className="p-2">
                        <strong className="d-block mb-1">
                          Payment schedule type
                        </strong>
                        <Select
                          className="w-100"
                          placeholder="Payment schedule type"
                          value={invoiceMeta.paymentScheduleType || undefined}
                          onChange={(value) =>
                            handleInvoiceMetaOnChange(
                              "paymentScheduleType",
                              value
                            )
                          }
                          disabled={disableForm}
                        >
                          <Option value="monthly">Monthly</Option>
                          <Option value="weekly">Weekly</Option>
                        </Select>
                      </div>
                      <hr className="my-0" />
                      <div className="p-2">
                        <strong className="d-flex align-items-center mb-1">
                          Recurring Invoice Date
                          <Tooltip title="The day of the month to charge customers on. Charge day should be between 1 and 28.">
                            <InfoCircleOutlined
                              className={`${styles.cursorPointer} ml-2`}
                            />
                          </Tooltip>
                        </strong>
                        <DatePicker
                          format={dateFormat}
                          disabledDate={disabledDate}
                          placeholder="Select Recurring Invoice Date"
                          className="w-100"
                          size="large"
                          value={
                            editInvoice && invoiceMeta.paymentStartDate
                              ? moment(
                                  new Date(invoiceMeta.paymentStartDate),
                                  dateFormat
                                )
                              : undefined
                          }
                          onChange={(date) =>
                            handleInvoiceMetaOnChange(
                              "paymentStartDate",
                              date || undefined
                            )
                          }
                          disabled={disableForm}
                        />
                      </div>
                    </div>
                  </Badge.Ribbon>
                </ComingSoonWrapper>
              </div>
            </div>
            <Badge.Ribbon placement="start" color="green" text="Items">
              <LineItems
                items={lineItems}
                transactionType="Business Income"
                currencyFormatter={formatCurrency}
                addHandler={handleAddLineItem}
                changeHandler={handleLineItemChange}
                nameChangeHandler={handleLineItemNameChange}
                focusHandler={handleFocusSelect}
                deleteHandler={handleRemoveLineItem}
                reorderHandler={handleReorderLineItems}
                disableForm={disableForm}
              />
            </Badge.Ribbon>

            <div className={styles.totalContainer}>
              <Badge.Ribbon color="gold" text="Amount">
                <form>
                  <div className={styles.valueTable}>
                    {" "}
                    <br />
                    <div className={styles.row}>
                      <div className={styles.label}>Subtotal</div>
                      <div className={`${styles.value} ${styles.currency}`}>
                        {formatCurrency(calcLineItemsTotal())}
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div className={styles.label}>Total Due</div>
                      <div className={`${styles.value} ${styles.currency}`}>
                        {formatCurrency(calcGrandTotal())}
                      </div>
                    </div>
                  </div>
                </form>
              </Badge.Ribbon>
            </div>
          </div>
        )}
      </Modal>
      {openAddContactModal && (
        <AddContact setNewContactAdded={setNewContactAdded} />
      )}
    </>
  );
};

export default Invoice;
