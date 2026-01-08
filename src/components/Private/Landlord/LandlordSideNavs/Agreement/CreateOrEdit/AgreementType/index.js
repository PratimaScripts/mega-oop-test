import React, { useEffect, useState } from "react";
import { Radio, Select, Space, Typography, Col, Row } from "antd";
import { NextButton } from "../Buttons";
import "./styles.scss";
import showNotification from "config/Notification";
import { agreementTypeValidation } from "../../validators";

const { Option } = Select;

const AgreementType = ({ agreementType, templateType, onNext }) => {
  const [agreement, setAgreement] = useState("");
  const [template, setTemplate] = useState("");

  useEffect(() => {
    setAgreement(agreementType);
    setTemplate(templateType);
  }, [agreementType, templateType]);

  const handleOnNext = async () => {
    try {
      const variables = {
        agreementType: agreement,
      };
      if (agreement === "template") {
        variables.templateType = template;
      }

      await agreementTypeValidation.validate(variables);
      onNext({ agreementType: agreement, templateType: template });
    } catch (error) {
      showNotification("error", "Validation Error", error.message);
    }
  };

  return (
    <Row gutter={[16, 16]} className="agreement-type">
      <Col span={24}>
        <h6>Select Rental Agreement Type</h6>
      </Col>
      <Col span={24}>
        <Radio.Group
          defaultValue=""
          value={agreement}
          onChange={(e) => setAgreement(e.target.value)}
        >
          <Space direction="vertical">
            <Radio className="radioBtn" value="template">
              <Typography>
                Build a digital rental agreement with our tenancy template and
                customise your own.
              </Typography>
            </Radio>

            {agreement === "template" && (
              <div>
                <Select
                  defaultValue={template}
                  onChange={setTemplate}
                  placeholder="Select template"
                >
                  <Option value="" disabled>
                    Select template
                  </Option>
                  <Option value="AssuredShortHoldTenancy">
                    Assured Short Hold Tenancy
                  </Option>
                </Select>
              </div>
            )}
            <Radio className="radioBtn" value="upload">
              If you have your own version of signed rental agreements, upload
              it here.
            </Radio>
          </Space>
        </Radio.Group>
      </Col>
      <Col span={24} className="next-button">
        <NextButton onClick={handleOnNext}>Let's get started</NextButton>
      </Col>
    </Row>
  );
};

export default AgreementType;
