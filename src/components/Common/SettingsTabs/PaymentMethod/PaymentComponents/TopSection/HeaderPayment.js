import React from 'react'

const HeaderPayment = ({ userRole }) => {
  return (
    <div className="header">
      {userRole !== "renter" && (
        <p className="label__title">How do you want to get paid?</p>
      )}
      <h3 className="mt-4 mb-4  font-weight-400  bank-intro">
        {userRole === "servicepro" &&
          "While making an offer on open job task in marketplace, you will be required to select a payment method of earning. Once a task is completed, you will be able to request payment from the Task Owner, who will then release it to your choice of connected account."}
        {userRole === "landlord" &&
          "We don’t hold any payment unless it is specified on transaction or options such as redirect Rental deposit to Statutory custodian scheme. This integration feature is provided to Landlord to choose how to receive Rental money earnings."}
      </h3>
    </div>
  )
}
export default HeaderPayment