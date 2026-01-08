import { gql } from "apollo-boost";

const createProperty = gql`
  mutation createProperty(
    $address: JSON
    $propertyType: String!
    $title: String!
    $privateTitle: String!
    $uniqueId: String!
    $subType: String!
    $numberOfBed: Int!
    $numberOfBath: Int!
    $numberOfReception: Int!
    $sizeInSquareFeet: Int!
    $photos: [String]
    $landlordEmail: String
  ) {
    createProperty(
      propertyType: $propertyType
      title: $title
      privateTitle: $privateTitle
      uniqueId: $uniqueId
      address: $address
      subType: $subType
      numberOfBed: $numberOfBed
      numberOfBath: $numberOfBath
      numberOfReception: $numberOfReception
      sizeInSquareFeet: $sizeInSquareFeet
      photos: $photos
      landlordEmail: $landlordEmail
    ) {
      success
      message
      data {
        propertyId: _id
        uniqueId
        address
        isVerify
        status
        location
        photos
        propertyType
        title
        privateTitle
        subType
        numberOfBed
        numberOfBath
        numberOfReception
        sizeInSquareFeet
      }
    }
  }
`;

const createPropertyWithLandlordAndRenter = gql`
  mutation createPropertyWithLandlordAndRenter(
    $address: JSON
    $propertyType: String!
    $title: String!
    $privateTitle: String!
    $uniqueId: String!
    $subType: String!
    $numberOfBed: Int!
    $numberOfBath: Int!
    $numberOfReception: Int!
    $sizeInSquareFeet: Int!
    $photos: [String]
    $landlordEmail: String
  ) {
    createPropertyWithLandlordAndRenter(
      propertyType: $propertyType
      title: $title
      privateTitle: $privateTitle
      uniqueId: $uniqueId
      address: $address
      subType: $subType
      numberOfBed: $numberOfBed
      numberOfBath: $numberOfBath
      numberOfReception: $numberOfReception
      sizeInSquareFeet: $sizeInSquareFeet
      photos: $photos
      landlordEmail: $landlordEmail
    ) {
      success
      message
      data {
        propertyId: _id
        address
        isVerify
        status
        location
        photos
        propertyType
        title
        subType
        numberOfBed
        numberOfBath
        numberOfReception
        sizeInSquareFeet
      }
    }
  }
`;

const verifyProperty = gql`
  mutation verifyProperty($properties: [VerifyPropertyInput]) {
    verifyProperty(properties: $properties) {
      success
      message
    }
  }
`;

const updatePropertyStatus = gql`
  mutation updatePropertyStatus(
    $propertyId: String!
    $status: String!
    $comment: String
    $archived: Boolean
  ) {
    updatePropertyStatus(
      propertyId: $propertyId
      status: $status
      comment: $comment
      archived: $archived
    ) {
      success
      message
      data {
        propertyId: _id
        uniqueId
        isDraft
        archived
        address
        isVerify
        location
        status
        photos
        propertyType
        title
        privateTitle
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
          captionedPhotos {
            url
            caption
          }
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
`;

const fetchListing = gql`
  query fetchListing($propertyId: String!) {
    fetchListing(propertyId: $propertyId) {
      success
      message
      data {
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
        captionedPhotos {
          url
          caption
        }
        videoUrl
        partnerSearchEngine
        publish {
          publish
          link
        }
        archived
      }
    }
  }
`;

