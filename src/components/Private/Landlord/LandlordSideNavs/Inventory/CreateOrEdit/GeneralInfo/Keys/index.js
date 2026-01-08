import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Row,   Typography } from "antd";
import React, { useEffect, useState } from "react";
import { GivenDropdown } from "../../Dropdown";
import InputWithLabel from "../../InputWithLabel";
import { key } from "../../object-types";
import "./styles.scss";

const Keys = ({ updateRef, objKey, initialState }) => {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    setKeys(initialState);
  }, [initialState]);

  const handleOnChange = (index, name, value) => {
    const newArr = [...keys];
    let _meter = newArr[index];
    _meter = {
      ..._meter,
      [name]: value,
    };
    newArr[index] = _meter;
    setKeys(newArr);
    updateRef(objKey, newArr);
  };

  const handleAddNewRow = () => {
    const newArr = [...keys, key];
    setKeys(newArr);
    updateRef(objKey, newArr);
  };
  
  const handleOnDelete = (index) => {
    const newArr = [...keys];
    newArr.splice(index, 1);
    setKeys(newArr);
    updateRef(objKey, newArr);
  };

  return (
    <>
      {keys.map((data, index) => (
        <div
          key={`key-${index}`}
          className="row bg-light mx-0 mb-3 py-3"
          // className="keys-row__wrapper"
          // gutter={[16, 16]}
        >
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <InputWithLabel
              type="string"
              title="Key Type"
              name="keyType"
              value={data.keyType}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <InputWithLabel
              type="number"
              title="No."
              name="number"
              value={data.number}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <GivenDropdown
              name="given"
              value={data.given}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <Typography>Date</Typography>
            <DatePicker
              style={{ width: "100%" }}
              onChange={(e) => handleOnChange(index, "date", e.toISOString())}
              size="large"
            />
          </div>
          <div className="col-12 col-lg-9 mt-2">
            <InputWithLabel
              type="string"
              title="Notes"
              name="comments"
              value={data.comments}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12">
            <button
              className="btn btn-sm btn-danger mt-3"
              onClick={() => handleOnDelete(index)}
            >
              <i className="fas fa-trash-alt mr-2" /> Delete
            </button>
          </div>
        </div>
      ))}
      <Row>
        <Col>
          <Button
            className="inline-center"
            type="default"
            icon={<PlusOutlined />}
            onClick={handleAddNewRow}
          >
            Add More
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Keys;
