import React from "react";

const CardOther = props => {
  let profileChecks = props.profileChecks;
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

          <li className={profileChecks && profileChecks.phone && "verified"}>
            <span className={"mdi mdi-phone-in-talk"}></span> Phone
          </li>
          <li className={profileChecks && profileChecks.income && "verified"}>
            <span className={"mdi mdi-coin"}></span> Business
          </li>
          <li className={profileChecks && profileChecks.bank && "verified"}>
            <span className={"mdi mdi-bank"}></span> Bank
          </li>
          <li className={profileChecks && profileChecks.rental && "verified"}>
            <span className={"mdi mdi-search-web"}></span> AML
          </li>
        </ul>
      </div>
    </>
  );
};

export default CardOther;
