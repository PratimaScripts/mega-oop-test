import React, { useState } from "react";
// import {
//   CardElement,
//   injectStripe
//   //   CardNumberElement,
//   //   CardExpiryElement,
//   //   CardCVCElement
// } from "react-stripe-elements";
import { CardElement, useStripe } from "@stripe/react-stripe-js";

import get from "lodash/get";
import { withRouter } from "react-router-dom";
import ShowLoadingMessage from "../ShowLoadingMessage";
import showNotification from "../Notification";
import StripePayment from "../queries/payment";

import "./styles.scss";

const Stripe = props => {
  const stripe = useStripe();

  const [cardStatus, setCardStatus] = useState(false);
  const submit = async ev => {
    // let currentRole = get(
    //   props,
    //   "contextData.userData.authentication.data.role"
    // );

    ShowLoadingMessage("Processing Your Payment, Please wait...");
    setCardStatus(true);

    let { token } = await stripe.createToken({
      name: get(props, "apiResponse.email"),
      currency: "GBP"
    });
    let role = get(props, "apiResponse.invitedRole");

    let obj = {
      cardId: get(token, "card.id"),
      tokenId: get(token, "id"),
      amount: parseFloat(totalPayment) * 100,
      type: role.charAt(0).toUpperCase() + role.slice(1),
      screeningId: get(props, "apiResponse._id", "")
    };

    const createScreeningOrder = await props.client.query({
      query: StripePayment.paymentScreeningAmount,
      variables: obj
    });

    if (get(createScreeningOrder, "data.paymentScreeningAmount.success")) {
      showNotification(
        "success",
        "Payment Successful!",
        "One step away from creating your order, Please review your details and confirm!"
      );

      if (get(props, "apiResponse.isNew")) {
        // push to settings
        window.location.href = `/${role}/settings`;
      } else {
        // push to review
        window.location.href = `/${role}/screening/review`;
      }
    }

    if (!get(createScreeningOrder, "data.paymentScreeningAmount.success")) {
      showNotification(
        "error",
        "An error occured",
        get(createScreeningOrder, "data.paymentScreeningAmount.message")
      );

      setCardStatus(false);
    }
  };

  let totalPayment = process.env.REACT_APP_SCREENING_ORDER_SELF;
  return (
    <div>
      <div className="stripe_wrap checkout">
        <div className="container test">
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <div className="overview_order">
                <div className="header">
                  <div className="header_content d-flex">
                    <h6 className="mr-2"> Screening Order </h6>
                    <div className="link_page">
                      {" "}
                      <span className="badge badge-warning">Invitation</span>
                    </div>
                  </div>
                </div>
                <div className="payment_summary">
                  <p>Apply for screening order</p>
                  <h1>
                    £{totalPayment} <span>per screening order</span>
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6">
              <div className="pay_wrap">
                <div className="form_wrap">
                  <p>Confirm Your Order</p>
                  <form>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={`${get(props, "apiResponse.email")}`}
                      placeholder="Please Enter your email"
                      className="input_field"
                    />
                    <label>Card information</label>

                    <CardElement
                      onChange={status => setCardStatus(status)}
                      options={{
                        hidePostalCode: true,
                        iconStyle: "solid"
                      }}
                      className="input_field"
                    />
                  </form>
                  <button
                    disabled={!cardStatus.complete}
                    className="btn"
                    onClick={submit}
                  >
                    Pay £{totalPayment}
                  </button>
                </div>
                <div className="pay_terms">
                  <p>
                    By confirming your subscription, you allow Rent On Cloud to
                    charge your card for this payment in accordance with their
                    terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Stripe);
