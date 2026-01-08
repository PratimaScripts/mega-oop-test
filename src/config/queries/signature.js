import { gql } from "apollo-boost";

export const signDocument = gql`
  mutation SignDocument(
    $signDocumentId: String!
    $signatureType: SignatureTypeEnum!
    $imageUrl: String
    $fontStyle: String
    $name: String
    $location: LocationInput!
  ) {
    signDocument(
      data: {
        signDocumentId: $signDocumentId
        signatureType: $signatureType
        imageUrl: $imageUrl
        fontStyle: $fontStyle
        name: $name
        location: $location
      }
    )
  }
`;

export const getSignatureDataBySecret = gql`
  query getSignatureDataBySecret($secret: String!) {
    getSignatureDataBySecret(secret: $secret) {
      success
      message
      data {
        id
        documentType
        isSigned
      }
    }
  }
`;
