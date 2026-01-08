import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import CountryPicker from "../../../../../../config/CountryCodeSelector";

class ReferencesContacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      referenceContacts: {
        referenceContacts: [{ contactName: "", email: "" }]
      }
    };
  }

  componentDidMount() {
    this.setState({
      referenceContacts: this.props.referenceContacts
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.referenceContacts) {
      return {
        referenceContacts: nextProps.referenceContacts
      };
    }
  }

  render() {
    let { referenceContacts } = this.state;
    return (
      <div className="referencescontact_tabs__servicepro">
        <Formik
          enableReinitialize
          initialValues={referenceContacts}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            let res = await this.props.setReferencesContacts(values);
            if (res) {
              setSubmitting(false);
            }
          }}
          render={({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <FieldArray
                name="referenceContacts"
                render={arrayHelpers => (
                  <div>
                    {values.referenceContacts.map((supportingDoc, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-group">
                              <Field
                                autoComplete={"none"}
                                type="text"
                                placeholder="Contact Name"
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
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-group">
                              <CountryPicker
                                name="phoneNumber"
                                defaultValue={""}
                                value={
                                  values.referenceContacts[index].phoneNumber
                                }
                                setValue={(val, countryCode) => {
                                  setFieldValue(
                                    `referenceContacts[${index}].phoneNumber`,
                                    String(countryCode + val)
                                  );
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
                      ref={this.props.referenceContactRef}
                      hidden={this.props.hideSaveButton}
                      type="submit"
                      className="btn btns__blue"
                    >
                      Next
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

export default ReferencesContacts;
