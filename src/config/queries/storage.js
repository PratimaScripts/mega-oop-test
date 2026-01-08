import gql from "graphql-tag";

export const getStorageLevel = gql`
  query {
    getStorageLevel
  }
`;

export const getDocumentsStorageUsage = gql`
  query {
    getDocumentsStorageUsage
  }
`;
