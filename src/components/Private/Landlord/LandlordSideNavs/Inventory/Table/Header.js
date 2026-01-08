import { Checkbox } from "antd";
import React from "react";

const Header = (props) => (
  <thead className="thead-dark">
    <tr>
      <th>
        <Checkbox
          className="mr-1"
          checked={props.selectedInventories["all"]}
          onChange={() => props.onCheck("all")}
        />
        ID
      </th>
      <th>Type</th>
      <th>Property</th>
      <th>Tenant</th>
      <th>Template</th>
      <th>Signed By</th>
      <th>Action</th>
    </tr>
  </thead>
);
export default Header;