const updateListing = gql`
  mutation updateListing(
    $propertyId: String!
    $listingId: String!
    $monthlyRent: Int
    $deposit: Int
    $minimumDurationInMonth: Int
    $maxOccupancy: String
    $furnishing: String
    $parking: String
    $EPCRating: String
    $reasonEPC: String
    $description: String
    $preference: preferenceListingInput
    $features: featureListingInput
    $utility: utilityListingInput
    $amenities: amenitiesListingInput
    $earliestMoveInDate: DateTime
    $dayAvailability: String
    $timeAvailability: String
    $preQualify: Boolean
    $documents: documentsListingInput
    $photos: [String]
    $captionedPhotos: [captionedPhotoInput!]
    $videoUrl: [String]
    $partnerSearchEngine: Boolean
    $publish: publishListingInput
  ) {
    updateListing(
      propertyId: $propertyId
      listingId: $listingId
      monthlyRent: $monthlyRent
      deposit: $deposit
      minimumDurationInMonth: $minimumDurationInMonth
      maxOccupancy: $maxOccupancy
      furnishing: $furnishing
      parking: $parking
      EPCRating: $EPCRating
      reasonEPC: $reasonEPC
      description: $description
      preference: $preference
      features: $features
      utility: $utility
      amenities: $amenities
      earliestMoveInDate: $earliestMoveInDate
      dayAvailability: $dayAvailability
      timeAvailability: $timeAvailability
      preQualify: $preQualify
      documents: $documents
      photos: $photos
      captionedPhotos: $captionedPhotos
      videoUrl: $videoUrl
      partnerSearchEngine: $partnerSearchEngine
      publish: $publish
    ) {
      success
      message
      data {
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
        captionedPhotos {
          url
          caption
        }
        videoUrl
        partnerSearchEngine
        publish {
          publish
          link
        }
      }
    }
  }
`;

const updateProperty = gql`
  mutation updateProperty(
    $propertyId: String!
    $address: JSON
    $propertyType: String!
    $title: String!
    $privateTitle: String
    $subType: String!
    $numberOfBed: Int!
    $numberOfBath: Int!
    $numberOfReception: Int!
    $sizeInSquareFeet: Int!
    $photos: [String]
  ) {
    updateProperty(
      propertyId: $propertyId
      address: $address
      propertyType: $propertyType
      title: $title
      privateTitle: $privateTitle
      subType: $subType
      numberOfBed: $numberOfBed
      numberOfBath: $numberOfBath
      numberOfReception: $numberOfReception
      sizeInSquareFeet: $sizeInSquareFeet
      photos: $photos
    ) {
      success
      message
      data {
        propertyId: _id
        uniqueId
        address
        isVerify
        status
        location
        photos
        propertyType
        title
        privateTitle
        subType
        numberOfBed
        numberOfBath
        numberOfReception
        sizeInSquareFeet
      }
    }
  }
`;

const createListing = gql`
  mutation createListing(
    $propertyId: String
    $monthlyRent: Int
    $deposit: Int
    $minimumDurationInMonth: Int
    $maxOccupancy: String
    $furnishing: String
    $parking: String
    $EPCRating: String
    $reasonEPC: String
    $description: String
    $preference: preferenceListingInput
    $features: featureListingInput
    $utility: utilityListingInput
    $amenities: amenitiesListingInput
    $earliestMoveInDate: DateTime
    $dayAvailability: String
    $timeAvailability: String
    $preQualify: Boolean
    $documents: documentsListingInput
    $photos: [String]
    $captionedPhotos: [captionedPhotoInput!]
    $videoUrl: [String]
    $partnerSearchEngine: Boolean
    $publish: publishListingInput
  ) {
    createListing(
      propertyId: $propertyId
      monthlyRent: $monthlyRent
      deposit: $deposit
      minimumDurationInMonth: $minimumDurationInMonth
      maxOccupancy: $maxOccupancy
      furnishing: $furnishing
      parking: $parking
      EPCRating: $EPCRating
      reasonEPC: $reasonEPC
      description: $description
      preference: $preference
      features: $features
      utility: $utility
      amenities: $amenities
      earliestMoveInDate: $earliestMoveInDate
      dayAvailability: $dayAvailability
      timeAvailability: $timeAvailability
      preQualify: $preQualify
      documents: $documents
      photos: $photos
      captionedPhotos: $captionedPhotos
      videoUrl: $videoUrl
      partnerSearchEngine: $partnerSearchEngine
      publish: $publish
    ) {
      success
      message
      data {
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
        captionedPhotos {
          url
          caption
        }
        videoUrl
        partnerSearchEngine
        publish {
          publish
          link
        }
      }
    }
  }
`;
const fetchProperties = gql`
  query fetchProperties {
    fetchProperties {
      propertyId: _id
      archived
      uniqueId
      address
      isVerify
      location
      status
      photos
      propertyType
      title
      privateTitle
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
        documents {
          fileType
          url
        }
        earliestMoveInDate
        dayAvailability
        timeAvailability
        preQualify
        photos
        captionedPhotos {
          url
          caption
        }
        videoUrl
        partnerSearchEngine
        publish {
          publish
          link
        }
      }
      user {
        firstName
        gender
        lastName
        nationality
        phoneNumber
        email
      }
    }
  }
`;
const fetchProperty = gql`
  query fetchProperty(
    $showListingDraft: Boolean
    # Todo: backend yet not ready accept this args
    # $showPropertiesWithNoListing: Boolean
  ) {
    fetchProperty(
      showListingDraft: $showListingDraft
      # Todo: backend yet not ready accept this args
      # showPropertiesWithNoListing: $showPropertiesWithNoListing
    ) {
      success
      message
      data {
        propertyId: _id
        archived
        uniqueId
        address
        isVerify
        location
        status
        isDraft
        photos
        propertyType
        title
        privateTitle
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
          photos
          captionedPhotos {
            url
            caption
          }
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
`;

