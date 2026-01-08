import React, { useState, useContext } from "react";
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
import { UserDataContext } from "store/contexts/UserContext"
import "./styles.scss";

const Stripe = props => {
  const stripe = useStripe();
  const { state: userState } = useContext(UserDataContext)
  const { userData } = userState
  let inviteTypeUser = get(props, "location.state.inviteType.main");
  const [cardStatus, setCardStatus] = useState(false);
  const submit = async ev => {
    // const currentRole = userData.role;

    ShowLoadingMessage("Processing Your Payment, Please wait...");
    setCardStatus(true);

    let { token } = await stripe.createToken({
      name: `${userData.firstName} ${userData.lastName}`,
      currency: "GBP"
    });
    let obj = {
      cardId: get(token, "card.id"),
      tokenId: get(token, "id"),
      amount: parseFloat(totalPayment) * 100,
      type: "Renter"
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

      // props.createScreeningOrder();
      setCardStatus(false);
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

  let image1 =
    "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/home.png";

  let image3 =
    "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypass.png";

  let paymentCard =
    inviteTypeUser === "Tenant" ? (
      <div>
        <div className="option-card choice" name="1" value="1">
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <center>
                <img
                  src={
                    "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/lock.png"
                  }
                  alt="img"
                />
              </center>
              <center>
                <h3>Renter Screening</h3>
              </center>
            </div>
          </div>
          <div className="paid_line">
            <center>
              <p>
                <strike>
                  <lab>£9.99</lab>
                </strike>{" "}
                &nbsp; <lab>£5.99</lab> (paid by Renter)
              </p>
            </center>
          </div>
          <div className="info">
            <p>
              Full comprehensive report combining identity, Residency, Credit
              check, Past Rent and Income Referencing.
            </p>
            <hr></hr>
          </div>
          <div className="row">
            <div className="col-md-6">
              <a href className="badge badge-warning">
                Invite Others
              </a>
            </div>
            <div className="col-md-6">
              <div className="pull-right">
                {" "}
                Powered by <img src={image3} alt="img" />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <div className="option-card choice" name="1" value="1">
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <center>
                <img src={image1} alt="img" />
              </center>
              <center>
                <h3>Landlord Screening</h3>
              </center>
            </div>
          </div>
          <br></br>
          <div className="paid_line">
            <center>
              <p>
                <strike>
                  <lab>£9.99</lab>
                </strike>{" "}
                &nbsp; <lab>£5.99</lab> (paid by Landlord)
              </p>
            </center>
          </div>
          <div className="report">
            <center>
              <a href="/landlord/screeningReport">View example report</a>
            </center>
          </div>
          <br></br>
          <div className="info">
            <p>
              Combined identity,Anti-money laundering check and Title ownership
              verification upto 4 properties.
            </p>
            <hr></hr>
          </div>
          <div className="row">
            <div className="col-md-6">
              <a href className="badge badge-warning">
                Invite Others
              </a>
            </div>
            <div className="col-md-6">
              <div className="pull-right">
                {" "}
                Powered by <img src={image3} alt="img" />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  let totalPayment =
    process.env.REACT_APP_SCREENING_ORDER_SELF * props.totalInvitees;
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

              <div className="card__background">
                <div className="container">
                  <div className="row">{paymentCard}</div>
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
                      value={`${userData.email}`}
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

                    <label>Name</label>
                    <input
                      type="text"
                      name="NameOnCard"
                      value={`${userData.firstName} ${userData.lastName}`}
                      disabled
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
