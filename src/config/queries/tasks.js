import { gql } from "apollo-boost";

const createTask = gql`
  mutation createTask($task: JSON!) {
    createTask(task: $task) {
      success
      message
      data {
        taskId: _id
        propertyId
        identity
        status
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          avatar
          lastName
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const updateTask = gql`
  mutation updateTask($taskId: String!, $task: TaskInput!) {
    updateTask(taskId: $taskId, task: $task) {
      success
      message
      data {
        taskId: _id
        propertyId
        identity
        status
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          avatar
          lastName
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

// const getEarning = gql`
//   query getEarning {
//     getEarning {
//       recordType
//     createdAt
//     mongoId
//     uniqueId
//     title
//     amount
//     serviceCharge
//     grossEarning
//     status
//     }
//   }
// `;

const getTasks = gql`
  query getTasks {
    getTasks {
      message
      success
      data {
        taskId: _id
        propertyId
        identity
        status
        taskOfferMessageCount
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          avatar
          lastName
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const getTaskDataList = gql`
  query getTaskDataList {
    getTaskDataList {
      message
      success
      data {
        taskId: _id
        identity
        status
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        comment
        createdAt
      }
    }
  }
`;

const getTasksList = gql`
  query getTasksList($searchTaskInput: SearchTaskInput!, $page: String!) {
    getTasksList(searchTaskInput: $searchTaskInput, page: $page) {
      message
      success
      totalPages
      totalRecords
      currentPage
      data {
        taskId: _id
        propertyId
        identity
        status
        taskOfferMessageCount
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          avatar
          lastName
          role
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;
const getTaskOffers = gql`
  query getTaskOffers($searchTaskInput: SearchTaskInput!, $page: String!) {
    getTaskOffers(searchTaskInput: $searchTaskInput, page: $page) {
      message
      success
      totalPages
      totalRecords
      currentPage
      data {
        taskId: _id
        propertyId
        identity
        status
        taskOfferMessageCount
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          avatar
          lastName
          role
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const fetchPublicTask = gql`
  query fetchPublicTask($search: String, $filter: filterPublicTask) {
    fetchPublicTask(search: $search, filter: $filter) {
      message
      success
      data {
        taskId: _id
        propertyId
        identity
        status
        taskOfferMessageCount
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          avatar
          lastName
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const fetchServiceProviderOffers = gql`
  query fetchServiceProviderOffers {
    fetchServiceProviderOffers {
      message
      success
      data
    }
  }
`;

const fetchServiceProvideTasks = gql`
  query fetchServiceProvideTasks {
    fetchServiceProvideTasks {
      message
      success
      data {
        _id
        propertyId
        identity
        status
        taskOfferMessageCount
        offers {
          _id
          messages {
            userId
            message
          }
          serviceCharge
          grossEarning
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          address {
            city
            country
          }
          isAboutUpdate
          isProfileUpdate
          isPersonaUpdate
          isProfileUpdate
          isPersonaUpdate
          isMFA
          verifiedStatus
          lastName
          email
          lastScreeningDate
          accountSetting
          facebookLink
          linkedInLink
          telegramLink
          googleLink
          dob
          invitedOn
          selectedPlan
          gender
          avatar
          nationality
          role
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const refundCharges = gql`
  mutation refundCharges($taskId: String!) {
    refundCharges(taskId: $taskId) {
      success
      message
    }
  }
`;
const makeTaskOffer = gql`
  mutation makeTaskOffer(
    $taskId: String!
    $amount: Float!
    $description: String
  ) {
    makeTaskOffer(taskId: $taskId, amount: $amount, description: $description) {
      message
      success
      data {
        _id
        propertyId
        dayAvailability
        timeAvailability
        category
        offers {
          offerId: _id
          user {
            _id
            firstName
            lastName
            avatar
          }
          amount
          description
          status
          createdAt
        }
        postedBy {
          firstName
          lastName
          avatar
        }
        createdAt
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
        }
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const resolvedTask = gql`
  mutation resolvedTask(
    $taskId: String!
    $photos: [String]
    $videos: [String]
    $comment: String
  ) {
    resolvedTask(
      taskId: $taskId
      photos: $photos
      videos: $videos
      comment: $comment
    ) {
      message
      success
    }
  }
`;

const createConversation = gql`
  mutation createConversation(
    $receiverId: String!
    $role: String!
    $message: String!
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

const ratingOnTask = gql`
  mutation ratingOnTask($rating: Int, $taskOfferId: String, $review: String) {
    ratingOnTask(rating: $rating, taskOfferId: $taskOfferId, review: $review) {
      message
      success
    }
  }
`;

const createPaymentIntent = gql`
  query createPaymentIntent($amount: Float!) {
    createPaymentIntent(amount: $amount) {
      success
      message
      data
    }
  }
`;

const generateStripeConnectDashboardLink = gql`
  query generateStripeConnectDashboardLink {
    generateStripeConnectDashboardLink {
      success
      message
      data
    }
  }
`;

const releasePayment = gql`
  mutation releasePayment(
    $offerId: String!
    $status: String!
    $tokenId: String!
  ) {
    releasePayment(offerId: $offerId, status: $status, tokenId: $tokenId) {
      message
      success
      data {
        taskId: _id
        propertyId
        identity
        status
        taskOfferMessageCount
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
          }
          messageCount
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          firstName
          avatar
          lastName
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        photos
        videos
        comment
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const flagTaskOffer = gql`
  mutation flagTaskOffer($offerId: String!, $description: String!) {
    flagTaskOffer(offerId: $offerId, description: $description) {
      message
      success
    }
  }
`;

const updateTaskStatus = gql`
  mutation updateTaskStatus(
    $taskId: String!
    $status: String!
    $comment: String
  ) {
    updateTaskStatus(taskId: $taskId, status: $status, comment: $comment) {
      message
      success
      data {
        _id
        propertyId
        identity
        status
        offers {
          _id
          user {
            avatar
            firstName
            lastName
          }
          like
          dislike
          amount
          description
          status
          createdAt
        }
        postedBy {
          firstName
          avatar
          lastName
        }
        property {
          address
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const acceptRejectOffer = gql`
  mutation acceptRejectTaskOffer($offerId: String!, $status: String!) {
    acceptRejectTaskOffer(status: $status, offerId: $offerId) {
      message
      success
      data {
        _id
        propertyId
        identity
        status
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            avatar
            firstName
            lastName
          }
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          firstName
          avatar
          lastName
        }
        property {
          address
          propertyType
          title
          subType
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const likeAndDislikeOffer = gql`
  mutation likeAndDislikeOffer($offerId: String!, $type: String!) {
    likeAndDislikeOffer(offerId: $offerId, type: $type) {
      message
      success
      data {
        _id
        propertyId
        status
        offers {
          _id
          user {
            avatar
            firstName
            lastName
          }
          like
          dislike
          amount
          description
          status
          createdAt
        }
        postedBy {
          firstName
          avatar
          lastName
        }
        property {
          address
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const updateTaskOffer = gql`
  mutation updateTaskOffer(
    $offerId: String!
    $amount: Float
    $description: String
  ) {
    updateTaskOffer(
      offerId: $offerId
      amount: $amount
      description: $description
    ) {
      message
      success
      data {
        _id
        propertyId
        identity
        status
        offers {
          _id
          messages {
            userId
            message
          }
          user {
            _id
            avatar
            firstName
            lastName
            email
            role
          }
          like
          dislike
          amount
          status
          description
          status
          createdAt
        }
        postedBy {
          _id
          role
          firstName
          avatar
          lastName
        }
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
        }
        createdAt
        dayAvailability
        timeAvailability
        category
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const fetchTasksList = gql`
  query fetchTasksList {
    fetchTasksList {
      message
      success
      data {
        _id
        propertyId
        dayAvailability
        timeAvailability
        identity
        category
        offers {
          offerId: _id
          messages {
            userId
            message
          }
          user {
            _id
            firstName
            lastName
            avatar
          }
          amount
          description
          status
          createdAt
        }
        postedBy {
          _id
          role
          firstName
          lastName
          avatar
        }
        createdAt
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
        }
        subCategory
        title
        description
        priority
        payOwnedBy
        budgetAmount
        images {
          image
          status
        }
        videoUrl
        status
      }
    }
  }
`;

const transferWiseQuery = gql`
  mutation transferwiseTransferPayment($offerData: JSON) {
    transferwiseTransferPayment(offerData: $offerData) {
      success
      message
      data
    }
  }
`;

const obj = {
  createTask,
  getTasks,
  fetchPublicTask,
  updateTask,
  makeTaskOffer,
  fetchTasksList,
  acceptRejectOffer,
  likeAndDislikeOffer,
  updateTaskOffer,
  updateTaskStatus,
  fetchServiceProvideTasks,
  resolvedTask,
  releasePayment,
  flagTaskOffer,
  createConversation,
  ratingOnTask,
  refundCharges,
  fetchServiceProviderOffers,
  transferWiseQuery,
  createPaymentIntent,
  generateStripeConnectDashboardLink,
  getTaskDataList,
  getTasksList,
  getTaskOffers
};
export default obj;