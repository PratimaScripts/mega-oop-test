import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Dropdown, Menu, Select, Button, notification, Tooltip } from "antd";
import {
  //Menu bar (top) icons
  DeleteOutlined,
  FolderOutlined,

  //Action menu icons
  EditOutlined,
  CloudDownloadOutlined,
  FolderOpenOutlined,

  //Document type icons
  FilePdfTwoTone,
  FileWordTwoTone,
  FileExcelTwoTone,
  FileImageTwoTone,
  FileTwoTone,
} from "@ant-design/icons";

import { useQuery, useMutation } from "@apollo/react-hooks";

import DocumentQuery from "../../../config/queries/document";

import "./styles.scss";

import EditDocument from "./Edit";
import { isEmpty } from "lodash";
import EmptyDocument from "components/layout/emptyviews/EmptyDocument";

const ListingDashboard = (props) => {
  // Check user role
  const isLandlord = window.location.href.includes("landlord");
  // const isRenter = window.location.href.includes('renter');

  const [activeTab, setActiveTab] = useState(0);
  const [selectedDocType, setSelectedDocType] = useState("");

  const [showEditDoc, setShowEditDoc] = useState(false);
  const [editDocData, setEditDocData] = useState({});

  const cancelEditDoc = () => {
    setShowEditDoc(false);
  };

  let checkedDocs = [];

  // useEffect(() => {
  //   console.log('CHECKED DOCS', checkedDocs);
  // }, [checkedDocs]);

  let activeCount = 0;
  let archivedCount = 0;
  const { Option } = Select;

  const userId = props.userData._id;
  // console.log('UserData ID', props.userData._id);

  // Query the documents list
  const {
    loading: documentsLoading,
    error: documentsError,
    data: documentsData,
  } = useQuery(DocumentQuery.getDocumentsList, {
    variables: { userId },
  });

  //archive document
  // const [archiveDoc, { loading: archiveDocLoading, error: archiveDocError }] =
  //   useMutation(DocumentQuery.archiveDocument, {
  //     onCompleted: (success) =>
  //       success &&
  //       displayNotifications("success", "Document archived successfully"),
  //     refetchQueries: () => [
  //       {
  //         query: DocumentQuery.getDocumentsList,
  //         variables: { userId },
  //       },
  //     ],
  //   });

  //archive document
  const [
    archiveManyDocs,
    // { loading: archiveDocsLoading, error: archiveDocsError },
  ] = useMutation(DocumentQuery.archiveManyDocs, {
    onCompleted: (success) =>
      success &&
      displayNotifications("success", "Documents archived successfully"),
    refetchQueries: () => [
      {
        query: DocumentQuery.getDocumentsList,
        variables: { userId },
      },
    ],
  });

  // Delete documents mutation
  const [deleteDocs, { loading: deleteDocsLoading, error: deleteDocsError }] =
    useMutation(DocumentQuery.deleteDocs, {
      onCompleted: (success) =>
        success &&
        displayNotifications("success", "Documents deleted successfully"),
      refetchQueries: () => [
        {
          query: DocumentQuery.getDocumentsList,
          variables: { userId },
        },
      ],
    });

  //handle delete function
  const handleDeleteDoc = (id) => {
    displayNotifications("info", "Please wait...");

    if (!deleteDocsLoading && !deleteDocsError) {
      deleteDocs({
        variables: {
          ids: [id],
        },
      });
    }
  };

  // Handle download document
  const handleDownloadDoc = async (s3ObjectName) => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER}/api/v1/download-files/${s3ObjectName}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
          },
        }
      )
      .then((response) => {
        function download(dataurl, filename) {
          var a = document.createElement("a");
          a.href = dataurl;
          a.setAttribute("download", filename);
          a.click();
        }

        download(`data:text/html,${response.data}`, `${s3ObjectName}`);
      })
      .catch((error) => {
        // console.log("Axios request error.", error);

        if (error.request || error.response) {
          displayNotifications("error", "An error occurred!");
          // console.log("Request error:", error.request);
          // console.log("Response error:", error.response);
        }

        return displayNotifications(
          "error",
          "File could not be downloaded due to an error"
        );
      });
  };

  // Handle query errors
  const displayNotifications = (type, msg, desc = null) => {
    notification[type]({
      message: msg,
      description: desc,
    });
  };

  if (documentsError === "") {
    return displayNotifications(
      "error",
      "An error occured loading your documents."
    );
  }

  // Conditionally show the "+ New Document" button
  const showAddNewButton = () => {
    if (isLandlord) {
      return (
        // <Col span={3}>
        // <div style={{ paddingLeft: "2%", width: "100% !important" }}>
        <Button
          onClick={() => props.history.push("/landlord/documents/addNew")}
          className="btn btn__new--order"
        >
          + New Document
        </Button>
        // </div>
        // </Col>
      );
    }
  };

  let documentsList = [];
  let archivedDocumentsList = [];

  if (!documentsLoading && !documentsError) {
    const displayFileIcon = (fileType) => {
      switch (fileType) {
        case "pdf":
          return <FilePdfTwoTone twoToneColor="red" className="doc_icon" />;

        case "doc":
        case "docx":
          return <FileWordTwoTone className="doc_icon" />;

        case "xls":
        case "xlsx":
          return (
            <FileExcelTwoTone twoToneColor="#33c720" className="doc_icon" />
          );

        case "jpg":
        case "jpeg":
        case "gif":
        case "png":
          return (
            <FileImageTwoTone twoToneColor="#ebb134" className="doc_icon" />
          );

        default:
          return <FileTwoTone className="doc_icon" />;
      }
    };

    const displayDocumentTypes = (documentTypes) => {
      let docTypes = [];

      documentTypes.map((docType) => {
        return docTypes.push(<span class="doc_type">{docType}</span>);
      });

      return docTypes;
    };

    const handleEditDoc = (
      documentId,
      documentType,
      propertyTitle,
      propertyId,
      expiryDate,
      description,
      fileName,
      sharing,
      tenancy,
      s3ObjectName
    ) => {
      setShowEditDoc(true);
      setEditDocData({
        documentId,
        documentType,
        propertyTitle,
        propertyId,
        expiryDate,
        description,
        fileName,
        sharing,
        tenancy,
        s3ObjectName,
      });
    };

    // Define the documents list
    documentsData.getDocumentsList.data.map((document) => {
      //Document status Active - Search by document type results
      if (
        document.status === "Active" &&
        selectedDocType !== "" &&
        document.documentType.includes(selectedDocType)
      ) {
        const expDate = new Date(Date.parse(document.expiryDate));
        const expDateFormatted = `${expDate.getDate()}/${
          expDate.getMonth() + 1
        }/${expDate.getFullYear()}`;

        activeCount = activeCount + 1;
        documentsList.unshift([
          <tr>
            <td className="border__invited">
              <input
                type="checkbox"
                className="cusCheckBox"
                onChange={(e) =>
                  e.target.checked
                    ? checkedDocs.push(document._id)
                    : checkedDocs.splice(checkedDocs.indexOf(document._id), 1)
                }
              />
            </td>
            <td className="display_inline" style={{ paddingLeft: "10px" }}>
              <span className="profile__default">
                {displayFileIcon(document.fileType)}
              </span>
              <span className="doc_title">
                {document.fileName.length <= 30 && document.fileName}
                {document.fileName.length > 30 &&
                  document.fileName.slice(
                    0,
                    document.fileName.indexOf(" ", 30)
                  )}
                <br />
                {document.fileName.length > 30 &&
                  document.fileName.slice(document.fileName.indexOf(" ", 30))}
                <p className="doc_tag">
                  {displayDocumentTypes(document.documentType)}
                </p>
              </span>
            </td>
            <td>
              <span>{document?.propertyId?.title}</span>
            </td>
            <td>
              <span>
                {document.description.length <= 30 && document.description}
                {document.description.length > 30 &&
                  document.description.slice(
                    0,
                    document.description.indexOf(" ", 30)
                  )}
                <br />
                {document.description.length > 30 &&
                  document.description.slice(
                    document.description.indexOf(" ", 30)
                  )}
              </span>
            </td>
            <td>
              {document.tenancy.length ? (
                <span class="normal_pile">
                  {document.tenancy.length} tenants
                </span>
              ) : (
                "Not shared"
              )}
            </td>
            <td>
              {document.sharing && <span class="completed_pile">Yes</span>}
              {!document.sharing && <span class="low_pile">No</span>}
            </td>
            <td>
              {/* {Date.parse(document.expiryDate)} */}
              {Date.parse(document.expiryDate) > new Date() && (
                <span className="doc_open_pile">{expDateFormatted}</span>
              )}
              {Date.parse(document.expiryDate) <= new Date() && (
                <span className="high_pile">{expDateFormatted}</span>
              )}
            </td>
            <td>
              <Dropdown
                overlay={
                  <>
                    <Menu>
                      <Menu.Item
                        onClick={(e) => {
                          handleEditDoc(
                            document._id,
                            document.documentType,
                            document.propertyId.title,
                            document.propertyId._id,
                            document.expiryDate,
                            document.description,
                            document.fileName,
                            document.sharing,
                            document.tenancy,
                            document.s3ObjectName
                          );
                        }}
                      >
                        <EditOutlined /> Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          handleDownloadDoc(document.s3ObjectName);
                        }}
                      >
                        <CloudDownloadOutlined /> Download
                      </Menu.Item>
                      {/* <Menu.Item>
                        <ShareAltOutlined /> Share Link
                      </Menu.Item> */}
                      <Menu.Item
                        onClick={(e) => {
                          handleDeleteDoc(document._id);
                        }}
                      >
                        <DeleteOutlined />
                        Delete
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          archiveManyDocs({
                            variables: {
                              ids: [document._id],
                              status:
                                activeTab === 0
                                  ? "Archived"
                                  : activeTab === 1
                                  ? "Active"
                                  : null,
                            },
                          });
                        }}
                      >
                        <FolderOpenOutlined /> Archive
                      </Menu.Item>
                    </Menu>
                  </>
                }
                trigger={["click"]}
              >
                <td>
                  <i className="fa fa-ellipsis-v"></i>
                </td>
              </Dropdown>
            </td>
          </tr>,
        ]);
      }

      //Document status Active - All the documents
      if (
        document.status === "Active" &&
        (selectedDocType === "" || selectedDocType === "All")
      ) {
        const expDate = new Date(Date.parse(document.expiryDate));
        const expDateFormatted = `${expDate.getDate()}/${
          expDate.getMonth() + 1
        }/${expDate.getFullYear()}`;

        activeCount = activeCount + 1;
        documentsList.unshift([
          <tr>
            <td className="border__invited uuuu">
              <input
                type="checkbox"
                className="cusCheckBox"
                onChange={(e) => {
                  e.target.checked
                    ? checkedDocs.push(document._id)
                    : checkedDocs.splice(checkedDocs.indexOf(document._id), 1);
                }}
                value={document._id}
              />
            </td>
            <td className="display_inline" style={{ paddingLeft: "10px" }}>
              <span className="profile__default">
                {displayFileIcon(document.fileType)}
              </span>
              <span className="doc_title">
                {document.fileName.length <= 30 && document.fileName}
                {document.fileName.length > 30 &&
                  document.fileName.slice(
                    0,
                    document.fileName.indexOf(" ", 30)
                  )}
                <br />
                {document.fileName.length > 30 &&
                  document.fileName.slice(document.fileName.indexOf(" ", 30))}
                <p className="doc_tag">
                  {displayDocumentTypes(document.documentType)}
                </p>
              </span>
            </td>
            <td>
              <span>{document?.propertyId?.title}</span>
            </td>
            <td>
              <span>
                {document.description.length <= 30 && document.description}
                {document.description.length > 30 &&
                  document.description.slice(
                    0,
                    document.description.indexOf(" ", 30)
                  )}
                <br />
                {document.description.length > 30 &&
                  document.description.slice(
                    document.description.indexOf(" ", 30),
                    document.description.indexOf(" ", 60)
                  )}
                <br />
                {document.description.length > 60 &&
                  document.description.slice(
                    document.description.indexOf(" ", 60)
                  )}
              </span>
            </td>
            <td>
              {document.tenancy.length ? (
                <span class="normal_pile">
                  {document.tenancy.length} tenants
                </span>
              ) : (
                "Not shared"
              )}
            </td>
            <td>
              {document.sharing && <span class="completed_pile">Yes</span>}
              {!document.sharing && <span class="low_pile">No</span>}
            </td>
            <td>
              {/* {Date.parse(document.expiryDate)} */}
              {Date.parse(document.expiryDate) > new Date() && (
                <span className="doc_open_pile">{expDateFormatted}</span>
              )}
              {Date.parse(document.expiryDate) <= new Date() && (
                <span className="high_pile">{expDateFormatted}</span>
              )}
            </td>
            <td>
              <Dropdown
                overlay={
                  <>
                    <Menu>
                      <Menu.Item
                        onClick={(e) => {
                          handleEditDoc(
                            document._id,
                            document.documentType,
                            document.propertyId.title,
                            document.propertyId._id,
                            document.expiryDate,
                            document.description,
                            document.fileName,
                            document.sharing,
                            document.tenancy,
                            document.s3ObjectName
                          );
                        }}
                      >
                        <EditOutlined /> Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          handleDownloadDoc(document.s3ObjectName);
                        }}
                      >
                        <CloudDownloadOutlined />
                        {/* <a href="#" download> */}
                        Download
                        {/* </a> */}
                      </Menu.Item>
                      {/* <Menu.Item>
                        <ShareAltOutlined /> Share Link
                      </Menu.Item> */}
                      <Menu.Item
                        onClick={(e) => {
                          handleDeleteDoc(document._id);
                        }}
                      >
                        <DeleteOutlined /> Delete
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          archiveManyDocs({
                            variables: {
                              ids: [document._id],
                              status:
                                activeTab === 0
                                  ? "Archived"
                                  : activeTab === 1
                                  ? "Active"
                                  : null,
                            },
                          });
                        }}
                      >
                        <FolderOpenOutlined /> Archive
                      </Menu.Item>
                    </Menu>
                  </>
                }
                trigger={["click"]}
              >
                <td>
                  <i className="fa fa-ellipsis-v"></i>
                </td>
              </Dropdown>
            </td>
          </tr>,
        ]);
      }

      //Document status Archived - Search by document type results
      if (
        document.status === "Archived" &&
        selectedDocType !== "" &&
        document.documentType.includes(selectedDocType)
      ) {
        const expDate = new Date(Date.parse(document.expiryDate));
        const expDateFormatted = `${expDate.getDate()}/${
          expDate.getMonth() + 1
        }/${expDate.getFullYear()}`;

        archivedCount = archivedCount + 1;
        archivedDocumentsList.unshift([
          <tr>
            <td className="border__invited">
              <input
                type="checkbox"
                className="cusCheckBox"
                onChange={(e) =>
                  e.target.checked
                    ? checkedDocs.push(document._id)
                    : checkedDocs.splice(checkedDocs.indexOf(document._id), 1)
                }
              />
            </td>
            <td className="display_inline" style={{ paddingLeft: "10px" }}>
              <span className="profile__default">
                {displayFileIcon(document.fileType)}
              </span>
              <span className="doc_title">
                {document.fileName.length <= 30 && document.fileName}
                {document.fileName.length > 30 &&
                  document.fileName.slice(
                    0,
                    document.fileName.indexOf(" ", 30)
                  )}
                <br />
                {document.fileName.length > 30 &&
                  document.fileName.slice(document.fileName.indexOf(" ", 30))}
                <p className="doc_tag">
                  {displayDocumentTypes(document.documentType)}
                </p>
              </span>
            </td>
            <td>
              <span>{document?.propertyId?.title}</span>
            </td>
            <td>
              <span>
                {document.description.length <= 30 && document.description}
                {document.description.length > 30 &&
                  document.description.slice(
                    0,
                    document.description.indexOf(" ", 30)
                  )}
                <br />
                {document.description.length > 30 &&
                  document.description.slice(
                    document.description.indexOf(" ", 30)
                  )}
              </span>
            </td>
            <td>
              {document.tenancy.length ? (
                <span class="normal_pile">
                  {document.tenancy.length} tenants
                </span>
              ) : (
                "Not shared"
              )}
            </td>
            <td>
              {document.sharing && <span class="completed_pile">Yes</span>}
              {!document.sharing && <span class="low_pile">No</span>}
            </td>
            <td>
              {/* {Date.parse(document.expiryDate)} */}
              {Date.parse(document.expiryDate) > new Date() && (
                <span className="doc_open_pile">{expDateFormatted}</span>
              )}
              {Date.parse(document.expiryDate) <= new Date() && (
                <span className="high_pile">{expDateFormatted}</span>
              )}
            </td>
            <td>
              <Dropdown
                overlay={
                  <>
                    <Menu>
                      <Menu.Item
                        onClick={(e) => {
                          handleEditDoc(
                            document._id,
                            document.documentType,
                            document.propertyId.title,
                            document.propertyId._id,
                            document.expiryDate,
                            document.description,
                            document.fileName,
                            document.sharing,
                            document.tenancy,
                            document.s3ObjectName
                          );
                        }}
                      >
                        <EditOutlined /> Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          handleDownloadDoc(document.s3ObjectName);
                        }}
                      >
                        <CloudDownloadOutlined /> Download
                      </Menu.Item>
                      {/* <Menu.Item>
                        <ShareAltOutlined /> Share Link
                      </Menu.Item> */}
                      <Menu.Item
                        onClick={(e) => {
                          handleDeleteDoc(document._id);
                        }}
                      >
                        <DeleteOutlined /> Delete
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          archiveManyDocs({
                            variables: {
                              ids: [document._id],
                              status:
                                activeTab === 0
                                  ? "Archived"
                                  : activeTab === 1
                                  ? "Active"
                                  : null,
                            },
                          });
                        }}
                      >
                        <FolderOpenOutlined /> Unarchive
                      </Menu.Item>
                    </Menu>
                  </>
                }
                trigger={["click"]}
              >
                <td>
                  <i className="fa fa-ellipsis-v"></i>
                </td>
              </Dropdown>
            </td>
          </tr>,
        ]);
      }

      //Document status Archived - All the documents
      if (
        document.status === "Archived" &&
        (selectedDocType === "" || selectedDocType === "All")
      ) {
        const expDate = new Date(Date.parse(document.expiryDate));
        const expDateFormatted = `${expDate.getDate()}/${
          expDate.getMonth() + 1
        }/${expDate.getFullYear()}`;

        archivedCount = archivedCount + 1;
        archivedDocumentsList.unshift([
          <tr>
            <td className="border__invited dfdfd">
              <input
                type="checkbox"
                className="cusCheckBox"
                onChange={(e) =>
                  e.target.checked
                    ? checkedDocs.push(document._id)
                    : checkedDocs.splice(checkedDocs.indexOf(document._id), 1)
                }
              />
            </td>
            <td className="display_inline" style={{ paddingLeft: "10px" }}>
              <span className="profile__default">
                {displayFileIcon(document.fileType)}
              </span>
              <span className="doc_title">
                {document.fileName.length <= 30 && document.fileName}
                {document.fileName.length > 30 &&
                  document.fileName.slice(
                    0,
                    document.fileName.indexOf(" ", 30)
                  )}
                <br />
                {document.fileName.length > 30 &&
                  document.fileName.slice(document.fileName.indexOf(" ", 30))}
                <p className="doc_tag">
                  {displayDocumentTypes(document.documentType)}
                </p>
              </span>
            </td>
            <td>
              <span>{document?.propertyId?.title}</span>
            </td>
            <td>
              <span>
                {document.description.length <= 30 && document.description}
                {document.description.length > 30 &&
                  document.description.slice(
                    0,
                    document.description.indexOf(" ", 30)
                  )}
                <br />
                {document.description.length > 30 &&
                  document.description.slice(
                    document.description.indexOf(" ", 30)
                  )}
              </span>
            </td>
            <td>
              {document.tenancy.length ? (
                <span class="normal_pile">
                  {document.tenancy.length} tenants
                </span>
              ) : (
                "Not shared"
              )}
            </td>
            <td>
              {document.sharing && <span class="completed_pile">Yes</span>}
              {!document.sharing && <span class="low_pile">No</span>}
            </td>
            <td>
              {/* {Date.parse(document.expiryDate)} */}
              {Date.parse(document.expiryDate) > new Date() && (
                <span className="doc_open_pile">{expDateFormatted}</span>
              )}
              {Date.parse(document.expiryDate) <= new Date() && (
                <span className="high_pile">{expDateFormatted}</span>
              )}
            </td>
            <td>
              <Dropdown
                overlay={
                  <>
                    <Menu>
                      <Menu.Item
                        onClick={(e) => {
                          handleEditDoc(
                            document._id,
                            document.documentType,
                            document.propertyId.title,
                            document.propertyId._id,
                            document.expiryDate,
                            document.description,
                            document.fileName,
                            document.sharing,
                            document.tenancy,
                            document.s3ObjectName
                          );
                        }}
                      >
                        <EditOutlined /> Edit
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          handleDownloadDoc(document.s3ObjectName);
                        }}
                      >
                        <CloudDownloadOutlined /> Download
                      </Menu.Item>
                      {/* <Menu.Item>
                        <ShareAltOutlined /> Share Link
                      </Menu.Item> */}
                      <Menu.Item
                        onClick={(e) => {
                          handleDeleteDoc(document._id);
                        }}
                      >
                        <DeleteOutlined /> Delete
                      </Menu.Item>
                      <Menu.Item
                        onClick={(e) => {
                          archiveManyDocs({
                            variables: {
                              ids: [document._id],
                              status:
                                activeTab === 0
                                  ? "Archived"
                                  : activeTab === 1
                                  ? "Active"
                                  : null,
                            },
                          });
                        }}
                      >
                        <FolderOpenOutlined /> Unarchive
                      </Menu.Item>
                    </Menu>
                  </>
                }
                trigger={["click"]}
              >
                <td>
                  <i className="fa fa-ellipsis-v"></i>
                </td>
              </Dropdown>
            </td>
          </tr>,
        ]);
      }
      return null;
    });
  }

  // Active tab table -------------------------------------------------------------------------
  let activeDocuments, archivedDocuments;

  if (isLandlord) {
    activeDocuments = (
      <>
        {!documentsLoading &&
          !documentsError &&
          documentsList.map((doc) => {
            if (doc[0]) {
              return doc[0];
            }
            return null;
          })}
      </>
    );
  }

  //  Archived tab table -------------------------------------------------------------------------
  if (isLandlord) {
    archivedDocuments = (
      <>
        {!documentsLoading &&
          !documentsError &&
          archivedDocumentsList.map((doc) => {
            if (doc[0]) {
              return doc[0];
            }
            return 0;
          })}
      </>
    );
  }

  let docTypes = [];

  const lisDocumentTypes = () => {
    if (!documentsLoading && !documentsError) {
      documentsData.getDocumentsList.data.map((doc) => {
        // console.log('docTypes', doc.documentType);
        return doc.documentType.map((type) => {
          // console.log('type', type);

          if (!docTypes.includes(type)) {
            docTypes.push(type);
          }
          return 0;
        });
      });
    }
  };

  lisDocumentTypes();

  // docTypes.length > 0 && console.log('docTypes', docTypes);

  const handleDocTypeSelect = (value) => {
    //console.log('selected', value);
    setSelectedDocType(value);
  };

  // Check all documents
  const checkAll = (checked) => {
    const allCheckboxes = document.querySelectorAll(".cusCheckBox");

    if (!checked) {
      checkedDocs = [];
    }

    for (let checkBox of allCheckboxes) {
      checkBox.checked = checked;

      if (checked) {
        checkedDocs.push(checkBox.value);
      }
    }

    checkedDocs.shift();
  };

  // console.log("*********************documents", documentsList);
  // console.log("*************************", archivedDocumentsList);
  return (
    <>
      {!showEditDoc && (
        <>
          <Tabs
            selectedIndex={activeTab}
            className={props.responsiveClasses}
            defaultIndex={"0"}
          >
            <div className="document_____wrap">
              <div className="row m-0">
                <div className="col-8 col-lg-4 col-xl-4 pl-0 d-flex align-items-center pb-2">
                      <TabList>
                        <Tab onClick={() => setActiveTab(0)}>
                          Active ({activeCount})
                        </Tab>
                        <Tab onClick={() => setActiveTab(1)}>
                          Archived ({archivedCount})
                        </Tab>
                      </TabList>
                </div>
                <div className="col-4 col-lg-2 col-xl-4 d-flex justify-content-end align-items-center pr-0 pb-2 pr-lg-2">
                  <Tooltip title="Archive selected files">
                    <button
                      className="btn btn-outline-dark bg-white mr-2"
                      onClick={() => {
                        checkedDocs.length !== 0
                          ? archiveManyDocs({
                              variables: {
                                ids: checkedDocs,
                                status:
                                  activeTab === 0
                                    ? "Archived"
                                    : activeTab === 1
                                    ? "Active"
                                    : null,
                              },
                            })
                          : displayNotifications(
                              "warning",
                              `Please select at least one document to ${
                                activeTab === 0
                                  ? "archive"
                                  : activeTab === 1
                                  ? "unarchive"
                                  : null
                              }`
                            );
                      }}
                    >
                      <FolderOutlined
                        style={{ fontSize: "24px", color: "grey" }}
                      />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete selected files">
                    <button
                      className="btn btn-outline-danger bg-white"
                      onClick={() => {
                        displayNotifications("info", "Please wait...");

                        checkedDocs.length !== 0
                          ? deleteDocs({
                              variables: {
                                ids: checkedDocs,
                              },
                            })
                          : displayNotifications(
                              "warning",
                              "Please select at least one document to delete"
                            );
                      }}
                    >
                      <DeleteOutlined
                        style={{ fontSize: "24px", color: "red" }}
                      />
                    </button>
                  </Tooltip>
                </div>
                <div className="col-12 col-lg-6 col-xl-4 px-0">
                  <div className="row m-0">
                    <div className="col-8 pl-0 d-flex align-items-center">
                      <Select
                        className="docSelect float-right"
                        placeholder="Select Document Type"
                        style={{ width: "100%", marginTop: "0" }}
                        onChange={handleDocTypeSelect}
                      >
                        <Option value="All">All Documents</Option>
                        {docTypes.length > 0 &&
                          docTypes.map((type) => {
                            return <Option value={type}>{type}</Option>;
                          })}
                      </Select>
                    </div>
                    <div className="col-4 p-0 d-flex justify-content-end">
                      {showAddNewButton()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="clearfix" />

            {/* <Spin tip="Loading..."  spinning={loading} > */}
            <div className="document__tables ">
              <div className="row">
                <div className="col-md-12">
                  {/* Active tab */}
                  <TabPanel>
                    {isEmpty(documentsList) ? (
                      <EmptyDocument />
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <thead className="thead-dark">
                            <tr>
                              <th
                                style={{
                                  paddingLeft: "10px",
                                  paddingRight: "0px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  className="cusCheckBox"
                                  onChange={(e) => {
                                    e.target.checked
                                      ? checkAll(true)
                                      : checkAll(false);
                                  }}
                                />
                              </th>
                              <th
                                className="text-left"
                                style={{ paddingLeft: "10px" }}
                              >
                                File
                              </th>
                              <th className="text-left">Property</th>
                              <th className="text-left">Description</th>
                              <th className="text-left">Shared with</th>
                              <th className="text-left">Sharing</th>
                              <th className="text-left">Expiry date</th>
                              <th className="text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>{activeDocuments}</tbody>
                        </table>
                      </div>
                    )}
                  </TabPanel>

                  {/* Archived tab */}
                  <TabPanel>
                    {isEmpty(archivedDocumentsList) ? (
                      <EmptyDocument />
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <thead className="thead-dark">
                            <tr>
                              <th
                                style={{
                                  paddingLeft: "10px",
                                  paddingRight: "0px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  className="cusCheckBox"
                                  onChange={(e) => {
                                    e.target.checked
                                      ? checkAll(true)
                                      : checkAll(false);
                                  }}
                                />
                              </th>
                              <th
                                className="text-left"
                                style={{ paddingLeft: "10px" }}
                              >
                                File
                              </th>
                              <th className="text-left">Property</th>
                              <th className="text-left">Description</th>
                              <th className="text-left">Shared with</th>
                              <th className="text-left">Sharing</th>
                              <th className="text-left">Expiry date</th>
                              <th className="text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>{archivedDocuments}</tbody>
                        </table>
                      </div>
                    )}
                  </TabPanel>
                </div>
              </div>
            </div>
            {/* </Spin> */}
          </Tabs>
        </>
      )}

      {showEditDoc && (
        <EditDocument
          cancelEditDoc={cancelEditDoc}
          userId={userId}
          editDocData={editDocData}
        />
      )}

      {/* {isLandlord && 
        data.map
      }

      {isRenter && 
      } */}
    </>
  );
};

export default withRouter(ListingDashboard);
