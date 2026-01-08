import { gql } from "apollo-boost";
import { USER_DATA_RESPONSE } from "./invoice";

export const TRANSACTION_RESPONSE = gql`
  fragment transactionResponse on Transaction {
    _id
    userId {
      _id
      firstName
      lastName
      email
    }
    propertyId {
      _id
      title
    }
    contactId
    status
    additionalInfo
    transactionDate
    invoice
    invoiceNum
    rate
    quantity
    description
    taxRate
    dueDate
    property
    paymentDate
    paymentMethod
    transactionType
    images
    account
    accountId {
      _id
      accountName
    }
    amount
    doneByLandlordOn
    doneByRenterOn
    rentalInvoice {
      status
      paymentMethod
      paymentDate
    }
  }
`;

let fetchTransactions = gql`
  query getTransactionList {
    getTransactionList {
      message
      success
      data {
        businessExpenses {
          ...transactionResponse
        }
        businessIncome {
          ...transactionResponse
        }
      }
    }
  }
  ${TRANSACTION_RESPONSE}
`;

const deleteTransaction = gql`
  mutation deleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      message
      success
      data {
        _id
        transactionType
      }
    }
  }
`;

const deleteInvoiceTransaction = gql`
  mutation deleteInvoiceTransaction($id: [ID]!) {
    deleteInvoiceTransaction(id: $id) {
      message
      success
      data {
        id
        transactionType
      }
    }
  }
`;

const markPaymentPaid = gql`
  mutation markPaymentPaid(
    $id: ID!
    $paymentDate: DateTime!
    $paymentMethod: String!
  ) {
    markPaymentPaid(
      id: $id
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
    ) {
      message
      success
      data {
        ...transactionResponse
      }
    }
  }
  ${TRANSACTION_RESPONSE}
`;

const updateTransaction = gql`
  mutation updateTransaction(
    $id: ID!
    $contactId: ID!
    $propertyId: ID!
    $accountId: ID!
    $transactionType: String!
    $amount: Float!
    $additionalInfo: String
    $status: String
    $invoiceDate: DateTime
    $transactionDate: DateTime
    $paymentDate: DateTime
    $images: [String]
    $paymentMethod: String
    $dueDate: DateTime
    $rentalInvoiceId: ID
  ) {
    updateTransaction(
      id: $id
      contactId: $contactId
      propertyId: $propertyId
      accountId: $accountId
      transactionType: $transactionType
      amount: $amount
      additionalInfo: $additionalInfo
      status: $status
      invoiceDate: $invoiceDate
      transactionDate: $transactionDate
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
      images: $images
      dueDate: $dueDate
      rentalInvoiceId: $rentalInvoiceId
    ) {
      message
      success
      data {
        _id
        status
        amount
        invoiceDate
        invoiceNum
        paymentDate
        paymentMethod
        property {
          _id
          title
          privateTitle
        }
        contact {
          _id
          user {
            ...userDataResponse
          }
        }

        accountDetails
        transactionType
        additionalInfo

        contactId
        accountId
        propertyId
        transactionDate
      }
    }
  }
  ${USER_DATA_RESPONSE}
`;

const markPaymentUnpaid = gql`
  mutation markPaymentUnpaid($id: ID!) {
    markPaymentUnpaid(id: $id) {
      message
      success
      data {
        ...transactionResponse
      }
    }
  }
  ${TRANSACTION_RESPONSE}
`;

const createTransaction = gql`
  mutation createTransaction(
    $contactId: String!
    $propertyId: String!
    $accountId: String!
    $transactionType: String!
    $amount: Float!
    $additionalInfo: String
    $status: String
    $transactionDate: DateTime
    $paymentDate: DateTime
    $images: [String]
    $paymentMethod: String
    $dueDate: DateTime
  ) {
    createTransaction(
      contactId: $contactId
      propertyId: $propertyId
      accountId: $accountId
      transactionType: $transactionType
      amount: $amount
      additionalInfo: $additionalInfo
      status: $status
      transactionDate: $transactionDate
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
      images: $images
      dueDate: $dueDate
    ) {
      message
      success
      data {
        ...transactionResponse
      }
    }
  }
  ${TRANSACTION_RESPONSE}
`;

const createInvoice = gql`
  mutation createInvoice(
    $contactId: String
    $propertyId: String!
    $transactionType: String!
    $amount: Float!
    $taxRate: Float
    $status: String
    $transactionDate: DateTime
    $paymentDate: DateTime
    $paymentMethod: String
    $invoiceItems: [InvoiceItemsInput]!
    $dueDate: DateTime
  ) {
    createInvoice(
      contactId: $contactId
      propertyId: $propertyId
      transactionType: $transactionType
      amount: $amount
      taxRate: $taxRate
      status: $status
      transactionDate: $transactionDate
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
      invoiceItems: $invoiceItems
      dueDate: $dueDate
    ) {
      message
      success
      data {
        ...transactionResponse
      }
    }
  }
  ${TRANSACTION_RESPONSE}
`;

const obj = {
  fetchTransactions,
  createTransaction,
  createInvoice,
  deleteTransaction,
  markPaymentPaid,
  markPaymentUnpaid,
  updateTransaction,
  deleteInvoiceTransaction,
};
export default obj;
