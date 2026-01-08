import { Select, Typography } from "antd";
import React from "react";

const { Option } = Select;

const WearAndTear = ({ value, onChange, name }) => {
  return (
    <>
    <Typography>Wear & Tear</Typography>
    <Select defaultValue={value} onChange={(value) => onChange(name, value)} style={{width: "100%"}}>
      <Option value="notVerified">Not Verified</Option>
      <Option value="new">New</Option>
      <Option value="goodCondition">Good Condition</Option>
      <Option value="averageCondition">Average Condition</Option>
      <Option value="poorCondition">Poor Condition</Option>
    </Select>
    </>
  );
};

export default WearAndTear;
