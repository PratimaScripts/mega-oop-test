import { gql } from "apollo-boost";

let LandlordPersona = gql`
  mutation updateLandlordPersonaInformation(
    $profession: Profession
    $accreditation: [Accreditation]
    $supportingDocuments: [Document]
  ) {
    updateLandlordPersonaInformation(
      profession: $profession
      accreditation: $accreditation
      supportingDocuments: $supportingDocuments
    ) {
      message
      success
      data {
        profession {
          profession
          jobType
          jobTitle
          companyName
          startDate
          companyWebsite
          companyTelephone
        }
        accreditation {
          organization
          documentNumber
          validTillDate
        }
        supportingDocuments {
          document
          documentNumber
          documentUrl
        }
      }
    }
  }
`;

let fetchLandlordPersona = gql`
  query getLandlordPersonaInformation {
    getLandlordPersonaInformation {
      message
      success
      data {
        profession {
          profession
          jobType
          jobTitle
          companyName
          startDate
          companyWebsite
          companyTelephone
        }
        accreditation {
          organization
          documentNumber
          validTillDate
        }
        supportingDocuments {
          document
          documentNumber
          documentUrl
        }
      }
    }
  }
`;

let ServiceProPersona = gql`
  mutation updateServiceProviderPersonaInformation(
    $profession: SPProfession
    $serviceOrSkillTags: [String]
    $referenceContacts: [referenceContacts]
    $otherInformation: [otherInformation]
    $accreditation: [Accreditation]
    $supportingDocuments: [Document]
  ) {
    updateServiceProviderPersonaInformation(
      profession: $profession
      serviceOrSkillTags: $serviceOrSkillTags
      referenceContacts: $referenceContacts
      otherInformation: $otherInformation
      accreditation: $accreditation
      supportingDocuments: $supportingDocuments
    ) {
      message
      success
      data {
        profession {
          profession
          businessType
          UTR
          companyName
          VAT
          startDate
        }
        serviceOrSkillTags
        referenceContacts {
          phoneNumber
          contactName
          countryCode
          email
        }
        accreditation {
          organization
          documentNumber
          validTillDate
        }
        otherInformation {
          policyName
          providerName
          policyNumber
          policyAmount
          validTillDate
        }
        supportingDocuments {
          document
          documentNumber
          documentUrl
          fileId
        }
      }
    }
  }
`;

let fetchServiceProPersona = gql`
  query getServiceProviderPersonaInformation {
    getServiceProviderPersonaInformation {
      message
      success
      data {
        profession {
          profession
          businessType
          UTR
          companyName
          VAT
          startDate
        }
        serviceOrSkillTags
        referenceContacts {
          phoneNumber
          contactName
          countryCode
          email
        }
        accreditation {
          organization
          documentNumber
          validTillDate
        }
        otherInformation {
          policyName
          providerName
          policyNumber
          policyAmount
          validTillDate
        }
        supportingDocuments {
          document
          documentNumber
          documentUrl
          fileId
        }
      }
    }
  }
`;

let updateRenterPersona = gql`
  mutation updateRenterPersonaInformation(
    $income: incomeInput
    $landLordOrAgentReference: landLordOrAgentReferenceInput
    $otherInformation: otherInformationRenterInput
    $rightToRent: rightToRentInput
    $supportingDocuments: [Document]
  ) {
    updateRenterPersonaInformation(
      income: $income
      landLordOrAgentReference: $landLordOrAgentReference
      otherInformation: $otherInformation
      rightToRent: $rightToRent
      supportingDocuments: $supportingDocuments
    ) {
      message
      success
      data {
        income {
          profession
          jobType
          jobTitle
          salary {
            amount
            duration
          }
          workdaysPerWeek
          hoursPerWeek
          startDate
          endDate
          companyName
          managerName
          managerContactNumber
          managerEmail
        }
        landLordOrAgentReference {
          isSameAddress
          currentResidencyStatus
          landlordName
          landlordContactNumber
          landlordEmail
          rentPerMonth
          rentalStartDate
          durationInMonth
          mortgageProviderName
          mortgageProviderEmail
          monthlyMortgageAmount
          landRegistryTitleNumber
          fullAddress
          propertyOwnerStatus
        }
        rightToRent {
          swissPassport
          swissNationalID
          documentCertifyingPermanentResidence
          permanentResidentCard
          biometricResidencePermit
          passportOrTravelDocument
          immigrationStatusDocument
          registrationAsBritishCitizen
          passportEndorsed
          biometricImmigrationDocument
          nationalResidentCard
          endorsementFromHomeOffice
        }
        otherInformation {
          noOfAdult
          noOfChild
          noOfCars
          noOfPets
          moveInDate
          smoking
          incomeSupport
          disability
        }
        supportingDocuments {
          document
          documentNumber
          documentUrl
        }
      }
    }
  }
`;

let fetchRenterPersona = gql`
  query getRenterPersonaInformation {
    getRenterPersonaInformation {
      message
      success
      data {
        income {
          profession
          jobType
          jobTitle
          salary {
            amount
            duration
          }
          workdaysPerWeek
          hoursPerWeek
          startDate
          endDate
          companyName
          managerName
          managerContactNumber
          managerEmail
        }
        landLordOrAgentReference {
          isSameAddress
          currentResidencyStatus
          landlordName
          landlordContactNumber
          landlordEmail
          rentPerMonth
          rentalStartDate
          durationInMonth
          mortgageProviderName
          mortgageProviderEmail
          monthlyMortgageAmount
          landRegistryTitleNumber
          fullAddress
          propertyOwnerStatus
        }
        rightToRent {
          swissPassport
          swissNationalID
          documentCertifyingPermanentResidence
          permanentResidentCard
          biometricResidencePermit
          passportOrTravelDocument
          immigrationStatusDocument
          registrationAsBritishCitizen
          passportEndorsed
          biometricImmigrationDocument
          nationalResidentCard
          endorsementFromHomeOffice
        }
        otherInformation {
          noOfAdult
          noOfChild
          noOfCars
          noOfPets
          moveInDate
          smoking
          incomeSupport
          disability
        }
        supportingDocuments {
          document
          documentNumber
          documentUrl
        }
      }
    }
  }
`;

const obj = {
  LandlordPersona,
  fetchLandlordPersona,
  ServiceProPersona,
  fetchServiceProPersona,
  updateRenterPersona,
  fetchRenterPersona,
};
export default obj;
