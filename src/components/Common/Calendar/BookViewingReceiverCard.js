import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import { Button, Avatar, TimePicker, DatePicker, Tag, Popconfirm } from "antd";
import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import { MobileOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import NProgress from "nprogress";
import CommonQuery from "config/queries/login";
import showNotification from "config/Notification";
import {
  updateBookViewingStatus,
  updateBookViewDateTime,
} from "config/queries/bookViewing";
import { UPDATE_UI_DATA, UserDataContext } from "store/contexts/UserContext";
import { get } from "lodash";

const BookViewingReceiverCard = ({
  bookViewing,
  getBookViewings,
  isOpen = false,
}) => {
  const { dispatch: userDispatch } = useContext(UserDataContext);

  const [isNotActive, setIsNotActive] = useState(true);
  const [collapse, setCollapse] = useState(isOpen);
  const toggle = () => setCollapse(!collapse);
  const sharePrivateInfoStatusList = [
    "Approved",
    "Accepted",
    "InProgress",
    "Completed",
  ];
  const [showRescheduleView, setShowRescheduleView] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlots, setTimeSlots] = useState({ startTime: "", endTime: "" });

  useEffect(() => {
    setIsNotActive(moment(bookViewing.date) < moment());
  }, [bookViewing]);

  const getTimeRange = (timePeriod) => {
    if (typeof timePeriod === "string") {
      const times = timePeriod.split(" - ");
      return {
        startTime: moment(times[0], "hh:mm A"),
        endTime: moment(times[1], "hh:mm A"),
      };
    }
    return {
      startTime: moment("11:00 am", "hh:mm A"),
      endTime: moment("11:30 am", "hh:mm A"),
    };
  };

  // console.log("times", getTimeRange(bookViewing.bookedTimeSlot).startTime,
  // getTimeRange(bookViewing.bookedTimeSlot).endTime)

  const [updateBookViewingStatusMutation, { loading: confirmLoading }] =
    useMutation(updateBookViewingStatus, {
      onCompleted: ({ updateBookViewingStatus }) => {
        if (updateBookViewingStatus.success) {
          getBookViewings();
          showNotification("success", "Status updated", "");
        } else {
          showNotification(
            "error",
            "Failed to update",
            updateBookViewingStatus.data.message
          );
        }
        NProgress.done();
      },
      onError: (error) => {
        NProgress.done();
        showNotification(
          "error",
          "Failed to change status of Booking",
          "Reload the page and Try again"
        );
      },
    });

  const [updateBookViewingDateTimeMutation, { loading: dateTimeLoading }] =
    useMutation(updateBookViewDateTime, {
      onCompleted: ({ updateBookViewDateTime }) => {
        if (updateBookViewDateTime.success) {
          getBookViewings();
          showNotification("success", "Date-time updated", "");
        } else {
          showNotification(
            "error",
            "Failed to update",
            updateBookViewDateTime.data.message
          );
        }
        NProgress.done();
      },
      onError: (error) => {
        NProgress.done();
        showNotification(
          "error",
          "Failed to change status of Booking",
          "Reload the page and Try again"
        );
      },
    });

  const [updateCalendarNotificationCount] = useLazyQuery(
    CommonQuery.getCalendarNotifications,
    {
      onCompleted: (data) =>
        userDispatch({
          type: UPDATE_UI_DATA,
          payload: {
            key: "calendarNotification",
            data: get(data, "getCalendarNotifications.count", 0),
          },
        }),
    }
  );

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardHeader
        onClick={toggle}
        data-type="collapseLayout"
        className={`card__title card__middle ${collapse && "active__tab"}`}
      >
        <span
          className="dot mr-2"
          style={{
            backgroundColor: isNotActive
              ? "red"
              : bookViewing.status === "Request"
              ? "#bbb"
              : sharePrivateInfoStatusList.includes(bookViewing.status)
              ? "green"
              : "red",
            minWidth: 15,
          }}
        ></span>
        <span style={{ fontSize: 14 }} className="text-truncate">
          {moment(bookViewing.date).format("Do MMM YYYY")} Property View Request
        </span>
        <Tag className="tag">{bookViewing?.status}</Tag>
        {collapse ? (
          <div className="details__icons active ml-2">
            <i className="mdi mdi-chevron-up"></i>
          </div>
        ) : (
          <div className="details__icons ml-2">
            <i className="mdi mdi-chevron-down down__marg"></i>
          </div>
        )}
      </CardHeader>
      <Collapse isOpen={collapse}>
        <CardBody style={{ paddingBottom: "1rem" }}>
          <div className="row col-12 mb-3">
            <div className="col-12 col-sm-6">
              <div className="row">
                {" "}
                <ClockCircleOutlined
                  className="col px-0"
                  style={{ maxWidth: 45 }}
                />{" "}
                <p className="d-inline-block w-75 col m-0 p-0">
                  {bookViewing.bookedTimeSlot
                    ? bookViewing.bookedTimeSlot
                    : "Not Available"}
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 mt-3">
              <div className="row">
                <i
                  className="fa fa-map-marker col"
                  style={{ maxWidth: 45 }}
                  aria-hidden="true"
                ></i>
                <p className="d-inline-block w-75 col m-0 p-0">
                  {bookViewing.propertyId?.privateTitle
                    ? bookViewing.propertyId?.privateTitle
                    : bookViewing.propertyId?.title}
                </p>
              </div>
            </div>
          </div>
          <div className="row col-12 mt-4">
            <div className="col-12 col-sm-6">
              <div className="row">
                <span className="avatar-item col px-2" style={{ maxWidth: 45 }}>
                  <Avatar size="small" src={bookViewing.userId?.avatar} />
                </span>
                <p className="d-inline-block text-capitalize col p-0 m-0 w-75">
                  {bookViewing.userId?.firstName} {bookViewing.userId?.lastName}
                  .
                </p>
              </div>
              {/* <i
                      className="fa fa-envelope ml-2 custom-icon"
                      aria-hidden="true"
                    ></i> */}
            </div>
            <div className="col-12 col-sm-6 mt-3">
              <div className="row">
                <MobileOutlined className="col px-0" style={{ maxWidth: 45 }} />
                <p className="col p-0 m-0 d-inline-block w-75">
                  {sharePrivateInfoStatusList.includes(bookViewing.status) &&
                  bookViewing.userId?.phoneNumber
                    ? bookViewing.userId?.phoneNumber
                    : "+44XXXXXXXXXXX"}
                </p>
              </div>
            </div>
          </div>
          <div className="row col-12 mt-3 p-0 m-0 bottom-btn-group1">
            {!sharePrivateInfoStatusList.includes(bookViewing.status) && (
              <div className="col-6 col-lg col-md-6 px-1">
                <Popconfirm
                  disabled={isNotActive}
                  placement="topLeft"
                  title="Accept Property View Request"
                  onConfirm={() => {
                    NProgress.start();
                    updateBookViewingStatusMutation({
                      variables: { _id: bookViewing._id, status: "Accepted" },
                    });
                    updateCalendarNotificationCount();
                  }}
                  okButtonProps={{ loading: confirmLoading }}
                  okText="Yes, Accept!"
                  cancelText="No, Wil do later"
                >
                  <button
                    className={`btn btn-primary ${isNotActive && "disabled"}`}
                    style={{ cursor: isNotActive ? "not-allowed" : "pointer" }}
                  >
                    Accept
                  </button>
                </Popconfirm>
              </div>
            )}
            {bookViewing.status === "Accepted" && (
              <div className="col-6 col-lg col-md-6 px-1">
                <button
                  className="btn btn-outline-primary btn-reschedule btn-block"
                  onClick={() => setShowRescheduleView(!showRescheduleView)}
                >
                  Reschedule
                </button>
              </div>
            )}
            <div className="col-6 col-lg col-md-6 px-1">
              <Popconfirm
                disabled={isNotActive}
                placement="topLeft"
                title="Accept Property View Request"
                onConfirm={() => {
                  NProgress.start();
                  updateBookViewingStatusMutation({
                    variables: { _id: bookViewing._id, status: "Cancelled" },
                  });
                  updateCalendarNotificationCount();
                }}
                okButtonProps={{ loading: confirmLoading }}
                okText="Yes, Cancel!"
                cancelText="No, Wil do later"
              >
                <button
                  className={`btn btn-cancel btn-block ${
                    isNotActive && "disabled"
                  }`}
                  style={{ cursor: isNotActive ? "not-allowed" : "pointer" }}
                  disabled={confirmLoading}
                >
                  Cancel
                </button>
              </Popconfirm>
            </div>
          </div>
          <div className="row col-12 mt-3 bottom-btn-group1">
            {showRescheduleView && (
              <>
                <div className="col-4">
                  <DatePicker
                    className="picker"
                    defaultValue={moment(bookViewing.date)}
                    value={bookingDate ? bookingDate : moment(bookViewing.date)}
                    onChange={(value) => {
                      setBookingDate(value);
                    }}
                    format={"DD-MM-YYYY"}
                    style={{ width: 300 }}
                  />
                </div>
                <div className="col-4">
                  <TimePicker.RangePicker
                    className="picker"
                    style={{ width: 300 }}
                    defaultValue={[
                      getTimeRange(bookViewing.bookedTimeSlot).startTime,
                      getTimeRange(bookViewing.bookedTimeSlot).endTime,
                    ]}
                    format="HH:mm:ss"
                    onChange={(value) =>
                      setTimeSlots({
                        startTime: moment(value[0], "HH:mm:ss").format(
                          "hh:mm a"
                        ),
                        endTime: moment(value[1], "HH:mm:ss").format("hh:mm a"),
                      })
                    }
                  />
                </div>

                <div className="col-12 row bottom-btn-group2">
                  <Button
                    className="btn btn-primary"
                    loading={dateTimeLoading}
                    onClick={() => {
                      NProgress.start();
                      updateBookViewingDateTimeMutation({
                        variables: {
                          _id: bookViewing._id,
                          date: bookingDate ? bookingDate : bookViewing.date,
                          bookedTimeSlot:
                            timeSlots.startTime && timeSlots.endTime
                              ? `${timeSlots.startTime} - ${timeSlots.endTime}`
                              : bookViewing.bookedTimeSlot,
                          eventId: bookViewing.eventId,
                        },
                      });
                    }}
                  >
                    Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default BookViewingReceiverCard;
