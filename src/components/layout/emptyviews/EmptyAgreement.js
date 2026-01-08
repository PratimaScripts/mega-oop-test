import React from "react";
import { Button, Result } from "antd";
import { useHistory } from "react-router";
import "./styles.scss";

const EmptyAgreement = () => {
  const history = useHistory();
  return (
    <Result
      status="404"
      title="No agreement found right now"
      subTitle=""
      extra={
        <Button
          className="btn-new"
          type="primary"
          onClick={() => history.push("/landlord/agreement/add")}
        >
          {" "}
          + New Agreement
        </Button>
      }
    />
  );
};

export default EmptyAgreement;
