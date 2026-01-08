import { gql } from "apollo-boost";

export const getCompanies = gql`
  query GetCompanies($searchTerm: String!) {
    getCompanies(searchTerm: $searchTerm)
  }
`;
