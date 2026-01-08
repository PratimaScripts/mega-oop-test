import React, { useEffect, useRef, useState } from "react";
import {
  message,
  Table,
  Tooltip,
  Typography,
  Modal,
  Input,
  DatePicker,
} from "antd";
import { useMutation, useQuery } from "react-apollo";
import { getServices, rejectServicePublication } from "config/queries/service";
import "./styles.scss";
import { DownOutlined, RollbackOutlined, UpOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import moment from "moment";

const { RangePicker } = DatePicker;

const AdminServices = () => {
  const history = useHistory();
  const [modalId, setModalId] = useState(null);
  const commentRef = useRef(null);

  const { loading, data } = useQuery(getServices);

  const [services, setServices] = useState([]);

  useEffect(() => {
    if (data && data.getServices) {
      setServices(data.getServices);
    }
  }, [data]);

  const [executeRejectionPublication] = useMutation(rejectServicePublication, {
    onCompleted: (data) => {
      if (data) {
        message.success("Service status changed successfully!");
        history.replace("/admin/services");
      }
    },
  });

  const categoriesFilterArray = [];
  new Set(data?.getServices?.map((item) => item.category)).forEach((item) =>
    categoriesFilterArray.push({
      text: item,
      value: item,
    })
  );
  const subCategoriesFilterArray = [];
  new Set(data?.getServices?.map((item) => item.subCategory)).forEach((item) =>
    subCategoriesFilterArray.push({
      text: item,
      value: item,
    })
  );

  const handleRejectService = (comment) => {
    executeRejectionPublication({
      variables: {
        serviceId: modalId,
        comment,
      },
    });
  };

  const columns = [
    {
      title: "Service title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (value) =>
        value.map((item) => <span className="tag">{item}</span>),
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: (value, record) =>
        record.hasVariants ? record?.variants[0]?.price || 0 : value,
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Published",
          value: "Published",
        },
        {
          text: "Draft",
          value: "Draft",
        },
        {
          text: "Archived",
          value: "Archived",
        },
        {
          text: "InComplete",
          value: "InComplete",
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Posted on",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (value) => moment(value).format("DD-MM-YYYY"),
    },
    {
      title: "Move to Draft",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Reject">
          <RollbackOutlined onClick={() => setModalId(record._id)} />
        </Tooltip>
      ),
      align: "center",
    },
  ];

  return (
    <div className="services-table">
      <div className="date-pickers">
        <RangePicker
          onChange={(_, stringValues) => {
            if (
              stringValues &&
              stringValues.length === 2 &&
              stringValues[0] &&
              stringValues[1]
            ) {
              const _data = data.getServices.filter(
                (service) =>
                  new Date(service.createdAt).getTime() >=
                    new Date(stringValues[0]).getTime() &&
                  new Date(service.createdAt).getTime() <=
                    new Date(stringValues[1]).getTime()
              );
              setServices(_data);
            }
            if (!stringValues[0] && !stringValues[1]) {
              setServices(data.getServices);
            }
          }}
        />
      </div>
      <Table
        rowKey={(record) => record._id}
        loading={loading}
        columns={columns}
        dataSource={services}
        pagination={{
          pageSize: 10,
          size: "small",
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="expandable-row">
              <div>
                <h5>{"Description"}</h5>
                <Typography.Paragraph className="description">
                  {record.description}
                </Typography.Paragraph>
              </div>
              {record.hasVariants && (
                <div>
                  <h5>{"Variants"}</h5>
                  {record.variants.map((item, index) => (
                    <div className="variant" key={index}>
                      <div className="d-flex justify-content-between align-items-center">
                        <b>{item.title}</b>
                        <span>{item.price}</span>
                      </div>
                      <Typography.Paragraph>
                        {item.description}
                      </Typography.Paragraph>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ),
          rowExpandable: (record) => record.description || record.hasVariants,
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
            ? handleRejectService(
                commentRef?.current?.resizableTextArea?.props?.value
              )
            : message.error("Please add comment")
        }
        onCancel={() => setModalId(null)}
      />
    </div>
  );
};

export default AdminServices;
