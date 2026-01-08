import { gql } from "apollo-boost";

const checkEmail = gql`
  query checkEmail($email: String!) {
    checkEmail(email: $email) {
      success
      message
      email
      isRegister
      isDeactivate
      firstName
      isMFA
      otp
    }
  }
`;

let verifyEmailAddress = gql`
  query verifyEmailAddress($email: String!) {
    verifyEmailAddress(email: $email) {
      success
      data
    }
  }
`;

let verifyEmail = gql`
  query verifyEmail(
    $email: String!
    $method: String!
    $otp: String
    $token: String
  ) {
    verifyEmail(email: $email, method: $method, token: $token, otp: $otp) {
      success
      isImpersonate
      permissions {
        tab
        write
        read
      }
      message
      isProfileUpdated
      token
      data {
        _id
        firstName
        address {
          city
          country
        }
        isEmailVerified
        connected_account_id
        isStripeConnectActive
        isAboutUpdate
        isProfileUpdate
        defaultRole
        isPersonaUpdate
        isProfileUpdate
        isPersonaUpdate
        isMFA
        verifiedStatus
        lastName
        email
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
        loginMethod
      }
    }
  }
`;

let verifyEmailAddressSignUp = gql`
  query verifyEmailAddressSignUp(
    $email: String!
    $password: String!
    $role: String
    $type: String
    $token: String
  ) {
    verifyEmailAddressSignUp(
      type: $type
      email: $email
      password: $password
      role: $role
      token: $token
    ) {
      success
      message
      data
    }
  }
`;

let getNotifications = gql`
  {
    getNotifications {
      success
      data {
        _id
        type
        role
        userId
        title
        markAsRead
        createdAt
      }
    }
  }
`;

let getCalendarNotifications = gql`
  {
    getCalendarNotifications {
      success
      message
      count
    }
  }
`;

let checkAuth = gql`
  {
    authentication {
      success
      isImpersonate
      permissions {
        tab
        write
        read
      }
      message
      isProfileUpdated
      isVerified
      data {
        _id
        firstName
        address {
          city
          country
        }
        isEmailVerified
        connected_account_id
        isStripeConnectActive
        isAboutUpdate
        isProfileUpdate
        defaultRole
        isPersonaUpdate
        isProfileUpdate
        isPersonaUpdate
        isMFA
        verifiedStatus
        lastName
        email
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
        loginMethod
        socialId
        socialAccessToken
      }
    }
  }
`;

let checkOtp = gql`
  query checkOtp($email: String!, $otp: String!) {
    checkOTP(email: $email, otp: $otp) {
      success
      message
      isOtpCorrect
    }
  }
`;

let resendOTP = gql`
  query resendOTP($email: String!) {
    resendOTP(email: $email) {
      success
      message
      isMFA
      email
      firstName
    }
  }
`;

let stripeConnectApi = gql`
  query stripeConnectAuthorization($token: String, $status: Boolean) {
    stripeConnectAuthorization(token: $token, status: $status) {
      success
      message
      data
    }
  }
`;

let loginUser = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      token
      isProfileUpdated
      data {
        _id
        firstName
        address {
          city
          country
        }
        isEmailVerified
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
        loginMethod
        socialId
        socialAccessToken
      }
    }
  }
`;

let socialLogin = gql`
  mutation socialLogin(
    $firstName: String
    $lastName: String
    $email: String!
    $socialId: String!
    $loginMethod: String!
    $accesstoken: String!
  ) {
    socialLogin(
      firstName: $firstName
      lastName: $lastName
      email: $email
      socialId: $socialId
      loginMethod: $loginMethod
      accesstoken: $accesstoken
    ) {
      success
      message
      token
      isProfileUpdated
      data {
        _id
        firstName
        address {
          city
          country
        }
        loginMethod
        isEmailVerified
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
        socialAccessToken
        socialId
      }
    }
  }
