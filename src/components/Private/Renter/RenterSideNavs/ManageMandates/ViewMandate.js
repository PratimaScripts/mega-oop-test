import { Button } from "antd";
import moment from "moment";
import React, { useMemo } from "react";
import { useMutation } from "react-apollo";
import DataTable from "./DataTable";
import showNotification from "config/Notification";
import {
  cancelOneOffPayment,
  cancelRecurringSubscription,
  pauseOrResumeRecurringSubscription,
} from "config/queries/gocardless";
import "./Mandate.css";

const ViewMandate = ({ loading, mandateDetails, isLandlordRoute }) => {
  const { payments, subscriptions } = mandateDetails;

  const [cancelPayment, { loading: cancellingPayment }] = useMutation(
    cancelOneOffPayment,
    {
      onCompleted: (data) => {
        if (data?.cancelOneOffPayment?.success) {
          showNotification(
            "success",
            data?.cancelOneOffPayment?.message || "Payment cancelled"
          );
        } else {
          showNotification(
            "error",
            data?.cancelOneOffPayment?.message || "Something went wrong!"
          );
        }
      },
    }
  );

  const [cancelSubscription, { loading: cancellingSubscription }] = useMutation(
    cancelRecurringSubscription,
    {
      onCompleted: (data) => {
        if (data?.cancelRecurringSubscription?.success) {
          showNotification(
            "success",
            data?.cancelRecurringSubscription?.message ||
              "Subscription cancelled"
          );
        } else {
          showNotification(
            "error",
            data?.cancelRecurringSubscription?.message ||
              "Something went wrong!"
          );
        }
      },
    }
  );

  const [
    pauseOrResumeSubscription,
    { loading: loadingPauseOrResumeSubscription },
  ] = useMutation(pauseOrResumeRecurringSubscription, {
    onCompleted: (data) => {
      if (data?.pauseOrResumeRecurringSubscription?.success) {
        showNotification(
          "success",
          data?.pauseOrResumeRecurringSubscription?.message || "Success"
        );
      } else {
        showNotification(
          "error",
          data?.pauseOrResumeRecurringSubscription?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  const paymentColumns = useMemo(
    () => [
      {
        title: "# Invoice",
        dataIndex: "invoiceNumber",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (value) => (
          <span className="capitalize">{value?.replace("_", " ")}</span>
        ),
      },
      {
        title: "Type",
        dataIndex: "subscriptionId",
        render: (value) => (value ? "Recurring" : "One time"),
      },
      {
        title: "Transaction Id",
        dataIndex: "paymentId",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (value) => "£ " + value / 100,
      },
      {
        title: "Charge Date",
        dataIndex: "charge_date",
        render: (value) => moment(value).format("DD-MM-YYYY"),
      },
      ...(isLandlordRoute
        ? [
            {
              title: "Actions",
              dataIndex: "paymentId",
              render: (paymentId, rowData) => (
                <Button
                  type="dashed"
                  disabled={
                    cancellingPayment ||
                    ["paid_out", "cancelled"].includes(rowData.status)
                  }
                  onClick={() => cancelPayment({ variables: { paymentId } })}
                >
                  Cancel
                </Button>
              ),
            },
          ]
        : []),
    ],
    [isLandlordRoute, cancelPayment, cancellingPayment]
  );

  const subscriptionColumns = useMemo(
    () => [
      {
        title: "# Id",
        dataIndex: "id",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (value) => (
          <span className="capitalize">{value?.replace("_", " ")}</span>
        ),
      },
      {
        title: "Transaction Type",
        dataIndex: "type",
      },
      {
        title: "Interval",
        dataIndex: "paymentScheduleType",
        render: (value) => <span className="capitalize">{value}</span>,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (value) => "£ " + value,
      },
      {
        title: "Subscription Id",
        dataIndex: "subscriptionId",
      },
      ...(isLandlordRoute
        ? [
            {
              title: "Actions",
              dataIndex: "subscriptionId",
              render: (subscriptionId, rowData) => (
                <>
                  <Button
                    className="mr-2"
                    type="dashed"
                    disabled={
                      loadingPauseOrResumeSubscription ||
                      ["cancelled", "finished"].includes(rowData.status)
                    }
                    onClick={() =>
                      pauseOrResumeSubscription({
                        variables: {
                          subscriptionId,
                          param:
                            rowData.status === "paused" ? "resume" : "pause",
                        },
                      })
                    }
                  >
                    {rowData.status === "paused" ? "Resume" : "Pause"}
                  </Button>
                  <Button
                    type="dashed"
                    disabled={
                      cancellingSubscription ||
                      ["cancelled", "finished"].includes(rowData.status)
                    }
                    onClick={() =>
                      cancelSubscription({ variables: { subscriptionId } })
                    }
                  >
                    Cancel
                  </Button>
                </>
              ),
            },
          ]
        : []),
    ],

    //eslint-disable-next-line
    [isLandlordRoute, cancelSubscription, cancellingSubscription]
  );

  return (
    <>
      <DataTable
        title="Payments"
        loading={loading}
        columns={paymentColumns}
        data={payments}
      />
      <DataTable
        title="Subscriptions"
        loading={loading}
        columns={subscriptionColumns}
        data={subscriptions}
      />
    </>
  );
};

export default ViewMandate;
