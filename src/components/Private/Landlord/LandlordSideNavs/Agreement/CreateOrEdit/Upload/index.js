import React, { useRef, useState } from "react";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import cookie from "react-cookies";
import axios from "axios";
import { message, Spin } from "antd";
import { BackButton, NextButton } from "../Buttons";

const Upload = ({ documentUrl, onDocumentUrlChange, onSubmit, onBack }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const uploadDocument = async (file) => {
    try {
      setLoading(true);
      const frmData = new FormData();
      frmData.append("file", file);
      // for what purpose the file is uploaded to the server.
      frmData.append("uploadType", "Agreement");

      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
        frmData,
        {
          headers: {
            authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
          },
        }
      );
      if (data.success) {
        onDocumentUrlChange(data.data);
      } else {
        message.error("An error occurred!");
      }
      setLoading(false);
    } catch (error) {
      message.error("An error occurred while, please try again.");
      setLoading(false);
    }
  };

  const handleInputClick = () => {
    return fileInputRef.current.click();
  };

  const handleInputFileChange = (event) => {
    const { files } = event.target;
    uploadDocument(files[0]);
  };

  const getDocumentName = () => {
    const arr = documentUrl.split("/");
    const _arr = arr[arr.length - 1].split("-");
    _arr.shift();
    return _arr.join("-");
  };

  return (
    <Spin tip="Uploading..." spinning={loading}>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleInputFileChange}
        accept="application/pdf"
      />
      <div
        className="ant-upload ant-upload-drag p-3"
        onClick={handleInputClick}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </div>
      {documentUrl && (
        <div className="d-flex mt-2">
          <p className="mr-3">{getDocumentName()}</p>
          <DeleteOutlined color="red" onClick={() => onDocumentUrlChange("")} />
        </div>
      )}
      <div className="next-button mt-2">
        <BackButton onClick={onBack}>
          <i className="fa fa-angle-double-left mr-2" />
          Back
        </BackButton>
        <NextButton disabled={!documentUrl} onClick={onSubmit}>
          {"Complete move-in"}
        </NextButton>
      </div>
    </Spin>
  );
};

export default Upload;
