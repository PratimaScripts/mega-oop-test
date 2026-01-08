import React from "react";
import { ConditionDropdown, WearAndTearDropdown } from "../../Dropdown";
import { DragOutlined } from "@ant-design/icons";
import InputWithLabel from "../../InputWithLabel";
import "./styles.scss";

const EquipmentRow = ({ onChange, equipmentRowIndex, data, onRowDelete }) => {
  const handleOnChange = (name, value) => {
    onChange({ ...data, [name]: value }, equipmentRowIndex);
  };

  return (
    <div className="row bg-light mb-3 py-3 m-0">
      <div className="col d-flex align-items-center" style={{ maxWidth: 30 }}>
        <DragOutlined className="move-icon" />
      </div>
      <div className="col row">
        <div className=" my-1 col-12 col-md-6 col-lg-3">
          <InputWithLabel
            title="Equipment(s)"
            name="name"
            value={data.name}
            onChange={handleOnChange}
          />
        </div>
        <div className=" my-1 col-12 col-md-6 col-lg-3">
          <InputWithLabel
            title="Description"
            name="description"
            value={data.description}
            onChange={handleOnChange}
          />
        </div>
        <div className=" my-1 col-12 col-md-6 col-lg-3">
          <WearAndTearDropdown
            value={data.wearAndTear}
            onChange={handleOnChange}
            name="wearAndTear"
          />
        </div>
        <div className=" my-1 col-12 col-md-6 col-lg-3">
          <ConditionDropdown
            value={data.condition}
            onChange={handleOnChange}
            name="condition"
          />
        </div>
        <div className=" my-1 col-12">
          <InputWithLabel
            title="Comments"
            value={data.comments}
            onChange={handleOnChange}
            name="comments"
          />
        </div>
      </div>
      <div className="col d-flex align-items-center" style={{ maxWidth: 90 }}>
        <button
          // danger
          // type="primary"
          className="btn btn-danger btn-sm my-3"
          onClick={() => onRowDelete(equipmentRowIndex)}
        >
          <i className="fas fa-trash-alt p-2" />
        </button>
      </div>
    </div>
  );
};

export default EquipmentRow;
