import React, { useContext, useState } from "react";
import { Modal, Form, Switch, DatePicker, Select, Button } from "antd";
import { InvoiceContext } from "store/contexts/invoiceContexts";
import { useMutation } from "@apollo/react-hooks";
import InvoiceQuery from "config/queries/invoice";
import showNotification from "config/Notification";
import { useHistory } from "react-router-dom";

const EditPaymentModal = (props) => {
  const history = useHistory();

  const { transactionDetails: currentInvoice, openManualPaymentModal } = props;

  const [paidViaBank, setPaidViaBank] = useState(false);

  const { dispatch, state } = useContext(InvoiceContext);
  const { openEditPaymentModal, transactionDetail } = state;
  const [form] = Form.useForm();

  const [changePayment] = useMutation(InvoiceQuery.markInvoicePaid, {
    onCompleted: ({ markInvoicePaid }) => {
      if (markInvoicePaid.success) {
        form.resetFields();
        dispatch({
          type: "UPDATE_INVOICE_LIST",
          payload: markInvoicePaid.data,
        });
        dispatch({ type: "CLOSE_EDIT_PAYMENT_MODAL" });
        showNotification(
          "success",
          "Successfully marked transaction as paid",
          ""
        );
      } else {
        showNotification("error", "Failed to mark transaction as paid", "");
      }
    },
    onError: (error) => {
      showNotification("error", `Failed to update the transaction as paid`, "");
    },
  });

  const onCreate = (values) => {
    changePayment({
      variables: {
        id: transactionDetail._id,
        paymentDate: values.paymentDate ? values.paymentDate._d : new Date(),
        paymentMethod: values.paymentMethod,
      },
    });

    props.changeVisibility?.(false);
  };
  const { Option } = Select;

  return (
    <>
      <Modal
        title={
          props.pending ? "Direct Debit Mandate Setup" : "Mark Payment As Paid"
        }
        visible={openEditPaymentModal || openManualPaymentModal}
        onOk={() => {
          if (!props.pending) {
            form
              .validateFields()
              .then((values) => {
                setPaidViaBank(false);
                onCreate(values);
              })
              .catch((info) => {
                showNotification(
                  "error",
                  "An error occurred!",
                  "Validation error"
                );
              });
          } else {
            props.changeVisibility?.(false);
            dispatch({ type: "CLOSE_EDIT_PAYMENT_MODAL" });
          }
        }}
        onCancel={() => {
          props.changeVisibility?.(false);
          dispatch({ type: "CLOSE_EDIT_PAYMENT_MODAL" });
        }}
      >
        {props.pending ? (
          <Button
            type="primary"
            shape="round"
            onClick={() => history.push("/renter/mandates")}
          >
            Setup Now
          </Button>
        ) : (
          transactionDetail && (
            <Form
              preserve={false}
              form={form}
              scrollToFirstError={true}
              layout="vertical"
              name="transaction-form"
            >
              <Form.Item
                name="paid"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Switch
                  checkedChildren="Paid"
                  size="default"
                  unCheckedChildren="Unpaid"
                  defaultChecked
                  disabled
                />
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
                <DatePicker size="large" className="w-100" />
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
                <Select
                  size="large"
                  placeholder="Select Payment Method"
                  className="w-100"
                  onChange={(value) => setPaidViaBank(value === "Bank")}
                >
                  {["Cash", "Bank", "Card"].map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {paidViaBank &&
                currentInvoice?.accountNumber &&
                currentInvoice?.sortCode && (
                  <>
                    <h6 className="m-0 mt-4 mb-2">
                      Lander's bank account details
                    </h6>
                    <div>
                      <p className="m-0">
                        <label>Bank account number :&nbsp;</label>
                        <strong>{currentInvoice.accountNumber}</strong>
                      </p>
                      <p className="m-0">
                        <label>Sort code :&nbsp;</label>
                        <strong>{currentInvoice.sortCode}</strong>
                      </p>
                    </div>
                  </>
                )}
            </Form>
          )
        )}
      </Modal>
    </>
  );
};

export default EditPaymentModal;
