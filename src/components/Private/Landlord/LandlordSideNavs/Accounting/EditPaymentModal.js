import React, { useContext } from 'react';
import { Modal, Form, Switch, DatePicker, Select } from 'antd';
import { TransactionContext } from 'store/contexts/transactionContexts';
import { useMutation } from '@apollo/react-hooks';
import TransactionQuery from 'config/queries/transaction'
import showNotification from 'config/Notification';

const EditPaymentModal = () => {
    const { dispatch, state } = useContext(TransactionContext);
    const { openEditPaymentModal, transactionDetail } = state
    const [form] = Form.useForm();
    const [changePayment] = useMutation(TransactionQuery.markPaymentPaid, {
        onCompleted: ({ markPaymentPaid }) => {
            if (markPaymentPaid.success) {
                dispatch({
                    type: 'UPDATE_TRANSACTION',
                    payload: markPaymentPaid
                });
                showNotification("success", "Successfully marked transaction as paid", "");
            } else {
                showNotification("error", "Failed to mark transaction as paid", "");
            }
        },
        onError: (error) => {
            showNotification("error", `Failed to update the transaction as paid:`, "");
        }
    })

    const onCreate = (values) => {
        changePayment({
            variables: {
                id: transactionDetail._id,
                paymentDate: values.paymentDate ? values.paymentDate._d : new Date(),
                paymentMethod: values.paymentMethod
            }
        })

        dispatch({ type: 'CLOSE_EDIT_PAYMENT_MODAL' })
    }
    const { Option } = Select;

    return (
        <>
            <Modal title="Mark Payment As Paid" visible={openEditPaymentModal}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(info => {
                            showNotification("error", "An error occurred!")
                            // console.log('Validate Failed:', info);
                        });
                }}
                onCancel={() => dispatch({ type: 'CLOSE_EDIT_PAYMENT_MODAL' })}>
                {transactionDetail &&
                    <Form
                        preserve={false}
                        form={form}
                        scrollToFirstError={true}
                        layout="vertical"
                        name="transaction-form">

                        <Form.Item
                            name="paid"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Switch checkedChildren="Paid"
                                size="default" unCheckedChildren="Unpaid" defaultChecked disabled />
                        </Form.Item>

                        <Form.Item
                            name="paymentDate"
                            label="Select Payment Date"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <DatePicker size="large"
                                className="w-100" />
                        </Form.Item>
                        <Form.Item
                            name="paymentMethod"
                            label="Select Payment Method"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select size="large" placeholder="Select Payment Method" className="w-100">
                                <Option key="Cash" value="Cash">Cash</Option>
                                <Option key="Bank" value="Bank">Bank</Option>
                                <Option key="Card" value="Card">Card</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                }

            </Modal>
        </>
    );
};

export default EditPaymentModal;