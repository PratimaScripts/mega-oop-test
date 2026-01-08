import React, { useEffect } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { Modal, Input, Row, Col, Spin, notification } from "antd";
import MyNumberInput from "config/CustomNumberInput";
import { useMutation } from "react-apollo";
import { createWiseAccount as createWiseAccountMutation } from "config/queries/transferwise";
import showNotification from "config/Notification";

const FooterPayment = ({
  setStates,
  userRole,
  paymentType,
  accHolderName,
  accHolErr,
  accSortCode,
  errors,
  sortCodeErr,
  accNumber,
  bankAccNumberErr,
  isHovered,
  values,
  setFieldValue,
  isSortCodeValid,
  isBankAcNumberValid,
  showTransferWiseBankModal,
  showModal,
  transferwise,
}) => {
  const openNotificationWithIcon = (type, title, msg) => {
    notification[type]({
      message: title,
      description: msg,
    });
  };

  const [
    createWiseAccountQL,
    { error: createAccountErrors, loading: createAccountLoading },
  ] = useMutation(createWiseAccountMutation, {
    onCompleted: (data) => {
      if (data) {
        showModal(false);
        return showNotification(
          "success",
          "Wise account created successfully!"
        );
      }
    },
  });

  useEffect(() => {
    createAccountErrors &&
      createAccountErrors.graphQLErrors &&
      createAccountErrors.graphQLErrors.map((error) =>
        showNotification("error", "An error occurred!", error.message)
      );
  }, [createAccountErrors]);

  //creating a wise account
  const createWiseAccount = async () => {
    // return alert("created")
    if (!accHolderName)
      return openNotificationWithIcon(
        "error",
        "An error occurred!",
        "Please enter your first and last name!"
      );

    var regex = /^[A-Za-z ]+$/;
    var isValid = regex.test(accHolderName);

    if (!isValid || !/\s/.test(accHolderName) || accHolderName.length < 6) {
      // setAccHolErr("Please enter your first and last name.");
      return setStates("Please enter your first and last name.", "accHolErr");
    }

    if (accSortCode === 0) {
      // return setSortCodeErr("Please enter a Sort Code");
      return setStates("Please enter a Sort Code", sortCodeErr);
    }

    if (accNumber === 0) {
      // return setBankAccNumberErr("Please enter an Account Number");
      return setStates("Please enter an Account Number", bankAccNumberErr);
    }
    // createWiseAccount
    createWiseAccountQL({
      variables: {
        accountDetails: {
          sortCode: accSortCode,
          accountNumber: accNumber,
          accountName: accHolderName,
        },
      },
    });
  };

  return (
    <div
      className="card m-5"
      style={{ display: paymentType === "manual" ? "block" : "none" }}
    >
      {userRole === "servicepro" && (
        <>
          <div className="card-body" style={{ display: "block" }}>
            <div className="connectedTickDiv">
              <h5 className="card-title">Wise</h5>
              {paymentType === "manual" && transferwise !== "" && (
                <CheckCircleFilled className="connectedTick" />
              )}
            </div>
            {/* <h5 className="card-title">Transferwise</h5> */}
            <p className="card-text">
              Wise bank transfer allows the app to payout your net earning to
              the given bank account. Upon task completion and release of money
              by the Task owner, you will need to navigate to ‘My Money’ and
              raise a payout request on a periodical interval of 20 days. Once
              you're connected successfully, you will not be able to revert back
              the settings to Automatic payout. Reach out to our support team
              for any change requests.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => showModal(true)}
              disabled={paymentType === "manual" && transferwise ? true : false}
            >
              {transferwise ? "Connected to Wise" : "Connect"}
            </button>
            <Modal
              title="Bank Account Details"
              visible={showTransferWiseBankModal}
              okText="Submit"
              onOk={createWiseAccount}
              onCancel={() => showModal(false)}
            >
              <div>
                <Spin spinning={createAccountLoading}>
                  <Row gutter={[8, 16]}>
                    <Col span={24}>
                      <label>Enter Account Holder's Name</label>
                      <Input
                        placeholder="Accont Holder's Name"
                        type="text"
                        value={accHolderName}
                        onChange={(e) => {
                          accHolErr !== "" && setStates("", "accHolErr");
                          setStates(e.target.value, "accHolderName");
                          // setAccHolderName(e.target.value);
                          // console.log("acch", accHolderName);
                        }}
                      />
                      <i>
                        <p
                          style={{
                            marginBottom: "0",
                            color: "red",
                          }}
                        >
                          {accHolErr}
                        </p>
                      </i>
                    </Col>
                    <Col span={24}>
                      <label>Enter Bank Code</label>

                      <MyNumberInput
                        placeholder="Bank Code/Sort code"
                        required
                        className={
                          errors && errors["bankCode"]
                            ? "ant-input error__field_show"
                            : "ant-input"
                        }
                        format="######"
                        value={accSortCode}
                        onChange={(e) => {
                          // console.log(e.target.value)
                          sortCodeErr !== "" && setStates("", "sortCodeErr");
                          // setSortCodeErr("");
                          setStates(e.target.value, "accSortCode");
                          // setAccSortCode(e.target.value);
                          // console.log(accSortCode);
                        }}
                      />
                      <p
                        style={{
                          marginBottom: "0",
                          color: "red",
                        }}
                      >
                        {sortCodeErr}
                      </p>
                    </Col>
                    <Col span={24}>
                      <label>Enter Account Number</label>
                      <MyNumberInput
                        placeholder="Bank Account Number"
                        required
                        className={
                          errors && errors["accountNumber"]
                            ? "ant-input error__field_show"
                            : "ant-input"
                        }
                        format="########"
                        value={accNumber}
                        onChange={(e) => {
                          bankAccNumberErr !== "" &&
                            setStates("", "bankAccNumberErr");
                          setStates(e.target.value, "accNumber");
                        }}
                      />
                      <i>
                        <p
                          style={{
                            marginBottom: "0",
                            color: "red",
                          }}
                        >
                          {bankAccNumberErr}
                        </p>
                      </i>
                    </Col>
                  </Row>
                </Spin>
              </div>
            </Modal>
          </div>
        </>
      )}
      {userRole === "landlord" && (
        <>
          <div className="card-body">
            <h5 className="card-title">Bank *</h5>
            <div className="row">
              {/* <div className="col-sm-6 text-right">
                          <div className="btn btn-warning">Edit</div>
                          </div> */}
              <p style={{ padding: "1.25rem" }}>
                Under this method, your rental invoices document along with the
                bank account number will be shared with Renters to make payments
                directly to your bank account. You will have to mark invoice as
                paid manually after verifying your bank statement.
              </p>
            </div>

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
        </>
      )}
    </div>
  );
};

export default FooterPayment;
