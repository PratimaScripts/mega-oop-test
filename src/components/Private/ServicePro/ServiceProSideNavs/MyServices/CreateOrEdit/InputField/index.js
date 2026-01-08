import { Input, Typography } from "antd";
import React from "react";
import "./style.scss";

const InputField = ({
  title,
  textArea,
  placeholder,
  name,
  prefix,
  value,
  onChange,
}) => {
  return (
    <div className="input-field__container">
      <Typography.Text className="title">{title}</Typography.Text>
      {textArea ? (
        <Input.TextArea
          name={name}
          className="input-field"
          placeholder={placeholder}
          maxLength={300}
          minLength={100}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          name={name}
          className="input-field"
          placeholder={placeholder}
          prefix={prefix}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default InputField;
