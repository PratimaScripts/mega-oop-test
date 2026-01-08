import React, { useRef, useState } from "react";
import { Row, Col, Button, Spin } from "antd";
import SignatureCanvas from "react-signature-canvas";
import cookie from "react-cookies";
import axios from "axios";
import showNotification from "config/Notification";

const Draw = ({ onDataChange, data }) => {
  const WIDTH = window.innerWidth;
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleOnClickClear = () => {
    canvasRef.current.clear();
  };

  const handleOnClickSubmit = () => {
    setLoading(true);
    const canvas = canvasRef.current.getCanvas();

    canvas.toBlob(async (blob) => {
      try {
        const fd = new FormData();
        fd.append("image", blob, "signature.png");

        const token = await cookie.load(process.env.REACT_APP_AUTH_TOKEN);
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER}/api/v1/upload-image`,
          fd,
          {
            headers: {
              authorization: token,
            },
          }
        );
        onDataChange("imageUrl", data.data.uri);
        setLoading(false);
      } catch (error) {
        // console.log(error);
        showNotification("error", "An error occurred!")
      }
    });
  };

  return (
    <Spin tip="Uploading..." spinning={loading}>
      <Row gutter={[16, 16]} className="type-signature">
        <Col span={24}>
          <h6>Signature Preview:</h6>
        </Col>
        <Col span={24} className="signature-canvas">
          <SignatureCanvas
            penColor="blue"
            canvasProps={{ height: WIDTH < 400 ? 700 : 300, className: "sigCanvas" }}
            ref={canvasRef}
          />
          <div className="draw-buttons">
            <Button onClick={handleOnClickClear}>Clear</Button>
            <Button onClick={handleOnClickSubmit} type="default">
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </Spin>
  );
};

export default Draw;
