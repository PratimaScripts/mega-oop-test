import { CheckCircleFilled, ClockCircleFilled } from "@ant-design/icons";
import { Card, Col, Divider, Row, Skeleton, Timeline } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { useParams } from "react-router-dom";
import showNotification from "config/Notification";
import { gql } from "apollo-boost";
import moment from "moment";
import "./style.scss";

const GET_RECURRING_INVOICE_DETAILS = gql`
  query getRecurringInvoiceDetails($invoiceId: ID) {
    getRecurringInvoiceDetails(invoiceId: $invoiceId) {
      data {
        subscription {
          id
          created_at
          amount
          currency
          status
          name
          start_date
          end_date
          interval
          interval_unit
        }
        payments {
          id
          created_at
          charge_date
          amount
          description
          status
        }
        transactions
        amount
        invoiceNum
        propertyTitle
        propertyId
        contact
        nextChargeDate
      }
      message
      success
    }
  }
`;

const GBP = "£";

const ordinal_suffix_of = (i) => {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
};

const InvoiceDetails = ({ invoiceKey, value, loading = false }) => (
  <div className="d-flex justify-content-between align-items-center skeleton">
    {loading ? (
      <Skeleton paragraph={{ rows: 0 }} />
    ) : (
      <>
        <span>{invoiceKey}</span>
        <strong className="text-capitalize">{value}</strong>
      </>
    )}
  </div>
);

const RecurringInvoice = () => {
  const urlParams = useParams();

  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [viewAllPayments, setViewAllPayments] = useState(false);

  const { loading: fetchingInvoice } = useQuery(GET_RECURRING_INVOICE_DETAILS, {
    variables: { invoiceId: urlParams.recurringInvoiceId },
    onCompleted: ({ getRecurringInvoiceDetails }) => {
      if (getRecurringInvoiceDetails?.success) {
        let recurringInvoice = { ...(getRecurringInvoiceDetails?.data || {}) };
        if (recurringInvoice?.payments?.length) {
          setUpcomingPayments(recurringInvoice.payments.reverse());
        }
        setInvoiceDetails({ ...recurringInvoice });
      } else {
        showNotification(
          "error",
          getRecurringInvoiceDetails?.message || "Something went wrong"
        );
      }
    },
  });

  return (
    <Row gutter={16}>
      <Col span={16}>
        <Card
          title={
            <div className="d-flex justify-content-between align-items-center skeleton">
              {fetchingInvoice ? (
                <Skeleton paragraph={{ rows: 0, width: "100%" }} />
              ) : (
                <>
                  <span>{invoiceDetails?.propertyTitle}</span>
                  <span>
                    {GBP} {invoiceDetails?.amount}
                  </span>
                </>
              )}
            </div>
          }
        >
          <Row gutter={56}>
            <Col span={12}>
              <InvoiceDetails
                loading={fetchingInvoice}
                invoiceKey="Next Installment date"
                value={invoiceDetails.nextChargeDate}
              />
            </Col>
            <Col span={12}>
              <InvoiceDetails
                loading={fetchingInvoice}
                invoiceKey="Subscription Id"
                value={invoiceDetails?.subscription?.id}
              />
            </Col>
          </Row>
          <Row gutter={56} className="mt-2">
            <Col span={12}>
              <InvoiceDetails
                loading={fetchingInvoice}
                invoiceKey="Party Name"
                value={invoiceDetails?.contact}
              />
            </Col>
            <Col span={12}>
              <InvoiceDetails
                loading={fetchingInvoice}
                invoiceKey="Invoice Number"
                value={invoiceDetails?.invoiceNum}
              />
            </Col>
          </Row>
          <Row gutter={56} className="mt-2">
            <Col span={12}>
              <InvoiceDetails
                loading={fetchingInvoice}
                invoiceKey="Interval"
                value={invoiceDetails?.subscription?.interval_unit}
              />
            </Col>
          </Row>
        </Card>
        <div className="mt-5">
          {fetchingInvoice ? (
            <Skeleton />
          ) : upcomingPayments.length ? (
            <>
              <h5>Payments</h5>
              <Card>
                <Timeline>
                  {upcomingPayments
                    .map((payment, idx) => (
                      <Timeline.Item
                        dot={
                          payment.id ? (
                            <CheckCircleFilled />
                          ) : (
                            <ClockCircleFilled className="text-warning" />
                          )
                        }
                      >
                        <div className="d-flex flex-column">
                          <Title level={5}>
                            {ordinal_suffix_of(upcomingPayments.length - idx)}{" "}
                            installment:{" "}
                            <span className="text-capitalize">
                              {payment.id
                                ? String(payment.status).replace("_", " ")
                                : `Upcoming in ${moment(
                                    payment.charge_date
                                  ).diff(moment(), "days")} days`}
                            </span>
                          </Title>
                          <Text type="secondary">
                            {moment(payment.charge_date).format("DD MMM YYYY")}
                          </Text>
                        </div>
                      </Timeline.Item>
                    ))
                    .slice(null, viewAllPayments ? upcomingPayments.length : 3)}
                </Timeline>

                <div
                  className="d-flex justify-content-center"
                  style={{
                    cursor: "pointer",
                    textTransform: "uppercase",
                    fontWeight: "500",
                    letterSpacing: "1px",
                  }}
                  onClick={() => setViewAllPayments((prev) => !prev)}
                >
                  <Text type="success">
                    View {viewAllPayments ? "less" : "All"}
                  </Text>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </Col>
      <Col span={8}>
        <Card title="Amount breakup">
          {fetchingInvoice ? (
            <Skeleton />
          ) : (
            <>
              {invoiceDetails?.transactions?.length
                ? invoiceDetails.transactions.map((transaction) => (
                    <Row gutter={16}>
                      <Col span={16}>
                        {transaction.name}&nbsp;&nbsp;&nbsp;&nbsp;x{" "}
                        {transaction.quantity}
                      </Col>
                      <Col span={8} className="d-flex justify-content-end">
                        <strong>{transaction.amount}</strong>
                      </Col>
                    </Row>
                  ))
                : null}

              <Divider className="my-2" />
              <Row gutter={16}>
                <Col span={16}>
                  <strong>Total</strong>
                </Col>
                <Col span={8} className="d-flex justify-content-end">
                  <strong>
                    {GBP} {invoiceDetails?.amount}
                  </strong>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Col>
      <Col span={16}></Col>
    </Row>
  );
};

export default RecurringInvoice;
