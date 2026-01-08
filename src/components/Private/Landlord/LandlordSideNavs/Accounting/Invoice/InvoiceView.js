import React, { useContext } from "react";
//Vendor
import styled from "styled-components";
import moment from "moment";
import wordConvertor from "number-to-words";
import { Modal, Button, Spin } from "antd";
import { InvoiceContext } from "store/contexts/invoiceContexts";

// Styles
const BillDocument = styled.div`
  max-width: 100%;
  overflow: auto;
  height: 600px;
`;
const BillPage = styled.div`
  max-width: 900px;
  width: 900px;
  overflow: auto;
  margin: 0 auto;
  padding: 1rem 2rem;
  box-shadow: 4px 4px 28px 10px rgba(240, 240, 240, 0.9);
`;
const BillDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem auto;
`;
const BillColumn = styled.div`
  width: 40%;
  border: red 2px solidcolor;
`;
const InvoiceHeading = styled.h1`
  font-size: 32px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const InvoiceNumber = styled.p`
  color: #444;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bolder;
`;

const BillRow = styled.div`
  display: grid;
  padding: 8px 0;

  grid-template-columns: 1fr 10fr 3fr 2fr 2fr 3fr;
`;
const BillHead = styled(BillRow)`
  background: #444;
  border-radius: 3px;
  color: white;
`;
const BillDataNum = styled.p`
  text-align: right;
  padding: 0 5px;
`;

const ShowRentalInvoice = ({ transactionDetail }) => {
  const taxType = "inc";
  const currencySign = "£";

  const landlord = transactionDetail?.contact?.landlord || {};
  const renter = transactionDetail?.contact?.renter || {};

  return (
    <BillDocument>
      <BillPage>
        <BillDetails>
          <BillColumn>
            <p>
              <b>From</b>
            </p>
            <h3>
              {landlord?.firstName}{" "}
              {landlord?.middleName && landlord?.middleName}{" "}
              {landlord?.lastName && landlord?.lastName}
            </h3>
            <p>{transactionDetail.property.title}</p>
            <p>{landlord?.email}</p>
            {/* {userId.phoneNumber && (
          <p>
            <b>Mobile :</b> {userId.phoneNumber}
          </p>
        )}
        <p> */}
            <b>Status :</b> {transactionDetail.status}
            {/* </p> */}
            {transactionDetail.status === "Paid" && (
              <p>
                <b>Paid At :</b>{" "}
                {moment(transactionDetail.paymentDate).format("YYYY-MM-DD")}
              </p>
            )}
          </BillColumn>

          <BillColumn style={{ textAlign: "right" }}>
            <InvoiceHeading>INVOICE</InvoiceHeading>
            <InvoiceNumber># Inv/{transactionDetail.invoiceNum}</InvoiceNumber>
            <InvoiceNumber>
              Invoice Date :{" "}
              {moment(transactionDetail.invoiceDate).format("YYYY-MM-DD")}
            </InvoiceNumber>
            <InvoiceNumber>
              Due Date :{" "}
              {moment(transactionDetail.dueDate).format("YYYY-MM-DD")}
            </InvoiceNumber>
            <p>
              <b>To</b>
            </p>
            <h3>
              {renter?.firstName} {renter?.lastName}
            </h3>
            <p>{renter?.email}</p>
          </BillColumn>
        </BillDetails>
        <BillHead>
          <BillDataNum>#</BillDataNum>
          <p>Income Type</p>
          <p>Description</p>
          <BillDataNum>Rate</BillDataNum>
          <BillDataNum>Quantity</BillDataNum>
          <BillDataNum>Amount</BillDataNum>
        </BillHead>
        {transactionDetail.transactions.map(
          ({ accountDetails, description, rate, quantity, id }, i) => (
            <BillRow key={id}>
              <BillDataNum>{i + 1}</BillDataNum>
              <p>{accountDetails?.accountName}</p>
              <p>{description}</p>
              <BillDataNum>{rate.toFixed(2)}</BillDataNum>
              <BillDataNum>{quantity}</BillDataNum>
              <BillDataNum>
                {parseFloat(rate) * parseFloat(quantity).toFixed(2)}
              </BillDataNum>
            </BillRow>
          )
        )}
        <BillDetails>
          <BillColumn>
            <p style={{ marginTop: "10px", textTransform: "capitalize" }}>
              <b>Total Amount in words:</b>{" "}
              {wordConvertor.toWords(transactionDetail.amount)}
            </p>
            <p style={{ textTransform: "capitalize" }}>
              <b>Paid Amount in words:</b>{" "}
              {wordConvertor.toWords(
                transactionDetail.status === "Paid"
                  ? transactionDetail.amount
                  : 0
              )}
            </p>
          </BillColumn>
          <BillColumn>
            <BillDetails>
              <BillColumn style={{ textAlign: "right" }}>
                <p>
                  <b>Total:</b>{" "}
                </p>
                {taxType > 0 && <p> Tax {transactionDetail.taxPercent}% : </p>}

                <p>
                  <b>Total Due:</b>{" "}
                </p>
              </BillColumn>
              <BillColumn style={{ textAlign: "right" }}>
                <p>
                  {currencySign}{" "}
                  {transactionDetail.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p>
                  {currencySign}{" "}
                  {(transactionDetail.amount - transactionDetail.status ===
                  "Paid"
                    ? transactionDetail.amount
                    : 0
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </BillColumn>
            </BillDetails>
          </BillColumn>
        </BillDetails>
      </BillPage>
    </BillDocument>
  );
};

const InvoiceView = (props) => {
  const { dispatch, state } = useContext(InvoiceContext);
  const { openInvoiceModal, transactionDetail, fetchingInvoiceById } = state;

  const handleEdit = () => {
    dispatch({ type: "CLOSE_INVOICE_MODAL" });
    dispatch({
      type: "UPDATE_INVOICE",
      payload: { ...transactionDetail, transactionType: "Business Income" },
    });
  };

  return (
    <Modal
      title="Invoice Detail"
      visible={openInvoiceModal}
      onOk={() => dispatch({ type: "CLOSE_INVOICE_MODAL" })}
      onCancel={() => dispatch({ type: "CLOSE_INVOICE_MODAL" })}
      width={950}
      maskClosable={false}
      style={{ top: 10 }}
      footer={[
        !props.disableEditing && (
          <Button key="back" onClick={() => handleEdit()}>
            Edit
          </Button>
        ),
        <Button
          key="submit"
          type="primary"
          onClick={() => dispatch({ type: "CLOSE_INVOICE_MODAL" })}
        >
          Ok
        </Button>,
      ]}
    >
      {fetchingInvoiceById ? (
        <div className="d-flex justify-content-center my-5">
          <Spin size="large" />
        </div>
      ) : (
        <ShowRentalInvoice transactionDetail={transactionDetail} />
      )}
    </Modal>
  );
};

export default InvoiceView;
