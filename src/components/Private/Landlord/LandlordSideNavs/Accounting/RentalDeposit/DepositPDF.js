import React from 'react';
//Vendor
import moment from 'moment';
import styled from '@react-pdf/styled-components';
import wordConvertor from 'number-to-words';
import { Document } from '@react-pdf/renderer';


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
  font-size: 14px;
  font-weight: bolder;
  text-transform: uppercase;
  text-align: center;
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
// const BillDataSerial = styled(BillDataNum)`
//   width: 5%;
// `;
const BillTotal = styled(BillColumnRight)`
  padding: 0;
`;

function DepositPDF({deposit}) {
  const {
    status,
    transactionDate,
    dueDate,
    currency = '£',
    paymentDate,
    note = 'Thank you very much!',
    taxType = 'inc',
    taxRate = 0,
    amount,
    userId,
    accountId,
    contactId
  } = deposit?.transaction;

  const amountPaid = status === "Paid" ? amount : 0;
  const amountDue = amount - amountPaid;
  const propertyName = deposit?.transaction?.propertyId?.title;
  const customerName = `${contactId.firstName} ${contactId.lastName}`
  const customerEmail = contactId.email

  
  const itemList = () => {
    return (
      <BillRow key={deposit._id}>
        <BillDataNum>{deposit.referenceId}</BillDataNum>
        <BillDataText>{accountId.accountName}</BillDataText>
        <BillDataText>{deposit.depositType}</BillDataText>
        <BillDataText>{deposit.depositProtectionScheme}</BillDataText>
        <BillDataNum>{amount.toFixed(2)}</BillDataNum>
      </BillRow>
    )
  }

  return (
    <Document>
      <BillPage>
      <InvoiceHeading>{deposit.depositIncomeType === "deposit-in" ? "Deposit Receipt Statement" : "Deposit Refund Statement"}</InvoiceHeading>

        <BillDetails>
          <BillColumnLeft style={{ marinTop: "20px" }}>
            <Details><b>From</b></Details>
            <Textt>{userId.firstName}
              {userId.middleName && userId.middleName}
              {' '}{userId.lastName && userId.lastName}</Textt>
            <DetailsSm>{propertyName}</DetailsSm>
            <DetailsSm>{userId.email}</DetailsSm>
            {userId.phoneNumber && <DetailsSm><b>Mobile :</b> {userId.phoneNumber}</DetailsSm>}


            <Details>
              Status : {status}
            </Details>
            {status === 'Paid' && <Details>Paid At : {moment(paymentDate).format('YYYY-MM-DD')}</Details>}

            <Textt></Textt>
          </BillColumnLeft>
          <BillColumnRight>
            <InvoiceNumber># Ref/{deposit.referenceId}</InvoiceNumber>
            <InvoiceNumber>
              Deposit Date : {moment(transactionDate).format('YYYY-MM-DD')}
            </InvoiceNumber>
            <InvoiceNumber>
              Due Date : {moment(dueDate).format('YYYY-MM-DD')}
            </InvoiceNumber>
            <Details style={{ marginTop: '20px' }}>To</Details>
            <Textt>{customerName}</Textt>
            <DetailsSm>{propertyName}</DetailsSm>
            <DetailsSm>{customerEmail}</DetailsSm>
          </BillColumnRight>
        </BillDetails>
        <BillTable style={{ marginTop: "20px" }}>
          <BillRowHead>
            <BillDataNum>Ref</BillDataNum>
            <BillDataText>Income Type</BillDataText>
            <BillDataText>Deposit Type</BillDataText>
            <BillDataText>Protection Type</BillDataText>
            <BillDataNum>Amount</BillDataNum>
          </BillRowHead>
        </BillTable>
        {itemList()}
        <BillDetails style={{ padding: '25px 5px' }}>
          <BillColumnLeft>
            <Details style={{ marginTop: '10px', textTransform: 'capitalize' }}><b>Total Amount in words:</b> {wordConvertor.toWords(amount)}</Details>
            <Details style={{ textTransform: 'capitalize' }}><b>Paid Amount in words:</b> {wordConvertor.toWords(amountPaid)}</Details>
            {note.length > 0 && (
              <Details style={{ marginTop: '50px' }}>Note : {note}</Details>

            )}
            <DetailsSm>Powered By - rentoncloud.com</DetailsSm>
          </BillColumnLeft>
          <BillColumnRight>
            <BillDetails>
              <BillTotal>
                <Details><b>Total Amount:</b></Details>
                {taxType > 0 && <Details> Tax {taxRate}% : </Details>}

                <Details><b>Total Due:</b></Details>

                {taxRate > 0 && taxType === 'inc' && (
                  <Details style={{ marginLeft: '-50%' }}>
                    Includes Tax {taxRate}%:{' '}
                  </Details>
                )}
              </BillTotal>
              <BillTotal>
                <Details>
                  {currency}{' '}
                  {amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Details>
                <Details>
                  {currency}{' '}
                  {amountDue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
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

export default DepositPDF;
