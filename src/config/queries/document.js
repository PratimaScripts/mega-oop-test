import { gql } from 'apollo-boost';

const getDocumentsList = gql`
  query getDocumentsList($userId: String) {
    getDocumentsList(userId: $userId) {
      message
      success
      data {
        _id
        fileName
        url
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

const getDocumentSizes = gql`
  query getDocumentsList($userId: String) {
    getDocumentsList(userId: $userId) {
      message
      success
      data {
        fileSize
      }
    }
  }
`;

const uploadDocument = gql`
  mutation uploadDocument(
    $fileName: String
    $fileType: String
    $fileSize: Int
    $s3ObjectName: String
    $documentType: [String]
    $propertyId: String
    $tenancy: [String]
    $description: String
    $expiryDate: DateTime
    $sharing: Boolean
    $userId: String
    $status: String
    $url: String
  ) {
    uploadDocument(
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

const update = gql`
  mutation update(
    $documentId: String
    $documentType: [String]
    $propertyId: String
    $tenancy: [String]
    $description: String
    $expiryDate: DateTime
    $sharing: Boolean
    $userId: String
    $newDocument: Boolean
    $fileName: String
    $fileType: String
    $fileSize: Int
    $s3ObjectName: String
  ) {
    update(
      documentId: $documentId
      documentType: $documentType
      propertyId: $propertyId
      tenancy: $tenancy
      description: $description
      expiryDate: $expiryDate
      sharing: $sharing
      userId: $userId
      newDocument: $newDocument
      fileName: $fileName
      fileType: $fileType
      fileSize: $fileSize
      s3ObjectName: $s3ObjectName
    ) {
      success
      message
    }
  }
`;

const archiveDocument = gql`
  mutation archiveDocument($_id: String, $status: String) {
    archiveDocument(_id: $_id, status: $status) {
      success
      message
    }
  }
`;

const archiveManyDocs = gql`
  mutation archiveManyDocs($ids: [String], $status: String) {
    archiveManyDocs(ids: $ids, status: $status) {
      success
      message
    }
  }
`;

const deleteDocs = gql`
  mutation deleteDocs($ids: [String]) {
    deleteDocs(ids: $ids) {
      success
      message
    }
  }
`;

const obj = {
  getDocumentsList,
  getDocumentSizes,
  uploadDocument,
  update,
  archiveDocument,
  archiveManyDocs,
  deleteDocs,
};
export default obj;