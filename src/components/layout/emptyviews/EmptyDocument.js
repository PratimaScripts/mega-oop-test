import React from "react";
import { Button, Result } from "antd";
import { useHistory } from "react-router";
import "./styles.scss";

const EmptyDocument = () => {
  const history = useHistory();
  return (
    <Result
      status="404"
      title="No documents found right now"
      subTitle=""
      extra={
        <Button
          className="btn-new"
          type="primary"
          onClick={() => history.push("/landlord/documents/addNew")}
        >
          {" "}
          + New Document
        </Button>
      }
    />
  );
};

export default EmptyDocument;
