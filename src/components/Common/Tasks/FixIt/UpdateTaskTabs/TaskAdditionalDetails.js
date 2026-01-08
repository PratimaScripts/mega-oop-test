import React, { useState, useEffect } from "react";
import { Tooltip, message } from "antd";
import { Formik, Form, Field } from "formik";
import get from "lodash/get";
import MyNumberInput from "../../../../../config/CustomNumberInput";

import "../styles.scss";

const TaskAdditionalDetails = props => {
  const [taskAdditionalData, setAddData] = useState(
    get(props, "taskAdditionalData", {})
  );

  useEffect(() => {
    setAddData(get(props, "taskAdditionalData"));
  }, [props]);

  return (
    <>
      <p className="head--task">
        <b>New Task:</b> Tell us what you need to be done?
      </p>
      <Formik
        enableReinitialize
        initialValues={{ ...taskAdditionalData }}
        onSubmit={async (values, { setSubmitting }) => {
          if (
            values.description.length > 50 &&
            values.description.length < 1000
          ) {
            let data = props.taskAdditionalData;
            // eslint-disable-next-line array-callback-return
            let updateData = Object.keys(values).map((key, i) => {
              data[key] = values[key];
            });

            await Promise.all(updateData);

            props.setAdditionalData(data);
            props.setActiveClass(3);
          } else {
            message.error(
              "The Description should be between 50 to 1000 characters!"
            );
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="details--task">
              <label>Title of the Task:</label>
              <Field
                className="w-100 input"
                type="text"
                maxlength={"50"}
                name="title"
                placeholder="Enter the title of your task - e.g Help move my sofa."
              />
              <label>What are the details:</label>
              <textarea
                className="w-100 input"
                type="text"
                minlength={"25"}
                maxlength={"1000"}
                defaultValue={get(values, "description", "")}
                onChange={e => setFieldValue("description", e.target.value)}
                placeholder="Be as specific as you can about what needs to be done."
              />
            </div>
            <div className="selection__wrapper">
              <label>Set Task Priority:</label>
              <div className="form-group">
                <div className="radio-box">
                  <label htmlFor="radio11">
                    <Field
                      type="radio"
                      name="priority"
                      defaultChecked={get(values, "priority") === "Low"}
                      value="Low"
                      id="radio11"
                    />
                    <div className="radio-item low">
                      <span>Low </span>
                    </div>
                  </label>
                  <label htmlFor="radio12">
                    <Field
                      type="radio"
                      name="priority"
                      value="Medium"
                      defaultChecked={get(values, "priority") === "Medium"}
                      id="radio12"
                    />
                    <div className="radio-item medium">
                      <span>Medium</span>
                    </div>
                  </label>
                  <label htmlFor="radio13">
                    <Field
                      type="radio"
                      name="priority"
                      value="High"
                      defaultChecked={get(values, "priority") === "High"}
                      id="radio13"
                    />
                    <div className="radio-item high">
                      <span>High</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="budget-task">
                <div className="form-group">
                  <label>Task Pay Owned By:</label>
                  <div className="radio-box">
                    <label htmlFor="landlord">
                      <Field
                        type="radio"
                        name="payOwnedBy"
                        value="Landlord"
                        defaultChecked={
                          get(values, "payOwnedBy") === "Landlord"
                        }
                        id="landlord"
                      />
                      <div className="radio-item">
                        <span>Landlord</span>
                      </div>
                    </label>
                    <label htmlFor="renter">
                      <Field
                        type="radio"
                        name="payOwnedBy"
                        value="Renter"
                        defaultChecked={get(values, "payOwnedBy") === "Renter"}
                        id="renter"
                      />
                      <div className="radio-item">
                        <span>Renter</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Enter your budget amount:
                    <Tooltip
                      overlayClassName="tooltip__color"
                      title="Enter the price you're comfortable to pay to get your task done. ServicePro will use this as a guide for how much to offer."
                    >
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                        alt="i"
                      />
                    </Tooltip>
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="fas fa-pound-sign"></i>
                      </div>
                    </div>
                    <MyNumberInput
                      name="salary.amount"
                      placeholder="Salary or Income"
                      className="form-control"
                      mask="_"
                      value={get(values, "budgetAmount", 0)}
                      onValueChange={val =>
                        setFieldValue("budgetAmount", val.floatValue)
                      }
                    />
                    {/* <input
                      className="form-control"
                      type="text"
                      placeholder="Choose Sub Category Or Issue"
                    /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <button
                ref={props.taskDetailBtnRef}
                type="submit"
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

export default TaskAdditionalDetails;
