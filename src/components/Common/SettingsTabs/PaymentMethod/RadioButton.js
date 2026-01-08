import { Radio } from "antd";
import React from "react";
import TransferwiseLogo from "../CommonInfo/image/wise.svg";
import StripeLogo from "../CommonInfo/image/stripelogo.png";
import "./radiobutton.scss";

const RadioButton = ({ paymentType, setPaymentType, disabled }) => {
  return (
    <div className="payment_radio-container">
      <Radio.Group
        defaultValue=""
        onChange={(e) => setPaymentType(e.target.value)}
        disabled={disabled}
      >
        <Radio
          value="automatic"
          className={paymentType === "automatic" ? "active" : ""}
        >
          <div className="radio-button">
            <span>Automatic{""}</span>
            <span className="icon">
              <img src={StripeLogo} alt="gocardless" />
            </span>
          </div>
        </Radio>
        <Radio
          value="manual"
          className={paymentType === "manual" ? "active" : ""}
        >
          <div className="radio-button">
            <span>Manual&nbsp;&nbsp;</span>
            <span>
              <img className="wiseImg" src={TransferwiseLogo} alt="" />
            </span>
          </div>
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default RadioButton;
