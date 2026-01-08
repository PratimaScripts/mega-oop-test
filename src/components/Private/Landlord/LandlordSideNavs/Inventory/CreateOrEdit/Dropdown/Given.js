import { Select, Typography } from "antd";
import React from "react";

const { Option } = Select;

const Given = ({ value, onChange, name }) => {
  return (
    <>
      <Typography>Given</Typography>
      <Select defaultValue={value} onChange={(value) => onChange(name, value)} style={{width:"100%"}}>
        <Option value="">Select</Option>
        <Option value={false}>False</Option>
        <Option value={true}>True</Option>
      </Select>
    </>
  );
};

export default Given;
