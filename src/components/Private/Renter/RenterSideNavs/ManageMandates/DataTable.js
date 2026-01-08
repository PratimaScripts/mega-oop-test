import { Table, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const DataTable = ({ loading, columns, data, title }) => {
  return (
    <>
      {title ? <Title level={4}>{title}</Title> : null}
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
        className="mb-4"
      />
    </>
  );
};

export default DataTable;
