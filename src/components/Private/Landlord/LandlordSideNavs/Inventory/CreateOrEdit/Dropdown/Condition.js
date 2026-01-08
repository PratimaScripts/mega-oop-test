import { Select, Typography } from "antd";
import React from "react";

const { Option } = Select;

const Condition = ({ value, onChange, name }) => {
  return (
    <>
      <Typography>Condition</Typography>
      <Select defaultValue={value} onChange={(value) => onChange(name, value)} style={{width: "100%"}}>
        <Option value="notVerified">Not Verified</Option>
        <Option value="works">Works</Option>
        <Option value="outOfOrder">Out of Order</Option>
      </Select>
    </>
  );
};

export default Condition;
