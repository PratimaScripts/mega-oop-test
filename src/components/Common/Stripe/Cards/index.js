import { Button, Col, Row, Spin, Typography, message } from "antd";
import { useStripe } from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  getCustomerCardList,
} from "config/queries/stripe";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-apollo";

import visaLogo from "../../../../img/cards/visa.png";
import masterLogo from "../../../../img/cards/master.png";
import AMEXLogo from "../../../../img/cards/amrerican-express.png";

import "./styles.scss";
import showNotification from "config/Notification";

// accept amount as other details as props
const Cards = ({ onPaymentComplete, amount, transferToAccountUserId }) => {
  const stripe = useStripe();
  const [executeCreatePaymentIntent, { error }] =
    useMutation(createPaymentIntent);

  useEffect(() => {
    error && error.graphQLErrors.map((error) => message.error(error.message));
  }, [error]);

  const [selectedCard, setSelectedCard] = useState(null);
  const { data, loading } = useQuery(getCustomerCardList);

  const cards = data?.getCustomerCardList || [];

  const handlePaymentWithCard = async () => {
    try {
      const paymentIntent = await executeCreatePaymentIntent({
        variables: {
          createPaymentIntentInput: {
            transferToAccountUserId,
            // get as a prop
            amount: String(amount),
          },
        },
      });

      const payload = await stripe.confirmCardPayment(
        paymentIntent?.data?.createPaymentIntent,
        {
          payment_method: selectedCard.id,
        }
      );
      if (payload.error) {
        // console.log(payload);
        return showNotification(
          "error",
          "An error occurred!",
          "Stripe payment error, please try again!"
        );
      }
      onPaymentComplete(payload.paymentIntent);
    } catch (error) {
      // console.log(error);
      message.error("An error occurred!")
    }
  };

  return (
    <div className="cards-container">
      <Spin spinning={loading} tip="Getting cards...">
        {cards.map((card, index) => (
          <Row
            gutter={[16, 8]}
            key={index}
            className={`card-item-container ${
              card.id === selectedCard?.id ? "selected" : ""
            }`}
            onClick={() => setSelectedCard(card)}
          >
            <Col span={3}>
              {card.card.brand === "visa" && (
                <img className="card-image" src={visaLogo} alt="visalogo" />
              )}
              {card.card.brand === "mastercard" && (
                <img className="card-image" src={masterLogo} alt="masterlogo" />
              )}
              {card.card.brand === "amex" && (
                <img className="card-image" src={AMEXLogo} alt="masterlogo" />
              )}
            </Col>
            <Col offset={2} span={10}>
              <Typography.Text className="card-number">
                <span className="dots">****</span>
                <span>{card.card.last4}</span>
              </Typography.Text>
              <Typography.Text style={{ color: "#6A7486" }}>
                Expires {card.card.exp_month}/{card.card.exp_year}
              </Typography.Text>
            </Col>
            <Col offset={5} span={3}>
              {/* {props.editDeleteBtn && (
            <button
            type="button"
            className="btn btn-default"
            style={{ paddingLeft: "0" }}
            >
            <EditFilled />
            <DeleteFilled
            />
            </button>
          )} */}
            </Col>
          </Row>
        ))}
      </Spin>
      <div className="payment-button">
        <Button
          type="primary"
          disabled={!selectedCard}
          onClick={handlePaymentWithCard}
        >
          Pay With Existing Card
        </Button>
      </div>
    </div>
  );
};

export default Cards;
