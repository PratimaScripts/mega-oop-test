import React, { useState, useContext, useEffect, useRef } from "react";
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
import { createDeposit, updateDeposit } from "config/queries/rentalDeposit";
import { DepositContext } from "./rentalDepositContexts";
import showNotification from "config/Notification";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import AddContact from "components/Common/Contacts/AddContact";
import AddContactBtn from "components/Private/Landlord/AddContactBtn";

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

const CreateDepositDrawer = () => {
  const { push } = useHistory();
  const selectedContact = useRef();

  //property select input methods
  const handlePropertyChange = (value) => {
    if (value === "new") {
      push("/landlord/property/add");
    }
  };

  const { Option, OptGroup } = Select;
  const { dispatch, state } = useContext(DepositContext);
  const { state: interfaceState } = useContext(InterfaceContext);
  const {
    openCreateDepositDrawer,
    transactionType,
    editDeposit,
    releaseDeposit,
    depositDetail,
  } = state;
  const transactionDetail = depositDetail?.transaction;
  const [paid, setPaid] = useState(
    editDeposit && transactionDetail?.status === "Paid" ? true : false
  );
  // console.log("paid", paid);
  const { openAddContactModal } = interfaceState;
  const [contactsData, setContacts] = useState([]);

  // console.log("editData", editDeposit, transactionType, transactionDetail);

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
    if (editDeposit && transactionDetail) {
      setPaid(transactionDetail.status === "Paid" ? true : false);
    } else {
      setPaid(false);
    }

    form.resetFields();
    setImage({ ...image, fileList: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editDeposit, transactionDetail, transactionType]);

  // set the lable of constact list based on type of transaction
  const getTransactionIdentifierLable = () =>
    transactionType === "businessIncome"
      ? "From whom did you receive?"
      : "Who did you pay?";

  const getDepositDrawerTitle = () =>
    transactionType === "businessIncome" ? "New Deposit IN" : "New Deposit OUT";

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

  const currencyFormatter = (selectedCurrOpt) => (value) => {
    return new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: selectedCurrOpt,
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
    selectedContact.current = contactsData.filter(
      (contact) => contact.contactId === value
    )[0];
    // console.log(selectedContact.current)
  };

  const [createDepositMutation] = useMutation(createDeposit, {
    onCompleted: ({ createDeposit }) => {
      if (createDeposit.success) {
        dispatch({
          type: "CREATE_DEPOSIT",
          payload: get(createDeposit, "data", {}),
        });
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
  });

  const [updateDepositMutation] = useMutation(updateDeposit, {
    onCompleted: ({ updateDeposit }) => {
      if (updateDeposit.success) {
        dispatch({ type: "UPDATE_DEPOSIT", payload: updateDeposit.data });
        showNotification("success", "Successfully updated the transaction", "");
      } else {
        showNotification("success", "Failed to update the transaction", "");
      }
    },
    onError: (error) => {
      showNotification("error", `Failed to update the transaction`, "");
    },
  });

  const onFinish = async (values) => {
    setSubmitting(true);
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

    // console.log("form data", values);

    const transactionInput = {
      contactId: values.contact,
      propertyId: values.property,
      accountId: values.accountId,
      transactionType: nameOfAmountType,
      transactionDate: values.transactionDate._d,
      amount: values.amount,
      images: values.photos,
      additionalInfo: values.additionalInfo,
      status: values.paid ? "Paid" : "Pending",
      paymentDate: values.paid ? values.paymentDate._d : undefined,
      paymentMethod: values.paid ? values.paymentMethod : undefined,
    };

    const rentalDepositInput = {
      referenceId: values.referenceId,
      depositType: values.depositType,
      sharedWith: selectedContact?.current?.userId
        ? selectedContact?.current?.userId
        : depositDetail.sharedWith._id,
      depositIncomeType:
        transactionType === "businessIncome" ? "deposit-in" : "deposit-out",
      depositProtectionScheme: values.depositProtectionScheme,
    };

    editDeposit && !releaseDeposit
      ? updateDepositMutation({
          variables: {
            depositId: depositDetail._id,
            transactionInput,
            rentalDepositInput,
          },
        })
      : createDepositMutation({
          variables: { transactionInput, rentalDepositInput },
        });
    // createDepositMutation({ variables: {transactionInput, rentalDepositInput } });

    // reset form values
    form.resetFields();
    setImage({ ...image, fileList: [] });
    // close the drawer
    dispatch({ type: "CLOSE_CREATE_DEPOSIT_DRAWER" });
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
      title={getDepositDrawerTitle()}
      placement="right"
      closable={true}
      width={800}
      onClose={() => dispatch({ type: "CLOSE_CREATE_DEPOSIT_DRAWER" })}
      visible={openCreateDepositDrawer}
    >
      <Form
        form={form}
        scrollToFirstError={true}
        layout="vertical"
        name="transaction-form"
        onFinish={onFinish}
        initialValues={{
          depositType: editDeposit ? depositDetail.depositType : undefined,
          depositProtectionScheme: editDeposit
            ? depositDetail.depositProtectionScheme
            : undefined,
          referenceId: editDeposit ? depositDetail.referenceId : undefined,
          property: editDeposit
            ? depositDetail.transaction.propertyId._id
            : undefined,
          transactionDate: editDeposit
            ? moment(transactionDetail.transactionDate, "YYYY-MM-DD")
            : moment(new Date(), "YYYY-MM-DD"),
          // transactionDate: editDeposit ? format(transactionDetail.transactionDate, "YYYYMMDD") : format(new Date(), "YYYYMMDD"),
          contact:
            editDeposit && transactionDetail.contactId?._id
              ? transactionDetail.contactId?._id
              : undefined,
          accountId:
            editDeposit && !releaseDeposit
              ? transactionDetail.accountId?._id
              : undefined,
          amount: editDeposit ? transactionDetail.amount : 0,
          additionalInfo:
            editDeposit && transactionDetail.additionalInfo
              ? transactionDetail.additionalInfo
              : "",
          paymentDate:
            editDeposit && transactionDetail.paymentDate
              ? moment(transactionDetail.paymentDate, "YYYY-MM-DD")
              : undefined,
          // paymentDate: editDeposit ? (transactionDetail.paymentDate && format(transactionDetail.paymentDate, "YYYYMMDD")) : format(new Date(), "YYYYMMDD"),
          paymentMethod:
            editDeposit && transactionDetail.paymentMethod
              ? transactionDetail.paymentMethod
              : undefined,
          paid:
            editDeposit && transactionDetail.status === "Paid" ? true : false,
        }}
      >
        <div className="row">
          <div className="col-md-6">
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
                placeholder="Renter's Name"
                className="w-100"
                size="large"
                loading={contactsLoading}
                onChange={(value) => onContactChange(value)}
                dropdownRender={(menu) => <AddContactBtn menu={menu} />}
              >
                {contactsData?.map(
                  (contact) =>
                    contact.role === "renter" &&
                    contact.firstName &&
                    contact.userId && (
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
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-6">
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
                className="w-100"
                size="Large"
                loading={propertyLoading}
                onChange={handlePropertyChange}
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
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="referenceId"
              label="Reference ID"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                placeholder="Reference Id of deposit"
                size="large"
                className="w-100"
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="transactionDate"
              label="Select Deposit Date"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker size="large" className="w-100" />
            </Form.Item>
          </div>
          <div className="col-md-6">
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
                formatter={currencyFormatter("GBP")}
                parser={currencyParser}
              />
            </Form.Item>
          </div>
          <div className="col-md-6">
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
                  transactionType === "businessIncome"
                    ? "Select Income Type"
                    : "Select Expense Type"
                }
                loading={accountsLoading}
                className="w-100"
                size="large"
              >
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
          </div>
          <div className="col-md-6">
            <Form.Item
              name="depositType"
              label="Deposit Type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Deposit Type"
                // loading={accountsLoading}
                className="w-100"
                size="large"
              >
                <Option key="Insurance" value="Insurance">
                  Insurance
                </Option>
                <Option key="Custodial" value="Custodial">
                  Custodial
                </Option>
              </Select>
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item
              name="depositProtectionScheme"
              label="Deposit Protection Scheme"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Deposit Protection Scheme"
                // loading={accountsLoading}
                className="w-100"
                size="large"
              >
                <Option key="MyDeposit" value="MyDeposit">
                  MyDeposit
                </Option>
                <Option key="TDS" value="TDS">
                  TDS
                </Option>
                <Option key="DPS" value="DPS">
                  DPS
                </Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-12">
            <Form.Item
              name="paid"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Switch
                checkedChildren="Paid"
                size="default"
                defaultChecked={
                  editDeposit && transactionDetail.status === "Paid"
                }
                unCheckedChildren="Unpaid"
                onChange={(checked) => onPaymentStatusChange(checked)}
              />
            </Form.Item>
          </div>

          {paid && (
            <>
              <div className="col-md-6">
                <Form.Item
                  name="paymentDate"
                  label="Select Payment Date"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-100"
                    // defaultValue={moment(new Date(), "YYYY-MM-DD")}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
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
              </div>
            </>
          )}
          <div className="col-md-6">
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
          </div>
          <div className="col-md-6">
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
          </div>
          <Divider style={{ backgroundColor: "black" }} />
          <div className="col-md-6">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SaveOutlined />}
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
      {openAddContactModal && (
        <AddContact setContacts={(val) => setContacts(val)} />
      )}
    </Drawer>
  );
};

export default CreateDepositDrawer;
