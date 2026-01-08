import React from "react";
import isEmpty from "lodash/isEmpty";
import { Tooltip } from "antd";
import Img from "react-image";
import get from "lodash/get";
import SubscriptionButtons from "../SubscriptionButtons";

function MonthSub({
  userRole,
  monthlyStandard,
  monthlyPremium,
  viewPlan,
  selectedPlan,
  buySubscriptionModal,
  cancelSubscriptionModal,
}) {
  return (
    <>
      {viewPlan === "monthly" && (
        <div className="">
          <div className="row" style={{ justifyContent: "center" }}>
            {userRole === "landlord" && (
              <div className="col-xl-4">
                <div className="main_wrapper">
                  <div className="head_wrapper">
                    {selectedPlan.displayName === "Standard Monthly" && (
                      <div className="current">
                        <Img
                          src={[
                            "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.webp",
                            "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.png",
                          ]}
                          alt="img"
                        />
                      </div>
                    )}
                  </div>
                  <div className="header">
                    <div className="plan-name">STANDARD</div>
                    <div className="plan-price">
                      {get(monthlyStandard, "[0].amount")}
                      <sup className="sup__tag">£</sup>
                    </div>
                    <div className="plan-frequency">per month / unit</div>
                  </div>
                  <div className="menu">
                    <ul>
                      <li>
                        <i className="fa fa-check"></i>{" "}
                        <strong>Include all features of Basic plan</strong>
                      </li>
                      <li className="text-center">
                        <i className="fa fa-plus"></i>
                      </li>
                      <li>
                        <i className="fa fa-check"></i> Market property on
                        partner sites{" "}
                        <Tooltip
                          overlayClassName="tooltip__color"
                          title="Listing on Zoopla, Rightmove, Primelocation, Gumtree and Facebook, OntheMarket.com"
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                            alt="i"
                          />
                        </Tooltip>
                      </li>
                      <li>
                        <i className="fa fa-check"></i> Send Rental Agreement
                        for eSign
                      </li>
                      <li>
                        <i className="fa fa-check"></i> Storage 5 GB
                      </li>
                      <li>
                        <i className="fa fa-check"></i> Collect rent via Direct
                        Debit
                      </li>
                      <li>
                        <i className="fa fa-check"></i> Deposit protection
                      </li>
                    </ul>
                    <div className="col-12 text-center my-4">
                      <SubscriptionButtons
                        onBuy={() => buySubscriptionModal(monthlyStandard)}
                        onCancel={() =>
                          cancelSubscriptionModal(monthlyStandard)
                        }
                        planName="Standard Monthly"
                        selectedPlan={selectedPlan}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-xl-4">
              <div className="main_wrapperTwo">
                <div
                  style={{
                    background:
                      userRole === "landlord"
                        ? "#63b82f"
                        : userRole === "renter"
                        ? "#822ad0"
                        : "#030aa9",
                  }}
                  className="head_wrapper"
                >
                  {isEmpty(selectedPlan) && (
                    <div className="current">
                      <Img
                        src={[
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.webp",
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.png",
                        ]}
                        alt="img"
                      />
                    </div>
                  )}
                  <div className="header">
                    <div className="plan-name">BASIC</div>
                    <div className="plan-price">
                      0<sup className="sup__tag">£</sup>
                    </div>
                    <div className="plan-frequency">per month </div>
                  </div>
                </div>
                <div className="menuTwo">
                  <ul>
                    {userRole === "renter" ? (
                      <>
                        <li>
                          <i className="fa fa-check"></i>All Features are Free
                        </li>
                        <li>
                          <i className="fa fa-check"></i>No Admin Fee
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Sign Up for Free
                        </li>
                        <li>
                          <i className="fa fa-plus"></i>Bolt-on zyPass™ Tenant
                          screening{" "}
                          <Tooltip
                            overlayClassName="tooltip__color"
                            title="Paid by Renter £10 +VAT per person if ordered as standalone profile screening. However, you don’t have to pay if you apply & agreed to rent using our web-application platform as part of application process successfully."
                          >
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                              alt="i"
                            />
                          </Tooltip>
                        </li>
                      </>
                    ) : userRole === "landlord" ? (
                      <>
                        <li>
                          <i className="fa fa-check"></i>List &amp; manage
                          Rental 1 unit
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Viewing and enquiry
                          organiser
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Online Offer &amp;
                          applications
                        </li>
                        <li>
                          <i className="fa fa-plus"></i>Bolt-on zyPass™ Landlord
                          screening{" "}
                          <Tooltip
                            overlayClassName="tooltip__color"
                            title="Option to use your account without screening. However, in order to use certain functionality, you must complete zyPass™ personal profile screening @£10 +VAT that includes 4 units of landlord property title verification with land registry and anti-money laundering (AML) compliance check to help us prevent fraud and create trust for your potential renters and other RentOnCloud users."
                          >
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                              alt="i"
                            />
                          </Tooltip>
                        </li>
                        <li>
                          <i className="fa fa-plus"></i>Bolt-on zyPass™ Tenant
                          screening{" "}
                          <Tooltip
                            overlayClassName="tooltip__color"
                            title="Cookie PolicyTerms of usePrivacy Policy
                                                            Paid by landlord @ £10+VAT per person on successful rent application."
                          >
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                              alt="i"
                            />
                          </Tooltip>
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Draft Rental Agreement
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Storage up to 50 MB
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Automated rental demand
                          invoice
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Raise maintenance tasks
                          &amp; pay online
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Manage accounting &amp;
                          finance.
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Generate Tax return
                          report
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <i className="fa fa-check"></i>No start-up Fee
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Publish online webpage
                        </li>
                        <li>
                          <i className="fa fa-check"></i>List your service price
                          card
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Get direct order online
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Unlimited bid on
                          maintenance tasks
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Get referral feedback
                        </li>
                        <li>
                          <i className="fa fa-check"></i>10% admin fee +VAT on
                          paid earning amount
                        </li>
                        <li>
                          <i className="fa fa-check"></i>Sign Up for Free
                        </li>
                      </>
                    )}
                  </ul>
                  <div className="col-12 text-center my-4">
                    <a
                      style={{ backgroundColor: "#f28e1d " }}
                      href
                      className="btn btn-grey btn__plan"
                    >
                      Start Free
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {userRole === "landlord" && (
              <div className="col-xl-4">
                <div className="main_wrapperThree">
                  {selectedPlan.displayName === "Premium Monthly" && (
                    <div className="current">
                      <Img
                        src={[
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.webp",
                          "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/current-plan.png",
                        ]}
                        alt="img"
                      />
                    </div>
                  )}
                  <div className="header">
                    <div className="plan-name">PREMIUM</div>
                    <div className="plan-price">
                      {get(monthlyPremium, "[0].amount")}
                      <sup className="sup__tag">£</sup>
                    </div>
                    <div className="plan-frequency">per month / unit</div>
                  </div>
                  <div className="menuThree">
                    <ul>
                      <li>
                        <i className="fa fa-check"></i>{" "}
                        <strong>Include all features of Standard plan</strong>
                      </li>
                      <li className="text-center">
                        <i className="fa fa-plus"></i>
                      </li>
                      <li>
                        <i className="fa fa-check"></i> Expert Accountant to
                        prepare &amp; submit Tax return
                      </li>
                      <li>
                        <i className="fa fa-check"></i> zyPass™ Landlord
                        screening and Tenant Referencing
                      </li>
                      <li>
                        <i className="fa fa-check"></i>Bolt-on zyPass™ Tenant
                        screening{" "}
                        <Tooltip
                          overlayClassName="tooltip__color"
                          title="Include certified accountancy service partner to Register new company, Accounting, Corporation Tax returns, Dividend admin, Secretarial services, Virtual registered address"
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                            alt="i"
                          />
                        </Tooltip>
                      </li>
                    </ul>
                    <div className="col-12 text-center my-4">
                      <SubscriptionButtons
                        onBuy={() => buySubscriptionModal(monthlyPremium)}
                        onCancel={() => cancelSubscriptionModal(monthlyPremium)}
                        planName="Premium Monthly"
                        selectedPlan={selectedPlan}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default MonthSub;
