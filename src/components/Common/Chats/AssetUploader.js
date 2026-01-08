import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import get from "lodash/get";
import { Spin } from "antd";
import axios from "axios";
import cookie from "react-cookies";
import showNotification from "config/Notification";

function MyDropzone(props) {
  const [isUploading, setUploading] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState({});

  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        setUploading(true);
        setAcceptedFiles(acceptedFiles[0]);
        // Do something with the files
        var frmData = new FormData();
        frmData.append("file", acceptedFiles[0]);
        frmData.append("filename", acceptedFiles[0].name);
        // for what purpose the file is uploaded to the server.
        frmData.append("uploadType", "Assets");
        let uploadedFile = await axios.post(
          `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
          frmData,
          {
            headers: {
              authorization: await cookie.load(
                process.env.REACT_APP_AUTH_TOKEN
              ),
            },
          }
        );

        props.fileUploaded(uploadedFile.data.data);
        setUploading(false);
      } catch (error) {
        showNotification("error", "An error occurred", error.message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Spin
      spinning={isUploading}
      tip={`Uploading ${get(acceptedFiles, "name")}...`}
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p style={{ cursor: "pointer" }}>
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>
    </Spin>
  );
}

export default MyDropzone;
