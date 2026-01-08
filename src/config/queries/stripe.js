import { gql } from "apollo-boost";

export const getStripeCustomer = gql`
  query getStripeCustomer {
    getStripeCustomer {
      cusId
      paymentMethods
    }
  }
`;

export const getCustomerCardList = gql`
  query getCustomerCardList {
    getCustomerCardList {
      id
      card {
        brand
        country
        exp_month
        exp_year
        last4
      }
      created
      customer
      livemode
      billing_details
    }
  }
`;
export const deleteCustomerCard = gql`
  mutation deleteCustomerCard($CardInput: CardInput!) {
    deleteCustomerCard(CardInput: $CardInput) {
      id
      card {
        brand
        country
        exp_month
        exp_year
        last4
      }
      created
      customer
      livemode
      billing_details
    }
  }
`;
export const updateCustomerCard = gql`
  mutation updateCustomerCard($UpdateCardInput: UpdateCardInput!) {
    updateCustomerCard(UpdateCardInput: $UpdateCardInput) {
      id
      card {
        brand
        country
        exp_month
        exp_year
        last4
      }
      created
      customer
      livemode
      billing_details
    }
  }
`;

export const saveCard = gql`
  mutation saveCard {
    saveCard {
      customerId
      client_secret
    }
  }
`;

export const createPaymentIntent = gql`
  mutation CreatePaymentIntent(
    $createPaymentIntentInput: CreatePaymentIntentInput!
  ) {
    createPaymentIntent(createPaymentIntentInput: $createPaymentIntentInput)
  }
`;

export const createStripeAccount = gql`
  mutation CreateStripeAccount {
    createStripeAccount
  }
`;

export const createStripeLogin = gql`
  mutation CreateStripeLogin {
    createStripeLogin {
      status
      link
    }
  }
`;
// response "success" or "error"
export const getStripeAccountStatus = gql`
  query GetStripeAccountStatus {
    getStripeAccountStatus
  }
`;
