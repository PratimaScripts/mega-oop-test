import { gql } from "apollo-boost";

export const getRentedRequestedProperties = gql`
  query getRentedRequestedProperties {
    getRentedRequestedProperties
  }
`;

export const rejectRentPropertyRequest = gql`
  mutation RejectRentPropertyRequest($propertyId: String) {
    rejectRentPropertyRequest(propertyId: $propertyId)
  }
`;

export const approveRentPropertyRequest = gql`
  mutation ApproveRentPropertyRequest($propertyId: String) {
    approveRentPropertyRequest(propertyId: $propertyId)
  }
`;
