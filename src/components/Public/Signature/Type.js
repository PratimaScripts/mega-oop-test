import { Row, Col, Input, Typography, Select } from "antd";

import Styled from "styled-components";

const SignaturePreview = Styled.div`
  background-color: #F4FAFC;
  span {
    font-family: ${(props) => (props.fontStyle ? props.fontStyle : `Roboto`)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    white-space: nowrap;
    font-size: 36px;
  }
  display: flex;
  justify-content: center;
  width: 100%;
  height: 200px;
`;

const { Option } = Select;

const Type = ({ onDataChange, data }) => {
  return (
    <Row gutter={[16, 16]} className="type-signature">
      <Col span={24}>
        <Input
          placeholder="Full Name"
          required
          value={data.name}
          onChange={(e) => onDataChange("name",e.target.value)}
        />
      </Col>
      <Col span={24}>
        <h6>Signature Preview</h6>
        <Typography>Full Name</Typography>
        <SignaturePreview fontStyle={data.fontStyle}>
          <span>{data.name}</span>
        </SignaturePreview>
      </Col>
      <Col span={24}>
        <h6>Change Font</h6>
        <Select
          defaultValue=""
          value={data.fontStyle}
          onChange={(value) => onDataChange("fontStyle", value)}
        >
          <Option value="" disabled>
            Change Font
          </Option>
          <Option value={`'Sacramento', cursive`}>Sacramento</Option>
          <Option value={`'Dancing Script', cursive`}>Dancing Script</Option>
        </Select>
      </Col>
    </Row>
  );
};

export default Type;
