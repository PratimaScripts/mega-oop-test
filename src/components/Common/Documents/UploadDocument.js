import React, { useState } from "react";
// import { useQuery, useMutation } from "@apollo/react-hooks";
import { Upload, notification, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from "axios";

// import StorageLevel from "../StorageLevel";
// import moment from "moment";
import cookie from "react-cookies";
// import axios from "axios";
// import { useHistory } from "react-router-dom";


// import PropertyQuery from "config/queries/property";
// import DocumentQuery from "config/queries/document";

// import get from "lodash/get";
// import isEmpty from "lodash/isEmpty";
// import { getDocumentsStorageUsage } from "config/queries/storage";
// import { LIMIT_15_MB, LIMIT_50_MB } from "utils/constants";

const { Dragger } = Upload;


const UploadDocument = ({dragAreaText="Click or drag file to this area to upload"}) => {


  const actions = {
    name: 'file',
    multiple: true,
    action: `${process.env.REACT_APP_SERVER}/api/v1/transaction-file-upload`,
    
    customRequest: (options) => {
        const data= new FormData()
        data.append('file', options.file)
        data.append("uploadType", "Property Gallery")
        data.append("filename", options.file.uid)
        const config= {
          "headers": {
            "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s',
            authorization: cookie.load(process.env.REACT_APP_AUTH_TOKEN)
          }
        }
        console.log("options", options)
        axios.post(options.action, data, config).then((res) => {
          options.onSuccess(res.data, options.file)
        }).catch((err) => {
          console.log(err)
        })
        
      },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
          <Dragger {...actions}>
            <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    
    <p className="ant-upload-text">{dragAreaText}</p>
    <p className="ant-upload-hint">
      Maximum 3MB 
    </p>
  </Dragger>
  );
};

export default UploadDocument;
