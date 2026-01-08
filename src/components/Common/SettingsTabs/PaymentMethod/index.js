import React, { useState, useRef, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
// import {
//   message
// } from "antd";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
// import UserQueries from "config/queries/login";
import Seperator from "components/Common/PublicComps/Seperator";
import validateBank from "config/ValidateBankAccount";
import "./style.scss";
import filter from "lodash/filter";
import { useHistory } from "react-router-dom";
import UserRoleQuery from "config/queries/userRole";
import { UserDataContext } from "store/contexts/UserContext";
import ShowLoadingMessage from "config/ShowLoadingMessage";
import showNotification from "config/Notification";
import AccountQueries from "config/queries/account";
import TopSection from "./PaymentComponents/TopSection/TopSection";
import BottomSection from "./PaymentComponents/BottomSection/BottomSection";
import { getState } from "./PaymentState";
import { getStripeAccountStatus } from "config/queries/stripe";
// import payment from "config/queries/payment";

const BankCard = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserDataContext);
  let refContainer = useRef();
  let submitBtnRef = useRef();
  const [states, setState] = useState(getState())
  let userData = state.userData;
  let userRole = state.userData.role;
  let bankDetails = state.profileInfo.ProfileBankData;
  const updatePaymentInfo = useRef(true);
  history.listen((location, action) => {
    if (updatePaymentInfo.current && states.isSortCodeValid && states.isBankAcNumberValid) {
      submitBtnRef.current?.click();
      updatePaymentInfo.current = false;
    }
  });
  // const [updateStripeConnectPreference, { loading }] = useLazyQuery(
  //   UserQueries.stripeConnectApi,
  //   {
  //     onCompleted: (fetchedResponse) => {
  //       if (get(fetchedResponse, "stripeConnectAuthorization.success")) {
  //         let udata = get(fetchedResponse, "stripeConnectAuthorization.data");
  //         dispatch({
  //           type: "UPDATE_STRIPE_CONNECT",
  //           payload: {
  //             data: udata["connected_account_id"],
  //             status: udata["isStripeConnectActive"],
  //           },
  //         });
  //       }
  //       if (!get(fetchedResponse, "stripeConnectAuthorization.success")) {
  //         message.error(
  //           get(fetchedResponse, "stripeConnectAuthorization.message")
  //         );
  //       }
  //     },
  //   }
  // );

  const toggleSelection = (event) => {
    if (event.target.id !== "" && states.connectAccId === "" && states.transferwise === "") {
      setState({
        ...states,
        paymentType: event.target.id
      })
    }
    if (event.target.id !== "" && !states.paymentType) {
      setState({
        ...states,
        paymentType: event.target.id
      })
    }
  };

  useEffect(() => {
    setState({ ...states, paymentType: bankDetails?.accountDetail?.accountNumber ? "manual" : "" })

    //eslint-disable-next-line
  }, [bankDetails]);

  // Get user payment type
  const [getPayType] = useLazyQuery(UserRoleQuery.getUserPaymentType, {
    onCompleted: async ({ getUserPaymentType: { paymentType, stripeConnectAccId, transferwise } }) => {
      setState({
        ...states,
        paymentType: paymentType === "bank" ? "manual" : paymentType === "" ? "" : "automatic",
        connectAccId: (paymentType === "stripe" &&
          stripeConnectAccId !== "") ? stripeConnectAccId : '',
        transferwise: (paymentType === "bank" && transferwise !== "") ? transferwise.accountId : ""
      })
      if (
        paymentType === "stripe" &&
        stripeConnectAccId !== ""
      ) {
        getStripeAccData(stripeConnectAccId, {
          ...states,
          paymentType: paymentType === "bank" ? "manual" : 'automatic',
          connectAccId: (paymentType === "stripe" &&
            stripeConnectAccId !== "") ? stripeConnectAccId : '',
        });
      }
    },
    onError: (error) => {
      showNotification(
        "error",
        "An error occurred!"
      );
    }
  });
  // getStripeAccountStatus
  const [getStripeAccData] = useLazyQuery(getStripeAccountStatus, {

    onCompleted: async ({ getStripeAccountStatus }) => {
      // console.log(`getStripeAccountStatus`, getStripeAccountStatus)
      setState({
        ...states,
        showComplete: getStripeAccountStatus !== 'error' ? true : false
      })
    },
    onError: (error) => {
      showNotification(
        "error",
        "An error occurred!"
      );
    }
  });

  useEffect(() => {
    getPayType();
    //eslint-disable-next-line
  }, []);

  const validateBankAccount = async (sortCode, acNumber) => {
    let validateResponse = await validateBank(sortCode, acNumber);
    return validateResponse;
  };

  const [saveBankDetailsMutation] = useMutation(
    AccountQueries.saveBankDetails,
    {
      onCompleted: ({ updateBankDetail }) => {
        if (updateBankDetail.success) {
          showNotification(
            "success",
            "Details Updated!",
            "Bank Details have been updated!"
          );
          dispatch({
            type: "UPDATE_BANK_DETAILS",
            payload: updateBankDetail.data.accountDetail,
          });
          return history.push(`/${userData.role}/settings/payment-method`);
        } else {
          // showNotification(
          //   "error",
          //   "An error occured",
          //   updateBankDetail.message
          // );
        }
      },
    }
  );

  const saveBankData = async (bankData) => {
    // this.context.startLoading();

    ShowLoadingMessage("Validating Bank Details...");

    let validateBankResponse = await validateBankAccount(
      bankData.bankCode,
      bankData.accountNumber
    );

    bankData = {
      accountDetail: {
        ...bankData,
        ...get(validateBankResponse, "data.Items[0]"),
      },
    };
    let isCorrectBankDetails = filter(validateBankResponse.data.Items, {
      IsCorrect: true,
    });

    if (isCorrectBankDetails && isCorrectBankDetails.length === 0) {
      let details = filter(validateBankResponse.data.Items, {
        IsCorrect: false,
      });
      showNotification(
        "error",
        "Bank Details Are Incorrect!",
        get(details[0], "StatusInformation")
      );
      // this.context.endLoading();
    } else {
      saveBankDetailsMutation({ variables: bankData });
    }
  };

  //handling the bank account details modal
  const [showTransferWiseBankModal, setShowTransferWiseBankModal] =
    useState(false);

  const showModal = (bool) => {
    setShowTransferWiseBankModal(bool);
  };

  return (
    <>
      <Formik
        ref={refContainer}
        enableReinitialize
        initialValues={bankDetails?.accountDetail}
        onSubmit={(values, { validateForm, setSubmitting }) => {
          setSubmitting(true);
          if (
            get(values, "accountNumber", "123").length === 8 &&
            get(values, "bankCode", "123").length === 6
          ) {
            saveBankData(values);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values, errors }) => (
          <Form>
            <div className="card_wrap">
              {userRole !== "renter" && (
                <TopSection
                  {...states}
                  userRole={userRole}
                  setStates={(val, key) => {
                    setState({ ...states, [key]: val });
                  }}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                  toggleSelection={toggleSelection}
                  showTransferWiseBankModal={showTransferWiseBankModal}
                  showModal={showModal}
                />
              )}
              
              {userRole !== "renter" && (
                <Seperator background="#d09d09" height="2px" />
              )}
              <BottomSection
                userRole={userRole}
                {...states}
                setStates={(val, key) => {
                  setState({ ...states, [key]: val })
                }}
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
                submitBtnRef={submitBtnRef}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default withRouter(BankCard);
