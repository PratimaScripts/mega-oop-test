import React, { useState } from "react";
import Header from "./Header";
import Row from "./Row";
import { Modal as AntdModal, Button } from "antd";
import styled from "styled-components";

const Modal = styled(AntdModal)`
  top: 0px !important;
  height: 100vh;
  width: auto !important;

  .ant-modal-content {
    height: 100vh;
    margin: 0;
  }
  .ant-modal-body {
    height: calc(100vh - 110px);
  }
`;

const AgreementTable = ({ data, refreshAgreements, ...props }) => {
  const [state, setState] = useState({
    showModal: false,
    modalData: "",
    type: "",
  });
  return (
    <div className="table-responsive">
      <table className="table table-borderless">
        <Header />
        <tbody>
          {data.map((item) => (
            <Row
              item={item}
              refreshAgreements={refreshAgreements}
              id={item._id}
              showPdf={(type, modalData) => {
                setState({
                  showModal: true,
                  modalData,
                  type,
                });
              }}
              {...props}
            />
          ))}
        </tbody>
      </table>
      <Modal
        title="Agreement Detail"
        visible={state.showModal}
        destroyOnClose
        onOk={() => {
          setState({
            showModal: false,
            modalData: "",
          });
        }}
        onCancel={() => {
          setState({
            showModal: false,
            modalData: "",
          });
        }}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              setState({
                showModal: false,
                modalData: "",
              });
            }}
          >
            Ok
          </Button>,
        ]}
      >
        {state.type === "template" ? (
          state.modalData
        ) : (
          <embed
            id="viewAgreement"
            src={state.modalData}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default AgreementTable;