const checkPropertyExist = gql`
  mutation checkPropertyExist($address: String!) {
    checkPropertyExist(address: $address)
  }
`;

const fetchPropertyTitleAndId = gql`
  query fetchPropertyTitleAndId {
    fetchPropertyTitleAndId {
      data {
        propertyId: _id
        title
        privateTitle
      }
    }
  }
`;

const fetchApprovalPendingProperty = gql`
  query fetchApprovalPendingProperty {
    fetchApprovalPendingProperty {
      success
      message
      data {
        propertyId: _id
        uniqueId
        address
        isVerify
        location
        status
        photos
        propertyType
        title
        privateTitle
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
          captionedPhotos {
            url
            caption
          }
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
`;

const getPropertyById = gql`
  query getPropertyById($propertyId: String!, $isDraft: Boolean) {
    getPropertyById(propertyId: $propertyId, isDraft: $isDraft) {
      success
      message
      data {
        propertyId: _id
        uniqueId
        address
        isVerify
        location
        status
        isDraft
        photos
        propertyType
        title
        privateTitle
        subType
        numberOfBed
        numberOfBath
        numberOfReception
        sizeInSquareFeet
        listing {
          listingId: _id
          isDraft
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
          captionedPhotos {
            url
            caption
          }
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
`;

const fetchNeighborhoodPlaces = gql`
  query nearByPlaces($lat: Float!, $lng: Float!, $type: [String]) {
    nearByPlaces(lat: $lat, lng: $lng, type: $type) {
      success
      message
      data {
        icon
        openNow
        rating
        image
        place
        placeId
        lat
        lng
        types
      }
    }
  }
`;

const updatePropertyType = gql`
  mutation updatePropertyType($propertyType: PropertyTypeInput) {
    updatePropertyType(propertyType: $propertyType) {
      success
      message
    }
  }
`;

const getPropertyType = gql`
  query getPropertyType {
    getPropertyType {
      success
      data {
        propertyName
        avatar
        propertySubType
      }
    }
  }
`;

const updateListingStatus = gql`
  mutation updateListingStatus($listingId: String!, $status: String) {
    updateListingStatus(listingId: $listingId, status: $status) {
      success
      message
      data {
        propertyId: _id
        address
        isVerify
        location
        status
        photos
        propertyType
        title
        privateTitle
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
          captionedPhotos {
            url
            caption
          }
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
`;

const markPropertyAsVerified = gql`
  mutation markPropertyAsVerified($propertyId: String!) {
    markPropertyAsVerified(propertyId: $propertyId)
  }
`;

const obj = {
  fetchProperty,
  fetchProperties,
  checkPropertyExist,
  createProperty,
  getPropertyType,
  updatePropertyType,
  verifyProperty,
  updateProperty,
  createListing,
  fetchListing,
  updateListing,
  fetchNeighborhoodPlaces,
  updatePropertyStatus,
  updateListingStatus,
  getPropertyById,
  fetchApprovalPendingProperty,
  markPropertyAsVerified,
  fetchPropertyTitleAndId,
  createPropertyWithLandlordAndRenter,
};
export default obj;
