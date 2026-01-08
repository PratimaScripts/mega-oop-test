import React, { useEffect, useState, useContext, Fragment } from "react";
import axios from "axios";
import "./stylesBankCard.scss";
import {
  EditFilled,
  DeleteFilled,
  LoadingOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Row, Col, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import { StoreContext } from "../../../../store/store";
// import { useHistory } from "react-router-dom";

//images
import visaLogo from "./image/visa.png";
import masterLogo from "./image/master.png";
import showNotification from "config/Notification";

const SavedCards = (props) => {
  // const history = useHistory();
  //logs
  // console.log({
  //   saveCardProp: props,
  // });

  //context
  const { dispatch } = useContext(StoreContext);

  const BACKEND_SERVER = process.env.REACT_APP_SERVER;

  const [cusId, setCusId] = useState("");
  const [cards, setCards] = useState([]);

  //card list
  const [loading, setLoading] = useState(false);
  const [border, setBorder] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [btnCursor, setBtnCursor] = useState("not-allowed");

  //get cutomer id of the user
  const getUserData = async (id, role) => {
    // console.log("roleeeee", props.role);
    await axios({
      method: "POST",
      url: `${BACKEND_SERVER}/api/stripe/get-user-data`,
      data: {
        id: id,
        role: role,
      },
    })
      .then((response) => {
        // console.log("dd", response);
        setCusId(response.data.accDetails.stripeConnect.cusId);
        getCardList(response.data.accDetails.stripeConnect.cusId);
      })

      .catch((err) => {
        showNotification("error", "An error occurred", err.message);
        // console.log(err);
      });
  };

  //get the card list of the user
  const getCardList = async (id) => {
    // console.log("in cus", props.cusId);
    if (id) {
      await axios({
        method: "POST",
        url: `${BACKEND_SERVER}/api/stripe/list-cards`,
        data: {
          customer: id,
        },
      })
        .then(function (response) {
          // console.log("save set", response);
          setCards(response.data.data);

          // console.log("look", response.data.data.length);

          dispatch({ type: "CARD_LENGTH", payload: response.data.data.length });
        })
        .catch(function (error) {
          showNotification("error", "An error occurred!")
          // console.log(error);
        });
    }
  };

  // {props.cusId !== "" && getCardList(props.cusId)}

  useEffect(() => {
    let role = props.taskData.payOwnedBy === "Renter" ? "renter" : "landlord";
    getUserData(props.uId, role);

    //eslint-disable-next-line
  }, []);

  //charge the saved card
  const chargeSavedCard = async (cutomer, payId) => {
    // console.log({
    //   customer: cusId,
    //   payId: selectedCard,
    //   taskId: props.taskData.taskId,
    //   amount: props.offerAmount,
    //   spId: props.offerUserId,
    //   offerId: props.offerId,
    // });
    setLoading(true);
    // console.log("here", cutomer, payId);
    await axios({
      method: "POST",
      url: `${BACKEND_SERVER}/api/stripe/charge-later`,

      data: {
        customer: cusId,
        payId: selectedCard,
        taskId: props.taskData.taskId,
        amount: props.offerAmount,
        spId: props.offerUserId,
        offerId: props.offerId,
      },
    })
      .then(function (response) {
        // console.log("charge", response);
        setLoading(false);

        if (response.data.status === "success") {
          setTimeout(() => {
            dispatch({ type: "CLOSE_STRIPE_MODAL", payload: "none" });
          }, 200);

          setTimeout(() => {
            setIsModalVisible(true);
          }, 500);
        }

        if (response.data.status === "error") {
          showNotification("info", "Missing information", response.data.msg);
        }
      })
      .catch(function (error) {
        // console.log("darrrrr", error);
        setLoading(false);
      });
  };

  const clickedCard = (cus, id) => {
    // console.log("card id", cus, id);
    setCusId(cus);
    setSelectedCard(id);
    setBorder("2px solid #2288FB");
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <p style={{ fontWeight: "bold", marginBottom: "2%" }}>{props.heading}</p>

      {cards.length === 0 && <p>No cards added</p>}

      {cards.length !== 0 &&
        cards.map((card) => {
          return (
            <div className="form-row">
              <div className="col-md-12 mb-3">
                <div
                  class="card its"
                  style={{
                    paddingLeft: !props.padding && "0",
                    paddingRight: "0",
                    paddingTop: "0",
                    paddingBottom: "0",
                    border:
                      card.id === selectedCard ? border : "1px solid black",
                  }}
                  onClick={() => {
                    if (props.charge) {
                      setBtnCursor("pointer");
                      clickedCard(card.customer, card.id);
                    } else {
                      // console.log("do not charge");
                    }
                  }}
                >
                  <div
                    class="card-body"
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Row>
                      <Col span={3}>
                        {card.card.brand === "visa" && (
                          <img
                            style={{ width: "50px", height: "50px" }}
                            src={visaLogo}
                            alt="visalogo"
                          />
                        )}
                        {card.card.brand === "mastercard" && (
                          <img
                            style={{
                              width: "50px",
                              height: "30px",
                              marginTop: "10px",
                            }}
                            src={masterLogo}
                            alt="masterlogo"
                          />
                        )}
                      </Col>
                      <Col offset={2} span={10}>
                        <p
                          style={{
                            lineHeight: "20px",
                            marginTop: "0%",
                            fontSize: "15px",
                            marginBottom: "0",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bolder",
                              fontSize: "30px",
                              marginTop: "-30%",
                            }}
                          >
                            ....
                          </span>{" "}
                          <span>{card.card.last4}</span>
                        </p>{" "}
                        <p style={{ color: "#6A7486" }}>
                          Expires {card.card.exp_month}/{card.card.exp_year}
                        </p>
                      </Col>
                      <Col offset={5} span={3}>
                        {props.editDeleteBtn && (
                          <button
                            type="button"
                            className="btn btn-default"
                            style={{ paddingLeft: "0" }}
                          >
                            {/* <EditOutlined style={{ color: "#047BFE" }} /> */}
                            <EditFilled style={{ color: "#4F566B" }} />
                            <DeleteFilled
                              style={{ paddingLeft: "10px", color: "#4F566B" }}
                            />
                            {/* <DeleteOutlined
                              style={{ paddingLeft: "10px", color: "red" }}
                            /> */}
                          </button>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {cards.length > 0 && (
        <button
          className="stripeButtonEx"
          disabled={loading || (btnCursor === "not-allowed" && true)}
          id="submit"
          type="button"
          style={{ marginTop: "2%", cursor: btnCursor }}
          onClick={() => chargeSavedCard()}
        >
          <span id="button-text" style={{ cursor: btnCursor }}>
            {loading && (
              <LoadingOutlined
                style={{ fontSize: "25px", color: "white", marginRight: "1%" }}
              />
            )}{" "}
            Pay with an existing card
          </span>
        </button>
      )}

      <Modal
        className="paySuccessModal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        maskClosable={false}
        title={"Payment processed"}
      >
        <p className="successTick">
          <CheckCircleFilled />
        </p>
        <p className="suc1">Successfully!</p>

        <div className="sucBtnDiv">
          {props.role === "landlord" && (
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
          {props.role === "renter" && (
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
};

export default SavedCards;
