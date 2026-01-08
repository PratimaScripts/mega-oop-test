import { gql } from "apollo-boost";

// const LISTING_RESPONSE = gql`
//     fragment listingResponse on Listing {
//         _id
//         monthlyRent
//         deposit
//         minimumDurationInMonth
//         maxOccupancy
//         furnishing
//         parking
//         EPCRating
//         reasonEPC
//         description
//         photoCaption
//         preference {
//             family
//             couple
//             student
//             single
//             pets
//             smoker
//         }
//         features {
//             garden
//             disabledAccessability
//             unsuitedBathroom
//             billsIncluded
//             balconyPatio
//             laundryUtilityRoom
//         }
//         utility {
//             electricity
//             gas
//             water
//             councilTax
//             internetBroadband
//             telephone
//         }
//         amenities {
//             gatedEntrance
//             intercom
//             airConditioner
//             visitorParking
//             conservatory
//             gym
//             carpetFloors
//             woodFloors
//             waterfront
//             swimmingPool
//             centralHeating
//             ElectricOven
//             basement
//             park
//             gasCooker
//             refrigerator
//             lift
//             fireplace
//             washerDryer
//             dishWasher
//         }
//         earliestMoveInDate
//         dayAvailability
//         timeAvailability
//         preQualify
//         documents {
//             name
//             url
//         }
//         documentId {
//             _id
//             url
//             fileName
//             fileType
//             fileSize
//             s3ObjectName
//             documentType
//             tenancy
//             description
//             expiryDate
//             sharing
//             status
//         }
//         photos
//         captionedPhotos {
//             url
//             caption
//         }
//         videoUrl
//         partnerSearchEngine
//         publish {
//             publish
//             link
//         }
//         status
//     }
// `

export const createOrUpdateListingDetail = gql`
  mutation createOrUpdateListingDetail(
    $propertyId: ID!
    $listingDetail: listingDetailInput
  ) {
    createOrUpdateListingDetail(
      propertyId: $propertyId
      listingDetail: $listingDetail
    ) {
      success
      message
      data {
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
        isDraft
      }
    }
  }
`;

export const createOrUpdateListingAmenitiesUtilities = gql`
  mutation createOrUpdateListingAmenitiesUtilities(
    $propertyId: ID!
    $listingAmenities: amenitiesListingInput
    $listingUtilities: utilityListingInput
  ) {
    createOrUpdateListingAmenitiesUtilities(
      propertyId: $propertyId
      listingAmenities: $listingAmenities
      listingUtilities: $listingUtilities
    ) {
      success
      message
      data {
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
        isDraft
      }
    }
  }
`;
export const publishUpdatedListing = gql`
  mutation publishUpdatedListing($propertyId: ID!) {
    publishUpdatedListing(propertyId: $propertyId) {
      _id
      EPCRating
      reasonEPC
      description
      photoCaption
      status
      isDraft
    }
  }
`;

export const createOrUpdateListingSchedule = gql`
  mutation createOrUpdateListingSchedule(
    $propertyId: ID!
    $listingSchedule: listingScheduleInput!
  ) {
    createOrUpdateListingSchedule(
      propertyId: $propertyId
      listingSchedule: $listingSchedule
    ) {
      success
      message
      data {
        earliestMoveInDate
        dayAvailability
        timeAvailability
        isDraft
      }
    }
  }
`;

export const createOrUpdateListingPhotosVideo = gql`
  mutation createOrUpdateListingPhotosVideo(
    $propertyId: ID!
    $listingGallery: listingGalleryInput!
    $captionedPhotos: [captionedPhotoInput]
  ) {
    createOrUpdateListingPhotosVideo(
      propertyId: $propertyId
      listingGallery: $listingGallery
      captionedPhotos: $captionedPhotos
    ) {
      success
      message
      data {
        photos
        captionedPhotos {
          url
          caption
        }
        videoUrl
        isDraft
      }
    }
  }
`;

export const createOrUpdateListingDocument = gql`
  mutation createOrUpdateListingDocument(
    $fileName: String
    $fileType: String
    $fileSize: Int
    $s3ObjectName: String
    $documentType: [String]
    $propertyId: String!
    $tenancy: [String]
    $description: String!
    $expiryDate: DateTime
    $sharing: Boolean
    $userId: String
    $status: String
    $url: String!
  ) {
    createOrUpdateListingDocument(
      fileName: $fileName
      fileType: $fileType
      fileSize: $fileSize
      s3ObjectName: $s3ObjectName
      documentType: $documentType
      propertyId: $propertyId
      tenancy: $tenancy
      description: $description
      expiryDate: $expiryDate
      sharing: $sharing
      userId: $userId
      status: $status
      url: $url
    ) {
      success
      message
      data {
        _id
        url
        fileName
        fileType
        fileSize
        s3ObjectName
        documentType
        propertyId {
          _id
          title
        }
        tenancy
        description
        expiryDate
        sharing
        status
      }
    }
  }
`;

export const getDocument = gql`
  query getDocument($listingId: String!) {
    getDocument(listingId: $listingId)
  }
`;
