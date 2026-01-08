import React from "react";
import ComingSoon from "components/layout/emptyviews/ComingSoon"
import ApplicationDashboard from "./applicationlayout"

const Application = (props) => {
    return process.env.REACT_APP_AUTH_TOKEN === "dev_token"? <ApplicationDashboard /> : <ComingSoon />
}

export default Application;
