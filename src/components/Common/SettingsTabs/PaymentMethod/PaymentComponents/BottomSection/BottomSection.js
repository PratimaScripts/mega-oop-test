import React, { useContext } from "react";
import MyNumberInput from "config/CustomNumberInput";
import { useHistory } from "react-router-dom";
import CardSetupForm from "../../CardSetupForm";
import { UserDataContext } from "store/contexts/UserContext";

const BottomSection = ({
  userRole,
  errors,
  isHovered,
  values,
  setFieldValue,
  isSortCodeValid,
  setStates,
  isBankAcNumberValid,
  submitBtnRef,
}) => {
  const history = useHistory();
  const {
    state,
    // dispatch
  } = useContext(UserDataContext);

  return (
    <section>
      <p className="label__title">How do you want to pay?</p>
      <div className="col-lg-12 mt-0 p-0">
        {userRole === "servicepro" && (
          <p>
            We do not process any payment without your authorisation of
            transaction. These detail are used for profile verification purposes
            only.
          </p>
        )}
        {userRole === "landlord" && (
          <p>
            We do not process any payment without your authorization of
            transaction. These details are used for card verification and once
            you are ready to subscribe the product or pay for accepted
            maintenance task offer price, you will be required to pay for the
            task using these cards with applicable added security by Stripe
            Connect. Payment will be held securely until the task is completed
            and you release payment to the ServicePro.
          </p>
        )}
        {userRole === "renter" && (
          <p>
            We do not process any payment without your authorisation of
            transaction. These detail are used for profile verification and once
            you are ready to rent, it may further be used for direct debit
            rental payment to landlord based on your authorisation.
          </p>
        )}

        {userRole === "renter" && (
          <div className="card card_wrap" style={{ marginBottom: "3%" }}>
            <div className="card-body">
              <h5 className="card-title">Bank *</h5>
              <div className="row"></div>

              <div className="form-row">
                <div
                  className="form-group col-md-6"
                  onMouseOver={() => setStates(false, "isHovered")}
                  onMouseOut={() => setStates(true, "isHovered")}
                >
                  <label>Enter Bank Code</label>

                  <MyNumberInput
                    placeholder="Bank Code/Sort code"
                    required
                    className={
                      errors && errors["bankCode"]
                        ? "form-control error__field_show"
                        : "form-control"
                    }
                    disabled={isHovered}
                    format="##-##-##"
                    mask="_"
                    value={values?.bankCode || ""}
                    onValueChange={(val) => {
                      setFieldValue("bankCode", val.value);
                      val.value.length < 6
                        ? setStates(false, "isSortCodeValid")
                        : setStates(true, "isSortCodeValid");
                    }}
                  />
                  {!isSortCodeValid && (
                    <p className="error__class">Incomplete Sort Code!</p>
                  )}
                </div>
                <div
                  className="form-group col-md-6"
                  onMouseOver={() => setStates(false, "isHovered")}
                  onMouseOut={() => setStates(true, "isHovered")}
                >
                  <label>Enter Account Number</label>
                  <MyNumberInput
                    placeholder="Bank Account Number"
                    required
                    disabled={isHovered}
                    className={
                      errors && errors["accountNumber"]
                        ? "form-control error__field_show"
                        : "form-control"
                    }
                    format="########"
                    mask="_"
                    value={values?.accountNumber || ""}
                    onValueChange={(val) => {
                      setFieldValue("accountNumber", val.value);
                      val.value.length < 8
                        ? setStates(false, "isBankAcNumberValid")
                        : setStates(true, "isBankAcNumberValid");
                    }}
                  />
                  {!isBankAcNumberValid && (
                    <p className="error__class">Incomplete Account Number!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="d-flex"></div>
        <CardSetupForm userData={state.userData} />
      </div>
      <div style={{ clear: "both" }}></div>

      {userRole === "landlord" && (
        <div className="row mb-1 mt-4">
          <div className="col-md-6 btns">
            <a
              href
              className="btn btn-outline-primary btn-block mb-3"
              onClick={() => history.push(`/${userRole}/settings/persona`)}
            >
              {" "}
              Skip at this moment{" "}
            </a>
          </div>
          <div className="col-md-6 btns">
            <button
              ref={submitBtnRef}
              type="submit"
              className="btn btn-primary btn-block"
              // disabled={isButtonDisabled}
              disabled={
                (isBankAcNumberValid ? false : true) ||
                (isSortCodeValid ? false : true)
              }
            >
              {" "}
              Save &amp; next{" "}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
export default BottomSection;
