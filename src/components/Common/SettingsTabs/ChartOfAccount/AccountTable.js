/* eslint-disable array-callback-return */
import React, { useState, useRef, useContext } from "react";

import { Table, Select, Spin, Input, Button } from "antd";
import { SearchOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";

import isEmpty from "lodash/isEmpty";
import { CSVLink } from "react-csv";
import Highlighter from "react-highlight-words";

import { UserDataContext } from "store/contexts/UserContext";
const { Option } = Select;
let headers = [
  { label: "Name", key: "Name" },
  { label: "Type", key: "Type" },
  { label: "Category", key: "Category" },
  { label: "Added By", key: "Added By" },
];
const AccountTable = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const role = userState.userData.role;

  const {
    coaData,
    openDrawer,
    printButtonRef,
    loading,
    setLoading = (f) => f,
  } = props;

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const coaExcelData = useRef([]);
  const fileRef = useRef();
  const [searchText, setSearchText] = useState("");

  const createCoaAr = async () => {
    setLoading(true);

    coaExcelData.current = coaData.map((coa, i) => {
      return {
        Name: coa.accountName,
        Type: coa.accountType,
        Category: coa.category,
        "Added By": coa.isCreatedByAdmin ? "Admin" : "User",
      };
    });
    setLoading(false);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => node}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
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
    filterIcon: (filtered) => (
      // <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] &&
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text}
      />
    ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "accountName",
      align: "left",
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      align: "left",
    },
    {
      title: "Category",
      dataIndex: "category",
      align: "left",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Action",
      align: "center",
      render: (text) => (
        <>
          {role === "admin" ? (
            text.isCreatedByAdmin ? (
              <i
                onClick={() => openDrawer("update", text)}
                className="fas fa-edit"
              />
            ) : (
              <i className="fas fa-lock" />
            )
          ) : text.isCreatedByAdmin ? (
            <i className="fas fa-lock" />
          ) : (
            <i
              onClick={() => openDrawer("update", text)}
              className="fas fa-edit"
            />
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <h4>List of accounts for Income and Expense </h4>
      <p>
        {" "}
        User can define own custom account name catagorised under existing
        account type for reporting
      </p>

      <div>
        Show &nbsp;
        <Select
          name="entriesPerPage"
          defaultValue="10"
          onChange={(change) => setItemsPerPage(Number(change))}
        >
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="30">30</Option>
          <Option value="40">40</Option>
        </Select>
        &nbsp; entries
      </div>

      <div className="d-flex justify-content-between">
        <Spin tip="Preparing your download!" spinning={loading}>
          <div className="dt-buttons btn-group">
            <button
              className="btn btn-secondary buttons-print"
              tabIndex="0"
              aria-controls="billing_table"
              type="button"
              title="Print"
              onClick={() => printButtonRef.current.click()}
            >
              <span>
                <i className="fa fa-print"></i>&nbsp;Print
              </span>
            </button>
            <button
              className="btn btn-secondary buttons-csv buttons-html5"
              tabIndex="0"
              aria-controls="billing_table"
              type="button"
              title="CSV"
              onClick={() => createCoaAr()}
            >
              <span>
                <i className="fas fa-file-excel"></i>&nbsp;CSV
              </span>
            </button>
            {!isEmpty(coaExcelData.current) && (
              <CSVLink
                ref={fileRef}
                data={coaExcelData.current}
                headers={headers}
                filename={"Business Expenses.csv"}
              >
                {/* <Icon
                  style={{ fontSize: "40px" }}
                  type="vertical-align-bottom"
                /> */}
                <VerticalAlignBottomOutlined style={{ fontSize: "40px" }} />
              </CSVLink>
            )}
          </div>
        </Spin>

        <button
          onClick={() => openDrawer("new", {})}
          className="btn btn_add_new dt-buttons"
        >
          Add New
        </button>
      </div>

      <Table
        rowKey={(record) => record._id}
        // ref={props.testRef}
        pagination={{ pageSize: itemsPerPage }}
        locale={{ emptyText: "No Data!" }}
        columns={columns}
        dataSource={coaData}
        bordered
      />
    </>
  );
};

export default AccountTable;
