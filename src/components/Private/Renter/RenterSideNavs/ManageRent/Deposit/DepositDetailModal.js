import React, { useContext } from 'react';
import { Modal, Descriptions, Tag, Image, Button } from 'antd';
import { RenterDepositContext } from "./renterDepositContexts";



const DepositDetailModal = () => {
    const { dispatch, state } = useContext(RenterDepositContext);
    const { openDepositModal, depositDetail  } = state

    return (
        <>
            <Modal title="Deposit Detail" visible={openDepositModal}
                onOk={() => dispatch({ type: 'CLOSE_DEPOSIT_MODAL' })}
                onCancel={() => dispatch({ type: 'CLOSE_DEPOSIT_MODAL' })}
                footer={[
                    <Button key="submit" type="primary" onClick={() => dispatch({ type: 'CLOSE_DEPOSIT_MODAL' })}>
                        Ok
                    </Button>
                ]}
            >
                {depositDetail && <Descriptions
                    title={depositDetail?.depositIncomeType === 'deposit-in' ? "Deposit-IN" : "Deposit-OUT"}
                    bordered
                    column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                >
                   <Descriptions.Item label="Reference Id">{depositDetail?.referenceId}</Descriptions.Item>
                    <Descriptions.Item label="Property"><Tag color="#108ee9">{depositDetail?.transaction.propertyId.title}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Amount"><Tag color="#87d068">£ {depositDetail?.transaction.amount}</Tag> {depositDetail?.transaction.status === "Paid" ?
                        <Tag color="#87d068">Paid</Tag> :
                        <Tag color="#f50">Pending</Tag>}</Descriptions.Item>
                    <Descriptions.Item label="Transaction Date">{new Date(depositDetail?.transaction.transactionDate).toDateString()}</Descriptions.Item>
                
                    <Descriptions.Item label="Deposit Type">{depositDetail?.depositType}</Descriptions.Item>
                    <Descriptions.Item label="Protection Scheme">{depositDetail?.depositProtectionScheme}</Descriptions.Item>


                    {depositDetail?.transaction.paymentDate && <Descriptions.Item label="Payment Date">{new Date(depositDetail?.transaction.paymentDate).toDateString()}</Descriptions.Item>}
                    {depositDetail?.transaction.paymentMethod && <Descriptions.Item label="Payment Method"><Tag color="#2db7f5">{depositDetail?.transaction.paymentMethod}</Tag></Descriptions.Item>}
                    {depositDetail?.transaction.additionalInfo && <Descriptions.Item label="Additional Note">{depositDetail?.transaction.additionalInfo}</Descriptions.Item>}
                    <Descriptions.Item label="Landlord">Name: {depositDetail?.transaction.userId.firstName} {depositDetail?.transaction.userId.lastName} <br /> Email: {depositDetail?.transaction.userId.firstName} {depositDetail?.transaction.userId.email} </Descriptions.Item>
                    {depositDetail?.transaction.images.length > 0 && <Descriptions.Item label="Image"><Image
                        width={100}
                        src={depositDetail?.transaction.images[0]}
                        placeholder={
                            <Image
                                preview={false}
                                src={`${depositDetail?.transaction.images[0]}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`}
                                width={100}
                            />
                        }
                    /></Descriptions.Item>}

                </Descriptions>}


            </Modal>
        </>
    );
};

export default DepositDetailModal;