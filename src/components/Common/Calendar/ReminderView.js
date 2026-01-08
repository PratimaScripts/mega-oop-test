import React, { useState, useEffect, useContext, useRef } from "react";
import { Calendar, Skeleton, Result, Switch, DatePicker } from "antd";
import get from "lodash/get";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import CalendarQuery from "../../../config/queries/calendar";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Formik, Form, Field } from "formik";
import NormalEventCard from "./NormalEventCard";
import { UserDataContext } from "store/contexts/UserContext";

import { message, Spin, Modal, TimePicker } from "antd";
import { CalendarTwoTone } from "@ant-design/icons";

import showNotification from "config/Notification";
import NProgress from "nprogress";

const ReminderView = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const { accountSetting } = userState;
  const [calEvents, setCalEvents] = useState([]);
  const allEvents = useRef([]);
  const [updateData, setUpdateData] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  // const [showReminders, setShowRemindersModal] = useState(false);
  const [isAddDrawerOpen, setDrawerStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const dateFormat =
    accountSetting && accountSetting["dateFormat"]
      ? accountSetting["dateFormat"]
      : process.env.REACT_APP_DATE_FORMAT;
  // const [selectedTime, setSelectedTime] = useState('')

  const updateReminders = (data) => {
    // calEvents = get(data, "getCalendarEvents.data", [])
    allEvents.current = get(data, "getCalendarEvents.data");
    setCalEvents(get(data, "getCalendarEvents.data"));
    setLoading(false);
  };
  const [filterByMonth, setFilterByMonth] = useState(false);
  const filterEvents = (date) => {
    setCalEvents(
      allEvents.current.filter(
        (event) =>
          moment(event.eventDate).format(
            filterByMonth ? "YYYYMM" : "YYYYMMDD"
          ) ===
          moment(new Date(date).toISOString()).format(
            filterByMonth ? "YYYYMM" : "YYYYMMDD"
          )
      )
    );
  };

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);

  const [updateEvent] = useMutation(CalendarQuery.updateEventItem, {
    onCompleted: ({ updateEventItem }) => {
      if (get(updateEventItem, "success", false)) {
        setDrawerStatus(false);
        // setShowRemindersModal(false);
        setSelectedDate({});
        showNotification("success", "Event Update Successfully", "");
        setCalEvents(get(updateEventItem, "data"));
      } else {
        showNotification(
          "error",
          "Failed to update event",
          updateEvent.message
        );
      }
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      showNotification(
        "error",
        "Not able to process your request",
        "Try again"
      );
    },
  });

  const [callData] = useMutation(CalendarQuery.updateCalenderEvent, {
    onCompleted: (data) => {
      if (get(data, "updateCalenderEvent.success")) {
        message.success("Event Added!");
        setSelectedDate({});
        // calEvents = get(data, "updateCalenderEvent.data", [])
        setCalEvents(get(data, "updateCalenderEvent.data"));
        setDrawerStatus(false);
      }
      NProgress.done();
    },
    onError: (error) => {
      NProgress.done();
      showNotification(
        "error",
        "Not able to process your request",
        "Try again"
      );
    },
  });

  const [getEvents] = useLazyQuery(CalendarQuery.getCalendarEvents, {
    onCompleted: updateReminders,
  });

  const getListData = (value) => {
    let va2 = filter(allEvents.current, (t) => {
      return (
        moment(new Date(t.eventDate).toISOString()).format("YYYYMMDD") ===
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
          listData[0].eventList.map((item, index) => (
            <li key={item.event}>
              <span className="ant-badge ant-badge-status ant-badge-not-a-wrapper d-block text-truncate">
                {item.event}
              </span>
            </li>
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
    setFilterByMonth(true);
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
      <div className="calendar_header_wrapper row m-0 mb-3">
        <div className="reminder_title col">
          <h2>Manage Reminders</h2>
        </div>
        <div className="calendar_fields col d-flex justify-content-end">
          <button
            className="btn btn-warning d-flex align-items-center justify-content-center"
            onClick={() => setDrawerStatus(true)}
          >
            + Add Reminder
          </button>
        </div>
      </div>

      <div className="clearfix" />
      <div className="calendar__menu--details row m-0 ">
        <div className="profile__details--left col-12 mx-0 col-lg-12 col-md-12">
          {/* part 1 */}
          {loading ? (
            <Skeleton active />
          ) : isEmpty(calEvents) ? (
            <Result
              title="No Events Found for this day"
              icon={<CalendarTwoTone />}
            />
          ) : (
            calEvents.map(
              (event) =>
                !isEmpty(event.eventList) && (
                  <NormalEventCard
                    event={event}
                    setUpdateData={setUpdateData}
                    // setShowRemindersModal={setShowRemindersModal}
                    setDrawerStatus={setDrawerStatus}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setCalEvents={setCalEvents}
                  />
                )
            )
          )}
        </div>

        {/* part 2 */}

        <div className="profile__details--right col-12 mx-0 col-lg-12 col-md-12">
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
                  values.eventTime = values.eventTime
                    ? values.eventTime
                    : moment("11:30", "HH:mm").format("HH:mm");
                  let d = {
                    variables: {
                      ...values,
                    },
                  };
                  // console.log("Values", d)

                  if (!isEmpty(updateData)) {
                    values.type = "update";
                    NProgress.start();
                    updateEvent({ variables: values });
                  } else {
                    NProgress.start();
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
                              placeholder="Please select date"
                              // style={{width: 295}}
                              value={
                                values.eventDate
                                  ? moment(values.eventDate)
                                  : undefined
                              }
                              format={dateFormat}
                              onChange={(date, dateString) =>
                                setFieldValue("eventDate", date)
                              }
                            />
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
                            {/* <Field
                              type="time"
                              name="eventTime"
                              className="form-control input__global"
                              placeholder="Select Event Time"
                              required
                            /> */}
                            <TimePicker
                              className="form-control input__global"
                              name="eventTime"
                              defaultValue={
                                values.eventTime
                                  ? moment(values.eventTime, "HH:mm")
                                  : moment("11:30", "HH:mm")
                              }
                              onChange={(value) =>
                                setFieldValue(
                                  "eventTime",
                                  moment(value).format("HH:mm")
                                )
                              }
                              format={"HH:mm"}
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
                      required
                    ></Field>
                    {/* <div className="toggle_recurring"> */}
                    <label>
                      <Switch
                        checkedChildren="Recurring"
                        unCheckedChildren="Recurring?"
                        onChange={(checked) =>
                          setFieldValue("isRecurring", checked)
                        }
                        checked={get(values, "isRecurring", false)}
                      />
                    </label>
                    {/* </div> */}
                    {get(values, "isRecurring", false) && (
                      <Field
                        component="select"
                        name="recurringFrequency"
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

export default ReminderView;
