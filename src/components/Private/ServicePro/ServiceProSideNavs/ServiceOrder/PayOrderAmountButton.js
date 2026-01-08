import { Button, message, Modal } from "antd";
import CheckoutModal from "components/Common/CheckoutModal";
import showNotification from "config/Notification";
import { makeServiceOrderPaymentAsDone } from "config/queries/serviceOrder";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { useHistory } from "react-router";
import { UserDataContext } from "store/contexts/UserContext";

const PayOrderAmountButton = ({ order }) => {
  const history = useHistory();
  const { state } = useContext(UserDataContext);

  const [executeMutation, { loading, error }] = useMutation(
    makeServiceOrderPaymentAsDone
  );

  useEffect(() => {
    error &&
      error.graphQLErrors.map((error) =>
        showNotification("error", error.message)
      );
  }, [error]);

  const [visible, setVisible] = useState(false);

  const handleUpdateOrderPaymentState = async (paymentIntent) => {
    if (!paymentIntent)
      return message.error("An error occurred, please try again!");

    const { data } = await executeMutation({
      variables: {
        inputs: {
          serviceOrderId: order._id,
          paymentIntent,
        },
      },
    });

    message.success(data.makeServiceOrderPaymentAsDone);
    setVisible(false);
    return history.push(`/${state.userData.role}/service-orders`);
  };

  return (
    <div>
      <Button loading={loading} type="primary" onClick={() => setVisible(true)}>
        Pay Now
      </Button>

      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Pay Now"
        footer={null}
        confirmLoading={loading}
      >
        <CheckoutModal
          transferToAccountUserId={order.serviceProviderId}
          amount={order.amount}
          onPaymentComplete={handleUpdateOrderPaymentState}
        />
      </Modal>
    </div>
  );
};

export default PayOrderAmountButton;
