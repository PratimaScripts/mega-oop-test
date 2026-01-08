import { Button, Col } from "antd";
import React from "react";

const CreateButton = ({ onClick }) => {
  return (
    <Col span={24} className="signature-button">
      <Button type="primary" onClick={onClick}>
        Create Signature
      </Button>
    </Col>
  );
};

export default CreateButton;
