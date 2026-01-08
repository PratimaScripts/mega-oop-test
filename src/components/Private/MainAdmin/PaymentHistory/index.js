/* eslint-disable array-callback-return */
import React, { useState, useRef } from "react";
import { Table, Input, Button, Tooltip } from "antd";
import { SearchOutlined, FileExcelFilled, VerticalAlignBottomOutlined, CheckCircleTwoTone, AuditOutlined } from "@ant-design/icons";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import Highlighter from "react-highlight-words";
import { DatePicker } from "antd";
import AdminQueries from "config/queries/admin";

import { CSVLink } from "react-csv";
import { useQuery } from "react-apollo";
const { RangePicker } = DatePicker;


let headers = [
  { label: "Customer", key: "customer" },
  { label: "Amount", key: "amount" },
  { label: "Payment Reason", key: "description" },
  { label: "Bill Date", key: "created" },
  { label: "Payment Status", key: "status" },
  { label: "Receipt", key: "receiptUrl" }
];
const PaymentHistory = (props) => {
  const [paymentHistory, setPaymentHistory] = useState([])
  const allPayments = useRef([])
  const paymentArCsv = useRef([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('');
  const downloadSheet = useRef()


  useQuery(AdminQueries.retrievePaymentHistory, {
    onCompleted: ({ retrievePaymentHistory }) => {
      if (retrievePaymentHistory.success) {
        setPaymentHistory(retrievePaymentHistory.data)
        allPayments.current = retrievePaymentHistory.data
      }
      setLoading(false)
    }
  })
  const createPaymentAr = async () => {

    paymentArCsv.current = await paymentHistory?.map((user, i) => {
      return {
        customer: user.customer,
        amount: `£${user.amount / 100}`,
        description: user.description,
        created: `${moment(user.createdAt).format("DD-MM-YYYY h:m:s a")}`,
        status: user.status,
        receiptUrl: user.receiptUrl
      };
    });
  };

  const filterByDate = (date) => {
    date === 'all' ? setPaymentHistory(allPayments.current) :
      setPaymentHistory(allPayments.current.filter(payment => moment(payment.createdAt).isBetween(date[0]._d, date[1]._d)))
  }

  const resetFilter = () => {
    setPaymentHistory(allPayments.current)
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => node}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      // <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "black" }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] &&
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // setTimeout(() => searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text}
      />
    )
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };


  const columns = [
    {
      title: "Payment Id",
      dataIndex: "chargeId",
      key: "chargeId",
      ...getColumnSearchProps("chargeId")
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      ...getColumnSearchProps("amount"),
      render: amount => <p>£{amount / 100}</p>
    },
    {
      title: "Payment Reason",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description")
    },
    {
      title: "Bill Date",
      dataIndex: "createdAt",
      align: "center",
      render: createdAt => (
        <p>{createdAt && moment(createdAt).format("DD-MM-YYYY h:m:s a")}</p>
      )
    },
    {
      title: "Payment Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: status => (
        <>
          {status === "succeeded" && (
            // <Icon
            //   theme="twoTone"
            //   twoToneColor="#52c41a"
            //   style={{ fontSize: "1.5rem" }}
            //   type="check-circle"
            // />
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "1.5rem" }} />
          )}
        </>
      )
    },
    {
      title: "Action",
      key: "action",
      render: record => (
        <span>
          <Tooltip title="Payment Receipt">
            <a
              href={record.receiptUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* <Icon type="audit" style={{ fontSize: "1.5rem" }} /> */}
              <AuditOutlined style={{ fontSize: "1.5rem" }} />
            </a>
          </Tooltip>
        </span>
      )
    }
  ];

  return (
    <>
      <RangePicker size="large" onChange={value => filterByDate(value)} showToday={true} />
      <Button size="large" onClick={resetFilter}>Reset</Button>
      {isEmpty(paymentArCsv.current) && !loading && (

        <Tooltip placement="bottom" title="Export as excel">
          {/* <Icon
                style={{ fontSize: "40px", color: "#08c" }}
                onClick={() => createPaymentAr()}
                type="file-excel"
                theme="filled"
              /> */}
          <FileExcelFilled style={{ fontSize: "40px", color: "#08c" }}
            onClick={() => createPaymentAr()} />
        </Tooltip>
      )}
      {!isEmpty(paymentArCsv.current) && (
        <CSVLink
          ref={downloadSheet}
          data={paymentArCsv.current}
          headers={headers}
          filename={"AdminUsers.csv"}
        >
          <VerticalAlignBottomOutlined style={{ fontSize: "40px" }} />
        </CSVLink>
      )}
      <Table rowKey="_id" loading={loading} columns={columns} dataSource={paymentHistory} />
    </>
  );
}

export default PaymentHistory;
