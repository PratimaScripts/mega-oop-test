import { gql } from "apollo-boost";

const INVOICE_RESPONSE = gql`
  fragment invoiceResponse on InvoiceResponse {
    message
    success
    data {
      _id
      userId {
        _id
        firstName
        middleName
        lastName
        email
        phoneNumber
        userId
      }
      propertyId {
        _id
        title
      }
      status
      roleType
      contactId
      additionalInfo
      transactionDate
      invoice
      invoiceItems
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
      doneByRenterOn
      doneByLandlordOn
      mandate
      gocardlessPayment
      gocardlessSubscription
      accountNumber
      sortCode
      hasAutoRecurring
      paymentScheduleType
      paymentStartDate
    }
  }
`;

export const USER_DATA_RESPONSE = gql`
  fragment userDataResponse on UserData {
    _id
    role
    email
    firstName
    lastName
  }
`;

const RENTAL_INVOICE = gql`
  fragment rentalInvoice on RentalInvoice {
    _id
    status
    amount
    mandate
    dueDate
    sortCode
    invoiceNum
    invoiceDate
    accountNumber
    nextPaymentOn
    paymentMethod
    hasAutoRecurring
    paymentStartDate
    gocardlessPayment
    paymentScheduleType
    gocardlessSubscription
    property {
      _id
      title
    }
    contact {
      _id
      user {
        ...userDataResponse
      }
    }
  }
  ${USER_DATA_RESPONSE}
`;

export const RENTAL_INVOICES_RESPONSE = gql`
  fragment rentalInvoiceResponse on RentalInvoiceResponse {
    success
    message
    data {
      ...rentalInvoice
      recurringInvoices {
        _id
        status
        dueDate
        isChild
        invoiceNum
        paymentStartDate
        gocardlessPayment
        paymentScheduleType
      }
    }
  }
  ${RENTAL_INVOICE}
`;

let getInvoiceList = gql`
  query getInvoiceList {
    getInvoiceList {
      ...invoiceResponse
    }
  }
  ${INVOICE_RESPONSE}
`;

const emailInvoiceByInvoiceNumber = gql`
  query emailInvoiceByInvoiceNumber($invoiceNum: String!) {
    emailInvoiceByInvoiceNumber(invoiceNum: $invoiceNum) {
      success
      message
    }
  }
`;

let getRenterInvoices = gql`
  query getRenterInvoices {
    getRenterInvoices {
      ...invoiceResponse
    }
  }
  ${INVOICE_RESPONSE}
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

const deleteRentalInvoice = gql`
  mutation deleteRentalInvoice($id: ID!) {
    deleteRentalInvoice(id: $id) {
      message
      success
      data
    }
  }
`;

const markInvoicePaid = gql`
  mutation markInvoicePaid(
    $id: ID!
    $paymentDate: DateTime!
    $paymentMethod: String!
  ) {
    markInvoicePaid(
      id: $id
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
    ) {
      message
      success
      data {
        _id
        status
        paymentDate
        paymentMethod
      }
    }
  }
`;

const updateInvoice = gql`
  mutation updateInvoice(
    $contactId: ID!
    $propertyId: ID!
    $status: String!
    $invoiceNum: Int!
    $invoiceDate: DateTime!
    $paymentDate: DateTime
    $paymentMethod: String
    $dueDate: DateTime!
    $accountNumber: String
    $sortCode: String
    $invoiceItems: [InvoiceItemsInput]!
    $paymentScheduleType: String
    $hasAutoRecurring: Boolean
    $paymentStartDate: String
    $rentalInvoiceId: ID!
  ) {
    updateInvoice(
      contactId: $contactId
      propertyId: $propertyId
      status: $status
      invoiceNum: $invoiceNum
      invoiceDate: $invoiceDate
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
      dueDate: $dueDate
      accountNumber: $accountNumber
      sortCode: $sortCode
      invoiceItems: $invoiceItems
      paymentScheduleType: $paymentScheduleType
      hasAutoRecurring: $hasAutoRecurring
      paymentStartDate: $paymentStartDate
      rentalInvoiceId: $rentalInvoiceId
    ) {
      ...rentalInvoiceResponse
    }
  }
  ${RENTAL_INVOICES_RESPONSE}
`;

const createInvoice = gql`
  mutation createInvoice(
    $contactId: String!
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
    $propertyTitle: String!
    $accountNumber: String
    $sortCode: String
    $paymentScheduleType: String
    $hasAutoRecurring: Boolean
    $paymentStartDate: String
    $invoiceDate: String
  ) {
    createInvoice(
      contactId: $contactId
      propertyId: $propertyId
      propertyTitle: $propertyTitle
      transactionType: $transactionType
      amount: $amount
      taxRate: $taxRate
      status: $status
      transactionDate: $transactionDate
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
      invoiceItems: $invoiceItems
      dueDate: $dueDate
      accountNumber: $accountNumber
      sortCode: $sortCode
      paymentScheduleType: $paymentScheduleType
      hasAutoRecurring: $hasAutoRecurring
      paymentStartDate: $paymentStartDate
      invoiceDate: $invoiceDate
    ) {
      ...rentalInvoiceResponse
    }
  }
  ${RENTAL_INVOICES_RESPONSE}
`;

const getRentalInvoices = gql`
  query getRentalInvoices {
    getRentalInvoices {
      ...rentalInvoiceResponse
    }
  }
  ${RENTAL_INVOICES_RESPONSE}
`;

const getRentalInvoiceById = gql`
  query getRentalInvoiceById(
    $invoiceId: String!
    $includeSubscriptionDetails: Boolean
  ) {
    getRentalInvoiceById(
      invoiceId: $invoiceId
      includeSubscriptionDetails: $includeSubscriptionDetails
    ) {
      success
      message
      data {
        _id
        status
        amount
        invoiceDate
        invoiceNum
        property {
          _id
          title
          privateTitle
        }
        contact {
          _id
          landlord {
            ...userDataResponse
          }
          renter {
            ...userDataResponse
          }
        }

        isChild
        paymentMethod
        hasAutoRecurring
        accountNumber
        sortCode
        paymentScheduleType
        paymentStartDate
        taxPercent
        paymentDate
        dueDate
        transactions {
          _id
          description
          rate
          quantity
          amount
          name
          accountDetails
        }
      }
    }
  }
  ${USER_DATA_RESPONSE}
`;

const obj = {
  getInvoiceList,
  createInvoice,
  deleteTransaction,
  markInvoicePaid,
  updateInvoice,
  deleteRentalInvoice,
  getRenterInvoices,
  emailInvoiceByInvoiceNumber,

  getRentalInvoices,
  getRentalInvoiceById,
};
export default obj;
