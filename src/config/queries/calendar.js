import { gql } from "apollo-boost";

let updateCalenderEvent = gql`
  mutation updateCalenderEvent(
    $eventDate: DateTime!
    $eventTime: String
    $event: String!
    $isRecurring: Boolean
    $recurringFrequency: String
  ) {
    updateCalenderEvent(
      eventDate: $eventDate
      eventTime: $eventTime
      event: $event
      isRecurring: $isRecurring
      recurringFrequency: $recurringFrequency
    ) {
      success
      message
      data {
        eventId: _id
        userId
        eventIdentity
        eventDate
        eventList {
          eventItemId: _id
          event
          eventTime
          isRecurring
          recurringFrequency
        }
        createdAt
        otherUserId {
          _id
          firstName
          lastName
          avatar
        }
        eventType
        eventUserType
      }
    }
  }
`;

let getCalendarEvents = gql`
  query getCalendarEvents {
    getCalendarEvents {
      success
      message
      data {
        eventId: _id
        userId
        eventIdentity
        eventDate
        eventList {
          eventItemId: _id
          event
          eventTime
          isRecurring
          recurringFrequency
        }
        createdAt
        otherUserId {
          _id
          firstName
          lastName
          avatar
        }
        eventType
        eventUserType
      }
    }
  }
`;

let updateEventItem = gql`
  mutation updateEventItem(
    $eventId: String!
    $eventItemId: String!
    $eventDate: DateTime
    $eventTime: String
    $event: String
    $type: String!
    $isRecurring: Boolean
    $recurringFrequency: String
  ) {
    updateEventItem(
      eventId: $eventId
      eventItemId: $eventItemId
      eventDate: $eventDate
      eventTime: $eventTime
      event: $event
      type: $type
      isRecurring: $isRecurring
      recurringFrequency: $recurringFrequency
    ) {
      success
      message
      data {
        eventId: _id
        userId
        eventIdentity
        eventDate
        eventList {
          eventItemId: _id
          event
          eventTime
          isRecurring
          recurringFrequency
        }
        createdAt
        otherUserId {
          _id
          firstName
          lastName
          avatar
        }
        eventType
        eventUserType
      }
    }
  }
`;


const obj ={
  updateCalenderEvent,
  updateEventItem,
  getCalendarEvents
};
export default obj;