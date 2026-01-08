import { Select, Typography } from "antd";
import React from "react";

const { Option } = Select;

const InventoryType = ({ value, onChange, name }) => {
  return (
    <>
      <Typography>Inventory Type</Typography>
      <Select defaultValue={value} onChange={(e) => onChange(name, e)} style={{width: "100%"}}>
        <Option value="checkIn">Check In</Option>
        <Option value="checkOut">Check Out</Option>
      </Select>
    </>
  );
};

export default InventoryType;
