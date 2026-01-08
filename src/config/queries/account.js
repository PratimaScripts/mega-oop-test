import { gql } from "apollo-boost";

let resetPassword = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`;

let inviteLandlord = gql`
  mutation inviteLandlord(
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    inviteLandlord(email: $email, firstName: $firstName, lastName: $lastName) {
      success
      message
    }
  }
`;

let changeRole = gql`
  query changeRole($role: String!) {
    changeRole(role: $role) {
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
        connected_account_id
        isStripeConnectActive
        isAboutUpdate
        isProfileUpdate
        isPersonaUpdate
        isProfileUpdate
        isPersonaUpdate
        isEmailVerified
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
      }
    }
  }
`;

let setNotificationPreferences = gql`
  mutation (
    $appointment: Notification!
    $taskReminder: Notification!
    $screeningReport: Notification!
    $newsLetter: Notification!
  ) {
    updateNotificationInformation(
      appointment: $appointment
      taskReminder: $taskReminder
      screeningReport: $screeningReport
      newsLetter: $newsLetter
    ) {
      message
      success
      data
    }
  }
`;

let fetchNotificationPreferences = gql`
  query fetchNotificationPreferences {
    notifications {
      success
      message
      data
    }
  }
`;

let updateConnectInformation = gql`
  mutation updateConnectInformation($connectInput: JSON!) {
    updateConnectInformation(connectInput: $connectInput) {
      success
      message
      data {
        linkedInLink
        facebookLink
        googleLink
        telegramLink
        fullAddress
        addressLine1
        addressLine2
        city
        zip
        state
        country
      }
    }
  }
`;

const disConnectSocialAccount = gql`
  mutation disConnectSocialAccount($accountId: ID!) {
    disConnectSocialAccount(accountId: $accountId) {
      success
      message
      data {
        linkedInLink
        facebookLink
        googleLink
        telegramLink
        fullAddress
        addressLine1
        addressLine2
        city
        zip
        state
        country
      }
    }
  }
`;

let fetchConnectProfile = gql`
  query getConnectInformation {
    getConnectInformation {
      success
      message
      data {
        linkedInLink
        facebookLink
        fullAddress
        googleLink
        telegramLink
        addressLine1
        addressLine2
        city
        zip
        state
        country
      }
    }
  }
`;

let updateProfileAbout = gql`
  mutation updateProfileAbout(
    $firstName: String!
    $lastName: String!
    $avatar: String!
    $countryCode: String
    $middleName: String
    $email: String!
    $gender: String
    $isCompany: Boolean
    $dob: String
    $companyName: String
    $companyRegistrationNumber: String
    $phoneNumber: String!
    $nationality: String
    $isPhoneNumberVerified: Boolean
    $fullAddress: String
    $addressLine1: String!
    $addressLine2: String
    $city: String!
    $zip: String!
    $state: String!
    $country: String!
  ) {
    updateProfileInformation(
      profileInput: {
        firstName: $firstName
        avatar: $avatar
        countryCode: $countryCode
        middleName: $middleName
        lastName: $lastName
        isPhoneNumberVerified: $isPhoneNumberVerified
        email: $email
        gender: $gender
        isCompany: $isCompany
        dob: $dob
        companyName: $companyName
        companyRegistrationNumber: $companyRegistrationNumber
        phoneNumber: $phoneNumber
        nationality: $nationality
        fullAddress: $fullAddress
        addressLine1: $addressLine1
        addressLine2: $addressLine2
        city: $city
        zip: $zip
        state: $state
        country: $country
      }
    ) {
      success
      message
      data {
        firstName
        avatar
        middleName
        lastName
        email
        gender
        isCompany
        dob
        countryCode
        isPhoneNumberVerified
        phoneNumber
        companyName
        companyRegistrationNumber
        phoneNumber
        nationality
        fullAddress
        addressLine1
        addressLine2
        city
        zip
        state
        country
      }
    }
  }
`;

let fetchProfileAbout = gql`
  query getProfileInformation {
    getProfileInformation {
      success
      message
      data {
        firstName
        avatar
        countryCode
        middleName
        lastName
        isPhoneNumberVerified
        email
        gender
        isCompany
        dob
        companyName
        companyRegistrationNumber
        phoneNumber
        nationality
      }
    }
  }
`;

let updateAccountPreferences = gql`
  mutation updateAccountSetting(
    $currency: String
    $timeZone: String
    $timeFormat: String
    $dateFormat: String
    $measurementUnit: String
  ) {
    updateAccountSetting(
      currency: $currency
      timeZone: $timeZone
      timeFormat: $timeFormat
      dateFormat: $dateFormat
      measurementUnit: $measurementUnit
    ) {
      message
      success
      data
    }
  }
`;

let fetchAccountPreferences = gql`
  query fetchAccountPreferences {
    getAccountSetting {
      success
      message
      data
    }
  }
`;

let fetchPrivacyInformation = gql`
  query getPrivacyInformation {
    getPrivacyInformation {
      success
      message
      data
    }
  }
