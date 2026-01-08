import React, { useState } from "react";
import get from "lodash/get";
import { List, Avatar, Drawer, Popover, Modal, Skeleton } from "antd";
import TaskDetails from "./TaskDetails";
import AdminQueries from "../../../../config/queries/admin";
import { useMutation, useQuery } from "@apollo/react-hooks";
import "./style.scss";

const Reports = () => {
  const [flaggedReports, setFlags] = useState([]);
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState({});
  const [viewDetails, toggleDetailsDrawer] = useState(false);
  const [viewReasonDrawer, toggleReasonDrawer] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [activeReason, setActiveReason] = useState(false);

  const [changeFlagTaskStatus] = useMutation(AdminQueries.changeFlagTaskStatus);



  useQuery(AdminQueries.getFlaggedTasks, {
    onCompleted: ({ getFlaggedTasks }) => {
      if (getFlaggedTasks.success) {
        setFlags(getFlaggedTasks.data)
      }
      setLoading(false)
    }
  })

  const updateReport = async type => {
    toggleReasonDrawer(true);
  };
  return (
    loading ? <Skeleton active /> : <>
      <List
        itemLayout="horizontal"
        dataSource={flaggedReports}
        pagination={{ pageSize: 5 }}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={get(
                    item,
                    "taskId.images[0].image",
                    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  )}
                />
              }
              title={<a href>{get(item, "taskId.title")}</a>}
              description={
                <>
                  <p>
                    <b>Reason - </b>
                    {get(item, "flagReason")}
                  </p>
                  <p>
                    <b>Flagged On - </b>
                    {get(item, "createdAt")}
                  </p>
                  <button
                    onClick={() => {
                      toggleDetailsDrawer(true);
                      setSelectedTask(item);
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    View Details
                  </button>{" "}
                  <Popover
                    title={null}
                    content={
                      <>
                        <p>
                          <b>Flagged IP -</b>{" "}
                          {get(item, "flaggingLocationMetaData.ip")}
                        </p>
                        <p>
                          <b>Flagged Location -</b>{" "}
                          {get(item, "flaggingLocationMetaData.city")},{" "}
                          {get(item, "flaggingLocationMetaData.region")}
                        </p>
                      </>
                    }
                    trigger="click"
                  >
                    <button className="btn btn-sm btn-secondary">
                      View Location Details
                    </button>
                  </Popover>{" "}
                  <i
                    onClick={() => {
                      setSelectedTask(item);
                      updateReport(true);
                    }}
                    style={{ fontSize: "30px", color: "green" }}
                    className="fa fa-check-circle"
                    aria-hidden="true"
                  ></i>{" "}
                  <i
                    onClick={() => {
                      setSelectedTask(item);
                      updateReport(false);
                    }}
                    style={{ fontSize: "30px", color: "red" }}
                    className="fa fa-times"
                    aria-hidden="true"
                  ></i>
                </>
              }
            />
          </List.Item>
        )}
      />

      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={true}
        className="width_drawer_findit"
        onClose={() => toggleDetailsDrawer(false)}
        visible={viewDetails}
      >
        <TaskDetails selectedTask={selectedTask.taskId} />
      </Drawer>

      <Modal
        title={null}
        visible={viewReasonDrawer}
        footer={null}
        onCancel={() => toggleReasonDrawer(!viewReasonDrawer)}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            let closeReason = e.target[0].value;
            let reportStatus = activeReason
              ? "No Action Taken"
              : "Task Unlisted";
            let isOpen = false;

            let obj = {
              taskId: selectedTask._id,
              isOpen,
              closeReason,
              flaggingLocationMetaData: selectedTask.flaggingLocationMetaData,
              reportStatus
            };
            changeFlagTaskStatus({
              variables: {
                ...obj
              }
            });
          }}
        >
          <textarea name="closeReason" cols="40" rows="10" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
};

export default Reports;
