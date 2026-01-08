import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ConditionDropdown, WearAndTearDropdown } from "../../Dropdown";
import InputWithLabel from "../../InputWithLabel";
import { otherItem } from "../../object-types";

import "./styles.scss";

const OtherItem = ({ updateRef, objKey, initialState }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(initialState);
  }, [initialState]);

  const handleOnChange = (index, name, value) => {
    const newArr = [...items];
    let _meter = newArr[index];
    _meter = {
      ..._meter,
      [name]: value,
    };
    newArr[index] = _meter;
    setItems(newArr);
    updateRef(objKey, newArr);
  };

  const handleAddNewRow = () => {
    const newArr = [...items, otherItem];
    setItems(newArr);
    updateRef(objKey, newArr);
  };

  return (
    <>
      {items.map((data, index) => (
        <div
          key={`other-item-${index}`}
          // className="other-item-row__wrapper"
          className="row bg-light mx-0 mb-3 py-3"
          // gutter={[16, 16]}
        >
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <InputWithLabel
              type="string"
              title="Equipments"
              name="equipments"
              value={data.equipments}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <InputWithLabel
              type="string"
              title="Description"
              name="description"
              value={data.description}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-12 col-sm-6 mt-2 col-md-6 col-lg-3">
            <WearAndTearDropdown
              name="wearAndTear"
              value={data.wearAndTear}
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
          <div className="col-12 mt-2 col-md-12 col-lg-9">
            <InputWithLabel
              type="string"
              title="Comments"
              name="comments"
              value={data.comments}
              onChange={(name, value) => handleOnChange(index, name, value)}
            />
          </div>
          <div className="col-lg-12">
            <button className="btn btn-sm btn-danger mt-3"
              // onClick={() => onRowDelete(wallRowIndex)}
            >
              <i className="fas fa-trash-alt mr-2"/> Delete
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

export default OtherItem;
