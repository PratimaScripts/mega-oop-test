import React from "react";
import moment from "moment";
import { Table, Tooltip } from "antd";
import { EyeOutlined, CloudDownloadOutlined } from "@ant-design/icons";


class BusinessExpenses extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      paymentHistory: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { paymentHistory: nextProps.paymentHistoryUpdated };
  }

  render() {
    const columns = [
      {
        title: "Invoice",
        align: "center",
        key: "invoiceNo",
        dataIndex: "invoiceNo"
      },
      {
        title: "Payment Reference",
        dataIndex: "chargeId",
        align: "center"
      },
      {
        title: "Bill Date",
        dataIndex: "createdAt",
        align: "center",
        render: createdAt => (
          <p>{createdAt && moment(createdAt).format("DD-MM-YYYY")}</p>
        )
      },
      {
        title: "Due Date",
        dataIndex: "createdAt",
        align: "center",
        render: createdAt => (
          <p>{createdAt && moment(createdAt).format("DD-MM-YYYY")}</p>
        )
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: status => (
          <>{status === "succeeded" && <p className="text-success">Paid</p>}</>
        )
      },
      {
        title: "Amount(£)",
        dataIndex: "amount",
        align: "center",
        render: amount => <p>£{amount / 100}</p>
      },
      {
        title: "Action",
        key: "action",
        render: record => (
          <span>
            <Tooltip title="View Payment Receipt">
              <a
                href={record.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* <Icon type="eye" style={{ fontSize: "1.5rem" }} /> */}
                <EyeOutlined style={{ fontSize: "1.5rem" }} />
              </a>
            </Tooltip>
            &nbsp;&nbsp;
            <Tooltip title="Download Payment Receipt">
              <a
                href={record.receiptUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* <Icon type="cloud-download" style={{ fontSize: "1.5rem" }} /> */}
                <CloudDownloadOutlined style={{ fontSize: "1.5rem" }} />
              </a>
            </Tooltip>
          </span>
        )
      }
    ];
    let { paymentHistory } = this.state;
    return (
      <>
        <Table
          ref={this.props.testRef}
          locale={{ emptyText: "No Data!" }}
          columns={columns}
          dataSource={paymentHistory}
        />
      </>
    );
  }
}

export default BusinessExpenses;
