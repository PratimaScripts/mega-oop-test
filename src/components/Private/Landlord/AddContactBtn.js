import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import React, { useContext } from "react";
import { InterfaceContext } from "store/contexts/InterfaceContext";

const AddContactBtn = ({ menu }) => {
  const { dispatch: interfaceDispatch } = useContext(InterfaceContext);
  return (
    <>
      {menu}
      <Divider style={{ marginTop: "8px", marginBottom: "0" }} />
      <Button
        type="link"
        icon={<PlusOutlined />}
        style={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={() =>
          interfaceDispatch({
            type: "OPEN_ADD_CONTACT_MODAL",
          })
        }
      >
        Add Contact
      </Button>
    </>
  );
};

export default AddContactBtn;
