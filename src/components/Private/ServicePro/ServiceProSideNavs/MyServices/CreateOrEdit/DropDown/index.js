import { Select } from "antd";
import React from "react";

import "./style.scss";

const { Option } = Select;

const CategoryDropDown = ({
  data,
  value,
  onChange,
  fetchFromString,
  title,
}) => {
  const handleCategoryChange = (value) => {
    onChange(value);
  };

  return (
    <Select
      className="category__dropdown"
      onChange={handleCategoryChange}
      defaultValue={""}
      value={value}
    >
      <Option value="">Select {title}</Option>
      {fetchFromString ? (
        <>
          {data.map((item, key) => (
            <Option key={key} value={item}>
              {item}
            </Option>
          ))}
        </>
      ) : (
        <>
          {data.map((item, key) => (
            <Option key={key} value={item.name}>
              {item.name}
            </Option>
          ))}
        </>
      )}
    </Select>
  );
};

export default CategoryDropDown;
