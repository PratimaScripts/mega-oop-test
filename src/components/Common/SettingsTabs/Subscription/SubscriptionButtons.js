import moment from "moment";
import React from "react";

const SubscriptionButtons = ({ planName, onBuy, onCancel, selectedPlan }) => {
  const leftSecondsInExpire = moment(new Date(selectedPlan.expireDate)).diff(
    new Date(),
    "seconds"
  );
  const isPlanExpired = isNaN(leftSecondsInExpire)
    ? true
    : leftSecondsInExpire < 1;

  return (
    <div>
      {leftSecondsInExpire > 1 && selectedPlan.displayName === planName ? (
        <button onClick={onCancel} className="btn btn__plan">
          Cancel Plan
        </button>
      ) : (
        <button
          disabled={!isPlanExpired}
          onClick={onBuy}
          className="btn btn__plan"
        >
          Get Plan
        </button>
      )}
    </div>
  );
};

export default SubscriptionButtons;
