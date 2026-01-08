import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { Modal } from "antd";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import FileUpload from "./uploadDropzone";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
const dropzoneStyle = {
  width: "100%",
  height: "100px",
  borderWidth: 2,
  borderColor: "rgb(102, 102, 102)",
  borderStyle: "dashed",
  borderRadius: 5
};

class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskCategories: {
        taskCategories: [{ name: "", subCategory: [], docRaw: [], avatar: "" }]
      }
    };
    this.formRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.taskCategories) {
      return { taskCategories: nextProps.taskCategories };
    }
  }

  getFileExtension3 = filename => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  previewDocument = async url => {
    // let newUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    // let type = await this.getFileExtension3(newUrl);

    Modal.info({
      title: "Document",
      width: 900,
      content: (
        <>
          {/* <FileViewer
            fileType={type}
            filePath={newUrl}
            errorComponent={() => <>ERROR</>}
            onError={err => console.log("AN ERROR OCCURED", err)}
          /> */}
        </>
      ),
      onOk() {}
    });
  };

  render() {
    const { taskCategories } = this.state;

    return (
      <div className="upload_documents__tabs">
        <Formik
          ref={this.formRef}
          enableReinitialize
          initialValues={taskCategories}
          onSubmit={values => this.props.submitForm(values)}
          render={({ values, setFieldValue }) => (
            <Form>
              <FieldArray
                name="taskCategories"
                render={arrayHelpers => (
                  <div>
                    {values.taskCategories.map((supportingDoc, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-4">
                            <Field
                              type="text"
                              className="form-control tab__input"
                              placeholder="Category name"
                              name={`taskCategories.${index}.name`}
                              required
                            />
                          </div>

                          <TagsInput
                            value={get(supportingDoc, "subCategory", [])}
                            onChange={tags =>
                              setFieldValue(
                                `taskCategories.${index}.subCategory`,
                                tags
                              )
                            }
                            tagProps={{
                              className:
                                "react-tagsinput-tag badge badge-primary",
                              classNameRemove: "react-tagsinput-remove"
                            }}
                            className="tab__deatils--input"
                          />

                          <div className="col-md-4 flex__browse">
                            <FileUpload
                              key={supportingDoc}
                              allDocsLength={values.taskCategories.length}
                              fieldVal={supportingDoc}
                              style={dropzoneStyle}
                              setFieldValue={setFieldValue}
                              removeField={() => arrayHelpers.remove(index)}
                              setFieldValueData={{
                                main: "taskCategories",
                                index,
                                fileKey: "docRaw"
                              }}
                            />
                            {isEmpty(supportingDoc.docRaw) ? (
                              (get(supportingDoc, `avatar`).includes("pdf") && (
                                <i
                                  style={{ fontSize: "35px" }}
                                  className="fas fa-file-pdf"
                                ></i>
                              )) || (
                                <img
                                  onClick={() =>
                                    this.previewDocument(
                                      get(supportingDoc, `avatar`)
                                    )
                                  }
                                  alt={get(supportingDoc, `avatar`)}
                                  src={get(supportingDoc, `avatar`)}
                                  className="img-supported-doc"
                                />
                              )
                            ) : (
                              <img
                                onClick={() =>
                                  this.previewDocument(
                                    get(
                                      supportingDoc,
                                      `docRaw[${supportingDoc.docRaw.length -
                                        1}].path`
                                    )
                                  )
                                }
                                alt={
                                  isEmpty(supportingDoc.docRaw) &&
                                  get(
                                    supportingDoc,
                                    `docRaw[${supportingDoc.docRaw.length -
                                      1}].path`
                                  )
                                }
                                src={get(
                                  supportingDoc,
                                  `docRaw[${supportingDoc.docRaw.length -
                                    1}].preview`
                                )}
                                className="img-supported-doc"
                              />
                            )}
                          </div>
                        </div>

                        {supportingDoc.avatar && (
                          <p>
                            Previously uploaded:{" "}
                            <a download href={supportingDoc.avatar}>
                              Document
                            </a>
                          </p>
                        )}

                        {values.taskCategories.length > 1 && (
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
                              name: "",
                              subCategory: [],
                              docRaw: [],
                              avatar: ""
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
                      className="btn btns__blue"
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
