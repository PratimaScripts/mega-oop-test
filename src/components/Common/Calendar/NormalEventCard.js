import React, { useState } from "react";
import moment from "moment";
import { Tag, Space, Divider } from "antd";
import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import { ClockCircleOutlined, RedoOutlined } from "@ant-design/icons";
import isEmpty from "lodash/isEmpty";
import { useMutation } from "@apollo/react-hooks";
import CalendarQuery from "../../../config/queries/calendar";
import get from "lodash/get";
import showNotification from "config/Notification";

const NormalEventCard = ({
  event,
  setUpdateData,
  setDrawerStatus,
  setSelectedDate,
  setCalEvents,
}) => {
  const [collapse, setCollapse] = useState(false);
  const toggle = () => setCollapse(!collapse);

  const [updateEvent] = useMutation(CalendarQuery.updateEventItem, {
    onCompleted: (data) => {
      setDrawerStatus(false);
      setSelectedDate({});
      // calEvents = get(data, "updateEventItem.data", [])
      setCalEvents(get(data, "updateEventItem.data"));
    },
    onError: (error) => {
      showNotification("error", "Failed to update the event");
    },
  });

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardHeader
        onClick={toggle}
        data-type="collapseLayout"
        className={`card__title card__middle ${collapse && "active__tab"}`}
      >
        <span className="dot"></span>
        <span style={{ fontSize: 14 }}>
          {moment(event.eventDate).format("Do MMM YYYY")}
        </span>
        <Tag className="tag">Scheduled</Tag>
        {collapse ? (
          <div className="details__icons active">
            <i className="mdi mdi-chevron-up"></i>
          </div>
        ) : (
          <div className="details__icons">
            <i className="mdi mdi-chevron-down down__marg"></i>
          </div>
        )}
      </CardHeader>
      <Collapse isOpen={collapse}>
        <CardBody>
          {!isEmpty(event.eventList) &&
            event.eventList.map((item, index) => (
              <>
                <Space size={"large"}>
                  <span>
                    Event - {item.event ? item.event : "Not available"}
                  </span>
                  <span>
                    <ClockCircleOutlined />{" "}
                    {item.eventTime ? item.eventTime : "Not Available"}
                  </span>
                  {item.isRecurring && item.recurringFrequency !== "None" && (
                    <span>
                      <RedoOutlined /> {item.recurringFrequency}{" "}
                    </span>
                  )}
                  <i
                    onClick={() => {
                      setUpdateData({ ...event, ...item });
                      setDrawerStatus(true);
                    }}
                    className="fas fa-edit cursor-pointer"
                  ></i>
                  <i
                    onClick={() => {
                      event.eventTime = moment(event.eventDate).format("HH:MM");
                      updateEvent({
                        variables: {
                          ...event,
                          ...item,
                          type: "delete",
                        },
                      });
                    }}
                    className="fas fa-trash-alt cursor-pointer"
                  ></i>
                </Space>
                <Divider />
              </>
            ))}
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default NormalEventCard;
