import React, { useState } from "react";
import ScreeningInvite from "./InvitationForm";
import ValidateEmail from "../../../../../config/ValidateEmail";
import ScreeningQuery from "../../../../../config/queries/screening";
import ScreeningPaymentModal from "../../../../../config/PaymentModals/ScreeningInvite";
import Notification from "../../../../../config/Notification";

import { message } from "antd";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import "./style.scss";

const ScreeningInvitation = props => {
  const [isPaymentTime, setPaymentTime] = useState(false);
  const [totalInvitees, setInviteData] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState([]);

  const inviteUsers = async data => {
    let screeningInvites = data.screeningInvites;
    let validAr = [];

    let validateUsers = screeningInvites.map(async (invite, i) => {
      let isValid = await ValidateEmail(invite);

      if (isValid) {
        validAr.push("valid");
      }

      if (!isValid) {
        message.error(`${invite.email} is not a valid email!`);
        validAr.push("invalid");
      }
    });

    await Promise.all(validateUsers);

    if (!validAr.includes("invalid")) {
      setFormData(data.screeningInvites);
      setInviteData(validAr.length);
      setTimeout(() => {
        createScreeningOrder(data.screeningInvites);
      }, 800);
      // setPaymentTime(true);
    }
  };

  const createScreeningOrder = async screeningInvites => {
    let inv = inviteType === "Tenant" ? "Renter" : inviteType;
    let fData = screeningInvites;

    let createOrder = await props.client.mutate({
      mutation: ScreeningQuery.createScreeningOrder,
      variables: { type: inv, invite: fData, propertiesId: [] }
    });

    if (get(createOrder, "data.createInvitation.success")) {
      Notification(
        "success",
        "Invitation Sent!",
        "The users have been sent an email with the invites"
      );

      setTimeout(() => {
        window.location.href = "/renter/screening";
      }, 2000);
    } else {
      Notification(
        "error",
        "An Error Occured",
        get(createOrder, "data.createInvitation.message")
      );
    }
  };

  let inviteType = get(props, "location.state.inviteType.main");

  return (
    <>
      <ScreeningPaymentModal
        closeModal={() => setPaymentTime(false)}
        isPaymentTime={isPaymentTime}
        totalInvitees={totalInvitees}
        createScreeningOrder={createScreeningOrder}
        {...props}
      />
      <div className="screening_wrap">
        <div className="container">
          <h6>Enter {inviteType && inviteType} name</h6>

          <div className="row">
            <div className="form_screening">
              <ScreeningInvite inviteUsers={inviteUsers} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(ScreeningInvitation);
