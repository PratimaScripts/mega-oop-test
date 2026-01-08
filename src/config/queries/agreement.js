import { gql } from "apollo-boost";

export const getAgreements = gql`
  query GetAgreements {
    getAgreements {
      success
      message
      data {
        _id
        agreementId
        agreementType
        templateType
        status
        agreementTitle
        hasSigningStarted
        archived
        duration {
          start
          end
          leaveOpen
          humanReadableFormat
        }
        propertyId {
          address
          _id
        }
        contacts {
          userDetails {
            email
            firstName
            lastName
            phoneNumber
          }
        }
        signatures {
          signedOn
        }
        createdAt
      }
    }
  }
`;

export const createAgreement = gql`
  mutation CreateAgreement(
    $propertyId: String!
    $contactId: [String!]!
    $agreementType: AGREEMENT_TYPE_ENUM!
    $templateType: AgreementTemplateTypeEnum
    $duration: DurationInput!
    $occupation: OccupationInput!
    $renterTransaction: RenterTransactionInput!
    $exclusions: String
    $additionalInfo: String
    $guarantors: [GuarantorInput]
    $documentUrl: String
    $sendForSign: Boolean
  ) {
    createAgreement(
      agreement: {
        propertyId: $propertyId
        contactId: $contactId
        agreementType: $agreementType
        templateType: $templateType
        duration: $duration
        occupation: $occupation
        renterTransaction: $renterTransaction
        exclusions: $exclusions
        additionalInfo: $additionalInfo
        guarantors: $guarantors
        documentUrl: $documentUrl
        sendForSign: $sendForSign
      }
    ) {
      _id
      propertyId {
        address
        _id
      }
      contactId
      contacts {
        userDetails {
          email
          firstName
          lastName
          phoneNumber
          address {
            fullAddress
          }
        }
      }
      agreementId
      agreementType
      templateType
      status
      duration {
        start
        end
        leaveOpen
        humanReadableFormat
      }
      occupation {
        occupantNames
        adults
        kids
        pets
      }
      renterTransaction {
        hasAutoRecurring
        rate
        paymentScheduleType
        paymentMethod
        paymentStartDate
        deposit {
          hasSecurityDeposit
          amount
          type
        }
        invoiceAdvanceDays
        information
      }
      additionalInfo
      exclusions
      documentUrl
      guarantors {
        email
        name
        mobile
      }
      landlordData {
        email
        firstName
        lastName
        phoneNumber
        address {
          fullAddress
        }
      }
      signatures {
        signeeType
        name
        email
        ipAddress
        signedOn
        signatureType
        imageUrl
        typedName
      }
    }
  }
`;

export const editAgreement = gql`
  mutation UpdateAgreement(
    $agreementId: String!
    $propertyId: String!
    $contactId: [String!]!
    $agreementType: AGREEMENT_TYPE_ENUM!
    $templateType: AgreementTemplateTypeEnum
    $duration: DurationInput!
    $occupation: OccupationInput!
    $renterTransaction: RenterTransactionInput!
    $exclusions: String
    $additionalInfo: String
    $guarantors: [GuarantorInput]
    $documentUrl: String
    $sendForSign: Boolean
  ) {
    updateAgreement(
      agreement: {
        propertyId: $propertyId
        contactId: $contactId
        agreementType: $agreementType
        templateType: $templateType
        duration: $duration
        occupation: $occupation
        renterTransaction: $renterTransaction
        exclusions: $exclusions
        additionalInfo: $additionalInfo
        guarantors: $guarantors
        documentUrl: $documentUrl
        sendForSign: $sendForSign
      }
      agreementId: $agreementId
    ) {
      _id
      propertyId {
        address
        _id
      }
      contactId
      contacts {
        userDetails {
          email
          firstName
          lastName
          phoneNumber
          address {
            fullAddress
          }
        }
      }
      agreementId
      agreementType
      templateType
      status
      duration {
        start
        end
        humanReadableFormat
        leaveOpen
      }
      occupation {
        adults
        kids
        pets
        occupantNames
      }
      renterTransaction {
        hasAutoRecurring
        rate
        paymentScheduleType
        paymentMethod
        paymentStartDate
        deposit {
          amount
          type
          hasSecurityDeposit
        }
        invoiceAdvanceDays
        information
      }
      additionalInfo
      exclusions
      documentUrl
      guarantors {
        email
        name
        mobile
      }
      landlordData {
        email
        firstName
        phoneNumber
        lastName
        address {
          fullAddress
        }
      }
      signatures {
        signeeType
        name
        email
        ipAddress
        signedOn
        signatureType
        imageUrl
        typedName
      }
    }
  }
`;

export const getAgreementId = gql`
  query GetAgreementById($agreementId: String!) {
    getAgreementById(agreementId: $agreementId) {
      _id
      propertyId {
        address
        _id
      }
      contactId
      contacts {
        userDetails {
          email
          firstName
          lastName
          phoneNumber
          address {
            fullAddress
          }
        }
      }
      agreementId
      agreementType
      templateType
      status
      duration {
        start
        end
        humanReadableFormat
        leaveOpen
      }
      occupation {
        adults
        kids
        pets
        occupantNames
      }
      renterTransaction {
        hasAutoRecurring
        rate
        paymentScheduleType
        paymentMethod
        paymentStartDate
        deposit {
          amount
          type
          hasSecurityDeposit
        }
        invoiceAdvanceDays
        information
      }
      additionalInfo
      exclusions
      documentUrl
      guarantors {
        email
        name
        mobile
      }
      landlordData {
        email
        firstName
        lastName
        phoneNumber
        address {
          fullAddress
        }
      }
      signatures {
        signeeType
        name
        email
        ipAddress
        signedOn
        signatureType
        imageUrl
        typedName
      }
    }
  }
`;

export const deleteAgreement = gql`
  mutation DeleteAgreement($agreementId: String!) {
    deleteAgreement(agreementId: $agreementId)
  }
`;

export const duplicateAgreement = gql`
  mutation DuplicateAgreement($agreementId: String!) {
    duplicateAgreement(agreementId: $agreementId)
  }
`;

export const sendAgreementForSigning = gql`
  mutation SendAgreementForSigning($agreementId: String!) {
    sendAgreementForSigning(agreementId: $agreementId)
  }
`;

export const archiveAgreement = gql`
  mutation archiveAgreement($agreementId: ID!, $archived: Boolean!) {
    archiveAgreement(agreementId: $agreementId, archived: $archived) {
      success
      message
      data {
        _id
        archived
      }
    }
  }
`;
