import React, { useRef, useState } from "react";

import { message, Table, Tooltip, Typography, Modal, Input } from "antd";
import { DownOutlined, RollbackOutlined, UpOutlined } from "@ant-design/icons";

import { useMutation, useQuery } from "react-apollo";
import TaskQuries from "config/queries/tasks";
import { useHistory } from "react-router-dom";

const Task = () => {
  const history = useHistory();
  const { loading, data } = useQuery(TaskQuries.getTaskDataList);
  const [modalId, setModalId] = useState(null);
  const commentRef = useRef(null);

  const [updateTaskStatus] = useMutation(TaskQuries.updateTaskStatus, {
    onCompleted: (data) => {
      if (data) {
        message.success("Service status changed successfully!");
        history.replace("/admin/task");
      }
    },
  });

  const handleRejectTask = (comment) =>
    updateTaskStatus({
      variables: {
        comment,
        taskId: modalId,
        status: "InComplete",
      },
    });

  const categoriesFilterArray = [];
  new Set(data?.getTaskDataList?.data?.map((item) => item.category)).forEach(
    (item) =>
      categoriesFilterArray.push({
        text: item,
        value: item,
      })
  );
  const subCategoriesFilterArray = [];
  new Set(data?.getTaskDataList?.data?.map((item) => item.subCategory)).forEach(
    (item) =>
      subCategoriesFilterArray.push({
        text: item,
        value: item,
      })
  );

  const columns = [
    {
      title: "Identity",
      dataIndex: "identity",
      key: "identity",
    },
    {
      title: "Budget Amount",
      dataIndex: "budgetAmount",
      key: "budgetAmount",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: categoriesFilterArray,
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "SubCategory",
      dataIndex: "subCategory",
      key: "subCategory",
      filters: subCategoriesFilterArray,
      onFilter: (value, record) => record.subCategory === value,
    },
    {
      title: "Day Availability",
      dataIndex: "dayAvailability",
      key: "dayAvailability",
      filters: ["All Day", "Weekend", "Weekdays"].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.dayAvailability === value,
    },
    {
      title: "Time Availability",
      dataIndex: "timeAvailability",
      key: "timeAvailability",
      filters: [
        "Morning 8 am - 12 pm",
        "Afternoon 12 pm - 4 pm",
        "Evening 4 pm - 8 pm",
        "Any Time",
      ].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.timeAvailability === value,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      filters: ["Low", "Medium", "High"].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: "Pay Owned By",
      dataIndex: "payOwnedBy",
      key: "payOwnedBy",
      filters: ["Landlord", "Renter"].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.payOwnedBy === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        "Open",
        "Draft",
        "Archived",
        "Completed",
        "Awaiting Landlord Conformation",
        "Accepted",
        "Pending",
        "Task Resolved",
        "In Progress",
        "Invoice Created",
        "InComplete"
      ].map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Move to Draft",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Reject">
          <RollbackOutlined onClick={() => setModalId(record.taskId)} />
        </Tooltip>
      ),
      align: "center",
    },
  ];
  return (
    <div className="services-table">
      <Table
        rowKey={(record) => record.taskId}
        loading={loading}
        columns={columns}
        dataSource={
          data && data.getTaskDataList ? data.getTaskDataList.data : []
        }
        pagination={{
          pageSize: 10,
          size: "small",
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="expandable-row">
              <div>
                <h6>Title</h6>
                <Typography.Paragraph className="description">
                  {record.title}
                </Typography.Paragraph>
                <h6>{"Description"}</h6>
                <Typography.Paragraph className="description">
                  {record.description}
                </Typography.Paragraph>
              </div>
            </div>
          ),
          rowExpandable: (record) => record.description,
          expandIcon: ({ expanded, onExpand, record }) =>
            !expanded ? (
              <DownOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <UpOutlined onClick={(e) => onExpand(record, e)} />
            ),
        }}
      />
      <Modal
        title="Added comment"
        visible={modalId ? true : false}
        children={<Input.TextArea required rows={5} ref={commentRef} />}
        onOk={() =>
          commentRef?.current?.resizableTextArea?.props?.value
            ? handleRejectTask(
                commentRef?.current?.resizableTextArea?.props?.value
              )
            : message.error("Please add comment")
        }
        onCancel={() => setModalId(null)}
      />
    </div>
  );
};

export default Task;
