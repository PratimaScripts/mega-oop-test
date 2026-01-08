import { gql } from "apollo-boost";

export const goCardlessPayment = gql`
  mutation goCardlessPaymentz {
    goCardlessPayment
  }
`;

export const getMandateById = gql`
  query getMandateById($mandateId: String!) {
    getMandateById(mandateId: $mandateId) {
      success
      message
      data
    }
  }
`;

export const getMandates = gql`
  query getMandates {
    getMandates {
      success
      message
      data
    }
  }
`;

export const getAccessToken = gql`
  mutation getAccessToken($code: String!) {
    getAccessToken(code: $code) {
      success
      message
    }
  }
`;

export const sendEmailToRenter = gql`
  mutation sendEmailToRenter($contactId: String!) {
    sendEmailToRenter(contactId: $contactId) {
      status
      message
    }
  }
`;

export const goCardlessConnected = gql`
  query goCardlessConnected {
    goCardlessConnected
  }
`;

export const checkCustomerVerified = gql`
  query checkCustomerVerified {
    checkCustomerVerified {
      success
      message
      verified
    }
  }
`;

export const disconnectGoCardLess = gql`
  mutation disconnectGoCardLess {
    disconnectGoCardLess {
      success
      message
    }
  }
`;

export const getConnectionLink = gql`
  query connectionLink {
    connectionLink {
      success
      message
      data
    }
  }
`;

export const setupDirectDebitMandate = gql`
  query setupDirectDebitMandate($propertyName: String!, $mandateId: String!) {
    setupDirectDebitMandate(
      propertyName: $propertyName
      mandateId: $mandateId
    ) {
      success
      message
      data
    }
  }
`;

export const completeTheRedirectFlow = gql`
  mutation completeTheRedirectFlow($redirectId: String!) {
    completeTheRedirectFlow(redirectId: $redirectId) {
      success
      message
      data
    }
  }
`;

export const initiateThePayment = gql`
  mutation initiateThePayment($rentalInvoiceId: ID!) {
    initiateThePayment(rentalInvoiceId: $rentalInvoiceId) {
      success
      message
      data
    }
  }
`;

export const cancelOneOffPayment = gql`
  mutation cancelOneOffPayment($paymentId: String!) {
    cancelOneOffPayment(paymentId: $paymentId) {
      success
      message
      data
    }
  }
`;

export const cancelRecurringSubscription = gql`
  mutation cancelRecurringSubscription($subscriptionId: String!) {
    cancelRecurringSubscription(subscriptionId: $subscriptionId) {
      success
      message
      data
    }
  }
`;

export const pauseOrResumeRecurringSubscription = gql`
  mutation pauseOrResumeRecurringSubscription(
    $subscriptionId: String!
    $param: String!
  ) {
    pauseOrResumeRecurringSubscription(
      subscriptionId: $subscriptionId
      param: $param
    ) {
      success
      message
      data
    }
  }
`;
