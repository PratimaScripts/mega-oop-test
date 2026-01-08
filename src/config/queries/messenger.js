import { gql } from "apollo-boost";

export const fetchChatlist = gql`
  {
    getConversations {
      success
      message
      data
    }
  }
`;

export const fetchConversations = gql`
  query getConversation($conversationId: String!) {
    getConversation(conversationId: $conversationId) {
      success
      message
      data
    }
  }
`;

export const readMessageSubscription = gql`
  subscription readMessageSubscription(
    $conversationId: String!
    $userId: String!
  ) {
    readMessageSubscription(conversationId: $conversationId, userId: $userId) {
      success
      messageIds
    }
  }
`;

export const conversationSubscription = gql`
  subscription getConversationChat($conversationId: String!) {
    getConversationChat(conversationId: $conversationId) {
      success
      message
      data
    }
  }
`;

export const isTypingSubscription = gql`
  subscription isUserTyping($conversationId: String!) {
    isUserTyping(conversationId: $conversationId)
  }
`;

export const isTypingDispatch = gql`
  query userIsTyping($conversationId: String!) {
    userIsTyping(conversationId: $conversationId)
  }
`;

export const sendMessage = gql`
  mutation sendMessage(
    $conversationId: String!
    $message: String!
    $type: String
  ) {
    sendMessage(
      conversationId: $conversationId
      message: $message
      type: $type
    ) {
      success
      data
      message
    }
  }
`;

export const createConversation = gql`
  mutation createConversation(
    $receiverId: String!
    $role: String!
    $message: String
    $type: String
  ) {
    createConversation(
      receiverId: $receiverId
      role: $role
      message: $message
      type: $type
    ) {
      message
      success
      data
    }
  }
`;

export const markMessagesAsRead = gql`
  mutation markAsRead(
    $messageIds: [String]
    $conversationId: String!
    $senderId: String!
  ) {
    markAsRead(
      messageIds: $messageIds
      conversationId: $conversationId
      senderId: $senderId
    ) {
      success
      message
      data
    }
  }
`;
