import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  InputNumber,
  Input,
  Upload,
  Switch,
  Button,
  Divider,
  Form,
  Select,
  Modal,
  DatePicker,
  Tag,
  Space,
} from "antd";
import axios from "axios";
import cookie from "react-cookies";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import moment from "moment";

import PropertiesQuery from "config/queries/property";
import ContactsQuery from "config/queries/contacts";
import AccountsQuery from "config/queries/account";
import TransactionQuery from "config/queries/transaction";
import { TransactionContext } from "store/contexts/transactionContexts";
import showNotification from "config/Notification";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import AddContact from "components/Common/Contacts/AddContact";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const tagColor = {
  landlord: "#2db7f5",
  renter: "#f50",
  servicepro: "#87d068",
};

const CreateTransactionDrawer = () => {
  const { push } = useHistory();

  //property select input methods
  const handlePropertyChange = (value) => {
    if (value === "new") {
      push("/landlord/property/add");
    }
  };

  const { Option, OptGroup } = Select;
  const { dispatch, state } = useContext(TransactionContext);
  const { state: interfaceState, dispatch: interfaceDispatch } =
    useContext(InterfaceContext);
  const {
    openCreateTransactionDrawer,
    transactionType,
    editTransaction,
    transactionDetail,
  } = state;

  const [paid, setPaid] = useState(
    editTransaction && transactionDetail.status === "Paid" ? true : false
  );

  const { openAddContactModal } = interfaceState;
  const [contactsData, setContacts] = useState([]);

  const LOCALE = "en-us";

  const [form] = Form.useForm();

  // state related to upload image field
  const [image, setImage] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  // set transaction type on btn clicks
  // MoneyIn -> 'inflow'
  // MoneyOut -> 'outflow'
  // mark whether transaction is paid or not
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editTransaction && transactionDetail) {
      setPaid(transactionDetail.status === "Paid" ? true : false);
    } else {
      setPaid(false);
    }

    form.resetFields();
    setImage({ ...image, fileList: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTransaction, transactionDetail, transactionType]);

  // set the lable of constact list based on type of transaction
  const getTransactionIdentifierLable = () =>
    transactionType === "businessIncome"
      ? "From whom did you receive?"
      : "Who did you pay?";

  // set the lable of transaction type list based on type of transaction
  const getTransactionTypeLable = () =>
    transactionType === "businessIncome"
      ? "What kind of income is this?"
      : "What kind of expense is this?";

  /* call this function on MoneyIn , MoneyOut Buttons click with parameter of either 'inflow' or outflow*/

  const nameOfAmountType =
    transactionType === "businessExpenses"
      ? "Business Expenses"
      : "Business Income";
  const typeOfAmountFlow =
    transactionType === "businessExpenses" ? "capitalOutflow" : "capitalInflow";
  const nameOfAmountFlow =
    typeOfAmountFlow === "capitalOutflow"
      ? "Capital Outflow"
      : "Capital Inflow";

  const currencyFormatter = (value) => {
    return new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: "GBP",
    }).format(value);
  };

  /* currency parser, this function will be moved to utils files in refactoring */
  const currencyParser = (val) => {
    try {
      // for when the input gets clears
      if (typeof val === "string" && !val.length) {
        val = "0.0";
      }

      // detecting and parsing between comma and dot
      var group = new Intl.NumberFormat(LOCALE).format(1111).replace(/1/g, "");
      var decimal = new Intl.NumberFormat(LOCALE).format(1.1).replace(/1/g, "");
      var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
      reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
      //  => 1232.21 €

      // removing everything except the digits and dot
      reversedVal = reversedVal.replace(/[^0-9.]/g, "");
      //  => 1232.21

      // appending digits properly
      const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
      const needsDigitsAppended = digitsAfterDecimalCount > 2;

      if (needsDigitsAppended) {
        reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
      }

      return Number.isNaN(reversedVal) ? 0 : reversedVal;
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageCancel = () => setImage({ ...image, previewVisible: false });

  const handleImagePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setImage({
      ...image,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleImageChange = ({ fileList }) => {
    // console.log("filelist", fileList);
    setImage({ ...image, fileList });
    // console.log("images", image);
  };

  const onContactChange = (value) => {
    if (value === "addContact") {
      interfaceDispatch({ type: "OPEN_ADD_CONTACT_MODAL" });
    }
  };

  const [createTransaction, { loading: creating }] = useMutation(
    TransactionQuery.createTransaction,
    {
      onCompleted: ({ createTransaction }) => {
        if (createTransaction.success) {
          dispatch({ type: "CREATE_TRANSACTION", payload: createTransaction });
          dispatch({ type: "CLOSE_CREATE_TRANSACTION_DRAWER" });
          // reset form values
          form.resetFields();
          setImage({ ...image, fileList: [] });
          showNotification(
            "success",
            "Successfully created the new transaction",
            ""
          );
        } else {
          showNotification("error", "Failed to create the new transaction", "");
        }
      },
      onError: (error) => {
        showNotification("error", `Failed to create the transaction`, "");
      },
    }
  );

  const [updateTransaction, { loading: updating }] = useMutation(
    TransactionQuery.updateTransaction,
    {
      onCompleted: ({ updateTransaction }) => {
        if (updateTransaction.success) {
          dispatch({ type: "UPDATE_TRANSACTION", payload: updateTransaction });
          dispatch({ type: "CLOSE_CREATE_TRANSACTION_DRAWER" });
          // reset form values
          form.resetFields();
          setImage({ ...image, fileList: [] });
          showNotification(
            "success",
            "Successfully updated the transaction",
            ""
          );
        } else {
          showNotification(
            "error",
            "Failed to update the transaction",
            updateTransaction.message
          );
        }
      },
      onError: (error) => {
        showNotification(
          "error",
          "Failed to update the transaction",
          error.message
        );
      },
    }
  );

  const onFinish = async (values) => {
    // setSubmitting(true);
    const photos = [];
    let uploadImages = image.fileList.map(async (img, i) => {
      if (typeof img !== "string") {
        var frmData = new FormData();
        frmData.append("file", img.originFileObj);
        frmData.append("filename", img.name);
        // for what purpose the file is uploaded to the server.
        frmData.append("uploadType", "Transaction");
        let uploadedFile = await axios.post(
          `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
          frmData,
          {
            headers: {
              authorization: await cookie.load(
                process.env.REACT_APP_AUTH_TOKEN
              ),
            },
          }
        );

        if (!uploadedFile.data.success)
          return showNotification(
            "error",
            "An error occurred",
            uploadedFile.data.message
          );

        photos.push(get(uploadedFile, "data.data"));
        // setProgressPercent(prevState => prevState + 15);
      } else {
        photos.push(img);
      }
    });

    await Promise.all(uploadImages);
    // setProgressPercent(100);
    values.photos = !isEmpty(photos)
      ? photos
      : [
          "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1579693025/property_img_placeholder_thumb.png",
        ];

    const data = {
      contactId: values.contact,
      propertyId: values.property,
      accountId: values.accountId,
      transactionType: nameOfAmountType,
      amount: parseFloat(String(values.amount).replace(/[^0-9.-]+/g, "")),
      images: values.photos,
      additionalInfo: values.additionalInfo,
      status: values.paid ? "Paid" : "Pending",
      paymentDate: values.paid ? values.paymentDate._d : undefined,
      paymentMethod: values.paid ? values.paymentMethod : undefined,
    };

    data["transactionDate"] = values.transactionDate._d;

    editTransaction
      ? updateTransaction({
          variables: {
            id: transactionDetail._id,
            rentalInvoiceId: transactionDetail.rentalInvoiceId,
            ...data,
          },
        })
      : createTransaction({ variables: data });

    // close the drawer

    setSubmitting(false);
  };

  // queries

  const {
    loading: propertyLoading,
    // error: propertyError,
    data: propertyData,
  } = useQuery(PropertiesQuery.fetchProperty);
  const {
    loading: contactsLoading,
    // error: contactsError
  } = useQuery(ContactsQuery.getContactList, {
    onCompleted: ({ getContactList }) => {
      if (get(getContactList, "success", false)) {
        setContacts(getContactList.data);
      }
    },
  });
  const {
    loading: accountsLoading,
    // error: accountsError,
    data: accountsData,
  } = useQuery(AccountsQuery.fetchChartOfAccount);

  const onPaymentStatusChange = (status) => {
    setPaid(status);
    const paymentDate = form.getFieldValue("paymentDate");
    // console.log("earlier value", paymentDate)
    if (status) {
      paymentDate === undefined
        ? form.setFieldsValue({ paymentDate: moment(new Date(), "YYYY-MM-DD") })
        : form.setFieldsValue({
            paymentDate: moment(transactionDetail.paymentDate, "YYYY-MM-DD"),
          });
    } else {
      form.setFieldsValue("paymentDate", undefined);
    }
    // console.log("Payment date", form.getFieldValue('paymentDate'), moment(new Date(), "YYYY-MM-DD"))
  };

  return (
    <Drawer
      title={`${editTransaction ? "Edit" : "New"} Transactions Details`}
      placement="right"
      closable={true}
      width={400}
      onClose={() => dispatch({ type: "CLOSE_CREATE_TRANSACTION_DRAWER" })}
      visible={openCreateTransactionDrawer}
    >
      <Form
        form={form}
        scrollToFirstError={true}
        layout="vertical"
        name="transaction-form"
        onFinish={onFinish}
        initialValues={{
          property: editTransaction
            ? transactionDetail["propertyId"]._id
            : undefined,
          contact:
            editTransaction && transactionDetail["contactId"]?._id
              ? transactionDetail["contactId"]?._id
              : undefined,
          accountId: editTransaction
            ? transactionDetail["accountId"]?._id
            : undefined,
          amount: editTransaction ? transactionDetail.amount : 0,
          additionalInfo:
            editTransaction && transactionDetail.additionalInfo
              ? transactionDetail.additionalInfo
              : "",
          paymentDate:
            editTransaction && transactionDetail.paymentDate
              ? moment(new Date(transactionDetail.paymentDate), "YYYY-MM-DD")
              : undefined,
          // paymentDate: editTransaction ? (transactionDetail.paymentDate && format(transactionDetail.paymentDate, "YYYYMMDD")) : format(new Date(), "YYYYMMDD"),
          paymentMethod:
            editTransaction &&
            transactionDetail.paymentMethod &&
            transactionDetail.paymentMethod,
          paid:
            editTransaction && transactionDetail.status === "Paid"
              ? true
              : false,

          transactionDate: editTransaction
            ? moment(
                new Date(transactionDetail["transactionDate"]),
                "YYYY-MM-DD"
              )
            : moment(new Date(), "YYYY-MM-DD"),
        }}
      >
        <Form.Item
          name="contact"
          rules={[
            {
              required: true,
            },
          ]}
          label={getTransactionIdentifierLable()}
        >
          <Select
            placeholder={getTransactionIdentifierLable()}
            disabled={editTransaction && transactionDetail.rentalInvoice}
            className="w-100"
            size="large"
            loading={contactsLoading}
            onChange={(value) => onContactChange(value)}
          >
            {contactsData?.map(
              (contact) =>
                contact.firstName && (
                  <Option key={contact.contactId} value={contact.contactId}>
                    <Space size="large">
                      <span>
                        {contact.firstName} {contact.lastName}
                      </span>
                      <Tag color={tagColor[get(contact, "role", "")]}>
                        {get(contact, "role", "")}
                      </Tag>
                    </Space>
                  </Option>
                )
            )}
            <Option key="addContact" value="addContact">
              Add Contact
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="property"
          label="Select Property"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select Property"
            disabled={editTransaction && transactionDetail.rentalInvoice}
            className="w-100"
            size="Large"
            loading={propertyLoading}
            onChange={handlePropertyChange}
          >
            <Option value="new">Add New Property</Option>
            {propertyData?.fetchProperty?.data?.map(
              (property) =>
                property.address && (
                  <Option key={property.propertyId} value={property.propertyId}>
                    {property.privateTitle
                      ? property.privateTitle
                      : property.title}
                  </Option>
                )
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name={"transactionDate"}
          label="Select Transaction Date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker
            disabled={editTransaction && transactionDetail.rentalInvoice}
            format="DD-MM-YYYY"
            size="large"
            className="w-100"
          />
        </Form.Item>
        <Form.Item
          name="accountId"
          label={getTransactionTypeLable()}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder={
              transactionType === "outflow"
                ? "Select Expense Type"
                : "Select Income Type"
            }
            loading={accountsLoading}
            className="w-100"
            size="large"
          >
            <OptGroup label={nameOfAmountType}>
              {accountsData?.getChartOfAccount?.data[transactionType]?.map(
                (accountType) =>
                  accountType.accountName && (
                    <Option key={accountType._id} value={accountType._id}>
                      {accountType.accountName}
                    </Option>
                  )
              )}
            </OptGroup>
            <OptGroup label={nameOfAmountFlow}>
              {accountsData?.getChartOfAccount?.data[typeOfAmountFlow]?.map(
                (accountType) =>
                  accountType.accountName && (
                    <Option key={accountType._id} value={accountType._id}>
                      {accountType.accountName}
                    </Option>
                  )
              )}
            </OptGroup>
          </Select>
        </Form.Item>
        <Form.Item
          name="amount"
          label="Total Amount"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            className="w-100"
            size="large"
            onBlur={(event) =>
              form.setFieldsValue({
                amount: currencyFormatter(
                  event.target.value.replace(/[^0-9.-]+/g, "")
                ),
              })
            }
            parser={currencyParser}
            disabled={editTransaction}
          />
        </Form.Item>
        <Form.Item
          name="additionalInfo"
          label="Additional Info"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input
            placeholder="Add additional info that you want to remember"
            size="large"
            className="w-100"
          />
        </Form.Item>
        <Form.Item
          name="paid"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Switch
            disabled={editTransaction && transactionDetail.rentalInvoice}
            checkedChildren="Paid"
            size="default"
            defaultChecked={
              editTransaction && transactionDetail.status === "Paid"
            }
            unCheckedChildren="Unpaid"
            onChange={(checked) => onPaymentStatusChange(checked)}
          />
        </Form.Item>
        {paid && (
          <>
            <Form.Item
              name="paymentDate"
              label="Select Payment Date"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <DatePicker size="large" className="w-100" />
            </Form.Item>
            <Form.Item
              name="paymentMethod"
              label="Select Payment Method"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Payment Method"
                className="w-100"
              >
                <Option key="Cash" value="Cash">
                  Cash
                </Option>
                <Option key="Bank" value="Bank">
                  Bank
                </Option>
                <Option key="Card" value="Card">
                  Card
                </Option>
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item
          name="image"
          label="Image"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Upload
            name="image"
            listType="picture"
            fileList={image.fileList}
            onPreview={handleImagePreview}
            onChange={handleImageChange}
            beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
          >
            {image.fileList.length < 1 && (
              <Button size="large" icon={<UploadOutlined />}>
                Click to upload
              </Button>
            )}
          </Upload>
          <Modal
            visible={image.previewVisible}
            title={image.previewTitle}
            footer={null}
            onCancel={handleImageCancel}
          >
            <img
              alt="previewImage"
              style={{ width: "100%" }}
              src={image.previewImage}
            />
          </Modal>
        </Form.Item>
        <Divider style={{ "background-color": "black" }} />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting || creating || updating}
            icon={<SaveOutlined />}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      {openAddContactModal && (
        <AddContact setContacts={(val) => setContacts(val)} />
      )}
    </Drawer>
  );
};

export default CreateTransactionDrawer;
