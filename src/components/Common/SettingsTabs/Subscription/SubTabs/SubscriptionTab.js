import React, { useContext } from "react";
import MonthSub from "../SubComponents/MonthSub";
import YearSub from "../SubComponents/YearSub";
import SubHeader from "../SubComponents/SubHeader";
import { UserDataContext } from "store/contexts/UserContext";

function SubscriptionTab(props) {
  const {
    state,
    // , dispatch
  } = useContext(UserDataContext);
  let userRole = state.userData.role;

  return (
    <div className="subscribe_landlord">
      <SubHeader {...props} />
      {/* Monthly Plan */}
      <MonthSub userRole={userRole} {...props} />
      {/* Yearly Plan */}
      <YearSub userRole={userRole} {...props} />
    </div>
  );
}
export default SubscriptionTab;
