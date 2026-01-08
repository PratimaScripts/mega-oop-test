import React, { useState, useEffect, useContext, Fragment } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import "./Checkout.css";
import { CloseOutlined } from "@ant-design/icons";
import TaskQueries from "../../../../config/queries/tasks";
import { Link } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";
import { Checkbox, Modal, Button, Row, Col } from "antd";
import SavedCards from "../../SettingsTabs/CommonInfo/savedCards";
import axios from "axios";
import { StoreContext } from "../../../../store/store";
import isValid from "uk-postcode-validator";
import showNotification from "config/Notification";

export default function CheckoutForm(props) {
  const BACKEND_SERVER = process.env.REACT_APP_SERVER;

  //context
  const { dispatch } = useContext(StoreContext);

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [checked, setChecked] = useState(false);
  const [cardLengthA, setCardLengthA] = useState(0);
  const [dis, setDis] = useState("pointer");
  const [opc, setOpc] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [initialZip, setInitialZip] = useState("");
  const [validZip, setValidZip] = useState("default");
  const [showError, setShowError] = useState("");

  //list cards
  const payOwnedBy =
    props.taskData.payOwnedBy === "Landlord" ? "landlord" : "renter";

  const amount = props.amount;
  // const appFee = ((props.amount / 100) * 12) * 100
  const taskId = props.taskData.taskId;
  const offerId = props.offerId;
  // const newBudget = props.amount;
  const spUserId = props.offerUserId;

  let emailM = props.userData !== undefined && props.userData.email;
  let fullName =
    props.userData !== undefined &&
    props.userData.firstName + " " + props.userData.lastName;
  let role = props.userData !== undefined && props.userData.role;
  let userId = props.userData !== undefined && props.userData._id;

  // console.log("test dd", emailM, fullName, role, userId);

  useEffect(() => {
    setValidZip(isValid(initialZip));
    // console.log("zip valid", validZip);
  }, [initialZip]);

  const [changeStatus] = useMutation(TaskQueries.updateTaskStatus, {
    onCompleted: ({ updateTaskStatus }) => {
      if (!updateTaskStatus.success) {
        showNotification(
          "error",
          updateTaskStatus.message || "Something went wrong"
        );
      } else {
        dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" });
        setIsModalVisible(true);
      }
    },
    update: (proxy, mutationResult) => {
      // console.log("mutationResult: ", mutationResult);
    },
  });

  const [offerStatus] = useMutation(TaskQueries.acceptRejectOffer, {
    onCompleted: async ({ acceptRejectTaskOffer }) => {
      if (!acceptRejectTaskOffer.success) {
        showNotification(
          "error",
          acceptRejectTaskOffer.message || "Something went wrong"
        );
      }
    },
  });

  // console.log("is this", cardLength);

  //get customer id of the user
  const getUserData = async (id, role) => {
    // console.log("in get user data", props.uId, props.role);
    await axios({
      method: "POST",
      url: `${BACKEND_SERVER}/api/stripe/get-user-data`,
      data: {
        id: id,
        role: role,
      },
    })
      .then((response) => {

        if (response.data.accDetails.stripeConnect.cusId) {
          getCardList(response.data.accDetails.stripeConnect.cusId);
        } else {
          throw Error("Please connect with Stripe in order to make this payment!");
        }

      })
      .catch((error) => {
        showNotification(
          "error",
          "An error occurred!",
          error.response.data.error.message || ""
        );
      });
  };

  //get the card list of the user
  const getCardList = async (id) => {
    await axios({
      method: "POST",
      url: `${BACKEND_SERVER}/api/stripe/list-cards`,
      data: {
        customer: id,
      },
    })
      .then(function (response) {
        // console.log("save set", response);
        setCardLengthA(response.data.data.length);
      })
      .catch(function (error) {
        showNotification(
          "error",
          "An error occurred!",
          error.response.data.error.message || ""
        );
      });
  };

  useEffect(() => {
    getUserData(userId, role);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    createPayIntent();

    //eslint-disable-next-line
  }, [spUserId]);

  const createPayIntent = async () => {
    // console.log("hjjjjjjjjjjjjj", amount, spUserId);
    if (spUserId !== "" && amount !== "") {
      await axios({
        url: `${BACKEND_SERVER}/api/stripe/create-payment-intent`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          id: spUserId,
          amount: amount,
        },
      })
        .then((res) => {
          // console.log("gooooooooooot", res);
          setProcessing(false);
          if (res.data.status === "success") {
            setClientSecret(res.data.clientSecret);
          }
          if (res.data.status === "error") {
            showNotification("info", "Missing Information", res.data.msg);
          }
        })
        .catch((error) => {
          setProcessing(false);
          showNotification(
            "error",
            "An error occurred!",
            error.response.data.error.message || ""
          );
        });
    }
  };

  const finallyFunc = () => {
    setProcessing(false);
    setDis("pointer");
    setOpc("1");
  };

  const handleSubmit = async (ev) => {
    // console.log("onnnn");
    ev.preventDefault();
    if (!clientSecret) {
      return showNotification(
        "info",
        "Pending payment method verification",
        "Eithier your's or client's payment method have not yet verifed!"
      );
    }

    if (!validZip) {
      return setShowError("Please enter a valid ZIP code");
    }

    //When the user does not want to save the card.
    if (!checked) {
      ev.preventDefault();
      setProcessing(true);

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });
      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);

        dispatch({ type: "PAYMENT_STATUS", payload: "success" });

        await offerStatus({
          variables: {
            offerId: offerId,
            status: "Accepted",
          },
        })
          .then(({ acceptRejectTaskOffer }) => {
            if (!acceptRejectTaskOffer.success) {
              showNotification(
                "error",
                acceptRejectTaskOffer.message || "Something went wrong"
              );
            } else {
              changeStatus({
                variables: {
                  status: "In Progress",
                  taskId,
                },
              });
            }
          })
          .finally(finallyFunc);

        setTimeout(() => {
          dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" });
          setIsModalVisible(true);
        }, 100);
      }
    } else {
      setDis("not-allowed");
      setOpc("0.5");

      if (!stripe || !elements) {
        return;
      }

      const firstToExecute = async () => {
        await axios({
          method: "POST",
          url: `${BACKEND_SERVER}/api/stripe/save-card`,
          data: {
            id: userId,
            email: emailM,
            name: fullName,
            description: role,
          },
        })
          .then(function (response) {
            setProcessing(false);
            setClientSecret(response.data.client_secret);
            secondToExecute(response.data.client_secret, response.data.cusId);
          })
          .catch(function (error) {
            setProcessing(false);
            showNotification(
              "error",
              "An error occurred!",
              error.response.data.error.message || ""
            );
          })
          .finally(finallyFunc);
      };

      //saving the customer Id and payment method ids to db - 3rd to execute
      const saveToDb = async (payId, cusId) => {
        // console.log("saveToDbBBB", cusId);
        await axios({
          method: "POST",
          url: `${BACKEND_SERVER}/api/stripe/save-user-payment-data`,
          data: {
            id: userId,
            cusId: cusId,
            payMethodId: payId,
            role: role,
          },
        })
          .catch(function (error) {
            setProcessing(false);
            showNotification(
              "error",
              "An error occurred!",
              error.response.data.error.message || ""
            );
          })
          .finally(finallyFunc);
      };

      const secondToExecute = async (secret, cusId) => {
        const result = await stripe.confirmCardSetup(secret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: fullName,
              address: {
                postal_code: initialZip,
              },
            },
          },
        });

        if (result.error) {
          showNotification("error", result.error.message);
        } else {
          saveToDb(result.setupIntent.payment_method, cusId);
          chargeSavedCard(result.setupIntent.payment_method, cusId);
        }
      };

      //fourth to excecute
      const chargeSavedCard = async (id, cId) => {
        await axios({
          method: "POST",
          url: `${BACKEND_SERVER}/api/stripe/charge-later`,

          data: {
            customer: cId,
            payId: id,
            amount: amount,
            spId: props.offerUserId,
            taskId: taskId,
            offerId: props.offerId,
          },
        })
          .then(async function (response) {
            showNotification("success", "Payment has been created");
            dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" });
            props.setTaskData?.((prevData) => ({
              ...prevData,
              status: "In Progress",
            }));
          })
          .catch((error) => {
            showNotification(
              "error",
              "An error occurred!",
              error.response.data.error.message || ""
            );
          })
          .finally(finallyFunc);
      };

      firstToExecute();
    }
  };

  function onChange(e) {
    // console.log(`checked = ${e.target.checked}`);
    setChecked(e.target.checked);
  }

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="dadiv">
      <form id="payment-form" onSubmit={handleSubmit}>
        <CloseOutlined
          style={{
            fontSize: "18px",
            cursor: "pointer",
            color: "grey",
            textAlign: "right",
          }}
          onClick={() => {
            dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" });
            // console.log("ha");
          }}
        />
        <h2
          style={{
            textAlign: "center",
            marginBottom: "5%",
            fontSize: "18px",
            letterSpacing: "1px",
            marginTop: "5%",
          }}
        >
          Please initiate {props.amount} GBP to accept <br /> {props.name}'s
          offer
        </h2>
        <SavedCards
          editDeleteBtn={false}
          taskData={props.taskData}
          uId={props.taskData.postedBy._id}
          role={payOwnedBy}
          charge={true}
          padding={false}
          heading={"Pay with added cards"}
          offerId={props.offerId}
          offerUserId={props.offerUserId}
          offerAmount={props.amount}
        />
        {
          <>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={{ display: "none" }}
              className="stripeEmailInput"
            />

            <p
              style={{
                fontWeight: "bold",
                marginTop: "8%",
                marginBottom: "2%",
              }}
            >
              Pay with a new card
            </p>
            {/* <CardElement
              id="card-element"
              options={cardStyle}
              onChange={handleChange}
          /> */}

            <Row>
              <Col span={13}>
                <CardNumberElement
                  className="cnuminput"
                  onChange={(event) => {
                    // console.log("cne", event);
                    error !== null && setError(null);
                  }}
                />
              </Col>

              <Col offset={1} span={6}>
                <CardExpiryElement
                  className="cexpinput"
                  onChange={(event) => error !== null && setError(null)}
                />
              </Col>
            </Row>

            <Row style={{ marginTop: "2%", marginBottom: "3%" }}>
              <Col span={6}>
                <CardCvcElement
                  className="ccsvinput"
                  onChange={(event) => error !== null && setError(null)}
                />
              </Col>

              <Col offset={1} span={8}>
                <input
                  placeholder="ZIP"
                  className="czipinput"
                  onChange={(e) => setInitialZip(e.target.value)}
                  style={
                    initialZip !== "" && !validZip
                      ? { border: "1px solid red" }
                      : { border: "1px solid #dfdfdf" }
                  }
                />
              </Col>
            </Row>

            {cardLengthA < 3 ? (
              <Checkbox
                onChange={onChange}
                className="saveCardCheck"
                style={{ textAlign: "center", fontSize: "13px" }}
              >
                Save card for future payments
              </Checkbox>
            ) : (
              <span style={{ fontSize: "13px" }}>
                Users can only save upto 3 cards.
              </span>
            )}

            {/* Show any error that happens when processing the payment */}
            {error && (
              <div className="card-error" role="alert">
                <i>
                  <p
                    style={{ textAlign: "left", color: "red", marginTop: "2%" }}
                  >
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

            <button
              className="stripeButton"
              disabled={processing || (dis === "not-allowed" && true)}
              id="submit"
              style={{ marginTop: "2%", cursor: dis, opacity: opc }}
            >
              <span id="button-text">
                {processing ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  "Pay now"
                )}
              </span>
            </button>

            <p
              style={{ textAlign: "center", fontSize: "12px", marginTop: "5%" }}
            >
              By confirming your payment, you allow Rent On Cloud to charge your
              card and initiate the payment in accordance with our terms.
            </p>
          </>
        }
      </form>

      <Modal
        className="paySuccessModal"
        visible={isModalVisible}
        onOk={handleOk}
        closable={false}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
        title={"Payment processed"}
      >
        <p className="successTick">
          <CheckCircleFilled />
        </p>
        <p className="suc1">Successfully!</p>

        <div className="sucBtnDiv">
          {props.userData.role === "landlord" && (
            <Fragment>
              <Button className="taskBtn">
                <Link
                  to="/landlord/fixit"
                  onClick={() =>
                    dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" })
                  }
                >
                  Return to Tasks
                </Link>
              </Button>
              <Button className="accBtn" type="primary">
                <Link
                  to="/landlord/accounting/rental-transaction"
                  onClick={() =>
                    dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" })
                  }
                >
                  View Accounts
                </Link>
              </Button>
            </Fragment>
          )}
          {props.userData.role === "renter" && (
            <Fragment>
              <Button className="taskBtn">
                <Link
                  to="/renter/fixit"
                  onClick={() =>
                    dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" })
                  }
                >
                  Return to Tasks
                </Link>
              </Button>
              <Button className="taskBtn">
                <Link
                  to="/renter/settings/subscriptions"
                  onClick={() =>
                    dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" })
                  }
                >
                  Go to billings
                </Link>
              </Button>
            </Fragment>
          )}
        </div>
      </Modal>
    </div>
  );
}
