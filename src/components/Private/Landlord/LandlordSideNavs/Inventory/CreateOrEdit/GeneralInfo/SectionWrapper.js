import { Col } from "antd";
import React from "react";

const SectionWrapper = ({ title, children }) => {
  return (
    <div>
      <Col span={24} className="section-title">
        <h4>{title}</h4>
      </Col>
      {children}
    </div>
  );
};

export default SectionWrapper;
