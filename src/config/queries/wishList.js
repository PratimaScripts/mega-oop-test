import { gql } from "apollo-boost";

// const fetchWishList = gql`
//   query getWishList {
//     getWishList {
//       success
//       data {
//         _id
//         name
//         title
//         description
//         permissions {
//           tab
//           read
//           write
//         }
//       }
//       message
//     }
//   }
// `;

const addToWishList = gql`
  mutation addToWishList($type: String!, $body: String!) {
    addToWishList(type: $type, body: $body) {
      success
      message
      data{
        _id
        type
        body
        alert
      }
    }
  }
`;

const updateToWishList = gql`
  mutation editWishList($wishlistId:String!, $type: String!, $body: String!) {
    editWishList(wishlistId: $wishlistId, type: $type, body: $body) {
      success
      message
      data{
        _id
        type
        body
        alert
      }
    }
  }
`;
const editWishListAlert = gql`
  mutation editWishListAlert($wishlistId:String!, $alert: String!) {
    editWishListAlert(wishlistId: $wishlistId, alert: $alert) {
      success
      message
      data{
        _id
        type
        body
        alert
      }
    }
  }
`;

const addToShortList = gql`
  mutation addToShortList($propertyId: String!) {
    addToShortList(propertyId: $propertyId) {
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


const obj = {
  addToWishList,
  updateToWishList,
  addToShortList,
  editWishListAlert
};
export default obj;