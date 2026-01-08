import { gql } from "apollo-boost";

let fetchContactList = gql`
  query fetchContactList($filter: String!) {
    fetchContactList(filter: $filter) {
      success
      message
      data {
        roleId
        gender
        email
        userId
        companyName
        firstName
        lastName
        phoneNumber
        contactId
        role
      }
    }
  }
`;

let getUserByEmailAndRole = gql`
  query getUserByEmailAndRole($email: String!, $role: String!) {
    getUserByEmailAndRole(email: $email, role: $role) {
      success
      message
      data {
        _id
        roleId
        email
        avatar
        firstName
        lastName
        role
      }
    }
  }
`;

let createContact = gql`
  mutation createContact($contact: CreateContactInput) {
    createContact(contact: $contact) {
      success
      message
      data {
        roleId
        gender
        email
        userId
        avatar
        companyName
        firstName
        lastName
        phoneNumber
        contactId
        role
      }
    }
  }
`;

let removeContact = gql`
  mutation removeContact($contactId: String!) {
    removeContact(contactId: $contactId) {
      success
      message
      data {
        roleId
        gender
        email
        userId
        avatar
        companyName
        firstName
        lastName
        phoneNumber
        contactId
        role
      }
    }
  }
`;

let getContactList = gql`
  query getContactList($filterString: String) {
    getContactList(filterString: $filterString) {
      success
      message
      data {
        roleId
        gender
        email
        userId
        avatar
        companyName
        firstName
        lastName
        phoneNumber
        contactId
        role
      }
    }
  }
`;
const obj = {
  fetchContactList,
  createContact,
  getContactList,
  removeContact,
  getUserByEmailAndRole,
};
export default obj;
