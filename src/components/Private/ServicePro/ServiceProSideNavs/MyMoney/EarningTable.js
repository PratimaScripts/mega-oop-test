import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  notification,
  Table,
  Tooltip,
  Typography,
  Row,
  Col,
} from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  PoundCircleOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import moment from "moment";
import { getEarnings } from "config/queries/earnings";
import UserRoleQueries from "config/queries/userRole";
import { payoutServiceOrder } from "config/queries/serviceOrder";
import { payoutTaskOffer } from "config/queries/taskoffer";
import { UserDataContext } from "store/contexts/UserContext";
import axios from "axios";

const fourteenDays = 1209600000;
const showNotification = (type, msg) => {
  notification[type]({
    message: msg,
  });
};
const BACKEND_SERVER = process.env.REACT_APP_SERVER;

const EarningTable = () => {
  const { state } = useContext(UserDataContext);
  const [paymentType, setPaymentType] = useState("No Selected");
  const [executeQuery, { data, loading: queryLoading }] =
    useLazyQuery(getEarnings);

  useQuery(UserRoleQueries.getUserPaymentType, {
    onCompleted: (data) => {
      setPaymentType(data.getUserPaymentType.paymentType);
    },
    onError: (error) => {
      showNotification("error", "An error occurred!")
    }
  });

  useEffect(() => {
    executeQuery();
  }, []);

  const [
    executePayoutServiceOrder,
    { error: orderError, loading: orderMutationLoading },
  ] = useMutation(payoutServiceOrder, {
    onCompleted: (data) => {
      if (data) {
        showNotification("success", data.payoutServiceOrder);
        executeQuery();
      }
    },
  });

  const [
    executePayoutTaskOffer,
    { error: offerError, loading: offerMutationLoading },
  ] = useMutation(payoutTaskOffer, {
    onCompleted: (data) => {
      if (data) {
        showNotification("success", data.payoutTaskOffer);
        executeQuery();
      }
    },
  });

  const error = orderError || offerError;

  useEffect(() => {
    error &&
      error.graphQLErrors.map((error) =>
        showNotification("error", error.message)
      );
  }, [error]);

  const handlePayout = ({ record }) => {
    switch (record.recordType) {
      case "Order":
        executePayoutServiceOrder({
          variables: {
            orderId: record.mongoId,
          },
        });
        break;
      case "TaskOffer":
        executePayoutTaskOffer({
          variables: {
            offerId: record.mongoId,
          },
        });
        break;

      default:
        break;
    }
  };

  const handleOnPayoutClick = ({ record }) => {
    if (record.grossEarning < 100)
      return showNotification(
        "error",
        "You cannot request for a payment less than £100!"
      );
    Modal.confirm({
      okText: "Submit",
      onOk: () => handlePayout({ record }),
      title: `Payout out request for £${record.grossEarning}`,
      content: (
        <Fragment>
          <Typography>
            Please confirm the payout of £{record.grossEarning} from your stripe
            balance to your bank account.
          </Typography>
        </Fragment>
      ),
    });
  };

  const loading = orderMutationLoading || queryLoading || offerMutationLoading;

  const totalEarnings = [...(data?.getEarnings || [])].reduce(
    (acc, curr) => ({
      paid:
        curr.payoutStatus === "Paid"
          ? acc.paid + curr?.grossEarning
          : acc.unpaid + curr?.grossEarning,
    }),
    { paid: 0, unpaid: 0 }
  );

  return (
    <div className="earnings-container">
      <Row gutter={[16, 16]} className="total-earnings">
        <Col span={6}>
          <div className="earning-badge">
            <PoundCircleOutlined className="icon" />
            <div>
              <Typography.Text>Paid</Typography.Text>
              <Typography.Title className="amount">
                £{totalEarnings.paid || 0}
              </Typography.Title>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="earning-badge">
            <PoundCircleOutlined className="icon" />
            <div>
              <Typography.Text>Unpaid</Typography.Text>
              <Typography.Title className="amount">
                £{totalEarnings.unpaid || 0}
              </Typography.Title>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="payment-type">
            <Typography.Text>Payment Method&nbsp;:&nbsp;</Typography.Text>
            <Typography.Text className="method-name">{paymentType}</Typography.Text>
          </div>
        </Col>
        <Col span={24}>
          <Table
            columns={[
              {
                dataIndex: "createdAt",
                title: "Date",
                // render: (value) => new Date(value)
                render: (value) => moment(value).format("DD-MM-YYYY"),
              },
              {
                dataIndex: "uniqueId",
                title: "ID",
                ellipsis: true,
              },
              {
                dataIndex: "title",
                title: "Title",
                ellipsis: true,
              },
              {
                dataIndex: "amount",
                title: "Amount",
              },
              {
                dataIndex: "serviceCharge",
                title: "Service Charge",
              },
              {
                dataIndex: "grossEarning",
                title: "Gross Earning",
              },
              {
                dataIndex: "recordType",
                title: "Record Type",
                filters: [
                  {
                    text: "Task Offer",
                    value: "TaskOffer",
                  },
                  {
                    text: "Service Order",
                    value: "Order",
                  },
                ],
                onFilter: (value, record) => record.recordType === value,
              },
              {
                dataIndex: "payoutStatus",
                title: "Status",
                render: (value, record) => (
                  <Fragment>
                    {value === "Paid" && (
                      <Tooltip
                        placement="bottom"
                        title="The amount has been paid out to your bank account from your stripe balance."
                      >
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      </Tooltip>
                    )}

                    {value === "Released" && (
                      <Tooltip
                        placement="bottom"
                        title="The task owner has released the payment to your stripe account. It can take up to 7 to 14 days for the funds to be available to payout."
                      >
                        <ClockCircleTwoTone />
                      </Tooltip>
                    )}
                  </Fragment>
                ),
                align: "center",
              },
              {
                title: "Action",
                render: (_, record) => (
                  <Fragment>
                    {record.payoutStatus === "Released" &&
                      new Date().getTime() -
                      new Date(record.createdAt).getTime() >=
                      fourteenDays && (
                        <Button
                          className="withdrawBtn"
                          onClick={() => handleOnPayoutClick({ record })}
                        >
                          Payout
                        </Button>
                      )}
                  </Fragment>
                ),
              },
            ]}
            dataSource={data?.getEarnings || []}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};
export default EarningTable;
