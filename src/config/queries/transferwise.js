import { gql } from "apollo-boost";

export const createWiseAccount = gql`
  mutation CreateWiseAccount($accountDetails: WiseAccountDetailsInput!) {
    createWiseAccount(accountDetails: $accountDetails)
  }
`;