`;

let checkPassword = gql`
  query checkPassword($password: String!) {
    checkPassword(password: $password) {
      success
      message
    }
  }
`;

let forgotPassword = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

let resetPassword = gql`
  mutation resetPassword($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token) {
      success
      message
    }
  }
`;

let getUserInformation = gql`
  query getUserInformation($token: String!) {
    getUserInformation(token: $token) {
      success
      message
      data
    }
  }
`;

const sendPhoneOtp = gql`
  mutation SendPhoneOtp($phoneNumber: String!) {
    sendPhoneOtp(phoneNumber: $phoneNumber) {
      success
      message
      data
    }
  }
`;

const verifyPhoneOtp = gql`
  mutation verifyPhoneOtp($phoneNumber: String!, $phoneOtp: String!) {
    verifyPhoneOtp(phoneNumber: $phoneNumber, phoneOtp: $phoneOtp) {
      success
      message
      data
    }
  }
`;

const updateRegisteredUser = gql`
  mutation UpdateRegisteredUser(
    $email: String!
    $role: String!
    $firstName: String!
    $lastName: String!
    $phoneNo: String!
    $countryCode: String!
    $fullAddress: String!
    $companyName: String
    $companyNumber: String
    $addressLine1: String
    $addressLine2: String
    $city: String
    $zip: String
    $state: String
    $country: String
    $verifiedStatus: String
    $location: JSON
  ) {
    updateRegisteredUser(
      email: $email
      data: {
        role: $role
        firstName: $firstName
        lastName: $lastName
        phoneNo: $phoneNo
        countryCode: $countryCode
        fullAddress: $fullAddress
        companyName: $companyName
        companyNumber: $companyNumber
        addressLine1: $addressLine1
        addressLine2: $addressLine2
        city: $city
        zip: $zip
        state: $state
        country: $country
        verifiedStatus: $verifiedStatus
        location: $location
      }
    ) {
      success
      message
      data {
        _id
        firstName
        address {
          city
          country
        }
        isEmailVerified
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
        loginMethod
        socialId
        socialAccessToken
      }
    }
  }
`;

const onboardSocialUser = gql`
  mutation onboardSocialUser(
    $email: String!
    $role: String!
    $firstName: String!
    $lastName: String!
    $phoneNo: String!
    $countryCode: String!
    $fullAddress: String!
    $companyName: String
    $companyNumber: String
    $addressLine1: String
    $addressLine2: String
    $city: String
    $zip: String
    $state: String
    $country: String
    $verifiedStatus: String
  ) {
    onboardSocialUser(
      email: $email
      data: {
        role: $role
        firstName: $firstName
        lastName: $lastName
        phoneNo: $phoneNo
        countryCode: $countryCode
        fullAddress: $fullAddress
        companyName: $companyName
        companyNumber: $companyNumber
        addressLine1: $addressLine1
        addressLine2: $addressLine2
        city: $city
        zip: $zip
        state: $state
        country: $country
        verifiedStatus: $verifiedStatus
      }
    ) {
      success
      message
      data {
        _id
        firstName
        address {
          city
          country
        }
        isEmailVerified
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
        loginMethod
        socialId
        socialAccessToken
      }
    }
  }
`;

export const getUnreadMessageCount = gql`
  query getUnreadMessageCount {
    getUnreadMessageCount {
      success
      count
      message
    }
  }
`;

let obj = {
  checkEmail,
  checkAuth,
  checkOtp,
  loginUser,
  socialLogin,
  checkPassword,
  resendOTP,
  forgotPassword,
  resetPassword,
  getUserInformation,
  verifyEmailAddress,
  verifyEmailAddressSignUp,
  getNotifications,
  getCalendarNotifications,
  stripeConnectApi,
  sendPhoneOtp,
  verifyPhoneOtp,
  updateRegisteredUser,
  verifyEmail,
  onboardSocialUser,
  getUnreadMessageCount,
};

export default obj;
