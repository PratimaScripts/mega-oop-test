import React, { useState } from "react";
import ScreeningInvite from "./InvitationForm";
import ValidateEmail from "../../../../../config/ValidateEmail";
import ScreeningQuery from "../../../../../config/queries/screening";
import ScreeningPaymentModal from "../../../../../config/PaymentModals/ScreeningInvite";
import showNotification from "../../../../../config/Notification";

import { message } from "antd";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import "./style.scss";

const ScreeningInvitation = props => {
  let inviteType = get(props, "location.state.inviteType.main");

  const [isPaymentTime, setPaymentTime] = useState(false);
  const [totalInvitees, setInviteData] = useState(1);
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
      await setFormData(screeningInvites);
      setInviteData(validAr.length);
      if (inviteType === "Landlord") {
        createScreeningOrder(screeningInvites);
      }

      if (inviteType === "Tenant") {
        setPaymentTime(true);
      }
    }
  };

  const createScreeningOrder = async screeningInvites => {
    let inv = inviteType === "Tenant" ? "Renter" : inviteType;
    let fData = inv === "Renter" ? formData : screeningInvites;

    let createOrder = await props.client.mutate({
      mutation: ScreeningQuery.createScreeningOrder,
      variables: { type: inv, invite: fData, propertiesId: [] }
    });

    if (get(createOrder, "data.createInvitation.success")) {
      showNotification(
        "success",
        "Invitation Sent!",
        "The users have been sent an email with the invites"
      );

      setTimeout(() => {
        window.location.href = "/landlord/screening";
      }, 2000);
    } else {
      showNotification(
        "error",
        "An Error Occured",
        get(createOrder, "data.createInvitation.message")
      );
    }
  };

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
