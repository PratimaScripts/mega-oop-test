import React, { Fragment,  useEffect, useState } from "react";
import { Button, Modal, Table, Tooltip, Typography,  } from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  PoundCircleOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import moment from "moment";
import { getEarnings } from "config/queries/earnings";
import UserRoleQueries from "config/queries/userRole";
import {
  bankPayoutServiceOrder,
  payoutServiceOrder,
} from "config/queries/serviceOrder";
import { bankPayoutTaskOffer, payoutTaskOffer } from "config/queries/taskoffer";
// import { UserDataContext } from "store/contexts/UserContext";
import showNotification from "config/Notification";
import "./styles.scss";

// const fourteenDays = 1209600000;

const EarningTable = () => {
  // const { state } = useContext(UserDataContext);
  const [paymentType, setPaymentType] = useState("No Selected");
  const [executeQuery, { data, loading: queryLoading }] =
    useLazyQuery(getEarnings);

  useQuery(UserRoleQueries.getUserPaymentType, {
    onCompleted: (data) => {
      setPaymentType(data.getUserPaymentType.paymentType);
    },
    onError: (error) => {
      showNotification("error", "An error occurred!");
    },
  });

  useEffect(() => {
    executeQuery();
    //eslint-disable-next-line
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
    executeBankPayoutServiceOrder,
    { error: bankOrderError, loading: bankOrderMutationLoading },
  ] = useMutation(bankPayoutServiceOrder, {
    onCompleted: (data) => {
      if (data) {
        showNotification("success", data.bankPayoutServiceOrder);
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

  const [
    executeBankPayoutTaskOffer,
    { error: bankOfferError, loading: bankOfferMutationLoading },
  ] = useMutation(bankPayoutTaskOffer, {
    onCompleted: (data) => {
      if (data) {
        showNotification("success", data.bankPayoutTaskOffer);
        executeQuery();
      }
    },
  });

  const error = orderError || offerError || bankOrderError || bankOfferError;

  useEffect(() => {
    error &&
      error.graphQLErrors.map((error) =>
        showNotification("error", error.message)
      );
  }, [error]);

  const handlePayout = ({ record }) => {
    switch (record.recordType) {
      case "Order":
        if (paymentType === "stripe")
          executePayoutServiceOrder({
            variables: {
              orderId: record.mongoId,
            },
          });
        else
          executeBankPayoutServiceOrder({
            variables: {
              orderId: record.mongoId,
            },
          });
        break;
      case "TaskOffer":
        if (paymentType === "stripe")
          executePayoutTaskOffer({
            variables: {
              offerId: record.mongoId,
            },
          });
        else
          executeBankPayoutTaskOffer({
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
    if (paymentType === "stripe" && record.grossEarning < 100)
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
            Please confirm the payout of £{record.grossEarning} from your{" "}
            {paymentType === "stripe" ? "Stripe" : "Wise bank"} account.
          </Typography>
        </Fragment>
      ),
    });
  };

  const loading =
    orderMutationLoading ||
    queryLoading ||
    offerMutationLoading ||
    bankOrderMutationLoading ||
    bankOfferMutationLoading;

  let paid = 0,
    unpaid = 0;

  data?.getEarnings?.forEach((item) => {
    if (item.payoutStatus === "Paid") {
      paid += item.amount;
    } else {
      unpaid += item.amount;
    }
  });

  return (
    <div className="earnings-container">
      <div className="total-earnings row">
        <div className="mt-3 col-12 col-sm-6 col-md-3">
          <div className="earning-badge">
            <PoundCircleOutlined className="icon" />
            <div>
              <Typography.Text>Total</Typography.Text>
              <Typography.Title className="amount">
                £{paid + unpaid || 0}
              </Typography.Title>
            </div>
          </div>
        </div>
        <div className="mt-3 col-12 col-sm-6 col-md-3">
          <div className="earning-badge">
            <PoundCircleOutlined className="icon" />
            <div>
              <Typography.Text>Paid</Typography.Text>
              <Typography.Title className="amount">
                £{paid || 0}
              </Typography.Title>
            </div>
          </div>
        </div>
        <div className="mt-3 col-12 col-sm-6 col-md-3">
          <div className="earning-badge">
            <PoundCircleOutlined className="icon" />
            <div>
              <Typography.Text>Unpaid</Typography.Text>
              <Typography.Title className="amount">
                £{unpaid || 0}
              </Typography.Title>
            </div>
          </div>
        </div>
        <div className="my-3 col-12 col-sm-6 col-md-3">
          <div className="payment-type">
            <Typography.Text>Payment Method&nbsp;:&nbsp;</Typography.Text>
            <Typography.Text className="method-name">
              {paymentType}
            </Typography.Text>
          </div>
        </div>
        <div className="py-3 col-12">
          <div class="table-responsive">
            <Table
              style={{ minWidth: "920px" }}
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
                      {/* new Date().getTime() -
                              new Date(record.createdAt).getTime() >=
                              fourteenDays */}
                      {record.payoutStatus === "Released" && (
                        <Fragment>
                          {paymentType === "stripe" ? (
                            <Button
                              className="withdrawBtn"
                              onClick={() => handleOnPayoutClick({ record })}
                            >
                              Stripe Payout
                            </Button>
                          ) : (
                            <Button
                              className="withdrawBtn"
                              onClick={() => handleOnPayoutClick({ record })}
                            >
                              Bank Transfer
                            </Button>
                          )}
                        </Fragment>
                      )}
                    </Fragment>
                  ),
                },
              ]}
              dataSource={data?.getEarnings || []}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EarningTable;
