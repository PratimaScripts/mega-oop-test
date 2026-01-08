import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { Modal, Tooltip } from "antd";

import FileUpload from "./Dropzone";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
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

class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      supportingDocuments: {
        supportingDocuments: [
          { documentNumber: "", docRaw: [], documentUrl: "" },
        ],
      },
    };
    this.formRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.supportingDocuments) {
      return { supportingDocuments: nextProps.supportingDocuments };
    }
  }

  getFileExtension3 = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.submitDocData !== this.props.submitDocData) {
      // if (this.formRef) {
      this.formRef.current &&
        this.props.setSupportingDocuments(this.formRef.current.state.values);
      // }
    }
  }

  previewDocument = async (url) => {
    if (typeof url !== "string") url = URL.createObjectURL(url);

    Modal.info({
      title: "Document",
      width: 900,
      content: (
        <embed
          src={url}
          style={{
            width: `calc(100% + 30px)`,
            marginLeft: "-30px",
            minHeight: "50vh",
          }}
        />
      ),
      onOk() {},
    });
  };

  render() {
    const { supportingDocuments } = this.state;

    return (
      <div className="upload_documents__tabs">
        <Formik
          ref={this.formRef}
          enableReinitialize
          initialValues={supportingDocuments}
          onSubmit={(values) => this.props.setSupportingDocuments(values)}
          render={({ values, setFieldValue }) => (
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
                                  onClick={() =>
                                    this.previewDocument(
                                      get(supportingDoc, `documentUrl`)
                                    )
                                  }
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
                                  onClick={() =>
                                    this.previewDocument(
                                      supportingDoc.docRaw[
                                        supportingDoc.docRaw.length - 1
                                      ]
                                    )
                                  }
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

                        {/* {values.supportingDocuments.length > 1 && (
                          <div className="row">
                            <div className="col-lg-4">
                              <button
                                type="button"
                                className="btn btns__addmore btn__gap"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <i className="fas fa-minus"></i> Remove
                              </button>
                            </div>
                          </div>
                        )} */}
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
                              document: "",
                              documentNumber: "",
                              docRaw: [],
                              documentUrl: "",
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
                      ref={this.props.supportingDocRef}
                      type="submit"
                      className="btn btn-primary btn-sm px-5"
                    >
                      Save Data
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default DynamicFieldSet;
