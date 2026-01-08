import { gql } from "apollo-boost";

const userList = gql`
  query userList {
    userList {
      success
      message
      data {
        _id
        firstName
        avatar
        lastName
        phoneNumber
        email
        gender
        isDeactivate
        isBlocked
        selectedPlan
        dob
        nationality
        defaultRole
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const usernameList = gql`
  query usernameList {
    usernameList {
      success
      message
      data {
        userId
        userName
        activateLandlord
        activatedServicePro
      }
    }
  }
`;

const findUsername = gql`
  query findUsername($userId: String!) {
    findUsername(userId: $userId) {
      success
      message
      data {
        userId
        userName
        activateLandlord
        activatedServicePro
      }
    }
  }
`;

const createUsernameList = gql`
  mutation createUsernameList(
    $userId: String!
    $userName: String!
    $activateLandlord: Boolean
    $activatedServicePro: Boolean
  ) {
    createUsernameList(
      userId: $userId
      userName: $userName
      activateLandlord: $activateLandlord
      activatedServicePro: $activatedServicePro
    ) {
      success
      message
      data {
        userId
        userName
        activateLandlord
        activatedServicePro
      }
    }
  }
`;

const deleteUser = gql`
  mutation deleteUserById($userId: String!) {
    deleteUserById(userId: $userId) {
      success
      message
      data {
        _id
        firstName
        avatar
        lastName
        phoneNumber
        email
        gender
        selectedPlan
        dob
        nationality
        defaultRole
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const deleteRequests = gql`
  query getDeleteRequestList {
    getDeleteRequestList {
      success
      message
      data {
        _id
        firstName
        lastName
        email
        defaultRole
        phoneNumber
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const getExportRequests = gql`
  query getExportRequestList {
    getExportRequestList {
      success
      message
      data {
        _id
        firstName
        lastName
        email
        defaultRole
        phoneNumber
        role
        createdAt
        updatedAt
      }
    }
  }
`;

let getFlaggedTasks = gql`
  query getFlaggedTasks {
    getFlaggedTasks {
      success
      message
      data
    }
  }
`;

let fetchAdminRates = gql`
  query fetchAdminRates {
    fetchAdminRates {
      success
      message
      data
    }
  }
`;

let updateAdminRates = gql`
  mutation updateAdminRates($data: JSON) {
    updateAdminRates(data: $data) {
      success
      message
      data
    }
  }
`;

let changeFlagTaskStatus = gql`
  mutation changeFlagTaskStatus(
    $taskId: String
    $isOpen: Boolean
    $reportStatus: String
    $flaggingLocationMetaData: JSON
    $closeReason: String
  ) {
    changeFlagTaskStatus(
      taskId: $taskId
      isOpen: $isOpen
      flaggingLocationMetaData: $flaggingLocationMetaData
      closeReason: $closeReason
      reportStatus: $reportStatus
    ) {
      success
      message
      data
    }
  }
`;

let updateExportRequest = gql`
  mutation updateExportDataRequest($userId: String!, $action: String!) {
    updateExportDataRequest(userId: $userId, action: $action) {
      success
      message
      data
    }
  }
`;

let flagATask = gql`
  mutation flagATask(
    $taskId: String
    $flagReason: String
    $flaggingLocationMetaData: JSON
  ) {
    flagATask(
      taskId: $taskId
      flaggingLocationMetaData: $flaggingLocationMetaData
      flagReason: $flagReason
    ) {
      success
      message
      data
    }
  }
`;

let rejectUserAccountDeleteRequest = gql`
  mutation rejectUserAccountDeleteRequest($userId: String!) {
    rejectUserAccountDeleteRequest(userId: $userId) {
      success
      message
      data
    }
  }
`;

let userActionQuery = gql`
  mutation updateUserAccountSetting(
    $userId: String!
    $actionType: String!
    $status: Boolean!
  ) {
    updateUserAccountSetting(
      userId: $userId
      actionType: $actionType
      status: $status
    ) {
      success
      message
      data
    }
  }
`;

let updateAccreditation = gql`
  mutation updateAccreditation($accreditations: [String!]) {
    updateAccreditation(accreditations: $accreditations) {
      success
      message
      data {
        accreditations
      }
    }
  }
`;

let fetchAccreditation = gql`
  query getAccreditation {
    getAccreditation {
      success
      message
      data {
        accreditations
      }
    }
  }
`;

let fetchScreeningList = gql`
  query fetchScreeningList {
    fetchScreeningList {
      success
      message
      data
    }
  }
`;

let fetchAdminDashboardInfo = gql`
  query fetchAdminDashboardInfo {
    fetchAdminDashboardInfo {
      message
      success
      data {
        totalPayout
        screeningOrderCount
        screeningOrderData {
          role
          count
        }
        roleCount
        roleData {
          role
          count
        }
        userData {
          email
          gender
          createdAt
          firstName
          avatar
          lastName
          defaultRole
        }
      }
    }
  }
`;

let retrievePaymentHistory = gql`
  query retrievePaymentHistory {
    retrievePaymentHistory {
      message
      success
      data {
        invoiceNo
        chargeId
        amount
        description
        receiptUrl
        created
        customer
        status
        createdAt
      }
    }
  }
`;

let docVerificationList = gql`
  query getDocumentList {
    getDocumentList {
      success
      message
      data
    }
  }
`;

let getTaskCategories = gql`
  query getTaskCategories {
    getTaskCategories {
      success
      message
      data {
        name
        avatar
        subCategory
      }
    }
  }
`;

const createTaskCategory = gql`
  mutation updateTaskCategories($taskCategories: [TaskCategoryInput]) {
    updateTaskCategories(taskCategories: $taskCategories) {
      success
      message
      data {
        name
        avatar
        subCategory
      }
    }
  }
`;

const updateDocumentAdmin = gql`
  mutation updateDocument(
    $documentId: String!
    $status: String!
    $description: String
  ) {
    updateDocument(
      documentId: $documentId
      status: $status
      description: $description
    ) {
      success
      message
      data
    }
  }
`;

const changeScreeningStatus = gql`
  mutation changeScreeningStatus($screeningId: String!, $status: String!) {
    changeScreeningStatus(screeningId: $screeningId, status: $status) {
      success
      message
      data
    }
  }
`;

const getLandlordDashboardInfo = gql`
  query getLandlordDashboardInfo {
    getLandlordDashboardInfo {
      rentedProperties
      listedProperties
      myClients
      listedServices
      unpaidInvoices
      paidInvoices
      totalToDo
      totalInProgress
      totalResolved
      totalCompleted
      myContactsLanloard
      myContactsServicePro
      totalPropertiesOflandlord
      inMarketCount
      offMarketCount
      unpaidMoney
      directOrders
      earnedMoney
      upcomingEvents
    }
  }
`;

const getRenterDashboardInfo = gql`
  query getRenterDashboardInfo {
    getRenterDashboardInfo {
      rentedProperties
      listedProperties
      myClients
      listedServices
      unpaidInvoices
      paidInvoices
      totalToDo
      totalInProgress
      totalResolved
      totalCompleted
      myContactsLanloard
      myContactsServicePro
      totalPropertiesOflandlord
      inMarketCount
      offMarketCount
      unpaidMoney
      directOrders
      earnedMoney
      upcomingEvents
    }
  }
`;

const getServiceProDashboardInfo = gql`
  query getServiceProDashboardInfo {
    getServiceProDashboardInfo {
      rentedProperties
      listedProperties
      myClients
      listedServices
      unpaidInvoices
      paidInvoices
      totalToDo
      totalInProgress
      totalResolved
      totalCompleted
      myContactsLanloard
      myContactsServicePro
      totalPropertiesOflandlord
      inMarketCount
      offMarketCount
      unpaidMoney
      directOrders
      earnedMoney
      upcomingEvents
    }
  }
`;

let obj = {
  userList,
  findUsername,
  createUsernameList,
  usernameList,
  updateAccreditation,
  deleteUser,
  fetchAccreditation,
  deleteRequests,
  getExportRequests,
  updateExportRequest,
  rejectUserAccountDeleteRequest,
  userActionQuery,
  retrievePaymentHistory,
  docVerificationList,
  updateDocumentAdmin,
  getTaskCategories,
  createTaskCategory,
  fetchAdminDashboardInfo,
  fetchScreeningList,
  changeScreeningStatus,
  flagATask,
  getFlaggedTasks,
  changeFlagTaskStatus,
  fetchAdminRates,
  updateAdminRates,
  getLandlordDashboardInfo,
  getRenterDashboardInfo,
  getServiceProDashboardInfo,
};

export default obj;
