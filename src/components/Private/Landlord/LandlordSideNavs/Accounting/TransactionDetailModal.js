import React, { useContext } from "react";
import { Modal, Descriptions, Tag, Image, Button } from "antd";
import { TransactionContext } from "store/contexts/transactionContexts";

const TransactionDetailModal = () => {
  const { dispatch, state } = useContext(TransactionContext);
  const { openTransactionModal, transactionDetail } = state;

  const handleEdit = () => {
    dispatch({ type: "CLOSE_TRANSACTION_MODAL" });
    dispatch({
      type: "OPEN_CREATE_TRANSACTION_DRAWER_IN_EDIT_MODE",
      payload: transactionDetail,
    });
  };

  return (
    <>
      <Modal
        title="Transaction Detail"
        visible={openTransactionModal}
        onOk={() => dispatch({ type: "CLOSE_TRANSACTION_MODAL" })}
        onCancel={() => dispatch({ type: "CLOSE_TRANSACTION_MODAL" })}
        footer={[
          <Button key="back" onClick={() => handleEdit()}>
            Edit
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => dispatch({ type: "CLOSE_TRANSACTION_MODAL" })}
          >
            Ok
          </Button>,
        ]}
      >
        {transactionDetail && (
          <Descriptions
            title={transactionDetail["accountId"].accountName}
            bordered
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Property">
              <Tag color="#108ee9">{transactionDetail["propertyId"].title}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              <Tag color="#87d068">£ {transactionDetail.amount}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Date">
              {new Date(transactionDetail["transactionDate"]).toDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {" "}
              {transactionDetail.status === "Paid" ? (
                <Tag color="#87d068">Paid</Tag>
              ) : (
                <Tag color="#f50">Pending</Tag>
              )}
            </Descriptions.Item>

            {transactionDetail.paymentDate && (
              <Descriptions.Item
                className="text-capitalize"
                label="Payment Date"
              >
                {new Date(transactionDetail.paymentDate).toDateString()}
              </Descriptions.Item>
            )}
            {transactionDetail.paymentMethod && (
              <Descriptions.Item
                className="text-capitalize"
                label="Payment Method"
              >
                <Tag color="#2db7f5">{transactionDetail.paymentMethod}</Tag>
              </Descriptions.Item>
            )}
            {transactionDetail.additionalInfo && (
              <Descriptions.Item
                className="text-capitalize"
                label="Additional Note"
              >
                {transactionDetail.additionalInfo}
              </Descriptions.Item>
            )}
            {transactionDetail?.images &&
              transactionDetail?.images?.length > 0 && (
                <Descriptions.Item label="Image">
                  <Image
                    width={100}
                    src={transactionDetail.images[0]}
                    placeholder={
                      <Image
                        preview={false}
                        src={`${transactionDetail.images[0]}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`}
                        width={100}
                      />
                    }
                  />
                </Descriptions.Item>
              )}
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default TransactionDetailModal;
