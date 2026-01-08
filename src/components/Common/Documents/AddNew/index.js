import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Select, Input, Form, DatePicker, Switch, notification } from "antd";
import StorageLevel from "../StorageLevel";
import moment from "moment";
import cookie from "react-cookies";
import axios from "axios";
import { useHistory } from "react-router-dom";

import "./addNew.scss";

import {
  UploadOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import PropertyQuery from "config/queries/property";
import DocumentQuery from "config/queries/document";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getDocumentsStorageUsage } from "config/queries/storage";
import { LIMIT_15_MB, LIMIT_50_MB } from "utils/constants";
import ContactsDropdown from "components/Common/Contacts/ContactsDropdown";

const { TextArea } = Input;

const AddDocument = (props) => {
  const { push } = useHistory();

  // Form states
  const [properties, setProperties] = useState([]);
  const [storageUsed, setStorageUsed] = useState(0);

  const [docDes, setDocDes] = useState("");

  const [documentType, setDocumentType] = useState([]);
  const [property, setProperty] = useState("");
  const [tenancy, setTenancy] = useState([]);
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [sharing, setSharing] = useState(false);

  // Select options
  // Document type options
  const documentTypeOptions = ["Agreement", "Licence", "Public"].map(
    (docType) => {
      return (
        <option key={docType} value={docType}>
          {docType}
        </option>
      );
    }
  );

  // Property options
  useQuery(PropertyQuery.fetchProperty, {
    variables: { draftListing: true },
    onCompleted: (data) => setProperties(get(data, "fetchProperty.data", [])),
  });

  let propertyOptions =
    !isEmpty(properties) &&
    properties.map((pr, i) => {
      return <option value={pr.propertyId}>{pr.title}</option>;
    });

  const userId = props.userData._id;
  useQuery(getDocumentsStorageUsage, {
    onCompleted: (data) => {
      if (data?.getDocumentsStorageUsage) {
        setStorageUsed(data?.getDocumentsStorageUsage);
      }
    },
  });

  //loading: submitLoading,
  const [submitDocumentData, { error: submitError }] = useMutation(
    DocumentQuery.uploadDocument,
    {
      onCompleted: () => { },
      refetchQueries: () => [
        {
          query: DocumentQuery.getDocumentsList,
          variables: { userId },
        },
      ],
    }
  );

  //selecting a document type
  const handleDocChange = (value) => {
    setDocumentType(value);
  };

  //property select input methods
  const handlePropertyChange = (value) => {
    if (value !== "new") {
      setProperty(value);
    }
    if (value === "new") {
      push("/landlord/property/add");
    }
  };

  //selecting tenancy
  const handleTenancyChange = (value) => {
    setTenancy(value);
  };

  // Description onChange
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  //Uploading the file

  const formData = new FormData();

  let uploadFile = () => {
    const fileUpload = document.querySelector("#fileUpload");
    setDocDes(fileUpload.files[0].name);
  };

  let deleteFile = () => {
    setDocDes("");
    formData.delete("file");
    formData.delete("filename");
  };

  //date picker
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

  const handleDateChange = (date, dateString) => {
    setExpiryDate(date);
  };

  //switch
  function onSwitchChange(checked) {
    setSharing(checked);
  }

  // Handle notifications
  const displayNotifications = (type, msg, desc = null) => {
    notification[type]({
      message: msg,
      description: desc,
    });
  };

  // Submit form with document
  const handleSubmit = async () => {
    // Handle errors
    if (!documentType.length > 0) {
      return displayNotifications("error", "Document type cannot be empty.");
    }

    if (property === "") {
      return displayNotifications("error", "Property cannot be empty.");
    }

    if (!description.length > 0) {
      return displayNotifications("error", "Description cannot be empty.");
    }

    if (sharing && !tenancy?.length) {
      return displayNotifications(
        "error",
        "Please select at least one tenant."
      );
    }

    const fileUpload = document.querySelector("#fileUpload");

    if (fileUpload.files[0] == null) {
      return displayNotifications("error", "Please upload a valid file.");
    }

    const file = fileUpload.files[0];

    const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);

    // File type errors
    const acceptedFileTypes = [
      "doc",
      "docx",
      "pdf",
      "gif",
      "jpg",
      "jpeg",
      "png",
      "xls",
      "xlsx",
    ];

    if (!acceptedFileTypes.includes(fileType)) {
      return displayNotifications(
        "error",
        "This file type cannot be uploaded."
      );
    }

    // File size (15 MB) errors
    if (file.size > LIMIT_15_MB) {
      return displayNotifications("error", "This file is too big to upload.");
    }

    // Total storage (50 MB) error
    if (parseInt(file.size) + parseInt(storageUsed) > LIMIT_50_MB) {
      return displayNotifications(
        "error",
        "You have run out of storage space."
      );
    }

    // Expiry errors
    if (expiryDate === "") {
      return displayNotifications("error", "Expiry date must be selected.");
    }

    if (submitError) {
      displayNotifications(
        "error",
        "Document was not submitted due to an error."
      );
    }

    // Upload file
    formData.append("file", file);
    formData.append("filename", file.name);
    // for what purpose the file is uploaded to the server.
    formData.append("uploadType", "Document");

    displayNotifications("info", "Please wait...");

    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/v1/transaction-file-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
          },
        }
      )
      .then(async (response) => {
        if (!response.data.success) {
          // Handle failure
          return displayNotifications(
            "error",
            response.data.message || "Upload error, please try again!"
          );
        }

        const url = response.data.data;

        // const entryData = {
        //   fileName: file.name,
        //   fileType,
        //   fileSize: file.size,
        //   s3ObjectName: url.substring(url.lastIndexOf("/") + 1),
        //   documentType,
        //   property,
        //   tenancy,
        //   description,
        //   expiryDate,
        //   sharing,
        //   userId,
        //   status: "Active",
        // };

        // Pass data to backend (call mutation)

        submitDocumentData({
          variables: {
            fileName: file.name,
            fileType,
            fileSize: file.size,
            s3ObjectName: url.substring(url.lastIndexOf("/") + 1),
            documentType,
            propertyId: property,
            tenancy,
            description,
            expiryDate,
            sharing,
            userId,
            status: "Active",
          },
        }).then(() => {
          displayNotifications("success", "Document updated successfully");
          return push("/landlord/documents/");
        });


        // Redirect to documents list
      })
      .catch((error) => {
        // console.log("Error.", error);

        return displayNotifications(
          "error",
          "File was not uploaded due to an error."
        );
      });
  };

  return (
    <div className="row m-0">
      <div className="col-md-7 col-lg-8 bg-white py-3 px-2">
        <div className="inContainer">
          <div className="row">
            <div className="col-12">
              <h5>Data &amp; Sharing</h5>
              <hr />
            </div>
          </div>
          <div className="row">
            {/* DOCUMENT TYPE ------------------------------------- */}
            <div className="col-md-6 col-lg-4 ">
              <h6>Document Type</h6>
              <Select
                className="inputField"
                mode="tags"
                allowClear
                placeholder="Please select document type(s)"
                onChange={handleDocChange}
                value={documentType}
              >
                {documentTypeOptions}
              </Select>
            </div>
            {/* PROPERTY ------------------------------------- */}
            <div className="col-md-6 col-lg-4 ">
              <h6>Property</h6>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a property"
                optionFilterProp="children"
                onChange={handlePropertyChange}
                value={property ? property : undefined}
              >
                <option value="new">Add New Property</option>
                {propertyOptions}
              </Select>
            </div>
            {/* EXPIRY DATE ------------------------------------- */}
            <div className="col-md-6 col-lg-4 ">
              <h6>Expiry Date</h6>
              <DatePicker
                defaultValue={moment("01/01/2015", dateFormatList[0])}
                format={dateFormatList}
                style={{ width: "100%", height: "42px" }}
                onChange={handleDateChange}
                value={expiryDate}
              />
            </div>
          </div>
          <div className="row">
            {/* DESCRIPTION ------------------------------------- */}
            <div className="col-12">
              <h6>Description</h6>
              <TextArea
                className="description inputField"
                showCount
                maxLength={100}
                autoSize={{ minRows: 4, maxRows: 4 }}
                onChange={handleDescriptionChange}
                value={description}
              />
            </div>
          </div>
          <div className="row mb-3">
            {/* SELECT FILE ------------------------------------- */}
            <div className="col-md-12 col-lg-5">
              <h6>Select File</h6>
              <Form.Item className="formUpload mb-2" name="upload">
                <input
                  type="file"
                  id="fileUpload"
                  hidden
                  onChange={uploadFile}
                />
                <label for="fileUpload" className="docUpload px-3">
                  {" "}
                  <span className="d-flex align-items-center justify-content-center">
                    <UploadOutlined className="fileUploadIcon" />
                    Upload File
                  </span>
                </label>
                <br />
                <div>
                  <span
                    className="fileUploadText"
                    style={
                      docDes === ""
                        ? { color: "#757575" }
                        : { color: "#1A90FF" }
                    }
                  >
                    <LinkOutlined
                      className="attachment"
                      style={
                        docDes === ""
                          ? { display: "none" }
                          : { display: "inline" }
                      }
                    />
                    {docDes}
                    <DeleteOutlined
                      className="delete"
                      onClick={() => deleteFile()}
                      style={
                        docDes === ""
                          ? { display: "none" }
                          : { display: "inline" }
                      }
                    />
                  </span>
                </div>
              </Form.Item>
            </div>
            {/* SHARING ------------------------------------- */}
            <div className="col-4 col-md-6 col-lg-2">
              <h6>Sharing </h6>
              <Switch
                defaultUnChecked
                onChange={onSwitchChange}
                value={sharing}
                className="mt-1"
              />
            </div>
            {/* TENANCY ------------------------------------- */}

            {sharing && (
              <div className="col-8 col-md-6 col-lg-5">
                <h6>Tenancy</h6>
                <ContactsDropdown
                  contacts={tenancy}
                  onContactUpdate={handleTenancyChange}
                />
              </div>
            )}
          </div>
        </div>
        <Form.Item>
          <button
            className="btn btn-sm btn-primary px-3 mr-3 ml-2"
            htmlType="submit"
            // className="docSubmit"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            // type="danger"
            // className="docSubmit"
            className="btn btn-sm btn-danger px-3"
            onClick={() => push("/landlord/documents/")}
          >
            Cancel
          </button>
        </Form.Item>
        {/* </Form> */}
      </div>
      <div className="col-md-5 col-lg-4 bg-white py-5">
        <StorageLevel storageUsed={storageUsed} />
      </div>
    </div>
  );
};

export default AddDocument;
