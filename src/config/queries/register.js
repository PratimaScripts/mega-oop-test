import { gql } from "apollo-boost";

const registerUser = gql`
  mutation registerUser(
    $email: String!
    $password: String!
    $role: String!
    $avatar: String
    $name: String!
    $token: String
  ) {
    registration(
      email: $email
      password: $password
      role: $role
      avatar: $avatar
      name: $name
      token: $token
    ) {
      success
      message
      token
      data {
        _id
        firstName
        address {
          city
          country
        }
        connected_account_id
        isStripeConnectActive
        isAboutUpdate
        isProfileUpdate
        isPersonaUpdate
        isProfileUpdate
        isPersonaUpdate
        defaultRole
        isMFA
        verifiedStatus
        lastName
        email
        isEmailVerified
        lastScreeningDate
        accountSetting
        facebookLink
        linkedInLink
        telegramLink
        googleLink
        dob
        invitedOn
        selectedPlan
        gender
        avatar
        nationality
        role
      }
    }
  }
`;

export default registerUser;
