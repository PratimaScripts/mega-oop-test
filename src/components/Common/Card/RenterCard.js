import React from "react";

const RenterCard = props => {
  let profileChecks = props.profileChecks;
  let selfDeclaration = props.selfDeclaration;
  let status = props.ProfileCompletenessData.verifiedStatus;
  return (
    <>
      <div className="short_card custom">
        {(status === "Partially Verified" && (
          <h4 className="text-center text-warning mb-4">
            {props.ProfileCompletenessData.verifiedStatus}{" "}
          </h4>
        )) ||
          (status === "Not Verified" && (
            <h4 className="text-center text-danger mb-4">
              {props.ProfileCompletenessData.verifiedStatus}{" "}
            </h4>
          )) ||
          (status === "Verified" && (
            <h4 className="text-center text-success mb-4">
              {props.ProfileCompletenessData.verifiedStatus}{" "}
            </h4>
          ))}

        <ul className="list-two-column">
          <li className={profileChecks && profileChecks.identity && "verified"}>
            <span className={"mdi mdi-account-card-details"}></span> Identity
          </li>
          <li
            className={profileChecks && profileChecks.creditCheck && "verified"}
          >
            <span className={"mdi mdi-credit-card-plus"}></span>
            Credit Check
          </li>
          <li className={profileChecks && profileChecks.phone && "verified"}>
            <span className={"mdi mdi-phone-in-talk"}></span> Phone
          </li>
          <li className={profileChecks && profileChecks.income && "verified"}>
            <span className={"mdi mdi-coin"}></span> Income
          </li>
          <li className={profileChecks && profileChecks.bank && "verified"}>
            <span className={"mdi mdi-bank"}></span> Bank
          </li>
          <li className={profileChecks && profileChecks.rental && "verified"}>
            <span className={"mdi mdi-cash-100"}></span> Past Rental
          </li>
          <li
            className={profileChecks && profileChecks.rightToRent && "verified"}
          >
            <span className={"mdi-playlist-check"}></span> Right to Rent
          </li>
          <li
            className={
              profileChecks && profileChecks.affordability && "verified"
            }
          >
            <span className={"mdi mdi-currency-gbp"}></span> Affordability
          </li>
        </ul>
      </div>
      <div className="short_card">
        <h4 className="text-center mb-4">Self Declaration</h4>
        <ul className="list-two-column">
          <li className={selfDeclaration && selfDeclaration.pets && "verified"}>
            <span className="mdi mdi-dog-side"></span> Pets
          </li>
          <li
            className={selfDeclaration && selfDeclaration.smoking && "verified"}
          >
            <span className="mdi mdi-smoking"></span>Smoking
          </li>
          <li
            className={
              selfDeclaration && selfDeclaration.vehicles && "verified"
            }
          >
            <span className="mdi mdi-car"></span> Vehicles
          </li>
          <li
            className={selfDeclaration && selfDeclaration.disable && "verified"}
          >
            <span className="mdi mdi-wheelchair-accessibility"></span> Disable
          </li>
          <li
            style={{ width: "100%" }}
            className={
              selfDeclaration && selfDeclaration.incomeSupport && "verified"
            }
          >
            <span className="mdi mdi-account-supervisor"></span> Income Support
          </li>
        </ul>
      </div>
    </>
  );
};

export default RenterCard;
