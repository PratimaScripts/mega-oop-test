import { gql } from "apollo-boost";

const fetchUserRoles = gql`
  query getAccessRoles {
    getAccessRoles {
      success
      data {
        _id
        name
        title
        description
        permissions {
          tab
          read
          write
        }
      }
      message
    }
  }
`;

const inviteUser = gql`
  mutation sendInvitation($name: String!, $email: String!, $roleId: String!) {
    sendInvitation(name: $name, email: $email, roleAccessId: $roleId) {
      success
      message
      data
    }
  }
`;

const acceptInvitation = gql`
  query acceptInvitation($token: String!) {
    acceptInvitation(token: $token) {
      success
      data
      message
    }
  }
`;

const impersonateUser = gql`
  query impersonateUser($inviteId: String) {
    impersonateUser(inviteId: $inviteId) {
      success
      data {
        _id
        firstName
        avatar
        lastName
        invitedOn
        phoneNumber
        email
        gender
        selectedPlan
        nationality
        defaultRole
        profileCompleteness
        role
        facebookLink
        linkedInLink
        verifiedStatus
        isEmailVerified
      }
      isImpersonate
      token
      message
    }
  }
`;
const getUserWorkspace = gql`
  query userWorkspace {
    userWorkspace {
      success
      message
      data {
        workspace
        loggedUser {
          firstName
          lastName
          role
          defaultRole
          email
        }
      }
    }
  }
`;
export const getUserInformationById = gql`
  query getUserInformationById($userParam: String!, $role: String) {
    getUserInformationById(userParam: $userParam, role: $role) {
      success
      message
      data
    }
  }
`;

const getUserPaymentType = gql`
  query GetUserPaymentType {
    getUserPaymentType {
      paymentType
      stripeConnectAccId
      transferwise {
        accountId
      }
    }
  }
`;

const validateInvite = gql`
  query validateInvite($token: String!) {
    validateInvite(token: $token) {
      email
      name
      role
      as
      isNewUser
      by {
        firstName
        lastName
      }
    }
  }
`;

const obj = {
  fetchUserRoles,
  inviteUser,
  acceptInvitation,
  impersonateUser,
  getUserWorkspace,
  getUserInformationById,
  getUserPaymentType,
  validateInvite,
};
export default obj;
