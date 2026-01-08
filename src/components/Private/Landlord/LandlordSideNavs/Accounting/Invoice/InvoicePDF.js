import React from "react";
//Vendor
import moment from "moment";
import styled from "@react-pdf/styled-components";
import wordConvertor from "number-to-words";
import { Document } from "@react-pdf/renderer";

const BillPage = styled.Page`
  padding: 40px 40px;
`;

const BillDetails = styled.View`
  display: table;
  width: auto;
  margin: 0 auto;
  flex-direction: row;
`;

const BillColumnLeft = styled.View`
  width: 50%;
  padding-right: 50px;
  padding-left: 0px;

  text-align: left;
`;
const BillColumnRight = styled(BillColumnLeft)`
  padding-left: 50px;
  padding-right: 0px;
  text-align: right;
`;

const InvoiceHeading = styled.Text`
  font-size: 30px;
  font-weight: bolder;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: right;
  width: 100%;
`;
const InvoiceNumber = styled.Text`
  color: #444;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bolder;
`;

const Details = styled.Text`
  font-size: 12;
  padding: 5px 0;
  line-height: 1.2;
`;
const DetailsSm = styled.Text`
  font-size: 10;
  padding: 5px 0;
  line-height: 1.2;
`;

const Textt = styled.Text`
  padding: 5px 0;
`;

const BillTable = styled.View`
  display: table;
  width: 100%;
`;
const BillRow = styled.View`
  margin: 0 auto;
  flex-direction: row;
  padding: 8px 0;
`;
const BillRowHead = styled(BillRow)`
  background-color: #333;
  font-size: 15px;
  border-radius: 2px;
  color: white;
`;
const BillDataText = styled.Text`
  width: 25%;
  padding: 0 5px;
  font-size: 12px;
`;
const BillDataNum = styled.Text`
  width: 15%;
  text-align: right;
  padding: 0 5px;
  font-size: 12px;
`;
const BillDataSerial = styled(BillDataNum)`
  width: 5%;
`;
const BillTotal = styled(BillColumnRight)`
  padding: 0;
`;

function InvoicePDF(props) {
  const {
    status,
    invoiceNum,
    invoiceDate,
    dueDate,
    currency = "£",
    paymentDate,
    note = "Thank you very much!",
    taxType = "inc",
    taxRate = 0,
    transactions,
    amount,
    contact,
  } = props.invoice;

  const customerName = `${contact.renter.firstName} ${contact.renter.lastName}`;
  const email = contact.renter.email;
  const amountPaid = status === "Paid" ? amount : 0;
  const amountDue = amount - amountPaid;
  const propertyName = props.invoice.property.title;

  const itemList = transactions.map(
    ({ accountDetails, description, rate, quantity, _id }, i) => {
      const price = parseFloat(rate) * parseFloat(quantity);
      return (
        <BillRow key={_id}>
          <BillDataSerial>{i + 1}</BillDataSerial>
          <BillDataText>{accountDetails.accountName}</BillDataText>
          <BillDataText>{description}</BillDataText>
          <BillDataNum>{rate.toFixed(2)}</BillDataNum>
          <BillDataNum>{quantity}</BillDataNum>
          <BillDataNum>{price.toFixed(2)}</BillDataNum>
        </BillRow>
      );
    }
  );

  return (
    <Document>
      <BillPage>
        <BillDetails>
          <BillColumnLeft style={{ marinTop: "20px" }}>
            <Details>
              <b>From</b>
            </Details>
            <Textt>
              {props?.invoice?.contact?.landlord?.firstName || ""}
              {(props?.invoice?.contact?.landlord?.middleName &&
                props?.invoice?.contact?.landlord?.middleName) ||
                ""}
              {(props?.invoice?.contact?.landlord?.lastName &&
                props?.invoice?.contact?.landlord?.lastName) ||
                ""}
            </Textt>
            <DetailsSm>{propertyName}</DetailsSm>
            <DetailsSm>
              {props?.invoice?.contact?.landlord?.email || ""}
            </DetailsSm>
            {props?.invoice?.contact?.landlord?.phoneNumber && (
              <DetailsSm>
                <b>Mobile :</b> {props?.invoice?.contact?.landlord?.phoneNumber}
              </DetailsSm>
            )}

            <Details>Status : {status}</Details>
            {status === "Paid" && (
              <Details>
                Paid At : {moment(paymentDate).format("YYYY-MM-DD")}
              </Details>
            )}

            <Textt></Textt>
          </BillColumnLeft>
          <BillColumnRight>
            <InvoiceHeading>INVOICE</InvoiceHeading>
            <InvoiceNumber># Inv/{invoiceNum}</InvoiceNumber>
            <InvoiceNumber>
              Invoice Date : {moment(invoiceDate).format("YYYY-MM-DD")}
            </InvoiceNumber>
            <InvoiceNumber>
              Due Date : {moment(dueDate).format("YYYY-MM-DD")}
            </InvoiceNumber>
            <Details style={{ marginTop: "20px" }}>To</Details>
            <Textt>{customerName}</Textt>
            <DetailsSm>{propertyName}</DetailsSm>
            <DetailsSm>{email}</DetailsSm>
          </BillColumnRight>
        </BillDetails>
        <BillTable style={{ marginTop: "20px" }}>
          <BillRowHead>
            <BillDataSerial>#</BillDataSerial>
            <BillDataText>Income Type</BillDataText>
            <BillDataText>Desription</BillDataText>
            <BillDataNum>Rate</BillDataNum>
            <BillDataNum>Quantity</BillDataNum>
            <BillDataNum>Amount</BillDataNum>
          </BillRowHead>
        </BillTable>
        {itemList}
        <BillDetails style={{ padding: "25px 5px" }}>
          <BillColumnLeft>
            <Details style={{ marginTop: "10px", textTransform: "capitalize" }}>
              <b>Total Amount in words:</b> {wordConvertor.toWords(amount)}
            </Details>
            <Details style={{ textTransform: "capitalize" }}>
              <b>Paid Amount in words:</b> {wordConvertor.toWords(amountPaid)}
            </Details>
            {note.length > 0 && (
              <Details style={{ marginTop: "50px" }}>Note : {note}</Details>
            )}
            <DetailsSm>Powered By - rentoncloud.com</DetailsSm>
          </BillColumnLeft>
          <BillColumnRight>
            <BillDetails>
              <BillTotal>
                <Details>
                  <b>Total Amount:</b>
                </Details>
                {taxType > 0 && <Details> Tax {taxRate}% : </Details>}

                <Details>
                  <b>Total Due:</b>
                </Details>

                {taxRate > 0 && taxType === "inc" && (
                  <Details style={{ marginLeft: "-50%" }}>
                    Includes Tax {taxRate}%:{" "}
                  </Details>
                )}
              </BillTotal>
              <BillTotal>
                <Details>
                  {currency}{" "}
                  {amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Details>
                <Details>
                  {currency}{" "}
                  {amountDue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Details>
              </BillTotal>
            </BillDetails>
          </BillColumnRight>
        </BillDetails>
      </BillPage>
    </Document>
  );
}

export default InvoicePDF;
