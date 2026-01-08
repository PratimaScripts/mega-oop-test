import React, { useContext } from "react";
import { Formik, Form } from "formik";
import get from "lodash/get";
import { Button, DatePicker } from "antd";
import moment from "moment";
import { UserDataContext } from "store/contexts/UserContext";
import { createOrUpdateListingSchedule } from "config/queries/listing";

import { useMutation } from "@apollo/react-hooks";
import showNotification from "config/Notification";
import { ListingScheduleSchema } from "config/FormSchemas/Listing";

import "../styles.scss";

const Schedule = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const { accountSetting } = userState;

  const dateFormat =
    accountSetting && accountSetting["dateFormat"]
      ? accountSetting["dateFormat"]
      : process.env.REACT_APP_DATE_FORMAT;

  const [createOrUpdateListingScheduleMutation, { loading }] = useMutation(
    createOrUpdateListingSchedule,
    {
      onCompleted: ({ createOrUpdateListingSchedule }) => {
        if (get(createOrUpdateListingSchedule, "success", false)) {
          showNotification(
            "success",
            "Your changes have been successfully saved!"
          );
          props.setPropertyData((prevState) => ({
            ...prevState,
            isDraft: createOrUpdateListingSchedule?.data?.isDraft,
          }));
          props.setListingData({
            ...props.listingData,
            ...createOrUpdateListingSchedule.data,
          });
          props.updateActiveTab();
        } else {
          showNotification("error", "Failed to update listing detail", "");
        }
      },
      onError: (error) => {
        showNotification(
          "error",
          "Not able to update",
          "Reload page and try again"
        );
      },
    }
  );

  return (
    <>
      <Formik
        initialValues={props.listingData}
        validationSchema={ListingScheduleSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await createOrUpdateListingScheduleMutation({
            variables: {
              propertyId: props.propertyData.propertyId,
              listingSchedule: {
                earliestMoveInDate: values.earliestMoveInDate,
                dayAvailability: values.dayAvailability,
                timeAvailability: values.timeAvailability,
              },
            },
          }).finally(() => setSubmitting(false));
        }}
      >
        {({ errors, setFieldValue, values, dirty, handleSubmit }) => (
          <Form>
            <div className="row">
              <div className="col-lg-8 col-md-12 schedule__left--wrapper">
                <h3 className="special_space">
                  Provide earliest Move-in date, preferred day &amp; time for
                  viewing and next step
                </h3>

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className="labels__global">
                        Earliest Move In Date *
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fas fa-calendar-check"></i>
                          </div>
                        </div>

                        <DatePicker
                          aria-required="true"
                          name="earliestMoveInDate"
                          disabled={props.isPreviewMode}
                          placeholder="Please select date"
                          style={{ width: 295 }}
                          value={
                            values.earliestMoveInDate
                              ? moment(values.earliestMoveInDate)
                              : undefined
                          }
                          format={dateFormat}
                          onChange={(date, dateString) =>
                            setFieldValue("earliestMoveInDate", date)
                          }
                        />
                        {errors["earliestMoveInDate"] && (
                          <div className="text-danger">
                            *Please select Earliest move-in date.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <label className="labels__global">
                      Select days availability
                    </label>
                    <div className="button__listing">
                      <ul>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              !props.isPreviewMode &&
                              setFieldValue("dayAvailability", "Weekdays")
                            }
                            className={`btn btn__selectable ${
                              get(values, "dayAvailability", "") ===
                                "Weekdays" && "btn__selectable--active"
                            }`}
                          >
                            Weekdays
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              !props.isPreviewMode &&
                              setFieldValue("dayAvailability", "Weekend")
                            }
                            className={`btn btn__selectable ${
                              get(values, "dayAvailability", "") ===
                                "Weekend" && "btn__selectable--active"
                            }`}
                          >
                            Weekend
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              !props.isPreviewMode &&
                              setFieldValue("dayAvailability", "All Days")
                            }
                            className={`btn btn__selectable ${
                              get(values, "dayAvailability", "") ===
                                "All Days" && "btn__selectable--active"
                            }`}
                          >
                            All Days
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <label className="labels__global">
                      Select Time availability
                    </label>
                    <div className="button__listing">
                      <ul>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              !props.isPreviewMode &&
                              setFieldValue("timeAvailability", "8 am - 12 pm")
                            }
                            className={`btn btn__selectable ${
                              get(values, "timeAvailability", "") ===
                                "8 am - 12 pm" && "btn__selectable--active"
                            }`}
                          >
                            8 am - 12 pm
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              !props.isPreviewMode &&
                              setFieldValue("timeAvailability", "12 pm - 4 pm")
                            }
                            className={`btn btn__selectable ${
                              get(values, "timeAvailability", "") ===
                                "12 pm - 4 pm" && "btn__selectable--active"
                            }`}
                          >
                            12 pm - 4 pm
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              !props.isPreviewMode &&
                              setFieldValue("timeAvailability", "4 pm - 8 pm")
                            }
                            className={`btn btn__selectable ${
                              get(values, "timeAvailability", "") ===
                                "4 pm - 8 pm" && "btn__selectable--active"
                            }`}
                          >
                            4 pm - 8 pm
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              !props.isPreviewMode &&
                              setFieldValue("timeAvailability", "Any Time")
                            }
                            className={`btn btn__selectable ${
                              get(values, "timeAvailability", "") ===
                                "Any Time" && "btn__selectable--active"
                            }`}
                          >
                            Any Time
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <label className="labels__global">
                      For next step, do you require applicant screening to pre
                      qualify for online application?
                    </label>
                    <div className="clearfix" />

                    <label className="labels__global--toggle">
                      zyPass<sup>TM</sup> Screening Report **
                    </label>
                    <label className="switch" htmlFor="profilePictureMe">
                      <input
                        onChange={(e) =>
                          setFieldValue("requireScreening", e.target.checked)
                        }
                        disabled={props.isPreviewMode}
                        checked={get(values, "requireScreening")}
                        type="checkbox"
                        id="profilePictureMe"
                      />
                      <div className="slider round"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="schedule__gray--box">
                  <p>
                    ** Screening reports are recommended for prospective
                    tenants, which can be accessed by landlords just by paying
                    £10 (inc VAT) per person for the report upon acceptance of
                    rental applicants. Find pre-qualified renters by requiring
                    screening reports from all applicants.
                  </p>
                  <p>
                    To view reports, Landlords also need to verify self-people
                    screening performed by partner agencies or credit bureau to
                    ensure that Tenant's reports are being viewed by an
                    authorized individual. Landlord screening includes identity,
                    anti-money laundering, and owner title verification with
                    land-registry.
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <hr />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-right">
                <Button
                  size="large"
                  type="submit"
                  disabled={loading}
                  ref={props.submitButtonRef}
                  className="btns__warning--schedule"
                  loading={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    if (dirty) {
                      handleSubmit();
                    } else {
                      props.updateActiveTab();
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Schedule;
