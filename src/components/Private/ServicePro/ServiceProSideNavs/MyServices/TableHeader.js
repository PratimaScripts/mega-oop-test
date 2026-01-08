import React from "react";

const TableHeader = () => {
  return (
    <thead className="thead-dark">
      <tr>
        <th className="name__style">Service name</th>
        <th>Skill Tags</th>
        <th>Starting Price</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
