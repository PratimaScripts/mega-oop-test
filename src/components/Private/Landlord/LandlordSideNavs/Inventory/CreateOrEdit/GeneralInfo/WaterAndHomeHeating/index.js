import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ConditionDropdown, WearAndTearDropdown } from "../../Dropdown";
import InputWithLabel from "../../InputWithLabel";
import { heatingMeter } from "../../object-types";

import "./styles.scss";

const WaterAndHomeHeating = ({ updateRef, objKey, initialState }) => {
  const [waterHeatingComponents, setWaterHeatingComponents] = useState([]);

  useEffect(() => {
    setWaterHeatingComponents(initialState);
  }, [initialState]);

  const handleOnChange = (index, name, value) => {
    const newArr = [...waterHeatingComponents];
    let _meter = newArr[index];
    _meter = {
      ..._meter,
      [name]: value,
    };
    newArr[index] = _meter;
    setWaterHeatingComponents(newArr);
    updateRef(objKey, newArr);
  };

  const handleAddNewRow = () => {
    const newArr = [...waterHeatingComponents, heatingMeter];
    setWaterHeatingComponents(newArr);
    updateRef(objKey, newArr);
  };

  return (
    <>
      {waterHeatingComponents.map((data, index) => (
        <div
          key={`water-heating-component-${index}`}
          className="row bg-light mx-0 mb-3 py-3"
          // className="waterAndHomeHeating-row__wrapper"
          // gutter={[16, 16]}
        >
          <div className="col-12 mt-2 col-sm-6 col-md-6 col-lg-3">
            <InputWithLabel
              type="string"
              title="Product Type"
              name="productType"
              value={data.productType}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 mt-2 col-sm-6 col-md-6 col-lg-3">
            <WearAndTearDropdown
              value={data.wearAndTear}
              name="wearAndTear"
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 mt-2 col-sm-6 col-md-6 col-lg-3">
            <ConditionDropdown
              value={data.condition}
              name="condition"
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 mt-2 col-md-6 col-lg-9">
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
              // onClick={() => onRowDelete(wallRowIndex)}
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

export default WaterAndHomeHeating;
