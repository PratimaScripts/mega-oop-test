import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import CountryPicker from "../../../../../config/CountryCodeSelector";

import "./style.scss";

class ReferencesContacts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      screeningInvites: {
        screeningInvites: [{ firstName: "", lastName: "", email: "", phoneNumber: "" }]
      },
      countryCode: "44"
    };
  }

  //   componentDidMount() {
  //     this.setState({
  //         screeningInvites: this.props.screeningInvites
  //     });
  //   }

  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     if (nextProps.screeningInvites) {
  //       return {
  //         screeningInvites: nextProps.screeningInvites
  //       };
  //     }
  //   }

  render() {
    let { screeningInvites } = this.state;
    return (
      <div>
        <Formik
          enableReinitialize
          initialValues={screeningInvites}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            let res = await this.props.inviteUsers(values);
            if (res) {
              setSubmitting(false);
            }
          }}
          render={({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <FieldArray
                name="screeningInvites"
                render={arrayHelpers => (
                  <div>
                    {values.screeningInvites.map((invites, index) => (
                      // Repeating div start
                      <div key={index}>
                        <div className="screening--mainCheckoutOrder">
                          <div className="row">
                            <div className="screening__checkoutOrder">
                              <div className="screening__checkoutOrder--wrap d-flex">
                                <div className="serial__number">
                                  {/* List Index */}
                                  <p>{index + 1}</p>
                                </div>

                                <ul>
                                  <li className="mr-3 list_invite">
                                    <div className="form-group">
                                      <label>First Name *</label>
                                      <Field
                                        autoComplete={"none"}
                                        type="text"
                                        placeholder="First Name"
                                        className="form-control select__global  w-100"
                                        name={`screeningInvites.${index}.firstName`}
                                        required
                                      />
                                    </div>
                                  </li>
                                  <li className="list_invite">
                                    <div className="form-group">
                                      <label>Last Name *</label>
                                      <Field
                                        autoComplete={"none"}
                                        type="text"
                                        placeholder="Last Name"
                                        className="form-control select__global w-100"
                                        name={`screeningInvites.${index}.lastName`}
                                        required
                                      />
                                    </div>
                                  </li>
                                  <li className="mr-3 list_invite">
                                    <div className="form-group">
                                      <label>Their Email Address *</label>
                                      <Field
                                        type="email"
                                        placeholder="Email"
                                        autoComplete={"none"}
                                        className="form-control select__global w-100"
                                        name={`screeningInvites.${index}.email`}
                                        required
                                      />
                                    </div>
                                  </li>
                                  <li className="list_invite">
                                    <div className="form-group">
                                      <label>Their Mobile Number *</label>
                                      <CountryPicker
                                        countryCode={this.state.countryCode}
                                        value={
                                          values.screeningInvites[index]
                                            .phoneNumber
                                        }
                                        required
                                        setValue={(val, countryCode) => {
                                          setFieldValue(
                                            `screeningInvites[${index}].phoneNumber`,
                                            String(countryCode + val)
                                          );
                                          this.setState({ countryCode })
                                        }}
                                        className="form-control select__global w-100"
                                      />
                                      {/* <CountryPicker
                                        placeholder="Phone Number"
                                        defaultValue={""}
                                        value={
                                          values.screeningInvites[index]
                                            .phoneNumber
                                        }
                                        required
                                        setValue={(val, countryCode) => {
                                          setFieldValue(
                                            `screeningInvites[${index}].phoneNumber`,
                                            String(countryCode + val)
                                          );
                                        }}
                                        className="form-control select__global w-100"
                                      /> */}
                                      {/* <MyNumberInput
                                        placeholder="Phone Number"
                                        className="form-control select__global"
                                        format="(###) ###-####"
                                        mask="_"
                                        defaultValue={""}
                                        value={
                                          values.screeningInvites[index]
                                            .phoneNumber
                                        }
                                        onValueChange={val =>
                                          setFieldValue(
                                            `screeningInvites[${index}].phoneNumber`,
                                            String(val.floatValue)
                                          )
                                        }
                                        required
                                      /> */}
                                    </div>
                                  </li>
                                  <li>
                                    <div className="col-md-4">
                                      {values.screeningInvites.length > 1 && (
                                        <button
                                          className="btn btns__addmore"
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                        >
                                          <i className="fas fa-minus"></i>{" "}
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                      // Repeating div end
                    ))}

                    <div className="row">
                      <div className="col-md-8"></div>
                      <div className="col-md-4">
                        <button
                          className="btn btns__addmore"
                          type="button"
                          onClick={() =>
                            arrayHelpers.push({
                              firstName: "",
                              email: "",
                              lastName: "",
                              phoneNumber: ""
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
