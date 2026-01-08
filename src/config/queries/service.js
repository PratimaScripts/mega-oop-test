import { gql } from "apollo-boost";

export const getServices = gql`
  query GetService {
    getServices {
      _id
      userId
      role
      category
      slug
      subCategory
      status
      title
      description
      tags
      images
      price
      hasVariants
      variants {
        title
        description
        price
      }
      createdAt
    }
  }
`;

export const createNewService = gql`
  mutation CreateService(
    $title: String!
    $description: String!
    $category: String!
    $subCategory: String!
    $price: Int!
    $tags: [String!]!
    $images: [String!]!
    $status: StatusType!
    $hasVariant: Boolean!
    $variants: [ServiceVariantInput]
  ) {
    createService(
      service: {
        title: $title
        description: $description
        category: $category
        subCategory: $subCategory
        price: $price
        tags: $tags
        images: $images
        status: $status
        hasVariants: $hasVariant
        variants: $variants
      }
    ) {
      _id
      userId
      role
      category
      subCategory
      status
      title
      description
      tags
      images
      price
      hasVariants
      variants {
        title
        description
        price
      }
    }
  }
`;

export const updateService = gql`
  mutation UpdateService(
    $serviceId: ID!
    $title: String!
    $description: String!
    $category: String!
    $subCategory: String!
    $price: Int!
    $tags: [String!]!
    $images: [String!]!
    $status: StatusType!
    $hasVariant: Boolean!
    $variants: [ServiceVariantInput]
  ) {
    updateService(
      serviceId: $serviceId
      service: {
        title: $title
        description: $description
        category: $category
        subCategory: $subCategory
        price: $price
        tags: $tags
        images: $images
        status: $status
        hasVariants: $hasVariant
        variants: $variants
      }
    ) {
      _id
    }
  }
`;

export const changeServiceState = gql`
  mutation ChangeServiceStatus(
    $serviceId: String!
    $status: StatusType!
    $title: String
  ) {
    changeServiceStatus(serviceId: $serviceId, status: $status, title: $title) {
      status
    }
  }
`;

export const rejectServicePublication = gql`
  mutation RejectServicePublication($serviceId: String!, $comment: String!) {
    rejectServicePublication(serviceId: $serviceId, comment: $comment)
  }
`;

export const deleteServiceState = gql`
  mutation DeleteService($serviceId: String!) {
    deleteService(serviceId: $serviceId)
  }
`;

export const fetchSingleService = gql`
  query GetServiceById($serviceId: ID!) {
    getServiceById(serviceId: $serviceId) {
      _id
      userId
      role
      category
      subCategory
      status
      title
      description
      tags
      images
      price
      hasVariants
      variants {
        title
        description
        price
      }
    }
  }
`;
