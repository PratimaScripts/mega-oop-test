import React, { useEffect, useState, useRef, useContext } from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import axios from "axios";
import About from "./AboutScreeningReview";
import Connect from "./ConnectScreeningReview";
import showNotification from "../../../config/Notification";
import ShowLoadingMessage from "../../../config/ShowLoadingMessage";
import validateBank from "../../../config/ValidateBankAccount";
import AccountQueries from "../../../config/queries/account";
import MyNumberInput from "../../../config/CustomNumberInput";
import { UserDataContext } from "store/contexts/UserContext";
import { Formik, Form } from "formik";

import "./styles.scss";

const ScreeningInitial = (props) => {
  let bankBtn = useRef();
  const { state: userState } = useContext(UserDataContext);
  const { profileInfo } = userState;
  const [bankSaveMode, setBankSaveMode] = useState(false);

  const {
    ProfileAbout: userDataAbout,
    ProfileBankData: bankDetails,
    ProfileConnect: connectInformation,
  } = profileInfo;

  const [nationalities, setNationalities] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.github.com/gists/2aae12314d5419365bc3cae033239273")
      .then((res) => {
        setNationalities(
          JSON.parse(res.data.files["nationalities.json"].content)
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveBankData = async (bankData) => {
    // props.contextData.startLoading();

    ShowLoadingMessage("Validating Bank Details...");

    let validateBankResponse = await validateBankAccount(
      bankData.bankCode,
      bankData.accountNumber
    );

    let isCorrectBankDetails = filter(validateBankResponse.data.Items, {
      IsCorrect: true,
    });

    bankData = {
      accountDetail: {
        ...bankData,
        ...get(validateBankResponse, "data.Items[0]"),
      },
    };

    if (isCorrectBankDetails && isCorrectBankDetails.length === 0) {
      let details = filter(validateBankResponse.data.Items, {
        IsCorrect: false,
      });
      showNotification(
        "error",
        "Bank Details Are Incorrect!",
        get(details[0], "StatusInformation")
      );
      // props.contextData.endLoading();
    } else {
      // console.log("");
    }

    const saveBankDetailsQuery = await props.client.mutate({
      mutation: AccountQueries.saveBankDetails,
      variables: bankData,
    });

    if (
      !isEmpty(saveBankDetailsQuery.data.updateBankDetail) &&
      get(saveBankDetailsQuery, "data.updateBankDetail.success")
    ) {
      showNotification(
        "success",
        "Details Updated!",
        "Bank Details have been updated!"
      );

      // props.contextData.endLoading();
      setBankSaveMode(false);
    } else {
      showNotification(
        "error",
        "An error occured",
        get(saveBankDetailsQuery, "data.updateBankDetail.message")
      );
      // props.contextData.endLoading();
    }
  };

  const validateBankAccount = async (sortCode, acNumber) => {
    let validateResponse = await validateBank(sortCode, acNumber);
    return validateResponse;
  };

  let SaveButton = bankSaveMode ? (
    <button
      type="button"
      onClick={() => bankBtn.current.click()}
      className="btn__edit--screening"
    >
      <i className="far fa-save" /> Save
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setBankSaveMode(true)}
      className="btn__edit--screening"
    >
      <i className="fas fa-edit" /> Edit
    </button>
  );

  return (
    <>
      <div className={`main__container_about ${props.responsiveClasses}`}>
        <About
          nationalities={nationalities}
          userDataAbout={userDataAbout}
          {...props}
        />

        <Connect connectInformation={connectInformation} {...props} />

        <Formik
          enableReinitialize
          initialValues={{ ...bankDetails }}
          onSubmit={(values, { validateForm, setSubmitting }) => {
            setSubmitting(true);
            saveBankData(values);
          }}
        >
          {({ isSubmitting, setFieldValue, values, errors }) => (
            <Form>
              <div className="tab__details">
                <div className="container-fluid">
                  <div className="row">
                    <div className="screening__card">
                      <div className="screening__bank--listing">
                        <div className="heading__edit">
                          <h4>Bank Details</h4>
                          {SaveButton}
                        </div>
                        <div className={!bankSaveMode && "cover"}>
                          <ul>
                            <li>
                              <div className="form-group">
                                <label className="labels__global">
                                  <span>Bank Code</span>
                                </label>
                                <MyNumberInput
                                  placeholder="Bank Code/Sort code"
                                  className="input__global"
                                  format="##-##-##"
                                  mask="_"
                                  value={values.bankCode}
                                  onValueChange={(val) =>
                                    setFieldValue("bankCode", val.value)
                                  }
                                />
                              </div>
                            </li>
                            <li>
                              <div className="form-group">
                                <label className="labels__global">
                                  <span>Bank Account</span>
                                </label>
                                <MyNumberInput
                                  placeholder="Bank Account Number"
                                  className="input__global"
                                  format="########"
                                  mask="_"
                                  value={values.accountNumber}
                                  onValueChange={(val) => {
                                    setFieldValue("accountNumber", val.value);
                                  }}
                                />
                              </div>
                            </li>
                            <button type="submit" hidden ref={bankBtn}>
                              save
                            </button>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ScreeningInitial;
