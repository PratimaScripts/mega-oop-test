import React from "react";
import { Formik, Form, Field } from "formik";
import CountryPicker from "../../../config/CountryCodeSelector";

import "./style.scss";

class InviteLandlord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invitedLandlordData: {}
    };
  }

  //   componentDidMount() {
  //     this.setState({
  //         screeningInvites: this.props.screeningInvites
  //     });
  //   }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.invitedLandlordData) {
      return {
        invitedLandlordData: nextProps.invitedLandlordData
      };
    }
  }

  render() {
    let { invitedLandlordData } = this.state;
    return (
      <div>
        <Formik
          enableReinitialize
          initialValues={invitedLandlordData}
          onSubmit={async (values, { setSubmitting }) => {
            this.props.setInvitedLandlordData(values);
            this.props.next();
          }}
          render={({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div>
                <div className="screening--mainCheckoutOrder">
                  <div className="row">
                    <div className="screening__checkoutOrder">
                      <div className="screening__checkoutOrder--wrap d-flex">
                        <ul>
                          <li className="mr-3 list_invite">
                            <div className="form-group">
                              <label>First Name *</label>
                              <Field
                                autoComplete={"none"}
                                type="text"
                                placeholder="First Name"
                                className="form-control select__global  w-100"
                                name={`firstName`}
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
                                name={`lastName`}
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
                                name={`email`}
                                required
                              />
                            </div>
                          </li>
                          <li className="list_invite">
                            <div className="form-group">
                              <label>Their Mobile Number *</label>
                              <CountryPicker
                                placeholder="Phone Number"
                                defaultValue={""}
                                value={values.phoneNumber}
                                required
                                setValue={(val, countryCode) => {
                                  setFieldValue(
                                    `phoneNumber`,
                                    String(countryCode + val)
                                  );
                                }}
                                className="form-control select__global w-100"
                              />
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-primary"
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

export default InviteLandlord;
