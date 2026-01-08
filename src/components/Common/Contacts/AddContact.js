import React, { useState, useContext } from "react";
import {
  Select,
  Input,
  Switch,
  Form,
  Drawer,
  Modal,
  Divider,
  Button,
} from "antd";

import get from "lodash/get";
import { SaveOutlined } from "@ant-design/icons";
import NProgress from "nprogress";
// import SuggestionDropdown from "components/Common/SettingsTabs/CommonInfo/Downshift";
// import LoqateAddress from "config/AddressAutoCompleteLoqate";
import LoqateAddressFull from "config/LoqateGetFullAddress";
import CountryCodeSelector from "config/CountryCodeSelector";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import { useLazyQuery, useMutation } from "react-apollo";
import contacts from "config/queries/contacts";
import showNotification from "config/Notification";
import AddressAutocomplete from "components/Common/AddressAutocomplete";
import GridContactCard from "./GridContactCard";
import "./addContactStyles.scss";

const AddContact = (props) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { state: interfaceState, dispatch: interfaceDispatch } =
    useContext(InterfaceContext);
  const { openAddContactModal } = interfaceState;
  const [showCompany, setShowCompany] = useState(false);
  const [loqateData, setLoqateData] = useState({});
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState(undefined);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [contactData, setContactData] = useState({});
  const [showExistingUserModal, setExistingUserModal] = useState(false);

  const findAddress = async (address) => {
    let fullAddress = await LoqateAddressFull(address.Id);
    let completeAddress = fullAddress.Items[0];
    if (completeAddress) {
      // setInitialData

      let addressObj = {
        fullAddress: completeAddress.Label,
        addressLine1: completeAddress["Company"]
          ? completeAddress["Company"]
          : completeAddress["Line1"],
        addressLine2: completeAddress["Company"]
          ? `${completeAddress["Line1"]}, ${completeAddress["Line2"]}`
          : completeAddress["Line2"],
        city: completeAddress["City"],
        state: completeAddress["Province"],
        zip: completeAddress["PostalCode"],
        country: completeAddress["CountryName"],
        // ...completeAddress
      };
      form.setFieldsValue(addressObj);
      setLoqateData({ address: addressObj });
      setAddress(addressObj.fullAddress);
    }
  };

  const [createContact, { loading: confirmLoading }] = useMutation(
    contacts.createContact,
    {
      onCompleted: ({ createContact }) => {
        if (createContact.success) {
          showNotification("success", createContact.message, "");
          if (props.setNewContactAdded) {
            props.setNewContactAdded(true);
          }
          if (props.setContacts) {
            props.setContacts(createContact.data);
          }
          interfaceDispatch({ type: "CLOSE_ADD_CONTACT_MODAL" });
        } else {
          showNotification("error", createContact.message, "");
        }
        NProgress.done();
      },
      onError: ({ graphQLErrors, networkError }) => {
        // setLoading(false)
        showNotification(
          "error",
          "Not able to process your request",
          "Try Again"
        );
        NProgress.done();
      },
    }
  );

  const [searchUserByEmailRoleQuery] = useLazyQuery(
    contacts.getUserByEmailAndRole,
    {
      onCompleted: ({ getUserByEmailAndRole }) => {
        if (get(getUserByEmailAndRole, "success", false)) {
          setContactData(getUserByEmailAndRole.data);
          setExistingUserModal(true);
        } else {
          showNotification(
            "info",
            "User not found",
            "Add additional fields manually"
          );
          setShowAdditionalFields(true);
        }
        NProgress.done();
      },
      onError: ({ graphQLErrors, networkError }) => {
        // setLoading(false)
        showNotification(
          "error",
          "Not able to process your request",
          "Try Again"
        );
        NProgress.done();
      },
    }
  );

  const handleFormSubmit = (values) => {
    // props.setLoading(true)
    // console.log("values: ", { ...values, phoneNumber });
    createContact({
      variables: {
        contact: { ...values, phoneNumber, countryCode, ...loqateData.address },
      },
    });
  };

  const searchContact = () => {
    const values = form.getFieldsValue(true);
    // console.log(values)
    if (values.email === undefined || values.role === undefined) {
      form.validateFields(["email", "role"]);
      return;
    }
    NProgress.start();
    searchUserByEmailRoleQuery({
      variables: { ...values, email: values.email.toLowerCase() },
    });
  };

  const createContactExistingUser = () => {
    if (
      contactData._id !== undefined &&
      contactData.role !== undefined &&
      contactData.email !== undefined
    ) {
      NProgress.start();
      createContact({
        variables: {
          contact: {
            email: contactData.email,
            role: contactData.role,
            userId: contactData._id,
          },
        },
      });
    }
  };

  return (
    <>
      <Drawer
        title="Add New Contact"
        placement="right"
        closable={true}
        width={400}
        onClose={() => interfaceDispatch({ type: "CLOSE_ADD_CONTACT_MODAL" })}
        visible={openAddContactModal}
      >
        <Form
          form={form}
          scrollToFirstError={true}
          layout="vertical"
          name="contact-form"
          className="contact-form"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="role"
            label="Contact Type"
            className="contact_page--label"
            rules={[{ required: true, message: "Please select Contact Type!" }]}
          >
            <Select
              placeholder="Select Contact Type"
              className="w-100"
              size="large"
            >
              <Option key="landlord" value="landlord">
                Landlord
              </Option>
              <Option key="servicepro" value="servicepro">
                ServicePro
              </Option>
              <Option key="renter" value="renter">
                Tenant
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            className="contact_page--label mt-2"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input
              placeholder="Email Address"
              size="large"
              className="w-100 input-field"
            />
          </Form.Item>

          {!showAdditionalFields ? (
            <Form.Item className="mt-2">
              <Button
                className="btn-contact"
                type="primary"
                htmlType="button"
                onClick={searchContact}
              >
                Next <i className="fa fa-angle-double-right ml-2" />
              </Button>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="firstName"
                label="First Name"
                className="contact_page--label mt-2"
                rules={[
                  {
                    required: true,
                    message: "Please enter first name!",
                  },
                ]}
              >
                <Input
                  placeholder="First Name"
                  size="large"
                  className="w-100 input-field"
                />
              </Form.Item>
              {/* 

                        <Form.Item
                            name="middleName"
                            label="Middle Name"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}>
                            <Input
                                placeholder="Middle Name"
                                size="large"
                                className="w-100"
                            />
                        </Form.Item>
                     */}

              <Form.Item
                name="lastName"
                label="Last Name"
                className="contact_page--label mt-2"
                rules={[
                  {
                    required: true,
                    message: "Please enter last name!",
                  },
                ]}
              >
                <Input
                  placeholder="Last Name"
                  size="large"
                  className="w-100 input-field"
                />
              </Form.Item>

              <p
                style={{ marginBottom: "5px" }}
                className="contact_page--label mt-2"
              >
                Phone Number
              </p>
              <CountryCodeSelector
                name="phoneNumber"
                countryCode={countryCode}
                value={`${countryCode}${phoneNumber}`}
                setValue={(val, countryCode) => {
                  setPhoneNumber(val);
                  setCountryCode(countryCode);
                }}
                className={"tab__deatils--input"}
              />
              {/* </Form.Item> */}
              <p
                style={{ marginBottom: "5px", marginTop: "10px" }}
                className="contact_page--label"
              >
                Address
              </p>

              {/* <SuggestionDropdown
                    LoqateAddress={LoqateAddress}
                    findAddress={findAddress}
                    loqateData={get(loqateData, "address")}
                    // register={register}
                    required={false}
                    label="address"
                    value={address}
                // disabled={isUpdateProperty()}
                /> */}
              <AddressAutocomplete
                placeholder="Enter the address"
                findAddress={findAddress}
                value={address}
                required={false}
                onChange={setAddress}
              />

              <Form.Item
                name="isCompany"
                className="contact_page--label"
                label="Display Company"
                rules={[
                  {
                    required: false,
                  },
                ]}
                style={{ flexDirection: "row", marginTop: "20px" }}
              >
                <Switch
                  checkedChildren="Yes"
                  size="default"
                  // defaultChecked={true}
                  unCheckedChildren="No"
                  style={{ float: "right" }}
                  onChange={(checked) => setShowCompany(checked)}
                />
              </Form.Item>

              {showCompany && (
                <>
                  <Form.Item
                    name="companyName"
                    className="contact_page--label"
                    label="Company Name"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ marginTop: "0px" }}
                  >
                    <Input
                      placeholder="Company Name"
                      size="large"
                      className="w-100 input-field"
                    />
                  </Form.Item>

                  <Form.Item
                    name="companyNumber"
                    className="contact_page--label mt-2"
                    label="Company Reg. Number"
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Company Registration Number"
                      size="large"
                      className="w-100 input-field"
                    />
                  </Form.Item>
                </>
              )}
              {/* <Form.Item
                        name="invite"
                     >
                        <Checkbox defaultChecked={true}>
                            Send invitation to join RentOnCloud
                        </Checkbox>
                </Form.Item> */}
              <Divider />
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-contact"
                  icon={<SaveOutlined style={{ verticalAlign: "middle" }} />}
                >
                  Create Contact
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </Drawer>
      {showExistingUserModal && (
        <Modal
          title="Add Contact"
          closable={true}
          visible={showExistingUserModal}
          destroyOnClose
          okText="Add Contact"
          onCancel={() => setExistingUserModal(false)}
          onOk={() => createContactExistingUser()}
          confirmLoading={confirmLoading}
          zIndex={1051}
        >
          <GridContactCard
            item={{ ...contactData, userId: contactData._id }}
            showActions={false}
          />
        </Modal>
      )}
    </>
  );
};

export default AddContact;
