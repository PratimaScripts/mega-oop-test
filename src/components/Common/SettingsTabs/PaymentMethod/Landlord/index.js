import { Row, Col, Typography } from "antd";
import React, { useState } from "react";
import RadioButton from "../RadioButton";

const LandlordPaymentMethod = () => {

  const [paymentType, setPaymentType] = useState("")

  return (
    <div>
      <Row gutter={[8, 16]}>
        <Col span={24}>
          <h3>How do you want to get paid?</h3>
        </Col>
        <Col span={24}>
          <Typography>
            We don’t hold any payment unless it is specified on transaction or
            options such as redirect Rental deposit to Statutory custodian
            scheme. This integration feature is provided to Landlord to choose
            how to receive Rental money earnings.
          </Typography>
        </Col>
        <Col span={24}>
          <RadioButton
            paymentType={paymentType}
            setPaymentType={setPaymentType}
          />
        </Col>
      </Row>
    </div>
  );
};

export default LandlordPaymentMethod;
