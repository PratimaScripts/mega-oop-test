import React from 'react'
import Switch from "react-switch";

function SubHeader({ timeLeft, setStates, viewPlan }) {

    return (
        <div className="col-md-12 text-center">
            {timeLeft && <h5>Next payment - {timeLeft}</h5>}

            <div className="monthly__annually--toggle">
                <span className="toggle__btn--space">Monthly</span>
                <Switch
                    onChange={() =>
                        setStates('viewPlan', viewPlan === "monthly" ? "yearly" : "monthly")
                    }
                    checked={viewPlan === "monthly" ? false : true}
                />
                <span className="toggle__btn--space">Annually</span>
            </div>
        </div>
    )
}
export default SubHeader