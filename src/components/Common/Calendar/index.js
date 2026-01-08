import React, { useContext, useState } from "react";
import { Tabs } from "antd";
import RemiderEventCard from "./ReminderView";
import BookViewing from "./BookViewing";
import { UPDATE_UI_DATA, UserDataContext } from "store/contexts/UserContext";
import "./style.scss";

const { TabPane } = Tabs;

const CalendarMain = (props) => {
  const {
    state: { uiData },
    dispatch,
  } = useContext(UserDataContext);

  const [activeTab] = useState(uiData.calendarActiveTab);

  const onChange = (key) =>
    dispatch({
      type: UPDATE_UI_DATA,
      payload: { key: "calendarActiveTab", data: key },
    });

  return (
    <Tabs type="card" activeKey={activeTab} onChange={onChange}>
      <TabPane tab="Reminders" key="1">
        <RemiderEventCard />
      </TabPane>
      <TabPane tab="Viewing Requests" key="2">
        <BookViewing />
      </TabPane>
    </Tabs>
  );
};

export default CalendarMain;