`;

let updatePrivacyData = gql`
  mutation updatePrivacyInformation(
    $profilePicture: Privacy!
    $gender: Privacy!
    $age: Privacy!
    $work: Privacy!
    $references: Privacy!
    $selfDeclaration: Privacy!
    $socialConnect: Privacy!
  ) {
    updatePrivacyInformation(
      profilePicture: $profilePicture
      gender: $gender
      age: $age
      references: $references
      work: $work
      selfDeclaration: $selfDeclaration
      socialConnect: $socialConnect
    ) {
      success
      message
      data
    }
  }
`;

let addCardDetails = gql`
  query verifyCardDetail(
    $cardNumber: String!
    $expireMonth: Int!
    $expireYear: Int!
    $cvc: String!
  ) {
    verifyCardDetail(
      cardNumber: $cardNumber
      expireMonth: $expireMonth
      expireYear: $expireYear
      cvc: $cvc
    ) {
      success
      message
      data
    }
  }
`;

let updateCardDetails = gql`
  query updateCardDetails(
    $cardNumber: String!
    $expireMonth: Int!
    $expireYear: Int!
    $cvc: String!
  ) {
    updateCardDetails(
      cardNumber: $cardNumber
      expireMonth: $expireMonth
      expireYear: $expireYear
      cvc: $cvc
    ) {
      success
      message
      data
    }
  }
`;

let getCardDetails = gql`
  query getCardDetails {
    getCardDetails {
      success
      message
      data {
        brand
        country
        last4
        expMonth
        expYear
      }
    }
  }
`;

let saveBankDetails = gql`
  mutation updateBankDetail($accountDetail: JSON) {
    updateBankDetail(accountDetail: $accountDetail) {
      success
      message
      data
    }
  }
`;

let getBankDetail = gql`
  query getBankDetail {
    getBankDetail {
      success
      message
      data
    }
  }
`;

let getSubscriptionPlans = gql`
  query getPlanDetails {
    getPlanDetails {
      success
      message
      data {
        _id
        planId
        amount
        interval
        displayName
      }
    }
  }
`;

let buySubscription = gql`
  mutation createUserSubscription($planId: String!) {
    createUserSubscription(planId: $planId) {
      success
      message
      data {
        paymentHistory
        selectedSubscription {
          _id
          planId
          amount
          interval
          displayName
          product
        }
      }
    }
  }
`;

let cancelSubscription = gql`
  mutation cancelSubscription($planId: ID!) {
    cancelSubscription(planId: $planId) {
      success
      message
    }
  }
`;

let addChartOfAccount = gql`
  mutation createChartOfAccount(
    $accountType: String!
    $accountName: String!
    $category: String!
  ) {
    createChartOfAccount(
      accountType: $accountType
      accountName: $accountName
      category: $category
    ) {
      success
      message
      data {
        capitalInflow {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }
        businessExpenses {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }

        capitalOutflow {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }
        businessIncome {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }
      }
    }
  }
`;

let fetchChartOfAccount = gql`
  query getChartOfAccount {
    getChartOfAccount {
      message
      success
      data {
        capitalInflow {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
          createdAt
        }
        businessExpenses {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
          createdAt
        }

        capitalOutflow {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
          createdAt
        }
        businessIncome {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
          createdAt
        }
      }
    }
  }
`;

let updateChartOfAccount = gql`
  mutation updateChartOfAccount(
    $chartId: String!
    $accountType: String!
    $accountName: String!
    $category: String!
  ) {
    updateChartOfAccount(
      chartId: $chartId
      accountType: $accountType
      accountName: $accountName
      category: $category
    ) {
      message
      success
      data {
        capitalInflow {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }
        businessExpenses {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }

        capitalOutflow {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }
        businessIncome {
          _id
          accountType
          accountName
          category
          isCreatedByAdmin
        }
      }
    }
  }
`;

export const fetchProfileCompleteness = gql`
  query getProfileCompleteness($userId: String, $role: String) {
    getProfileCompleteness(userId: $userId, role: $role) {
      success
      message
      data
    }
  }
`;

let fetchUserRoleInvites = gql`
  query getInvites {
    getInvites {
      success
      message
      data {
        email
        roleName
        inviteId
        status
        createdAt
      }
    }
  }
`;

let deactivateAccount = gql`
  query deactivateAccount {
    deactivateAccount {
      success
      message
      data
    }
  }
`;

let deleteAccount = gql`
  query deleteAccount {
    deleteAccount {
      success
      message
      data
    }
  }
`;

let exportData = gql`
  query exportData {
    exportData {
      success
      message
      data
    }
  }
`;

let fetchMFAQrCode = gql`
  {
    getQRCode {
      data
      success
      message
    }
  }
`;

let getWishList = gql`
  {
    getWishList {
      success
      message
      data {
        _id
        type
        body
        createdAt
        alert
      }
    }
  }
