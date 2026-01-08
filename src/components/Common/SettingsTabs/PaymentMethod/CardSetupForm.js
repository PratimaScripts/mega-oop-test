import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import CardList from "./CardSetup/CardList";
import CardElement from "./CardSetup/CardElement";
// import axios from "axios";
import "./CardSectionStyles.css";
import showNotification from "config/Notification";
import {
  useLazyQuery,
  useMutation,
  // , useQuery
} from "react-apollo";

import {
  getCustomerCardList,
  saveCard,
  updateCustomerCard,
  deleteCustomerCard,
} from "config/queries/stripe";
import { getStateCardSetup } from "./PaymentState";

// const BACKEND_SERVER =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_SERVER
//     : "http://localhost:3001";

export default function CardSetupForm(props) {
  const stripe = useStripe();
  const elements = useElements();

  //varaibles
  // let email = props.userData.email;
  let fullName = props.userData.firstName + " " + props.userData.lastName;
  // let role = props.userData.role;
  // let userId = props.userData._id;

  const [state, setState] = useState(getStateCardSetup);

  // const BACKEND_SERVER = process.env.REACT_APP_SERVER;

  // let singleMonthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  //get card list
  const [getStripeCardList] = useLazyQuery(getCustomerCardList, {
    onCompleted: (data) => {
      if (data) {
        setState({
          ...state,
          cards: data?.getCustomerCardList || [],
        });
      }
    },
  });
  useEffect(() => {
    getStripeCardList();

    //eslint-disable-next-line
  }, []);

  //saving a new card
  const [saveStripeCard] = useMutation(saveCard);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    if (!state.validZip) {
      return setState({ ...state, showError: "Please enter a valid ZIP code" });
    }

    //creating the client secret
    const data = await saveStripeCard();
    setState({ ...state, cusId: data?.data?.saveCard?.customerId });
    //setting up the card using the client secret
    const result = await stripe.confirmCardSetup(
      data?.data?.saveCard?.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: fullName,
            address: {
              postal_code: state?.initialZip,
            },
          },
        },
      }
    );

    if (result.error) {
      setState({
        ...state,
        cardErrors: result.error.message,
      });
    } else {
      setState({
        paymentMethodId: result.setupIntent.payment_method,
        saveCardSuccess: true,
        cardErrors: "",
      });
      showNotification("success", "", "Card save successfully!");
    }
  };

  //saving the customer Id and payment method ids to db
  // const saveToDb = async () => {
  //   await axios({
  //     method: "POST",
  //     url: `${BACKEND_SERVER}/api/stripe/save-user-payment-data`,
  //     data: {
  //       id: userId,
  //       cusId: state.cusId,
  //       payMethodId: state.paymentMethodId,
  //       role: role,
  //     },
  //   })
  //     .then(function (response) {
  //       // console.log(response.data);
  //     })
  //     .catch(function (error) {
  //       // console.log(error);
  //       showNotification("error", "An error occurred!");
  //     });
  // };

  // {
  //   state.saveCardSuccess && saveToDb();
  // }

  const showPopconfirm = (card) => {
    setState({
      ...state,
      visible: true,
      cardId: card.id,
    });
  };
  const [deleteStripeCard] = useMutation(deleteCustomerCard);

  const handleOk = async (cardId, customerId) => {
    setState({
      ...state,
      confirmLoading: true,
    });
    const data = await deleteStripeCard({
      variables: {
        CardInput: {
          customerId: customerId,
          cardId: cardId,
        },
      },
    });
    setState({
      ...state,
      cards: data?.deleteCustomerCard || [],
    });
    setTimeout(() => {
      setState({
        ...state,
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  const handleCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  // var d = new Date();
  // var n = d.getFullYear();
  // var t = d.getMonth();

  const closeEditCard = (card) => {
    setState({
      ...state,
      showEditCard: false,
      holderName: card.billing_details.name,
      month: card.card.exp_month,
      year: card.card.exp_year,
      zip: card.billing_details.address.postal_code,
    });
  };

  const clickedOnEdit = (card) => {
    setState({
      ...state,
      showEditCard: true,
      year: card.card.exp_year,
      holderName: card.billing_details.name,
      month: card.card.exp_month,
      cardId: card.id,
      zip: card.billing_details.address.postal_code,
    });
  };

  const [updateStripeCard] = useMutation(updateCustomerCard);
  const updateCard = async (cardId, customerId) => {
    setState({
      ...state,
      editSaveBtn: true,
      loading: true,
    });
    const data = await updateStripeCard({
      variables: {
        UpdateCardInput: {
          cardId,
          customerId,
          name: state.holderName,
          month: String(state.month),
          year: String(state.year),
          zip: state.zip,
        },
      },
    });

    setState({
      ...state,
      cards: data?.data?.updateCustomerCard || [],
      showEditCard: false,
      loading: false,
      editSaveBtn: false,
    });
  };

  // const handleOnZipCodeChange = (e) => {
  //   const value = e.target.value;
  // };

  return (
    <>
      {/* Card List Component */}
      <CardList
        closeEditCard={closeEditCard}
        handleOk={handleOk}
        clickedOnEdit={clickedOnEdit}
        handleCancel={handleCancel}
        showPopconfirm={showPopconfirm}
        updateCard={updateCard}
        setState={(key, value) => {
          setState({
            ...state,
            [key]: value,
          });
        }}
        {...state}
      />

      <div style={{ marginTop: "5%" }}>
        {state.cards.length < 1 && (
          <p style={{ fontWeight: "bold" }}>Add a new card</p>
        )}

        {state.cards.length >= 1 ? (
          <span style={{ color: "#6A7486" }}>
            <i>
              Save a card on profile and use for future payments and/or save a
              card when making a payment{" "}
            </i>
          </span>
        ) : (
          <>
            {/* Add Card Form */}
            <CardElement
              setState={(key, value) => {
                setState({
                  ...state,
                  [key]: value,
                });
              }}
              {...state}
            />

            {state.showError !== "" && !state.validZip && (
              <p style={{ color: "red", marginTop: "1%", marginBottom: "0" }}>
                <i>{state.showError}</i>
              </p>
            )}

            {state.cardErrors !== "" && (
              <p style={{ color: "red", marginTop: "1%", marginBottom: "0" }}>
                <i>{state.cardErrors}</i>
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!stripe || !elements}
              className="btn btn-primary"
              style={{ marginTop: "2%" }}
            >
              Save Card &nbsp; <i className="far fa-save"></i>
            </button>
          </>
        )}
      </div>
    </>
  );
}
