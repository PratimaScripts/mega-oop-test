/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useQuery } from "@apollo/react-hooks";
import PropertyQuery from "../../../../../config/queries/property";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import "../styles.scss";

const Location = props => {
  const [locationData, setData] = useState(get(props, "locationData"));
  const { data } = useQuery(PropertyQuery.fetchProperty);
  let properties = get(data, "fetchProperty.data", []);

  let propertyOptions =
    !isEmpty(properties) &&
    properties.map((pr, i) => {
      return <option key={i} value={pr.propertyId}>{pr.title}</option>;
    });

  useEffect(() => {
    setData(get(props, "locationData"));
  }, [props]);

  return (
    <>
      <p className="head--task">
        <b>Update Task</b>
      </p>

      {/* Formik test */}

      <Formik
        enableReinitialize
        initialValues={{ ...locationData }}
        onSubmit={async (values, { setSubmitting }) => {
          let data = props.locationData;
          let updateData = Object.keys(values).map((key, i) => {
            data[key] = values[key];
          });

          await Promise.all(updateData);
          props.setLocationData(data);
          props.setActiveClass(1);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="form-group">
              <label className="font-16">Select Property *</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                </div>
                <Field
                  component="select"
                  name="propertyId"
                  className="form-control"
                  disabled
                >
                  <option value disabled selected>
                    Select Property
                  </option>
                  {propertyOptions}
                </Field>
                {/* <input
                  className="form-control"
                  type="text"
                  placeholder="Property"
                /> */}
              </div>
            </div>
            <div className="availability--task">
              <label>Select Day Availability</label>
              <div className="form-group">
                <div className="radio-box">
                  <label htmlFor="radio11">
                    <Field
                      type="radio"
                      value="Weekdays"
                      defaultChecked={
                        get(values, "dayAvailability") === "Weekdays"
                      }
                      name="dayAvailability"
                      id="radio11"
                    />
                    <div className="radio-item">
                      <span>Weekdays </span>
                    </div>
                  </label>
                  <label htmlFor="radio12">
                    <Field
                      type="radio"
                      value="Weekend"
                      name="dayAvailability"
                      defaultChecked={
                        get(values, "dayAvailability") === "Weekend"
                      }
                      id="radio12"
                    />
                    <div className="radio-item">
                      <span>Weekend</span>
                    </div>
                  </label>
                  <label htmlFor="radio13">
                    <Field
                      type="radio"
                      value="All Day"
                      name="dayAvailability"
                      defaultChecked={
                        get(values, "dayAvailability") === "All Day"
                      }
                      id="radio13"
                    />
                    <div className="radio-item">
                      <span>All Day</span>
                    </div>
                  </label>
                </div>
              </div>
              <label>Select Time Availability</label>
              <div className="form-group">
                <div className="radio-box">
                  <label htmlFor="radio21">
                    <Field
                      type="radio"
                      name="timeAvailability"
                      value="Morning 8 am - 12 pm"
                      defaultChecked={
                        get(values, "timeAvailability") ===
                        "Morning 8 am - 12 pm"
                      }
                      id="radio21"
                    />
                    <div className="radio-item">
                      <span>Morning 8 am - 12 pm </span>
                    </div>
                  </label>
                  <label htmlFor="radio22">
                    <Field
                      type="radio"
                      name="timeAvailability"
                      value="Afternoon 12 pm - 4 pm"
                      defaultChecked={
                        get(values, "timeAvailability") ===
                        "Afternoon 12 pm - 4 pm"
                      }
                      id="radio22"
                    />
                    <div className="radio-item">
                      <span>Afternoon 12 pm - 4 pm </span>
                    </div>
                  </label>
                  <label htmlFor="radio23">
                    <Field
                      type="radio"
                      name="timeAvailability"
                      value="Evening 4 pm - 8 pm"
                      defaultChecked={
                        get(values, "timeAvailability") ===
                        "Evening 4 pm - 8 pm"
                      }
                      id="radio23"
                    />
                    <div className="radio-item">
                      <span>Evening 4 pm - 8 pm </span>
                    </div>
                  </label>
                  <label htmlFor="radio24">
                    <Field
                      type="radio"
                      name="timeAvailability"
                      value="Any Time"
                      defaultChecked={
                        get(values, "timeAvailability") === "Any Time"
                      }
                      id="radio24"
                    />
                    <div className="radio-item">
                      <span>Any Time</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <button
                type="submit"
                ref={props.locationBtnRef}
                // onClick={saveData}
                className="btn btn-warning  pull-right"
              >
                Next &nbsp;
                <i className="fa fa-angle-double-right" aria-hidden="true"></i>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Location;
