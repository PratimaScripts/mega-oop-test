import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
// import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { message } from "antd";
import ScreeningPaymentModal from "../../../../../config/PaymentModals/ScreeningSelf";

import "./screeningOrder.scss";

const ScreeningOrdersList = props => {
  const [activeScreeningOrder, setActiveOrder] = useState(1);
  const [isPaymentTime, setPaymentTime] = useState(false);
  let image1 = "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/home.png";
  let image2 = "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/tick1.png";
  let image3 = "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypass.png";

  let orders = [
    {
      type: "self",
      price: "5.99"
    },
    {
      type: "invite",
      price: "5.99",
      main: "Tenant"
    },
    {
      type: "invite",
      price: "5.99",
      main: "Landlord"
    }
  ];
  const checkOutOrder = () => {
    // let pendingOrders = get(
    //   props,
    //   "contextData.pendingOrders.data.getPendingScreening.data"
    // );
    const pendingOrders = [] // todo

    if (orders[activeScreeningOrder - 1].type === "invite") {
      props.history.push("invite", {
        inviteType: orders[activeScreeningOrder - 1]
      });
    }
    if (orders[activeScreeningOrder - 1].type !== "invite") {
      let disableSelfOrder = isEmpty(pendingOrders) ? false : true;
      if (disableSelfOrder) {
        message.error("You already have a Self Order you have paid for!");
        localStorage.setItem("isOriginCorrect", true);
        props.history.push(`/landlord/screening/review`, {
          legit: true
        });
      }

      if (!disableSelfOrder) {
        setPaymentTime(true);
      }
    }
  };

  return (
    <>
      <ScreeningPaymentModal
        closeModal={() => setPaymentTime(false)}
        isPaymentTime={isPaymentTime}
        {...props}
      />
      <div className="screening_wrap__order__list">
        <div className="container">
          <h6 className="mb-3">Request Screening Reports</h6>

          <div className="row">
            <div
              onClick={() => setActiveOrder(1)}
              className="col-xl-4 col-md-6 mb-3"
            >
              <div className="option-card choice" name="1" value="1">
                <div className="row">
                  <div className="col-md-2"></div>
                  <div className="col-md-8">
                    <center>
                      <img src={"https://res.cloudinary.com/dkxjsdsvg/image/upload/images/home.png"} alt="img" />
                    </center>
                    <center>
                      <h3>Landlord Screening</h3>
                    </center>
                  </div>
                  {activeScreeningOrder === 1 && (
                    <div className="col-md-2">
                      <img className="tick" src={image2} alt="img" />
                    </div>
                  )}
                </div>
                <br></br>
                <div className="paid_line">
                  <center>
                    <p>
                      <strike>
                        <lab>£9.99</lab>
                      </strike>{" "}
                      &nbsp; <lab>£5.99</lab> (paid by landlord)
                    </p>
                  </center>
                </div>
                <div className="report">
                  <center>
                    <Link to="/landlord/screening/report/sample">
                      View example report
                    </Link>
                  </center>
                </div>
                <br></br>
                <div className="info">
                  <p>
                    Combined identity,Anti-money laundering check and Title
                    ownership verification upto 4 properties.
                  </p>
                  <hr></hr>
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
                      <img src={"https://res.cloudinary.com/dkxjsdsvg/image/upload/images/zypass.png"} alt="img" />{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => setActiveOrder(2)}
              className="col-xl-4 col-md-6 mb-3"
            >
              <div className="option-card choice" name="1" value="1">
                <div className="row">
                  <div className="col-md-2"></div>
                  <div className="col-md-8">
                    <center>
                      <img src={"https://res.cloudinary.com/dkxjsdsvg/image/upload/images/lock.png"} alt="img" />
                    </center>
                    <center>
                      <h3>Renter Screening</h3>
                    </center>
                  </div>
                  {activeScreeningOrder === 2 && (
                    <div className="col-md-2">
                      <img className="tick" src={image2} alt="img" />
                    </div>
                  )}
                </div>
                <br></br>
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
                <div className="report">
                  <center>
                    <Link to="/landlord/screening/report/sample/renter">
                      View example report
                    </Link>
                  </center>
                </div>
                <br></br>
                <div className="info">
                  <p>
                    Full comprehensive report combining identity, Residency,
                    Credit check, Past Rent and Income Referencing.
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
            <div
              onClick={() => setActiveOrder(3)}
              className="col-xl-4 col-md-6 mb-3"
            >
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
                  {activeScreeningOrder === 3 && (
                    <div className="col-md-2">
                      <img className="tick" src={image2} alt="img" />
                    </div>
                  )}
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
                    <Link to="/landlord/screening/report/sample">
                      View example report
                    </Link>
                  </center>
                </div>
                <br></br>
                <div className="info">
                  <p>
                    Combined identity,Anti-money laundering check and Title
                    ownership verification upto 4 properties.
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
          </div>
          <button
            onClick={checkOutOrder}
            className="btn btn-warning pull-right mt-5"
          >
            Checkout Order
          </button>
        </div>
      </div>
    </>
  );
};

export default withRouter(ScreeningOrdersList);
