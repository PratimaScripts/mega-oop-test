import { Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import "./styles.scss";

const isNumber = (value) => (isNaN(Number(value)) ? false : true);
const isString = (value) => (typeof value === "string" ? true : false);

const InputWithLabel = ({
  title,
  value: initialState,
  onChange,
  name,
  inputRef,
  caption,
  type = "string",
  isDisabled = false,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(initialState);
  }, [initialState]);

  const handleOnChange = (e) => {
    let _value = e.target.value;
    if (_value) setError("");
    else setError(`${title} is required!`);
    if (type === "number") {
      if (!isNumber(_value)) return setError(`${title} should be a number!`);
      _value = Number(_value);
    }
    if (type === "string") {
      if (!isString(_value)) return setError(`${title} should be a string!`);
      _value = String(_value);
    }
    setValue(_value);
  };

  const handleOnBlur = (e) => {
    if (value === "") return setError(`${title} is required!`);
    if (!error && onChange) return onChange(name, value);
  };

  return (
    <div className="input-with-label__wrapper">
      <Typography>{title}</Typography>
      <div>
        <Input
          ref={inputRef}
          size="large"
          placeholder={title}
          title={title}
          value={value}
          name={name ? name : ""}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          className={error ? "error" : ""}
          disabled={isDisabled}
        />
        {error && <small className="error-text">{error}</small>}
        <br />
        <small>{caption}</small>
      </div>
    </div>
  );
};

export default InputWithLabel;
