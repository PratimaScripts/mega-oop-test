import { gql } from "apollo-boost";

export const getServiceOrders = gql`
  query GetServiceOrders {
    getServiceOrders {
      _id
      user {
        firstName
        lastName
        avatar
        phoneNumber
        email
        verifiedStatus
      }
      serviceProvider {
        firstName
        lastName
        avatar
        phoneNumber
        email
        verifiedStatus
      }
      serviceProviderId
      serviceId
      orderId
      serviceVariant
      amount
      serviceCharge
      grossEarning
      description
      isTransferredToAccount
      transferMetadata
      paidByUser
      status
      photoUrl
      videoUrl
      comments
      payoutStatus
      releasedDate
      rejectedOn
      acceptedOn
      isAccepted
      isRejected
      submittedOn
      isSubmitted
      service {
        _id
        userId
        slug
        role
        category
        subCategory
        status
        title
        description
        tags
        images
        price
        hasVariants
        variants {
          title
          description
          price
        }
        createdAt
      }
    }
  }
`;

export const submitForPayment = gql`
  mutation SubmitForPayment($inputs: SubmitForPaymentInput!) {
    submitForPayment(inputs: $inputs)
  }
`;

export const changeServiceOrderStatus = gql`
  mutation changeServiceOrderStatus($inputs: ChangeServiceOrderStatusInput!) {
    changeServiceOrderStatus(inputs: $inputs)
  }
`;

export const makeServiceOrderPaymentAsDone = gql`
  mutation MakeServiceOrderPaymentAsDone(
    $inputs: MakeServiceOrderPaymentAsDoneInput!
  ) {
    makeServiceOrderPaymentAsDone(inputs: $inputs)
  }
`;

export const saveStripeCard = gql`
  mutation SaveCard {
    saveCard {
      customerId
      client_secret
    }
  }
`;

export const payoutServiceOrder = gql`
  mutation payoutServiceOrder($orderId: ID!) {
    payoutServiceOrder(orderId: $orderId)
  }
`;

export const bankPayoutServiceOrder = gql`
  mutation bankPayoutServiceOrder($orderId: ID!) {
    bankPayoutServiceOrder(orderId: $orderId)
  }
`;
