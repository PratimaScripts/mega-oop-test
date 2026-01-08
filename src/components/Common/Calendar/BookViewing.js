import React, { useState, useEffect, useRef, useContext } from "react";
import { Calendar, Skeleton, Result, DatePicker } from "antd";
import get from "lodash/get";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import CalendarQuery from "../../../config/queries/calendar";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Formik, Form, Field } from "formik";
import BookViewingReceiverCard from "./BookViewingReceiverCard";
import BookViewingSenderCard from "./BookViewingSenderCard";

import {  message, Spin, Modal } from "antd";
import { CalendarTwoTone } from "@ant-design/icons";
import { getBookViewingByUser } from "config/queries/bookViewing";
import { UserDataContext } from "store/contexts/UserContext";

const BookViewing = (props) => {
  const { state: userDataState } = useContext(UserDataContext);
  const { userData, accountSetting } = userDataState;
  const [bookVieiwngs, setCalEvents] = useState([]);
  const allBookings = useRef([]);
  const [updateData, setUpdateData] = useState({});
  // const [selectedDate, setSelectedDate] = useState({});
  // const [showReminders, setShowRemindersModal] = useState(false);
  const [isAddDrawerOpen, setDrawerStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const dateFormat = accountSetting && accountSetting["dateFormat"]
  ? accountSetting["dateFormat"]
  : process.env.REACT_APP_DATE_FORMAT

  const filterEvents = (date, filterByMonth) => {
    setCalEvents(
      allBookings.current.filter(
        (bookViewing) =>
          moment(bookViewing.date).format(filterByMonth ? "MM" : "YYYYMMDD") ===
          moment(new Date(date).toISOString()).format(
            filterByMonth ? "MM" : "YYYYMMDD"
          )
      )
    );
  };

  useEffect(() => {
    getBookViewings();
    // eslint-disable-next-line
  }, []);

  const [updateEvent] = useMutation(CalendarQuery.updateEventItem, {
    onCompleted: (data) => {
      setDrawerStatus(false);
      // setShowRemindersModal(false);
      // setSelectedDate({});
      // bookVieiwngs = get(data, "updateEventItem.data", [])
      setCalEvents(get(data, "updateEventItem.data"));
    },
  });

  const [callData] = useMutation(CalendarQuery.updateCalenderEvent, {
    onCompleted: (data) => {
      if (get(data, "updateCalenderEvent.success")) {
        message.success("Event Added!");
        // setSelectedDate({});
        // bookVieiwngs = get(data, "updateCalenderEvent.data", [])
        setCalEvents(get(data, "updateCalenderEvent.data"));
        setDrawerStatus(false);
      }
    },
  });

  const [getBookViewings] = useLazyQuery(getBookViewingByUser, {
    onCompleted: ({ getBookViewingByUser }) => {
      if (get(getBookViewingByUser, "success", false)) {
        allBookings.current = get(getBookViewingByUser, "data", []);
        setCalEvents(get(getBookViewingByUser, "data", []));
        setLoading(false);
      }
      setLoading(false);
      // console.log(getBookViewingByUser)
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  const getListData = (value) => {
    let va2 = filter(allBookings.current, (t) => {
      return (
        moment(new Date(t.date).toISOString()).format("YYYYMMDD") ===
        moment(new Date(value).toISOString()).format("YYYYMMDD")
      );
    });

    return va2 || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);

    return (
      <ul className="events">
        {!isEmpty(listData) &&
          listData.map((item, index) => (
            <li key={item._id}>{`${item.propertyId.title} view request`}</li>
          ))}
      </ul>
    );
  };

  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    // filterEvents(value, true)
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  return (
    <div>
      <div className="calendar_header_wrapper">
        <div className="reminder_title">
          <h2>Your Book Viewing Requests</h2>
        </div>
      </div>

      <div className="clearfix" />
      <div className="calendar__menu--details row m-0">
        <div className="col-12 col-lg-5 col-md-12 profile__details--left">
          {/* part 1 */}
          {loading ? (
            <Skeleton active />
          ) : isEmpty(bookVieiwngs) ? (
            <Result
              title="No Events Found for this day"
              icon={<CalendarTwoTone />}
            />
          ) : (
            bookVieiwngs.map((bookViewing) => (
              <>
                {bookViewing.userId._id === userData._id ? (
                  <BookViewingSenderCard
                    key={bookViewing.eventId}
                    bookViewing={bookViewing}
                    getBookViewings={getBookViewings}
                  />
                ) : (
                  <BookViewingReceiverCard
                    key={bookViewing.eventId}
                    bookViewing={bookViewing}
                    getBookViewings={getBookViewings}
                  />
                )}
              </>
            ))
          )}
        </div>

        {/* part 2 */}

        <div className="col-12 mx-0 col-lg-7 col-md-12 profile__details--right">
          <div className="calendar-wrap">
            <Calendar
              dateCellRender={dateCellRender}
              monthCellRender={monthCellRender}
              onSelect={(data) => {
                filterEvents(data);
              }}
            />

            <Modal
              title="Add Activity"
              closable={true}
              footer={null}
              onCancel={() => {
                setUpdateData({});
                setDrawerStatus(false);
              }}
              visible={isAddDrawerOpen}
              destroyOnClose
            >
              <Formik
                enableReinitialize
                initialValues={updateData}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  values.eventDate =
                    values.eventDate &&
                    new Date(values.eventDate).toISOString();
                  values.isRecurring = get(values, "isRecurring", false);
                  let d = {
                    variables: {
                      ...values,
                    },
                  };

                  if (!isEmpty(updateData)) {
                    values.type = "update";
                    updateEvent({ variables: values });
                  } else {
                    callData(d);
                  }
                }}
              >
                {({ isSubmitting, errors, setFieldValue, values }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="tab__deatils--label">
                            <span className="labels__global">
                              Reminder Date *
                            </span>
                          </label>
                          <div className="date__flex">
                            <div className="input-group-prepend">
                              <div className="input-group-text">
                                <i className="fa fa-calendar" />
                              </div>
                            </div>

                            <DatePicker
                              required={true}
                              disabled={props.isPreviewMode}
                              placeholder="Please select date"
                              // style={{width: 295}}
                              value={values.eventDate ? moment(values.eventDate): undefined}
                              format={dateFormat}
                              onChange={(date, dateString) => setFieldValue("eventDate", date)} />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="labels__global">
                            Reminder Time *
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <div className="input-group-text">
                                <i className="fas fa-clock"></i>
                              </div>
                            </div>
                            <Field
                              type="time"
                              name="eventTime"
                              className="form-control input__global"
                              placeholder="Select Event Time"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Field
                      component="textarea"
                      className="form-control"
                      placeholder="Add a Reminder"
                      name="event"
                      spellcheck="false"
                    ></Field>
                    <div className="toggle_recurring">
                      <label className="switch" for="profilePictureMe">
                        <input
                          onChange={(e) =>
                            setFieldValue("isRecurring", e.target.checked)
                          }
                          checked={get(values, "isRecurring")}
                          type="checkbox"
                          id="profilePictureMe"
                        />
                        <div className="slider round"></div>
                      </label>
                      <label className="labels__global">Is Recurring ?</label>
                    </div>
                    {get(values, "isRecurring", false) && (
                      <Field
                        component="select"
                        name="subType"
                        className="form-control mb-3"
                      >
                        <option selected disabled>
                          Select Subtype
                        </option>
                        {[
                          "Daily",
                          "Weekly",
                          "Monthly",
                          "Every six months",
                          "Yearly",
                        ].map((f, i) => {
                          return (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          );
                        })}
                      </Field>
                    )}
                    <Spin spinning={isSubmitting}>
                      <div className="col-md-12 text-right">
                        <button
                          type="submit"
                          className=" btn btn-primary btns__warning--schedule"
                        >
                          Save &amp; Next &nbsp;
                          <i
                            className="fa fa-angle-double-right"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </Spin>
                  </Form>
                )}
              </Formik>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookViewing;
