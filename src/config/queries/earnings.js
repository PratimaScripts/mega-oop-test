import { gql } from "apollo-boost";

export const getEarnings = gql`
  query getEarnings {
    getEarnings
    # getEarning {
    #   recordType
    #   createdAt
    #   mongoId
    #   uniqueId
    #   title
    #   amount
    #   serviceCharge
    #   grossEarning
    #   status
    # }
  }
`;
