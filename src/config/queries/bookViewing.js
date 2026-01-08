import { gql } from "apollo-boost";

const BOOKING_RESPONSE = gql`
fragment bookingResponse on BookViewing {
  _id
  role
  userId {
    _id
    firstName
    lastName
    phoneNumber
    avatar
    role
  }
  receiverId {
    _id
    firstName
    lastName
    phoneNumber
    avatar
    role
  }
  date
  bookedTimeSlot
  propertyId {
    _id
    title
    privateTitle
  }
  status
 }
`

export const updateBookViewingStatus = gql`
mutation updateBookViewingStatus(
  $_id: ID!
  $status: String!
) {
    updateBookViewingStatus(
    _id: $_id
    status: $status
  ) {
    success
    message
    data {
       ...bookingResponse
        }
    }
}
${BOOKING_RESPONSE}
`

export const updateBookViewDateTime = gql`
mutation updateBookViewDateTime(
  $_id: ID!
  $date: DateTime!
  $bookedTimeSlot: String!
  $eventId: ID
) {
    updateBookViewDateTime(
    _id: $_id
    date: $date
    bookedTimeSlot: $bookedTimeSlot
    eventId: $eventId
  ) {
    success
    message
    data {
        ...bookingResponse
        }
    }
}
${BOOKING_RESPONSE}
`

export const getBookViewingByUser = gql`
query getBookViewingByUser {
  getBookViewingByUser{
    success
    message
    data {
      ...bookingResponse
        }
    }
}
${BOOKING_RESPONSE}
`

export const getBookViewingById = gql`
query getBookViewingById($bookViewingId: ID!){
  getBookViewingById(bookViewingId: $bookViewingId){
    success
    message
    data {
      ...bookingResponse
        }
    }
}
${BOOKING_RESPONSE}
`