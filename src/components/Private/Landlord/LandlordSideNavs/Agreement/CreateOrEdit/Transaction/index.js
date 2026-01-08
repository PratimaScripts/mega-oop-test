import React, { Fragment, useEffect, useState } from "react";
import {
  // Row,
  // Col,
  Input,
  Select,
  Switch,
  DatePicker,
  Radio,
  Space,
} from "antd";
import { PoundCircleOutlined } from "@ant-design/icons";
import "./styles.scss";
import moment from "moment";
import { BackButton, NextButton } from "../Buttons";
import { renterTransactionValidation } from "../../validators";
import showNotification from "config/Notification";
import { TitleContentWrapper } from "..";
import { PaymentTypeEnum } from "constants/payment";
import ComingSoonWrapper from "components/Common/ComingSoonWrapper";
const { Option } = Select;

const { TextArea } = Input;

const dateFormat = "YYYY-MM-DD";

const Transaction = ({ transaction, onTransactionChange, onBack }) => {
  const [data, setData] = useState({
    hasAutoRecurring: false,
    rate: "",
    paymentScheduleType: "",
    paymentMethod: PaymentTypeEnum.MANUAL,
    paymentStartDate: new Date(),
    invoiceAdvanceDays: "",
    deposit: {
      amount: "",
      type: "",
      hasSecurityDeposit: true,
    },
    information: "",
  });

  useEffect(() => {
    setData(transaction);
  }, [transaction]);

  const handleDataChange = (key, value) =>
    setData((prevState) => ({ ...prevState, [key]: value }));

  const handleDepositDataChange = (key, value) =>
    setData({ ...data, deposit: { ...data.deposit, [key]: value } });

  const handleOnNext = async () => {
    try {
      const variables = {};
      variables.deposit = {};

      variables.hasAutoRecurring = data.hasAutoRecurring ? true : false;
      variables.rate = data.rate;
      variables.paymentScheduleType = data.paymentScheduleType;
      variables.paymentMethod = data.paymentMethod;
      variables.information = data.information;
      variables.deposit.hasSecurityDeposit = data.deposit.hasSecurityDeposit
        ? true
        : false;

      if (data.hasAutoRecurring) {
        variables.paymentStartDate = data.paymentStartDate;
        variables.invoiceAdvanceDays = data.invoiceAdvanceDays;
      }

      if (data.deposit.hasSecurityDeposit) {
        variables.deposit = data.deposit;
      }

      await renterTransactionValidation.validate(variables);
      onTransactionChange(variables);
    } catch (error) {
      showNotification("error", "Validation Error", error.message);
    }
  };

  return (
    <div className="row transaction-wrapper">
      <div className="col-12">
        <h5>Rental amount</h5>
      </div>
      <div className="row col-12">
        <div className="col-12 col-md-8 mb-3 ">
          <div className="row">
            <TitleContentWrapper title={"Amount"}>
              <Input
                placeholder="Enter rent amount"
                prefix={<PoundCircleOutlined className="mr-2" />}
                className="input-field mr-5"
                size="large"
                type="number"
                value={data.rate}
                onChange={(e) => handleDataChange("rate", e.target.value)}
              />
            </TitleContentWrapper>
            <TitleContentWrapper title={"Payment schedule type"}>
              <Select
                placeholder="Select payment schedule type"
                style={{ width: "100%" }}
                value={data.paymentScheduleType}
                defaultValue={""}
                onChange={(value) =>
                  handleDataChange("paymentScheduleType", value)
                }
              >
                <Option value="" disabled>
                  Select
                </Option>
                <Option value="monthly">Monthly</Option>
                <Option value="weekly">Weekly</Option>
                {/* <Option value="biWeekly">biWeekly</Option> */}
              </Select>
            </TitleContentWrapper>
          </div>
        </div>
        <div className="col-12 mb-3">
          <ComingSoonWrapper>
            <div className="d-flex">
              <h5 className="mr-3">Enable auto-recurring Rental invoice</h5>
              <Switch
                disabled
                checked={data.hasAutoRecurring}
                onChange={(value) => {
                  handleDataChange("hasAutoRecurring", value);
                  if (value) {
                    handleDataChange(
                      "paymentMethod",
                      PaymentTypeEnum.AUTOMATIC
                    );
                  }
                }}
                style={{ verticalAlign: "middle" }}
              />
            </div>
          </ComingSoonWrapper>
        </div>
      </div>

      {data.hasAutoRecurring && (
        <Fragment>
          <div className="col-12">
            <div className="d-flex">
              <TitleContentWrapper title="Rental Invoice Date">
                <DatePicker
                  format={dateFormat}
                  className="input-field mr-5"
                  value={moment(data.paymentStartDate, dateFormat)}
                  onChange={(date) =>
                    date ? handleDataChange("paymentStartDate", date) : null
                  }
                />
              </TitleContentWrapper>
              <TitleContentWrapper title="Invoice days in advance">
                <Select
                  placeholder="Invoice days in advance"
                  defaultValue=""
                  value={data.invoiceAdvanceDays}
                  onChange={(value) =>
                    handleDataChange("invoiceAdvanceDays", value)
                  }
                >
                  <Option value="" disabled>
                    Select
                  </Option>
                  {[...new Array(7)].map((_, i) => (
                    <Option
                      key={`rental-advance-option-${i}`}
                      value={`${i + 1}`}
                    >
                      {i + 1}
                    </Option>
                  ))}
                </Select>
              </TitleContentWrapper>
            </div>
          </div>
        </Fragment>
      )}
      <div className="col-12">
        <h5>Payment Method</h5>
      </div>
      <div className="col-12">
        <div>
          <div>
            <Radio.Group
              value={data.paymentMethod}
              onChange={(e) =>
                handleDataChange("paymentMethod", e.target.value)
              }
            >
              <Space direction="horizontal">
                <Radio
                  className="radioBtn"
                  disabled
                  value={PaymentTypeEnum.AUTOMATIC}
                >
                  Automatic
                </Radio>
                <Radio className="radioBtn" value={PaymentTypeEnum.MANUAL}>
                  Manual
                </Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
      </div>
      <div className="col-12 mt-4">
        <h5>Security Deposit</h5>
      </div>
      <div className="col-12">
        <div className="d-flex mb-3">
          <h6 className="mr-3 mt-1">Will a security deposit be required?</h6>
          <Switch
            checked={data.deposit.hasSecurityDeposit}
            onChange={(value) =>
              handleDepositDataChange("hasSecurityDeposit", value)
            }
            style={{ verticalAlign: "middle" }}
          />
        </div>
      </div>
      {data.deposit.hasSecurityDeposit && (
        <div className="col-12">
          <div className="amount-section">
            <TitleContentWrapper title="Deposit amount">
              <Input
                placeholder="Enter deposit amount"
                prefix={<PoundCircleOutlined className="mr-2" />}
                className="mr-5 input-field"
                size="large"
                type="number"
                value={data.deposit.amount}
                onChange={(e) =>
                  handleDepositDataChange("amount", e.target.value)
                }
              />
            </TitleContentWrapper>
            <TitleContentWrapper title="Deposit type">
              <Select
                defaultValue={""}
                value={data.deposit.type}
                onChange={(value) => handleDepositDataChange("type", value)}
                placeholder="Deposit type"
                style={{ width: "100%" }}
              >
                <Option value="" disabled>
                  Select
                </Option>
                <Option value="custodial">Custodial</Option>
                <Option value="insurance">insurance</Option>
              </Select>
            </TitleContentWrapper>
          </div>
        </div>
      )}
      <div className="col-12 px-0">
        <TitleContentWrapper title="Other Information">
          <TextArea
            className="desc-field"
            placeholder="Any other information about deposit protection scheme and who has kept this amount"
            rows={4}
            value={data.information}
            onChange={(e) => handleDataChange("information", e.target.value)}
          />
        </TitleContentWrapper>
      </div>
      <div className="agreement-row-item text-right col-12 my-3">
        <BackButton onClick={onBack}>
          <i className="fa fa-angle-double-left mr-2" />
          Back
        </BackButton>
        <NextButton onClick={handleOnNext}>
          Continue <i className="fa fa-angle-double-right ml-2" />
        </NextButton>
      </div>
    </div>
  );
};

export default Transaction;
