import { gql } from "apollo-boost";

export const payoutTaskOffer = gql`
  mutation payoutTaskOffer($offerId: ID!) {
    payoutTaskOffer(offerId: $offerId)
  }
`;

export const bankPayoutTaskOffer = gql`
  mutation bankPayoutTaskOffer($offerId: ID!) {
    bankPayoutTaskOffer(offerId: $offerId)
  }
`;
