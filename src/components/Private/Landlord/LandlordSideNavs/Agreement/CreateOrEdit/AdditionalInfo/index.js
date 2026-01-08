import React from "react";
import { Row, Col, Input, Button } from "antd";
import "./styles.scss";
import { BackButton } from "../Buttons";

const { TextArea } = Input;

const AdditionalInfo = ({
  additionalInfo,
  onAdditionalInfoChange,
  onNext,
  onBack,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <h6>
          EXCLUSIONS from the Let Premises (e.g. Garage or other outbuildings
          etc)
        </h6>
      </Col>
      <Col span={24}>
        <TextArea
          className="desc-field"
          placeholder="Enter information, to be used in the tenancy agreement"
          rows={4}
          defaultValue={additionalInfo.exclusions}
          onBlur={(e) => onAdditionalInfoChange("exclusions", e.target.value)}
        />
      </Col>
      <Col span={24}>
        <h6>Special clauses individually negotiated between the parties</h6>
      </Col>
      <Col span={24}>
        <TextArea
          className="desc-field"
          placeholder="Enter information, to be used in the tenancy agreement"
          rows={4}
          defaultValue={additionalInfo.additionalInfo}
          onBlur={(e) =>
            onAdditionalInfoChange("additionalInfo", e.target.value)
          }
        />
      </Col>
      <Col span={24} className="next-button">
        <BackButton onClick={onBack}>
          <i className="fa fa-angle-double-left mr-2" /> Back
        </BackButton>
        <Button onClick={onNext} className="btns--agreement" type="primary">
          Continue &nbsp;
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      </Col>
    </Row>
  );
};

export default AdditionalInfo;
