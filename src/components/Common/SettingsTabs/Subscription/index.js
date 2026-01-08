import React, { useState, useEffect, useContext } from "react";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import filter from "lodash/filter";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SubHistory from "./SubTabs/SubHistory";
import { Modal, Spin } from "antd";
import moment from "moment";
import "./style.scss";
import { UserDataContext } from "store/contexts/UserContext";
import { useLazyQuery, useMutation } from "react-apollo";
import AccountQueries from "config/queries/account";
import showNotification from "config/Notification";
import SubscriptionTab from "./SubTabs/SubscriptionTab";

const { confirm } = Modal;

const SubscriptionSetting = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const { userData } = userState;
  // const [yearlyPlans, setYearlyPlans] = useState();
  // const [monthlyPlans, setMonthlyPlans] = useState();
  const [states, setStates] = useState({
    paymentHistory: [],
    monthlyPremium: [],
    monthlyStandard: [],
    yearlyPremium: [],
    yearlyStandard: [],
    loading: true,
    viewPlan: get(userData, "selectedPlan.interval", "monthly"),
    selectedPlan: get(userData, "selectedPlan"),
  });

  const [getSubscriptionsPlans] = useLazyQuery(
    AccountQueries.getSubscriptionPlans,
    {
      onCompleted: ({ getPlanDetails }) => {
        if (getPlanDetails.success) {
          const monthlyPlans = filter(getPlanDetails.data, {
            interval: "monthly",
          });
          const yearlyPlans = filter(getPlanDetails.data, {
            interval: "yearly",
          });
          setStates({
            ...states,
            monthlyPremium: filter(monthlyPlans, {
              displayName: "Premium Monthly",
            }),
            monthlyStandard: filter(monthlyPlans, {
              displayName: "Standard Monthly",
            }),
            yearlyPremium: filter(yearlyPlans, {
              displayName: "Premium Yearly",
            }),
            yearlyStandard: filter(yearlyPlans, {
              displayName: "Standard Yearly",
            }),
            loading: false,
          });
        } else {
          // console.log("error");
          showNotification("error", "An error occurred!");
          setStates({ ...states, loading: false });
        }
      },
    }
  );

  const [fetchPaymentHistory] = useLazyQuery(
    AccountQueries.retrieveUserPaymentHistory,
    {
      onCompleted: ({ retrieveUserPaymentHistory }) => {
        if (retrieveUserPaymentHistory.success) {
          setStates({
            ...states,
            paymentHistory: retrieveUserPaymentHistory.data,
            loading: false,
          });
          // setpaymentHistory(retrieveUserPaymentHistory.data);
        } else {
          setStates({ ...states, loading: false });
        }
      },
    }
  );

  const [cancelSubscription] = useMutation(AccountQueries.cancelSubscription, {
    onCompleted: ({ cancelSubscription }) => {
      if (cancelSubscription?.success) {
        showNotification(
          "success",
          "Plan Updated",
          cancelSubscription?.message
        );
      } else {
        showNotification(
          "error",
          "There was an error selecting the plan",
          cancelSubscription?.message
        );
      }
    },
  });

  const [buySubscription] = useMutation(AccountQueries.buySubscription, {
    onCompleted: ({ createUserSubscription }) => {
      if (createUserSubscription.success) {
        // setpaymentHistory(createUserSubscription.data.paymentHistory);
        setStates({
          ...states,
          paymentHistory: createUserSubscription.data.paymentHistory,
          selectedPlan: createUserSubscription.data.selectedSubscription,
        });
        showNotification("success", "Plan Updated", "");
      } else {
        showNotification(
          "error",
          "There was an error selecting the plan",
          createUserSubscription.message
        );
      }
    },
  });

  useEffect(() => {
    getSubscriptionsPlans();
    fetchPaymentHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buySubscriptionModal = (plan) => {
    confirm({
      title: "Are you sure you want to proceed with buying this plan?",
      content: (
        <p>
          You have selected the{" "}
          <b>
            {plan[0].displayName}, which costs {`£${plan[0].amount}`}
          </b>
          , do you want to proceed?
        </p>
      ),
      onOk: () => buySubscription({ variables: { planId: plan[0].planId } }),
      onCancel() {},
    });
  };

  const cancelSubscriptionModal = (plan) => {
    confirm({
      title: "Are you sure you want to cancel this plan?",
      okText: "Continue",
      onOk: () => cancelSubscription({ variables: { planId: plan[0].planId } }),
      onCancel: () => {},
    });
  };

  let timeLeft;
  if (!isEmpty(states.selectedPlan)) {
    const now = moment(states.selectedPlan["createDate"]); //todays date
    const end = moment(states.selectedPlan["expireDate"]); // another date

    timeLeft = now.to(end);
  }

  return (
    <>
      {states.loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin tip="Loading..." />
        </div>
      ) : (
        <Tabs className="subs__tabs">
          <TabList>
            <Tab>Subscription</Tab>
            <Tab>Billing</Tab>
          </TabList>
          <TabPanel>
            <SubscriptionTab
              {...states}
              timeLeft={timeLeft}
              setStates={(key, val) => {
                setStates({
                  ...states,
                  [key]: val,
                });
              }}
              buySubscriptionModal={buySubscriptionModal}
              cancelSubscriptionModal={cancelSubscriptionModal}
            />
          </TabPanel>
          <TabPanel>
            <SubHistory
              paymentHistoryUpdated={states.paymentHistory}
              {...props}
            />
          </TabPanel>
        </Tabs>
      )}
    </>
  );
};

export default SubscriptionSetting;
