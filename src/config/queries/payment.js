import { gql } from "apollo-boost";

const paymentScreeningAmount = gql`
  query paymentScreeningAmount(
    $cardId: String!
    $tokenId: String!
    $amount: Int!
    $type: String!
    $screeningId: String
  ) {
    paymentScreeningAmount(
      cardId: $cardId
      tokenId: $tokenId
      amount: $amount
      type: $type
      screeningId: $screeningId
    ) {
      success
      message
      data
    }
  }
`;

const obj = { paymentScreeningAmount };
export default obj;