`;

let getShortList = gql`
  query {
    getShortList {
      success
      message
      data {
        _id
        property {
          propertyId: _id
          address
          isVerify
          location
          status
          photos
          propertyType
          title
          subType
          numberOfBed
          numberOfBath
          numberOfReception
          sizeInSquareFeet
          listing {
            listingId: _id
            monthlyRent
            deposit
            minimumDurationInMonth
            maxOccupancy
            furnishing
            parking
            EPCRating
            reasonEPC
            description
            preference {
              family
              couple
              student
              single
              pets
              smoker
            }
            features {
              garden
              disabledAccessability
              unsuitedBathroom
              billsIncluded
              balconyPatio
              laundryUtilityRoom
            }
            utility {
              electricity
              gas
              water
              councilTax
              internetBroadband
              telephone
            }
            amenities {
              gatedEntrance
              intercom
              airConditioner
              visitorParking
              conservatory
              gym
              carpetFloors
              woodFloors
              waterfront
              swimmingPool
              centralHeating
              ElectricOven
              basement
              park
              gasCooker
              refrigerator
              lift
              fireplace
              washerDryer
              dishWasher
            }
            earliestMoveInDate
            dayAvailability
            timeAvailability
            preQualify
            documents {
              _id
              fileName
              url
              fileType
              fileSize
              s3ObjectName
              documentType
              propertyId {
                title
                _id
              }
              sharing
              status
              userId
            }

            photos
            videoUrl
            partnerSearchEngine
            publish {
              publish
              link
            }
          }
        }
      }
    }
  }
`;

let deleteWishList = gql`
  mutation deleteWishList($wishlistId: String!) {
    deleteWishList(wishlistId: $wishlistId) {
      success
      message
      data {
        _id
        type
        body
        createdAt
        alert
      }
    }
  }
`;

let deleteShortListProperty = gql`
  mutation deleteShortListProperty($propertyId: [String]) {
    deleteShortListProperty(propertyId: $propertyId) {
      success
      message
      data {
        _id
        property {
          propertyId: _id
          address
          isVerify
          location
          status
          photos
          propertyType
          title
          subType
          numberOfBed
          numberOfBath
          numberOfReception
          sizeInSquareFeet
          listing {
            listingId: _id
            monthlyRent
            deposit
            minimumDurationInMonth
            maxOccupancy
            furnishing
            parking
            EPCRating
            reasonEPC
            description
            preference {
              family
              couple
              student
              single
              pets
              smoker
            }
            features {
              garden
              disabledAccessability
              unsuitedBathroom
              billsIncluded
              balconyPatio
              laundryUtilityRoom
            }
            utility {
              electricity
              gas
              water
              councilTax
              internetBroadband
              telephone
            }
            amenities {
              gatedEntrance
              intercom
              airConditioner
              visitorParking
              conservatory
              gym
              carpetFloors
              woodFloors
              waterfront
              swimmingPool
              centralHeating
              ElectricOven
              basement
              park
              gasCooker
              refrigerator
              lift
              fireplace
              washerDryer
              dishWasher
            }
            earliestMoveInDate
            dayAvailability
            timeAvailability
            preQualify
            documents {
              name
              url
            }
            documentId {
              _id
              url
              fileName
              fileType
              fileSize
              s3ObjectName
              documentType
              tenancy
              description
              expiryDate
              sharing
              status
            }
            photos
            videoUrl
            partnerSearchEngine
            publish {
              publish
              link
            }
          }
        }
      }
    }
  }
`;

let revokeRoleAccess = gql`
  mutation revokeRoleAccess($inviteId: String!) {
    revokeRoleAccess(inviteId: $inviteId) {
      success
      message
      data
    }
  }
`;

let updateMfa = gql`
  query updateMfa($isMFA: Boolean!) {
    updateMFA(isMFA: $isMFA) {
      success
      message
      data
    }
  }
`;

let retrieveUserPaymentHistory = gql`
  query retrieveUserPaymentHistory {
    retrieveUserPaymentHistory {
      success
      message
      data {
        invoiceNo
        chargeId
        amount
        description
        receiptUrl
        created
        customer
        status
        createdAt
      }
    }
  }
`;

const obj = {
  updateMfa,
  retrieveUserPaymentHistory,
  fetchProfileCompleteness,
  resetPassword,
  changeRole,
  setNotificationPreferences,
  fetchNotificationPreferences,
  updateProfileAbout,
  updateAccountPreferences,
  fetchAccountPreferences,
  fetchProfileAbout,
  updatePrivacyData,
  fetchPrivacyInformation,
  updateConnectInformation,
  disConnectSocialAccount,
  fetchConnectProfile,
  addCardDetails,
  saveBankDetails,
  getBankDetail,
  getSubscriptionPlans,
  buySubscription,
  addChartOfAccount,
  fetchChartOfAccount,
  updateChartOfAccount,
  deactivateAccount,
  deleteAccount,
  exportData,
  fetchMFAQrCode,
  fetchUserRoleInvites,
  updateCardDetails,
  getCardDetails,
  revokeRoleAccess,
  getWishList,
  deleteWishList,
  getShortList,
  deleteShortListProperty,
  inviteLandlord,
  cancelSubscription,
};
export default obj;
