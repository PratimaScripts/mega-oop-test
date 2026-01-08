import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import CountryPicker from "../../../../../../config/CountryCodeSelector";
import { LoadingOutlined } from "@ant-design/icons";

const ReferenceContacts = (props) => {
  
    let { referenceContacts } = props;
    return (
      <div className="referencescontact_tabs__servicepro">
        <Formik
          enableReinitialize
          initialValues={referenceContacts}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await props.setReferencesContacts(values);
            console.log("values", values)
            await props.updateProfessionData({referenceContacts: values.referenceContacts})
            setSubmitting(false);
            props.onTabChange(props.activeTab+1)
          }}
          render={({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <FieldArray
                name="referenceContacts"
                render={arrayHelpers => (
                  <div>
                    {values?.referenceContacts?.map((supportingDoc, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <Field
                                autoComplete={"none"}
                                type="text"
                                placeholder="Contact Name"
                                required={true}
                                className="form-control select__global"
                                name={`referenceContacts.${index}.contactName`}
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group">
                              <Field
                                type="email"
                                placeholder="Email"
                                autoComplete={"none"}
                                // onChange={() => {

                                // }}
                                // // setFieldValue(
                                // //   `referenceContacts[${index}].email`,
                                // //   e.target.value
                                // // )
                                className="form-control select__global"
                                name={`referenceContacts.${index}.email`}
                                required={true}
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group">
                              <CountryPicker
                                name="phoneNumber"
                                defaultValue={""}
                                countryCode={values.referenceContacts[index].countryCode?values.referenceContacts[index].countryCode: "44" }
                                value={
                                  `${values.referenceContacts[index].countryCode}${values.referenceContacts[index].phoneNumber}`
                                }
                                setValue={(val, countryCode) => {
                                  setFieldValue(
                                    `referenceContacts[${index}].phoneNumber`,
                                    String(val)
                                  );
                                  setFieldValue(`referenceContacts[${index}].countryCode`, countryCode)
                                }}
                                className={
                                  "form-control select__global input_full"
                                }
                              />
                              {/* <MyNumberInput
                                placeholder="Phone Number"
                                className="form-control select__global"
                                format="(###) ###-####"
                                mask="_"
                                defaultValue={""}
                                value={
                                  values.referenceContacts[index].phoneNumber
                                }
                                onValueChange={val =>
                                  setFieldValue(
                                    `referenceContacts[${index}].phoneNumber`,
                                    String(val.floatValue)
                                  )
                                }
                              /> */}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            {values.referenceContacts.length > 1 && (
                              <button
                                className="btn btns__addmore"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <i className="fas fa-minus"></i> Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))}

                    <div className="row">
                      <div className="col-md-8"></div>
                      <div className="col-md-4">
                        <button
                          className="btn btns__addmore"
                          type="button"
                          onClick={() =>
                            arrayHelpers.push({
                              contactName: "",
                              email: ""
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
                      disabled={isSubmitting}
                      ref={props.referenceContactRef}
                      hidden={props.hideSaveButton}
                      type="submit"
                      className="btn btns__blue"
                      
                    >
                      {isSubmitting ? <LoadingOutlined /> : "Save & Next"} 
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

export default ReferenceContacts;
