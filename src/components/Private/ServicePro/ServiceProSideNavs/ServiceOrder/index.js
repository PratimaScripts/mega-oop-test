import { Button, message,  Table, Tag, Typography } from "antd";
import {
  changeServiceOrderStatus,
  getServiceOrders,
} from "config/queries/serviceOrder";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { UserDataContext } from "store/contexts/UserContext";
import PayOrderAmountButton from "./PayOrderAmountButton";
import "./styles.scss";
import SubmitOrder from "./SubmitOrder";

const ServiceOrder = () => {
  const [getOrders, { data, loading }] = useLazyQuery(getServiceOrders);
  const orders = data?.getServiceOrders || [];
  const { state } = useContext(UserDataContext);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    getOrders();
    //eslint-disable-next-line
  }, []);

  const [executeChangeStatusMutation, { loading: changeStatusLoading }] =
    useMutation(changeServiceOrderStatus, {
      onCompleted: (data) => {
        if (data) {
          message.success(data.changeServiceOrderStatus);
          return getOrders();
        }
      },
    });

  const handleCloseModal = () => {
    setOrderId(null);
    return getOrders();
  };

  const statusArr = orders.map((order) => order.status);
  const statusFilter = [...new Set(statusArr)].map((status) => ({
    text: status,
    value: status,
  }));

  const isServicePro = state?.userData?.role === "servicepro";

  return (
    <div>
      <Table
        columns={[
          {
            title: "Order ID",
            dataIndex: "orderId",
            ellipsis: true,
          },
          {
            title: "Service title",
            dataIndex: "service.title",
            render: (_, record) => record.service.title,
            ellipsis: true,
          },
          {
            title: isServicePro ? "User" : "Service Provider",
            dataIndex: "user",
            align: "center",
            render: (_, record) => {
              return (
                <span>
                  <Typography>
                    {isServicePro
                      ? record.user.firstName
                      : record.serviceProvider.firstName}{" "}
                    {String(
                      isServicePro
                        ? record.user.lastName
                        : record.serviceProvider.lastName
                    ).substr(0, 1)}
                  </Typography>
                  <Tag
                    color={(() => {
                      switch (
                        isServicePro
                          ? record.user.verifiedStatus
                          : record.serviceProvider.verifiedStatus
                      ) {
                        case "Partially Verified":
                          return "yellow";
                        case "Verified":
                          return "green";
                        default:
                        case "Not Verified":
                          return "red";
                      }
                    })()}
                  >
                    {isServicePro
                      ? record.user.verifiedStatus
                      : record.serviceProvider.verifiedStatus}
                  </Tag>
                </span>
              );
            },
          },
          {
            title: "Comment",
            dataIndex: "comment",
          },
          {
            title: "Variant",
            dataIndex: "serviceVariant",
          },
          {
            title: "Amount",
            dataIndex: "amount",
          },
          {
            title: "Payment Status",
            dataIndex: "paidByUser",
            render: (value) => (value ? "Paid" : "Unpaid"),
          },
          {
            title: "Status",
            dataIndex: "status",
            filters: statusFilter,
            onFilter: (value, record) => record.status === value,
          },
          {
            title: "Actions",
            dataIndex: "action",
            render: (_, record) => {
              const isOrderPayable =
                record.isAccepted && record.acceptedOn && !record.paidByUser;
              const isOrderSubmittable =
                record.isAccepted &&
                record.acceptedOn &&
                !record.isSubmitted &&
                record.paidByUser;

              return isServicePro ? (
                <div>
                  {!record.acceptedOn && !record.rejectedOn && (
                    <Fragment>
                      <Button
                        type="primary"
                        className="service-order-action-button green"
                        disabled={changeStatusLoading}
                        onClick={() =>
                          executeChangeStatusMutation({
                            variables: {
                              inputs: {
                                serviceOrderId: record._id,
                                status: "Accepted",
                              },
                            },
                          })
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        type="primary"
                        className="service-order-action-button red"
                        disabled={changeStatusLoading}
                        onClick={() =>
                          executeChangeStatusMutation({
                            variables: {
                              inputs: {
                                serviceOrderId: record._id,
                                status: "Rejected",
                              },
                            },
                          })
                        }
                      >
                        Reject
                      </Button>
                    </Fragment>
                  )}
                  {record.isSubmitted &&
                    record.status !== "Completed" &&
                    record.paidByUser && (
                      <Button
                        type="primary"
                        className="service-order-action-button"
                        onClick={() =>
                          executeChangeStatusMutation({
                            variables: {
                              inputs: {
                                serviceOrderId: record._id,
                                status: "Completed",
                              },
                            },
                          })
                        }
                      >
                        Mark as Done
                      </Button>
                    )}
                  {isOrderSubmittable && (
                    <Button
                      type="primary"
                      className="service-order-action-button"
                      onClick={() => setOrderId(record._id)}
                    >
                      Submit work
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {isOrderPayable && <PayOrderAmountButton order={record} />}
                </div>
              );
            },
          },
        ]}
        expandable
        loading={loading}
        dataSource={orders}
        rowKey={(record) => record._id}
      />
      {orderId && (
        <SubmitOrder orderId={orderId} handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
};

export default ServiceOrder;
