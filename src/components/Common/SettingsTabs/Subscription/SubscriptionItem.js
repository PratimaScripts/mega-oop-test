import { get } from "lodash-es";
import moment from "moment";
import React from "react";
import Img from "react-image";

const SubscriptionItem = ({
  selectedPlan,
  premium,
  showConfirm,
  cssClass,
  premiumName,
}) => {
  const isPlanExpired =
    moment(new Date(selectedPlan.expireDate)).diff(new Date(), "seconds") < 1
      ? true
      : false;

  return (
    <div>
      <div className={cssClass}>
        {selectedPlan.displayName === premiumName && (
          <div className="current">
            <Img
              src={[
                "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.webp",
                "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.png",
              ]}
              alt="img"
            />
          </div>
        )}
        <div className="header">
          <div className="plan-name">{premiumName}</div>
          <div className="plan-price">
            {get(premium, "[0].amount", 0)}
            <sup className="sup__tag">£</sup>
          </div>
          <div className="plan-frequency">per year / unit</div>
        </div>
        <div className="menuThree">
          <ul>
            <li>
              <i className="fa fa-check"></i>{" "}
              <strong>Include all features of Standard plan</strong>
            </li>
            <li className="text-center">
              <i className="fa fa-plus"></i>
            </li>
            <li>
              <i className="fa fa-check"></i> Expert Accountant to prepare &
              submit Tax return
            </li>
            <li>
              <i className="fa fa-check"></i> zyPass™ Landlord screening and
              Tenant Referencing
            </li>
          </ul>
          <div className="col-12 text-center my-4">
            <button
              disabled={!isPlanExpired}
              onClick={() => showConfirm(premium)}
              className="btn btn__plan"
            >
              Get Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionItem;
