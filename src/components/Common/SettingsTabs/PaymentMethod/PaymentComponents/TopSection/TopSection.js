import React from 'react'
import HeaderPayment from './HeaderPayment';
import MiddlePayment from './MiddlePayment';
import FooterPayment from './FooterPayment'

const TopSection = (props) => {
  let { userRole } = props
  return (
    <section>
      <HeaderPayment userRole={userRole} />
      <div className="row">
        <MiddlePayment
          {...props}
        />
        <FooterPayment
          {...props}
        />
      </div>
    </section>

  )
}
export default TopSection