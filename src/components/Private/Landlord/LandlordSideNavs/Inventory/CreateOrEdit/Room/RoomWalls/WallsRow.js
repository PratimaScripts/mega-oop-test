// import { Button, Col, Row } from "antd";
import React from "react";
import { WearAndTearDropdown } from "../../Dropdown";
import { DragOutlined } from "@ant-design/icons";
import InputWithLabel from "../../InputWithLabel";
import "./styles.scss";

const WallsRow = ({ onChange, wallRowIndex, data, onRowDelete }) => {
  const handleOnChange = (name, value) => {
    onChange({ ...data, [name]: value }, wallRowIndex);
  };

  return (
    <div className="row bg-light mb-3 py-3 m-0">
      <div className="col d-flex align-items-center" style={{maxWidth: 30}}>
        <DragOutlined className="move-icon" />
      </div>
      <div className="col row">
        <div className="my-1 col-12 col-md-6  col-lg-3">
          <InputWithLabel
            title="Item"
            name="item"
            value={data.item}
            onChange={handleOnChange}
          />
        </div>
        <div className="my-1 col-12 col-md-6  col-lg-3">
          <InputWithLabel
            title="Description"
            name="description"
            value={data.description}
            onChange={handleOnChange}
          />
        </div>
        <div className="my-1 col-12 col-md-6  col-lg-3">
          <WearAndTearDropdown
            value={data.wearAndTear}
            onChange={handleOnChange}
            name="wearAndTear"
          />
        </div>
        <div className="my-1 col-12 col-md-6  col-lg-3">
          <InputWithLabel
            title="Comments"
            value={data.comments}
            onChange={handleOnChange}
            name="comments"
          />
        </div>
      </div>

      <div className="col-12 col-md-1 d-flex align-items-center" style={{maxWidth: 90}}>
        <button
          className="btn btn-danger btn-sm my-3"
          onClick={() => onRowDelete(wallRowIndex)}
        >
          <i className="fas fa-trash-alt p-2" />
        </button>
      </div>
    </div>
  );
};

export default WallsRow;
