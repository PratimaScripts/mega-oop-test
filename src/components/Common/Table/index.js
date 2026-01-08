import { Table } from "antd";
import React from "react";
import "./style.scss";

const TableWithRowSpacing = (props) => {
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      props.setSelectedInventories(selectedRowKeys);
    },
  };

  return (
    <>
      <Table
        rowSelection={{ type: "checkbox", ...rowSelection }}
        className="table-with-row-spacing"
        {...props}
      />
    </>
  );
};

export default TableWithRowSpacing;
