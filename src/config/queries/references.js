import { gql } from "apollo-boost";

const getReferenceDetail = gql`
  query getReferenceDetail($token: String!) {
    getReferenceDetail(token: $token) {
      success
      message
      data
    }
  }
`;

const submitEmploymentReference = gql`
  mutation submitEmploymentReference(
    $validReference: validReferenceInput
    $token: String!
    $reference: employmentReferenceInput
  ) {
    submitEmploymentReference(
      validReference: $validReference
      token: $token
      reference: $reference
    ) {
      success
      message
      data
    }
  }
`;

const submitTenancyReference = gql`
  mutation submitTenancyReference(
    $token: String!
    $reference: tenancyReferenceInput
    $validReference: validReferenceInput
  ) {
    submitTenancyReference(
      token: $token
      reference: $reference
      validReference: $validReference
    ) {
      success
      message
      data
    }
  }
`;

const submitSelfEmploymentReference = gql`
  mutation submitSelfEmploymentReference(
    $token: String!
    $reference: selfEmploymentReferenceInput
  ) {
    submitSelfEmploymentReference(token: $token, reference: $reference) {
      success
      message
      data
    }
  }
`;

export default {
  getReferenceDetail,
  submitEmploymentReference,
  submitTenancyReference,
  submitSelfEmploymentReference
};
