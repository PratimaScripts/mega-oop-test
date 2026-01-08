import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Switch, Input, Button, Select } from "antd";
import "./styles.scss";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import contactQueries from "../../../../../../../config/queries/contacts";
import accountQueries from "../../../../../../../config/queries/account";
import { useQuery } from "react-apollo";
import ComingSoonWrapper from "components/Common/ComingSoonWrapper";
import { BackButton } from "../Buttons";

const { Option } = Select;

const ContactItem = ({ name, email }) => {
  return (
    <div className="name">
      Name:<span>{name}</span> &nbsp; &nbsp; &nbsp; Email:<span>{email}</span>
    </div>
  );
};

let guarantorItem = { email: "", name: "", mobile: "" };

const Signatories = ({
  onGuarantorsChange,
  guarantors,
  onSubmit,
  contacts,
  agreementType,
  onBack,
}) => {
  const { data } = useQuery(contactQueries.getContactList);
  const { data: profileInfo } = useQuery(accountQueries.fetchProfileAbout);

  const [contactsData, setContactsData] = useState([]);
  const [hasGuarantors, setHasGuarantors] = useState(false);
  const [guarantorsData, setGuarantorsData] = useState([]);

  //
  // const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    if (data?.getContactList) {
      const d = data?.getContactList?.data.filter((item) =>
        contacts.includes(item.contactId)
      );
      setContactsData(d);
    }
  }, [data, contacts]);

  useEffect(() => {
    setGuarantorsData(guarantors);
    setHasGuarantors(guarantors.length !== 0);
  }, [guarantors]);

  const handleAddNewGuarantors = () => {
    setGuarantorsData([...guarantorsData, guarantorItem]);
  }

  const handleRemoveGuarantors = (index) => {
    setGuarantorsData(guarantorsData.filter((_, i) => i !== index))
  };

  const handleChangeGuarantorData = (index, type, value) => {
    const _data = [...guarantorsData];
    const i = _data.findIndex((_, i) => i === index);
    if (i !== -1) {
      _data[i][type] = value;
    }
    onGuarantorsChange(_data);

    guarantorItem = { email: "", name: "", mobile: "" }

  };

  const handleChangeGuarantor = () => {
    if (!hasGuarantors && !guarantorsData.length) {
      setGuarantorsData([guarantorItem]);
    }
    setHasGuarantors(!hasGuarantors);
  };

  return (
    <Row gutter={[0, 20]} className="signatories-wrapper">
      <ComingSoonWrapper>
        <Col span={24} className="landlord-heading">
          <h6>Landlord</h6>
          <div className="landlord-dropdown">
            <Select mode="multiple" placeholder="Add co-landlord" disabled>
              {[...new Array(5)].map((_, index) => (
                <Option key={index} value={index}>
                  Landlord {index}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
      </ComingSoonWrapper>
      {profileInfo.getProfileInformation && (
        <Col span={24}>
          <ContactItem
            name={`${profileInfo.getProfileInformation.data.firstName} ${profileInfo.getProfileInformation.data.lastName}`}
            email={profileInfo.getProfileInformation.data.email}
          />
        </Col>
      )}

      <Col span={24}>
        <h6>Renters</h6>
      </Col>
      <Col span={24}>
        {contactsData.map((contact, index) => (
          <ContactItem
            key={index}
            name={`${contact.firstName} ${contact.lastName}`}
            email={contact.email}
          />
        ))}
      </Col>
      {agreementType !== "upload" && (
        <Fragment>
          <Col span={24} className="d-flex justify-content-between">
            <div className="d-flex">
              <h6 className="mr-2">Guarantors</h6>
              <div>
                <Switch
                  checkedChildren={
                    <CheckOutlined style={{ verticalAlign: "middle" }} />
                  }
                  unCheckedChildren={
                    <CloseOutlined style={{ verticalAlign: "middle" }} />
                  }
                  checked={hasGuarantors}
                  onClick={handleChangeGuarantor}
                />
              </div>
            </div>

            
          </Col>

          {hasGuarantors && (
            <Fragment>
              {guarantorsData.map((item, index) => (
                <Col span={24} className="d-flex" key={`Guarantors-${index}`}>
                  <Input
                    className="mx-2 input-field"
                    placeholder="Full Name of Guarantors"
                    value={item.name}
                    onChange={(e) =>
                      handleChangeGuarantorData(index, "name", e.target.value)
                    }
                  />
                  <Input
                    className="mx-2 input-field"
                    placeholder="Guarantor’s email"
                    defaultValue={item.email}
                    onChange={(e) =>
                      handleChangeGuarantorData(index, "email", e.target.value)
                    }
                  />
                  <Input
                    className="mx-2 input-field"
                    placeholder="Guarantor’s mobile"
                    defaultValue={item.mobile}
                    onChange={(e) =>
                      handleChangeGuarantorData(index, "mobile", e.target.value)
                    }
                  />
                  <Button
                    style={{ color: "red" }}
                    icon={
                      <DeleteOutlined style={{ verticalAlign: "middle" }} />
                    }
                    onClick={() => handleRemoveGuarantors(index)}
                    className="btn-delete"
                  >
                    Delete
                  </Button>
                </Col>
              ))}
            </Fragment>
          )}
          {hasGuarantors && (
              <div>
                <button
                  disabled={guarantorsData.length === 3}
                  onClick={handleAddNewGuarantors}
                  className="btn btn-primary"
                >
                 <PlusOutlined style={{ verticalAlign: "middle" }} /> Add new
                </button>
              </div>
            )}
        </Fragment>
      )}

      <Col span={24} className="button-section">
        <div className="bottom-btn-group">
          <BackButton onClick={onBack}>
            <i className="fa fa-angle-double-left mr-2" />
            {"Back"}
          </BackButton>
          <Button
            className="btn-save-preview mr-3"
            // disabled={btnDisabled}
            onClick={() => {
              // onGuarantorsChange(guarantorsData);
              // setBtnDisabled(true);
              onSubmit({
                preview: true,
              });
            }}
          >
            Save &amp; Preview
          </Button>
          {agreementType === "upload" ? (
            <Button
              className="btns--agreement"
              onClick={() => {
                // onGuarantorsChange(guarantorsData);
                onSubmit();
              }}
              type="primary"
            >
              Complete move-in
            </Button>
          ) : (
            <Button
              className="btns--agreement"
              onClick={() => {
                // onGuarantorsChange(guarantorsData);
                onSubmit({
                  sendForSign: true,
                });
              }}
              type="primary"
            >
              Send For Sign
            </Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Signatories;
