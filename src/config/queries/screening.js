import { gql } from "apollo-boost";

const getScreeningHistory = gql`
  query getScreeningHistory {
    getScreeningHistory {
      success
      message
      data
    }
  }
`;

const fetchPendingOrdersSelf = gql`
  query getPendingScreening {
    getPendingScreening {
      success
      message
      data
    }
  }
`;

const createScreening = gql`
  query createScreening {
    createScreening {
      success
      message
      data
    }
  }
`;

const createScreeningOrder = gql`
  mutation createInvitation(
    $invite: [InviteInput!]
    $propertiesId: [String!]
    $type: String!
  ) {
    createInvitation(
      invite: $invite
      propertiesId: $propertiesId
      type: $type
    ) {
      success
      message
      data
    }
  }
`;

const getInviteInformation = gql`
  query getInviteInformation($token: String!) {
    getInviteInformation(token: $token) {
      success
      message
      data
    }
  }
`;

const acceptScreeningInvitation = gql`
  query acceptScreeningInvitation($token: String!) {
    acceptScreeningInvitation(token: $token) {
      success
      message
      data
    }
  }
`;

const getScreeningReportInformation = gql`
  query getScreeningReportInformation($screeningId: String!) {
    getScreeningReportInformation(screeningId: $screeningId) {
      success
      message
      data
    }
  }
`;

const obj = {
  getScreeningReportInformation,
  acceptScreeningInvitation,
  getInviteInformation,
  getScreeningHistory,
  createScreening,
  createScreeningOrder,
  fetchPendingOrdersSelf
};
export default obj;