import { Divider } from "antd";
import React from "react";
import InputField from "../InputField";

import "./style.scss";

const Variant = ({
  title,
  description,
  price,
  onDescriptionChange,
  onPriceChange,
  variantType,
}) => {
  return (
    <div className="variant__container">
      <div className="bottom-section">
        <div className="description">
          <InputField
            title={`${title} Plan *`}
            name="description"
            placeholder={`What are the ${variantType} plan?\nBe as specific as you can about what needs doing e.g. I will do it...`}
            textArea
            onChange={onDescriptionChange}
            value={description}
          />
        </div>

        <div className="price">
          <InputField
            title={`${variantType} Price *`}
            name={`${variantType}Price`}
            prefix={<i className="fas fa-pound-sign"></i>}
            onChange={onPriceChange}
            value={price}
          />
        </div>
      </div>
      <Divider type="horizontal" />
    </div>
  );
};

export default Variant;
