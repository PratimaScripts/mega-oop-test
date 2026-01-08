import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { InventoryTypeDropdown, TenancyDropdown } from "../Dropdown";
import InputWithLabel from "../InputWithLabel";

const BasicInfo = ({ initialState, updateRef }) => {
  const location = useLocation();
  const isEditPage = location.pathname.includes("edit");

  const [basicInfo, setBasicInfo] = useState({
    type: "checkIn",
    id: "",
    tenancy: "",
  });

  useEffect(() => {
    setBasicInfo(initialState);
  }, [initialState]);

  const handleOnBasicInfoChange = (name, value) => {
    const _basicInfo = {
      ...basicInfo,
      [name]: value,
    };
    setBasicInfo(_basicInfo);
    updateRef(name, value);
  };

  return (
    <div>
      <div className="section-title">
        <h4>General Info</h4>
      </div>

      {/* <Col span={1} className="basic-info"> */}
      <div className="row">
        <div className="col-12 mt-3 col-md-6 col-lg-3">
          <InventoryTypeDropdown
            name="type"
            value={basicInfo.type}
            onChange={handleOnBasicInfoChange}
          />
        </div>

        <div className="col-12 mt-3 col-md-6 col-lg-3">
          <InputWithLabel
            type="string"
            title="Id"
            name="id"
            value={basicInfo.id}
            onChange={handleOnBasicInfoChange}
            caption="Give an unique id to your inventory."
            isDisabled={isEditPage}
          />
        </div>
        <div className="col-12 mt-3 col-md-6 col-lg-3">
          <TenancyDropdown
            title="Tenancy"
            name="tenancy"
            value={basicInfo.tenancy}
            onChange={handleOnBasicInfoChange}
            isDisabled={isEditPage}
          />
        </div>
      </div>
      {/* </Col> */}
    </div>
  );
};

export default BasicInfo;
