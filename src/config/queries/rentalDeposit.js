import { gql } from "apollo-boost";

import { TRANSACTION_RESPONSE } from "config/queries/transaction"

const DEPOSIT_RESPONSE = gql`
fragment depositResponse on RentalDeposit {
    _id
    roleType
    referenceId
    depositType
    depositProtectionScheme
    depositReleased
    depositReleasedOn
    depositIncomeType
    createdOn
    markPaidRequested
    markPaidRequestedOn
    depositReleaseRequested
    depositReleaseRequestedOn
    sharedWith {
      _id
      firstName
      lastName
    }
    transaction {
        ...transactionResponse
    }
}
${TRANSACTION_RESPONSE}
`

export const createDeposit = gql`
    ${DEPOSIT_RESPONSE}
    mutation createDeposit(
        $transactionInput: TransactionInput!
        $rentalDepositInput: RentalDepositInput!) {
        createDeposit(
            transactionInput: $transactionInput
            rentalDepositInput: $rentalDepositInput
            ) {
                success
                message
                data {
                    ...depositResponse
                }
            }
    }
`

export const updateDeposit = gql`
    ${DEPOSIT_RESPONSE}
    mutation updateDeposit(
        $depositId: ID!
        $transactionInput: TransactionInput!
        $rentalDepositInput: RentalDepositInput!) {
        updateDeposit(
            depositId: $depositId
            transactionInput: $transactionInput
            rentalDepositInput: $rentalDepositInput
            ) {
                success
                message
                data {
                    ...depositResponse
                }
            }
    }
`

export const releaseDeposit = gql`
    ${DEPOSIT_RESPONSE}
    mutation releaseDeposit(
        $depositId: ID!) {
            releaseDeposit(depositId: $depositId) {
                success
                message
                data {
                    ...depositResponse
                }
            }
    } 
`

export const markDepositPaid = gql`
  mutation markDepositPaid(
    $depositId: ID!
    $paymentDate: DateTime!
    $paymentMethod: String!
  ) {
    markDepositPaid(
        depositId: $depositId
      paymentDate: $paymentDate
      paymentMethod: $paymentMethod
    ) {
      message
      success
      data {
        ...depositResponse
        }
    }
  }
  ${DEPOSIT_RESPONSE}
`

export const markDepositUnpaid = gql`
  mutation markDepositUnpaid(
    $depositId: ID!
  ) {
    markDepositUnpaid(
        depositId: $depositId
    ) {
      message
      success
      data {
        ...depositResponse
        }
    }
  }
  ${DEPOSIT_RESPONSE}
`
// get all deposits created by a particular landlord
export const getRentalDepositList = gql`
  ${DEPOSIT_RESPONSE}
  query getRentalDepositList {
    getRentalDepositList {
        success
        message
        data {
            ...depositResponse
        }
    }
  }
`
// get all deposits that is shared with a particular renter
export const getRenterDepositList = gql`
  ${DEPOSIT_RESPONSE}
  query getRenterDepositList {
    getRenterDepositList {
        success
        message
        data {
            ...depositResponse
        }
    }
  }
`

export const deleteDeposit = gql`
  mutation deleteDeposit(
    $depositId: ID!
  ) {
    deleteDeposit(
        depositId: $depositId
    ) {
      message
      success
      data {
        _id
        }
    }
  }
`

export const markDepositPaidByRenter = gql`
    ${DEPOSIT_RESPONSE}
    mutation markDepositPaidByRenter($depositId: ID!) {
      markDepositPaidByRenter(
            depositId: $depositId
            ) {
                success
                message
                data {
                    ...depositResponse
                }
            }
    }
`

export const markDepositUnpaidByRenter = gql`
    ${DEPOSIT_RESPONSE}
    mutation markDepositUnpaidByRenter($depositId: ID!) {
      markDepositUnpaidByRenter(
            depositId: $depositId
            ) {
                success
                message
                data {
                    ...depositResponse
                }
            }
    }
`

export const makeDepositReleaseRequest = gql`
    ${DEPOSIT_RESPONSE}
    mutation makeDepositReleaseRequest($depositId: ID!) {
      makeDepositReleaseRequest(
            depositId: $depositId
            ) {
                success
                message
                data {
                    ...depositResponse
                }
            }
    }
`

