import React from "react";
import { Modal } from "antd";
import StripePayment from "../StripeTest/ScreeningInviteAccept";

const ScreeningInviteModal = props => {
  return (
    <Modal
      title={null}
      visible={props.isPaymentTime}
      width={900}
      header={null}
      destroyOnClose={true}
      onCancel={props.closeModal}
      footer={null}
      maskClosable={false}
    >
      <StripePayment {...props} />
    </Modal>
  );
};

export default ScreeningInviteModal;
