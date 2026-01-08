import React from "react";

const Header = () => {
  return (
    <thead className="thead-dark">
      <tr>
        <th className="name__style">Tenancy</th>
        <th>Type</th>
        <th>Property</th>
        <th>End Date</th>
        <th>Status</th>
        <th>Signed by</th>
        <th>Action</th>
      </tr>
    </thead>
  );
};

export default Header;
