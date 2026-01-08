import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Row,
  Col,
  Select,
  Input,
  Form,
  Button,
  DatePicker,
  Switch,
  notification,
} from "antd";

import moment from "moment";
import cookie from "react-cookies";
import axios from "axios";

import "./edit.scss";

import {
  UploadOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import PropertyQuery from "../../../../config/queries/property";
import DocumentQuery from "../../../../config/queries/document";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getDocumentsStorageUsage } from "config/queries/storage";
import ContactsDropdown from "components/Common/Contacts/ContactsDropdown";

const { TextArea } = Input;

const EditDocument = (props) => {
  const editData = props.editDocData;
  // console.log(editData);

  // Form states
  const [properties, setProperties] = useState([]);
  // const [storageUsed, setStorageUsed] = useState(0);

  const [docDes, setDocDes] = useState(editData.fileName);

  const [documentType, setDocumentType] = useState(editData.documentType);
  const [property, setProperty] = useState(editData.propertyId);
  const [tenancy, setTenancy] = useState(editData.tenancy);
  const [description, setDescription] = useState(editData.description);
  const [expiryDate, setExpiryDate] = useState(
    moment(new Date(Date.parse(editData.expiryDate)), "DD/MM/YYYY")
  );
  const [sharing, setSharing] = useState(editData.sharing);

  const [newDocument, setNewDocument] = useState(false);

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

  // Tenancy options
  // const tenancyOptions = ["Tenancy 1", "Tenancy 2", "Tenancy 3"].map(
  //   (tenancy) => {
  //     return (
  //       <option key={tenancy} value={tenancy}>
  //         {tenancy}
  //       </option>
  //     );
  //   }
  // );

  // Property options
  useQuery(PropertyQuery.fetchProperty, {
    onCompleted: (data) => setProperties(get(data, "fetchProperty.data", [])),
  });

  let propertyOptions =
    !isEmpty(properties) &&
    properties.map((pr, i) => {
      return <option value={pr.propertyId}>{pr.title}</option>;
    });

  const userId = props.userId;

  useQuery(getDocumentsStorageUsage, {
    onCompleted: (data) => {
      // if (data?.getDocumentsStorageUsage) {
      //   setStorageUsed(data?.getDocumentsStorageUsage);
      // }
    },
  });

  // useQuery(DocumentQuery.getStorageInformation, {
  //   onCompleted: (data) => console.log('Storage Used:', data)
  // })

  const [update, { loading: submitLoading, error: submitError }] = useMutation(
    DocumentQuery.update,
    {
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
    // console.log(`Doc type selection: ${value}`);
    setDocumentType(value);
  };

  //property select input methods
  const handlePropertyChange = (value) => {
    // console.log(`Property selection: ${value}`);
    setProperty(value);
  };

  //selecting tenancy
  const handleTenancyChange = (value) => {
    setTenancy(value);
  };

  // Description onChange
  const handleDescriptionChange = (e) => {
    // console.log('Change:', e.target.value);
    setDescription(e.target.value);
  };

  //Uploading the file

  const formData = new FormData();

  let uploadFile = () => {
    const fileUpload = document.querySelector("#fileUpload");
    setDocDes(fileUpload.files[0].name);
    setNewDocument(true);
  };

  let deleteFile = () => {
    setDocDes("");
    formData.delete("file");
    formData.delete("filename");
  };

  //date picker
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

  const handleDateChange = (date, dateString) => {
    // console.log(date, dateString);
    setExpiryDate(date);
  };

  //switch
  function onSwitchChange(checked) {
    // console.log(`switch to ${checked}`);
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
    try {
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

      // Expiry errors
      if (expiryDate === "") {
        return displayNotifications("error", "Expiry date must be selected.");
      }

      if (sharing && !tenancy?.length) {
        return displayNotifications(
          "error",
          "Please select at least one tenant."
        );
      }

      if (submitLoading) {
        // console.log("Submission is loading...");
        displayNotifications("info", "Please wait...");
      }

      if (submitError) {
        // console.log("Submission failed.");

        displayNotifications(
          "error",
          "Document was not submitted due to an error."
        );
      }

      // If the uploaded document was changed
      if (newDocument) {
        // Delete existing S3 object

        const fileUpload = document.querySelector("#fileUpload");

        if (fileUpload.files[0] == null || docDes === "") {
          return displayNotifications("error", "Please upload a valid file.");
        }

        const file = fileUpload.files[0];

        const fileType = file.type.substring(file.type.lastIndexOf("/") + 1);

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
        if (file.size > 15000000) {
          return displayNotifications(
            "error",
            "This file is too big to upload."
          );
        }

        // Between "Upload" button click and API call
        displayNotifications("info", "Please wait...");

        formData.append("file", file);
        formData.append("filename", file.name);
        // for what purpose the file is uploaded to the server.
        formData.append("uploadType", "Document");

        // Upload new S3 object
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER}/api/v1/transaction-file-upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: await cookie.load(
                process.env.REACT_APP_AUTH_TOKEN
              ),
            },
          }
        );

        if (!data.success) {
          // Handle failure
          return displayNotifications("error", data.message);
        }

        const url = data.data;

        update({
          variables: {
            documentId: editData.documentId,
            documentType,
            propertyId: property,
            tenancy,
            description,
            expiryDate,
            sharing,
            userId,
            newDocument,
            fileName: file.name,
            fileType,
            fileSize: file.size,
            s3ObjectName: url.substring(url.lastIndexOf("/") + 1),
          },
        });
      } else {
        // Uploaded document was not changed
        update({
          variables: {
            documentId: editData.documentId,
            documentType,
            propertyId: property,
            tenancy,
            description,
            expiryDate,
            sharing,
            userId,
            newDocument,
            fileName: "",
            fileType: "",
            fileSize: 0,
            s3ObjectName: "",
          },
        });
      }

      displayNotifications("success", "Document updated successfully");

      // Redirect to documents list
      props.cancelEditDoc();
    } catch (error) {
      return displayNotifications(
        "error",
        error.message || "File was not uploaded due to an error."
      );
    }
  };

  return (
    <>
      {/* <div className="addNewContainerOne">
        <div className="inContainer">
          <p className="infoP1">
            You have used {(storageUsed / 1000).toFixed(1)} MB (
            {((storageUsed / 50000) * 100).toFixed(0)}%) of 50 MB authorised.{' '}
            <a style={{ color: '#357BC2' }}>Need more space?</a>
          </p>
          <Progress
            percent={(storageUsed / 50000) * 100}
            showInfo={false}
            className="progressBar"
          />
          <h2 className="infoheading">Information</h2>
          <p className="infoP2">
            Archieve your scanned documents and share them with your tenents.
            Max storage 20 MB.
          </p>
          <p className="infoP2">
            Accepted formats Word, PDF, Pictures (GIF, JPG, PNG). Maximum size
            15 MB.
          </p>
          <p className="infoP3">To scan your documents, you can: </p>
          <ul className="infoLi">
            <li>
              Take a picture but be careful with the framing quality of the
              image. You can also use an app for smartphones.
            </li>
            <li>
              Scan your picuture a resultion of 150 to 200 DPI is more than
              enough to avoid excessively large files.
            </li>
          </ul>
        </div>
      </div> */}

      <Row>
        <Col span={24}>
          <Row>
            <Col span="24">
              <h5>Edit Document Data</h5>
              <hr />
            </Col>
          </Row>
          <Row>
            {/* DOCUMENT TYPE ------------------------------------- */}
            <Col span="8">
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
            </Col>
            {/* PROPERTY ------------------------------------- */}
            <Col span="8">
              <h6>Property</h6>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a property"
                optionFilterProp="children"
                onChange={handlePropertyChange}
                value={property}
              >
                {propertyOptions}
              </Select>
            </Col>
            {/* EXPIRY DATE ------------------------------------- */}
            <Col span="8">
              <h6>Expiry Date</h6>
              <DatePicker
                defaultValue={moment("01/01/2015", dateFormatList[0])}
                format={dateFormatList}
                style={{ width: "100%", height: "42px" }}
                onChange={handleDateChange}
                value={expiryDate}
              />
            </Col>
          </Row>
          <Row>
            {/* DESCRIPTION ------------------------------------- */}
            <Col span={"24"} style={{ marginTop: "1%" }}>
              <h6>Description</h6>
              <TextArea
                className="description inputField"
                showCount
                maxLength={100}
                autoSize={{ minRows: 4, maxRows: 4 }}
                onChange={handleDescriptionChange}
                value={description}
              />
            </Col>
          </Row>
          <Row gutter={[8, 16]}>
            {/* SELECT FILE ------------------------------------- */}
            <Col span={10}>
              <h6>Select File</h6>
              <Form.Item className="formUpload" name="upload">
                <input
                  type="file"
                  id="fileUpload"
                  hidden
                  onChange={uploadFile}
                  accept="application/pdf"
                />
                <label for="fileUpload" className="docUpload">
                  {" "}
                  <span>
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
            </Col>
            {/* SHARING ------------------------------------- */}
            <Col span={4}>
              <h6>Sharing</h6>
              <Switch
                defaultUnChecked
                onChange={onSwitchChange}
                value={sharing}
              />
            </Col>
            {/* TENANCY ------------------------------------- */}
            {sharing && (
              <Col span={10}>
                <h6>Tenancy</h6>
                <ContactsDropdown
                  contacts={tenancy}
                  onContactUpdate={handleTenancyChange}
                />
              </Col>
            )}
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="docSubmit"
              onClick={handleSubmit}
            >
              Update
            </Button>
            <Button
              type="danger"
              className="docSubmit"
              onClick={() => props.cancelEditDoc()}
            >
              Cancel
            </Button>
          </Form.Item>
        </Col>
        {/* </Form> */}
      </Row>
    </>
  );
};

export default EditDocument;
