import { Button, Col, Collapse, Row, Typography } from "antd";
import React, { useState } from "react";
import "./styles.scss";

const { Panel } = Collapse;

const Signature = ({ onChange, initialState }) => {
  const [signatureData, setSignatureData] = useState({
    landlord: "",
    renter: "",
  });

  return (
    <div className="signature__wrapper">
      <Collapse defaultActiveKey={0}>
        <Panel header="Upload an image">
          <Row gutter={[16, 16]} className="file-upload-wrapper">
            <Col span={12} className="signature-container">
              <Typography>Landlord signature</Typography>
              <Button
                type="primary"
                onClick={() =>
                  document.getElementById("landlord-signature-input").click()
                }
              >
                Choose an image
              </Button>
              <input
                type="file"
                id="landlord-signature-input"
                accept="image/*"
                style={{ display: "none" }}
              />
              {signatureData.landlord && (
                <img
                  src={signatureData.landlord}
                  alt="signature"
                  className="signature"
                />
              )}
            </Col>
            <Col span={12} className="signature-container">
              <Typography>Ranter signature</Typography>
              <Button
                type="primary"
                onClick={() =>
                  document.getElementById("render-signature-input").click()
                }
              >
                Choose an image
              </Button>
              <input
                type="file"
                id="render-signature-input"
                accept="image/*"
                style={{ display: "none" }}
              />
              {signatureData.renter && (
                <img
                  src={signatureData.renter}
                  alt="signature"
                  className="signature"
                />
              )}
            </Col>
          </Row>
        </Panel>
        <Panel header="Signature"></Panel>
      </Collapse>
    </div>
  );
};

export default Signature;
