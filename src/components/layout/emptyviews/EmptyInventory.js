import React from "react";
import { Button, Result } from "antd";
import { useHistory } from "react-router";
import "./styles.scss";

const EmptyInventory = ({ currentTab }) => {
  const history = useHistory();
  return (
    <Result
      status="404"
      title={`No ${currentTab ? "archived" : ""} inventory found right now`}
      subTitle=""
      extra={
        !currentTab ? (
          <Button
            className="btn-new"
            type="primary"
            onClick={() => history.push("/landlord/inventory/add")}
          >
            {" "}
            + New Inventory
          </Button>
        ) : null
      }
    />
  );
};

export default EmptyInventory;
