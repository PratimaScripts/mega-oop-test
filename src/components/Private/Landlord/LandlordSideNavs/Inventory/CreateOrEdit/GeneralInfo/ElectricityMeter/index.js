import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ConditionDropdown } from "../../Dropdown";
import InputWithLabel from "../../InputWithLabel";

import { electricityMeter } from "../../object-types";

import "./styles.scss";

const ElectricityMeter = ({ updateRef, objKey, initialState }) => {
  const [meters, setMeters] = useState([]);

  useEffect(() => {
    setMeters(initialState);
  }, [initialState]);

  const handleOnChange = (index, name, value) => {
    const newArr = [...meters];
    let _meter = newArr[index];
    _meter = {
      ..._meter,
      [name]: value,
    };
    newArr[index] = _meter;
    setMeters(newArr);
    updateRef(objKey, newArr);
  };

  const handleAddNewRow = () => {
    const newArr = [...meters, electricityMeter];
    setMeters(newArr);
    updateRef(objKey, newArr);
  };

  const handleOnDelete = (index) => {
    const newArr = [...meters];
    newArr.splice(index, 1);
    setMeters(newArr);
    updateRef(objKey, newArr);
  };

  return (
    <>
      {meters.map((data, index) => (
        <div
          key={`electric-meter-${index}`}
          className="row bg-light mx-0 mb-3 py-3"
          // className="meter-reading-row__wrapper"
          // gutter={[16, 16]}
        >
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <InputWithLabel
              type="string"
              title="Type Of Meter"
              name="typeOfMeter"
              value={data.typeOfMeter}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <InputWithLabel
              type="number"
              title="Serial No"
              name="serialNo"
              value={data.serialNo}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <InputWithLabel
              type="number"
              title="kwh"
              name="kwh"
              value={data.kwh}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <ConditionDropdown
              name="condition"
              value={data.condition}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-9">
            <InputWithLabel
              type="string"
              title="Notes"
              name="notes"
              value={data.notes}
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

export default ElectricityMeter;
