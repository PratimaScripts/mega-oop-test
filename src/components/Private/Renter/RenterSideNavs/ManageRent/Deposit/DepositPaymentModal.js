import React, { useContext } from 'react';
import { Modal, Form, Switch, DatePicker, Select } from 'antd';
import { get } from "lodash";

import { DepositContext } from "./rentalDepositContexts";
import { useMutation } from '@apollo/react-hooks';
import showNotification from 'config/Notification';
import { markDepositPaid } from "config/queries/rentalDeposit";

const DepositPaymentModal = () => {
    const { dispatch, state } = useContext(DepositContext);
    const { openEditPaymentModal, depositDetail } = state
    const [form] = Form.useForm();

    const [markDepositPaidMutation] = useMutation(markDepositPaid, {
        onCompleted: ({ markDepositPaid }) => {
          if(get(markDepositPaid, "success", false)) {
            dispatch({ type: "UPDATE_DEPOSIT", payload: markDepositPaid.data })
            showNotification("success", "Deposit marked as paid", "")
          } else {
            showNotification("error", "Failed to mark deposit as paid", get(markDepositPaid, "message", ""))
          }
        },
        onError: (error) => {
          showNotification("error", "Failed to mark deposit as paid", "Reload the page and try again!")
        }
      })

    const onCreate = (values) => {
        markDepositPaidMutation({
            variables: {
                depositId: depositDetail?._id,
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
                {depositDetail?.transaction  &&
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

export default DepositPaymentModal;