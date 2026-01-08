import React, { useState, useEffect, useContext } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import "./styles.scss";
import { Checkbox, Row, Col, Typography, Button, Input } from "antd";
// import axios from "axios";
import postcodeValidator from "uk-postcode-validator";
// import { StoreContext } from "store/store";
// import SavedCards from "../SettingsTabs/CommonInfo/savedCards";
import { useMutation } from "react-apollo";
import { createPaymentIntent } from "config/queries/stripe";
import { StripeCards } from "../Stripe";
import { saveStripeCard } from "config/queries/serviceOrder";
import { UserDataContext } from "store/contexts/UserContext";
import showNotification from "config/Notification";

const CheckoutModal = ({
  transferToAccountUserId,
  amount,
  onPaymentComplete,
}) => {
  // const BACKEND_SERVER = process.env.REACT_APP_SERVER;
  const { state: userState } = useContext(UserDataContext);
  // stripe
  const stripe = useStripe();
  const elements = useElements();

  const [executeCreatePaymentIntent] = useMutation(createPaymentIntent);
  const [executeSaveStripeCard] = useMutation(saveStripeCard);

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [checked, setChecked] = useState(false);

  //, setCardLengthA]
  const [cardLengthA] = useState(0);
  const [initialZip, setInitialZip] = useState("");
  const [validZip, setValidZip] = useState("default");
  const [showError, setShowError] = useState("");

  useEffect(() => {
    setValidZip(postcodeValidator(initialZip));
  }, [initialZip]);

  //get the card list of the user
  // const getCardList = async (id) => {
  //   await axios({
  //     method: "POST",
  //     url: `${BACKEND_SERVER}/api/stripe/list-cards`,
  //     data: {
  //       customer: id,
  //     },
  //   })
  //     .then(function (response) {
  //       // console.log("save set", response);
  //       setCardLengthA(response.data.data.length);
  //     })
  //     .catch(function (error) {
  //       // console.log(error);
  //     });
  // };

  const handleSubmit = async () => {
    try {
      if (!validZip) {
        return setShowError("Please enter a valid ZIP code");
      }

      if (checked) {
        if (!stripe || !elements) {
          return;
        }
        // get secret
        // save card
        // payment with same card

        const { data } = await executeSaveStripeCard();

        await confirmCardSetup({
          secret: data.saveCard.client_secret,
          customerId: data.saveCard.customerId,
        });

        await confirmCardPayment();
      } else {
        //When the user does not want to save the card.
        setProcessing(true);

        // get new secret from paymentIntent
        // backend call
        await confirmCardPayment();
        setProcessing(false);
      }
    } catch (error) {
      setProcessing(false);
      showNotification("error", "An error occurred!");
    }
  };

  const confirmCardPayment = async () => {
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
          payment_method: {
            card: elements.getElement(CardNumberElement),
          },
        }
      );

      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
        setProcessing(false);
      } else {
        // do data updating process here
        // DB operation
        showNotification("success", "Payment confirmed by Stripe!");
        await onPaymentComplete(payload.paymentIntent);
        setError(null);
      }
    } catch (error) {
      showNotification("error", "An error occurred!");
    }
  };

  const confirmCardSetup = async ({ secret }) => {
    const result = await stripe.confirmCardSetup(secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name:
            userState.userData.firstName + " " + userState.userData.lastName,
          address: {
            postal_code: initialZip,
          },
        },
      },
    });
    if (result.error) {
      // Display result.error.message in your UI.
    } else {
      // console.log("resukt", result);
      // chargeSavedCard(result.setupIntent.payment_method, cusId);
    }
  };

  const onChange = (e) => setChecked(e.target.checked);

  return (
    <div className="checkout-modal-container">
      <div>
        <Typography.Paragraph>
          Please initiate <b>{amount}</b> GBP amount
        </Typography.Paragraph>

        <StripeCards
          onPaymentComplete={onPaymentComplete}
          amount={amount}
          transferToAccountUserId={transferToAccountUserId}
        />
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Typography.Text>Pay with a new card</Typography.Text>
          </Col>
          <Col span={18}>
            <CardNumberElement
              className="card-number-input"
              onChange={(event) => {
                // console.log("cne", event);
                error !== null && setError(null);
              }}
            />
          </Col>

          <Col span={6}>
            <CardExpiryElement
              className="cexpinput"
              onChange={(event) => error !== null && setError(null)}
            />
          </Col>

          <Col span={6}>
            <CardCvcElement
              className="ccsvinput"
              onChange={(event) => error !== null && setError(null)}
            />
          </Col>

          <Col span={8}>
            <Input
              className="zip-code"
              placeholder="ZIP"
              onChange={(e) => setInitialZip(e.target.value)}
            />
          </Col>

          <Col span={24}>
            {cardLengthA < 3 ? (
              <Checkbox onChange={onChange}>
                Save card for future payments
              </Checkbox>
            ) : (
              <span style={{ fontSize: "13px" }}>
                Users can only save upto 3 cards.
              </span>
            )}
          </Col>

          <Col span={24} className="pay-now_button">
            <Button type="primary" loading={processing} onClick={handleSubmit}>
              Pay Now
            </Button>
          </Col>
        </Row>

        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="card-error" role="alert">
            <i>
              <p style={{ textAlign: "left", color: "red", marginTop: "2%" }}>
                {error}
              </p>
            </i>
          </div>
        )}

        {showError !== "" && !validZip && (
          <p style={{ textAlign: "left", color: "red", marginTop: "2%" }}>
            <i>{showError}</i>
          </p>
        )}

        <Typography.Text className="note">
          By confirming your payment, you allow Rent On Cloud to charge your
          card and initiate the payment in accordance with our terms.
        </Typography.Text>
      </div>
    </div>
  );
};

export default CheckoutModal;
