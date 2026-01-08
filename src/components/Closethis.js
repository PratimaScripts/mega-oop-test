import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Spin, Progress, message } from "antd";
import UserQueries from "../config/queries/login";

import get from "lodash/get";

const Comp = props => {
  const [isLoading, setLoadingStatus] = useState(true);
  const [stripeToken] = useState(
    get(window, "location.search") &&
      get(window, "location.search").includes("code=") &&
      get(window, "location.search").split("code=")
  );
  useQuery(UserQueries.stripeConnectApi, {
    variables: {
      token: get(stripeToken, "[1]", "123455"),
      status: true
    },
    onCompleted: data => {
      if (get(data, "stripeConnectAuthorization.success")) {
        message.success("Stripe Account Connected!");
        localStorage.setItem(
          "StripeaccountToken",
          get(data, "stripeConnectAuthorization.data")
        );
        setLoadingStatus(false);
        setTimeout(() => {
          window.close();
        }, 1500);
      } else {
        message.error(get(data, "stripeConnectAuthorization.message"));
        setTimeout(() => {
          window.close();
        }, 1500);
      }
    }
  });

  useEffect(() => {
    // setTimeout(() => {
    //   window.close();
    // }, 2000);
  }, []);
  return (
    <Spin
      spinning={isLoading}
      tip={
        <>
          <p>Please wait while we connect your account with Stripe...</p>
          <Progress percent={80} showInfo={false} status="active" />
        </>
      }
    >
      <div style={{ width: "100%", height: "100vh" }}></div>
    </Spin>
  );
};

export default Comp;
