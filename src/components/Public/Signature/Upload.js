import { Button, Col, message, Row, Spin } from "antd";
import React, { useRef, useState } from "react";
import cookie from "react-cookies";
import axios from "axios";

const Upload = ({ onDataChange, data, type }) => {
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const uploadImage = async (file) => {
    try {
      setLoading(true);
      const token = await cookie.load(process.env.REACT_APP_AUTH_TOKEN);
      const frmData = new FormData();
      frmData.append("image", file);
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/v1/upload-image`,
        frmData,
        {
          headers: {
            authorization: token,
          },
        }
      );
      onDataChange("imageUrl", data.data.uri);
      setLoading(false);
    } catch (error) {
      message.error("Server error, try again later!");
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const handleInputClick = () => {
    inputRef.current.click();
  };

  return (
    <Spin tip="Uploading..." spinning={loading}>
      <Row gutter={[16, 16]} className="type-signature">
        <Col span={24} className="signature-upload-section">
          <div>
            <h6>Signature Preview</h6>
            <div>Preview</div>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              hidden
              onChange={handleFileInputChange}
            />
          </div>
          <Button
            className="signature-upload-button"
            onClick={handleInputClick}
          >
            Upload
          </Button>
        </Col>
        <Col span={24} className="signature-image-section">
          {type && data.imageUrl && (
            <img
              src={data.imageUrl}
              alt="signature"
              className="signature-image"
            />
          )}
        </Col>
      </Row>
    </Spin>
  );
};

export default Upload;
