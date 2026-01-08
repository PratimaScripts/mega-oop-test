import React, { useState, useContext  } from "react";
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
import {Checkbox, InputNumber} from "antd";
import ShowLoadingMessage from "../ShowLoadingMessage";
import showNotification from "../Notification";
import StripePayment from "../queries/payment";
import { UserDataContext } from "store/contexts/UserContext"

import "./styles.scss";
// import NumberFormat from "react-number-format";

const Stripe = props => {
  const stripe = useStripe();
  const { state: userState } = useContext(UserDataContext)
  const { userData } = userState

  const [cardStatus, setCardStatus] = useState(false);
  const [checkedState, setCheckedState] = useState([true,true,false,false]);
  const [total,setTotal] = useState(parseFloat(process.env.REACT_APP_SCREENING_ORDER_SELF));
  const [noOfProperties, setNoOfProperties] = useState(1);
  const currentRole = userData.role;

  const submit = async ev => {
    ShowLoadingMessage("Processing Your Payment, Please wait...");
    setCardStatus(true);

    let { token } = await stripe.createToken({
      name: `${userData.firstName} ${userData.lastName}`,
      currency: "GBP"
    });
    let obj = {
      cardId: get(token, "card.id"),
      tokenId: get(token, "id"),
      amount: parseFloat(total) * 100,
      type: "Self"
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
      localStorage.setItem("isOriginCorrect", true);

      window.location.href = `/${currentRole}/screening/review`;
      setCardStatus(false);
    }

    if (!get(createScreeningOrder, "data.paymentScreeningAmount.success")) {
      if (
        get(createScreeningOrder, "data.paymentScreeningAmount.message") ===
        "First complete your old screening order."
      ) {
        localStorage.setItem("isOriginCorrect", true);

        props.history.push(`/${currentRole}/screening/review`, {
          legit: true
        });
      }
      showNotification(
        "error",
        "An error occured",
        get(createScreeningOrder, "data.paymentScreeningAmount.message")
      );

      setCardStatus(false);
    }
  };

  const features = [
      { price: 0, label: "Individual Identity"},
      { price: 0, label: "AML (anti money laundering) Check" },
      { price: 3.50, label: "Land Registry Title Check" },
      { price: 8.99, label: "Company Identity and AML Check"}
    ];
  const handleOnChange = (position, qty, preventChange) => {
    const updatedCheckedState = !preventChange ? checkedState.map((item, index) =>
      index === position ? !item : item
    )
    : checkedState;
    console.log(qty)
    setCheckedState(updatedCheckedState);

    const totalPrice = updatedCheckedState.reduce(
      (sum, currentState, index) => {
        if (currentState === true) {
          if(index === 2){ return sum + features[index].price*qty }
          return sum + features[index].price;
        }
        return sum;
      },
      parseFloat(process.env.REACT_APP_SCREENING_ORDER_SELF)
    );

    setTotal(totalPrice.toFixed(2));
  };

  
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
                      <span className="badge badge-success">Self</span>
                    </div>
                  </div>
                </div>
                <div className="payment_summary">
                  <p>Apply for screening order</p>
                  <h1>
                    £{total}{" "}
                    <span>per screening order</span>
                  </h1>
                </div>
              </div>
              <div className="card_left">
                <div >
                  <div className="card__background">
                    <div className="option-card choice" name="1" value="1">
                      <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                          <center>
                            <img
                              src={
                                "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/home.png"
                              }
                              alt="img"
                            />
                          </center>
                          <center>
                            <h3>
                              {currentRole === "renter" ? "Tenant" : "Landlord"}{" "}
                              Screening
                            </h3>
                          </center>
                        </div>
                      </div>
                      <div className="paid_line">
                        <center>
                          <p>
                            <lab><span className="price">£{total}</span></lab> (paid by{" "}
                            {currentRole === "renter" ? "tenant" : "landlord"})
                          </p>
                        </center>
                      </div>
                      <div className="info">
                        <ul className="price_list" >
                            {features.map(({price,label},index) => 
                              <li key="index">
                                <div className="price_list_item">
                                  <div className="price_list_item_left">
                                    <Checkbox 
                                      checked={checkedState[index]}
                                      onChange={() => handleOnChange(index,noOfProperties)} >{label}
                                    </Checkbox><br />
                                    {index ===2 && 
                                        <div className="property_counter">
                                        For &nbsp;
                                        <InputNumber min={1} max={4} 
                                          defaultValue={1}
                                          size="small"
                                          onChange={(value)=> {setNoOfProperties(value); handleOnChange(index,value,true)}} />
                                          &nbsp; properties
                                        </div>}
                                  </div>
                                  <div className="price_list_item_right">
                                    {index===2 ? `£${features[2].price*noOfProperties.toFixed(2)}` : price>0 ? `£${price.toFixed(2)}` : null}
                                  </div>
                                </div>
                              </li>
                            )}
                            {/* <li>{`£${total}`}</li> */}
                        </ul>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <a href className="badge badge-success">
                            For self
                          </a>
                        </div>
                        <div className="col-md-6">
                          <div className="pull-right">
                            {" "}
                            Powered by{" "}
                            <img
                              src={
                                "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypass.png"
                              }
                              alt="img"
                            />{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    Pay £{total}
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
