import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { Tooltip } from "antd";
import axios from "axios";
import cookie from "react-cookies";

import showMessage from "config/ShowLoadingMessage";
import showNotification from "config/Notification";
import FileUpload from "./Dropzone";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { LoadingOutlined } from "@ant-design/icons";
const dropzoneStyle = {
  width: "100%",
  height: "100px",
  borderWidth: 2,
  borderColor: "rgb(102, 102, 102)",
  borderStyle: "dashed",
  borderRadius: 5,
};

let docsDropdown = [
  "Identity Card",
  "Passport",
  "Utility bill",
  "Bank / Card Statement",
  "Education Certificate",
  "Professional Certificate",
  "Accredited Membership",
  "Employment Document",
  "Business Financial Statement",
  "Other",
];

const Documents = (props) => {
  const { supportingDocuments } = props;

  const uploadDocuments = async (values) => {
    let uploadSupportingDocuments;
    let uploadableFiles = get(values, "supportingDocuments", []);

    let finalDocAr = [];
    if (!isEmpty(uploadableFiles)) {
      uploadSupportingDocuments = uploadableFiles.map(async (file, i) => {
        if (file.docRaw && !isEmpty(file.docRaw)) {
          showMessage("Uploading Documents...");

          let toUpload = file.docRaw[file.docRaw.length - 1];

          const formData = new FormData();
          formData.append("file", toUpload);
          formData.append("filename", toUpload.name);

          // for what purpose the file is uploaded to the server.
          formData.append("uploadType", "Persona Document");
          let uploadedFile = await axios.post(
            `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
            formData,
            {
              headers: {
                authorization: await cookie.load(
                  process.env.REACT_APP_AUTH_TOKEN
                ),
              },
            }
          );

          if (get(uploadedFile, "data.success")) {
            let data = get(uploadedFile, "data.data");
            delete file["docRaw"];
            file["documentUrl"] = data.url;
            file["fileId"] = data._id;

            finalDocAr.push(file);
          } else {
            return showNotification(
              "error",
              "An error occurred",
              uploadedFile.data.message
            );
          }
        } else {
          if (file.documentUrl) {
            delete file["docRaw"];
            finalDocAr.push(file);
          }
        }
      });

      await Promise.all(uploadSupportingDocuments);
      await props.setSupportingDocuments({ supportingDocuments: finalDocAr });
      await props.updateProfessionData({ supportingDocuments: finalDocAr });
      props.onTabChange(props.activeTab + 1);
    }
  };

  return (
    <div className="upload_documents__tabs">
      <Formik
        //   ref={formRef}
        enableReinitialize
        initialValues={supportingDocuments}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          // await props.setSupportingDocuments(values)
          await uploadDocuments(values);
          setSubmitting(false);
        }}
        render={({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <FieldArray
              name="supportingDocuments"
              render={(arrayHelpers) => (
                <div>
                  {values.supportingDocuments.map((supportingDoc, index) => (
                    <div key={index}>
                      <div className="row">
                        <div className="col-md-4">
                          <Field
                            component="select"
                            name={`supportingDocuments[${index}].document`}
                            className="form-control tab__select"
                          >
                            <option value disabled selected>
                              Select Document
                            </option>
                            {docsDropdown.map((docField, index) => {
                              return (
                                <option key={index} value={docField}>
                                  {docField}
                                </option>
                              );
                            })}
                          </Field>
                        </div>

                        <div className="col-md-4">
                          <Field
                            type="text"
                            className="form-control tab__input"
                            placeholder="Document name"
                            name={`supportingDocuments.${index}.documentNumber`}
                          />
                        </div>

                        <div className="col-md-4 flex__browse">
                          <FileUpload
                            key={supportingDoc}
                            allDocsLength={values.supportingDocuments.length}
                            fieldVal={supportingDoc}
                            style={dropzoneStyle}
                            setFieldValue={setFieldValue}
                            removeField={() => arrayHelpers.remove(index)}
                            setFieldValueData={{
                              main: "supportingDocuments",
                              index,
                              fileKey: "docRaw",
                            }}
                          />
                          {isEmpty(supportingDoc.docRaw) ? (
                            (get(supportingDoc, `documentUrl`).includes(
                              "pdf"
                            ) && (
                              <i
                                style={{ fontSize: "35px" }}
                                className="fas fa-file-pdf"
                              ></i>
                            )) ||
                            ((get(supportingDoc, `documentUrl`).includes(
                              "docx"
                            ) ||
                              get(supportingDoc, `documentUrl`).includes(
                                "doc"
                              )) && (
                              <i
                                style={{ fontSize: "35px" }}
                                className="fa fa-file-text-o"
                              ></i>
                            )) || (
                              <img
                                alt={get(supportingDoc, `documentUrl`)}
                                src={get(supportingDoc, `documentUrl`)}
                                className="img-supported-doc"
                              />
                            )
                          ) : (
                            <Tooltip
                              title={get(
                                supportingDoc,
                                `docRaw[${
                                  supportingDoc.docRaw.length - 1
                                }].name`
                              )}
                            >
                              <img
                                alt={
                                  isEmpty(supportingDoc.docRaw) &&
                                  get(
                                    supportingDoc,
                                    `docRaw[${
                                      supportingDoc.docRaw.length - 1
                                    }].path`
                                  )
                                }
                                src={get(
                                  supportingDoc,
                                  `docRaw[${
                                    supportingDoc.docRaw.length - 1
                                  }].preview`
                                )}
                                className="img-supported-doc"
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {supportingDoc.documentUrl && (
                        <p>
                          Previously uploaded:{" "}
                          <a download href={supportingDoc.documentUrl}>
                            Document
                          </a>
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="row">
                    <div className="col-lg-7"> </div>
                    <div className="col-lg-5">
                      <button
                        type="button"
                        className="btn btns__addmore"
                        onClick={() =>
                          arrayHelpers.push({
                            document: undefined,
                            documentNumber: "",
                            docRaw: [],
                            documentUrl: "",
                            fileId: "",
                          })
                        }
                      >
                        <i className="fas fa-plus"></i> Add more
                      </button>
                    </div>
                  </div>
                </div>
              )}
            />
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btns__blue"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <LoadingOutlined /> : "Save Data & Next"}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      />
    </div>
  );
};

export default Documents;
