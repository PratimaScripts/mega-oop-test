import React from "react"
import { Modal } from "antd"
import { CheckCircleOutlined  } from "@ant-design/icons"
import get from "lodash/get";

const ShareListingModal = ({successModal, showSuccessModal, propertyData }) => {
    const propertyURL = `${process.env.REACT_APP_ROC_PUBLIC}/property/${get(
        propertyData,
        "propertyId"
      )}`
    return (
        <Modal
        title={`Share Listing ${propertyData.title} !`}
        visible={successModal}
        footer={null}
        onCancel={() => showSuccessModal(!successModal)}
      >
        <div className="listng_publish_modal">
          <div className="listng_publish_icon">
            <CheckCircleOutlined />
          </div>
          <h2>Your Listing is active! Start promoting it.</h2>
          <p>
            To Receive Applications, send renters your apply link directly. Post
            it on your social media, your website, or anywhere else you want to
            advertise.
          </p>
          <p>
            If you are using upgraded plan, Your listing will be published to
            3rd party partner's website (Zoopla/ PrimeLocation/ Gumtree, etc)
            within the next day. You can turn-off sync at any time.
          </p>
          <div className="form-group">
            <label>Your Property Link</label>
            <input
              name={"applyLink"}
              value={propertyURL}
              className="form-control"
            />
            <small id="emailHelp" className="form-text text-muted">
              Share this link to invite renters to apply
            </small>
          </div>
          <div className="form-inline">
            <button type="button" className="btn btn-outline-dark btn-md">
              <i className="fa fa-envelope"></i>
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${propertyURL}&t=${encodeURI(
                    "Check this property out!"
                  )}`,
                  "_blank"
                )
              }
              type="button"
              className="btn btn-fb btn-md"
            >
              <i className="fa fa-facebook"></i>
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURI(
                    "Check this property out!"
                  )}&url=${propertyURL}&hashtags=rentoncloud,roc,property,renting`,
                  "_blank"
                )
              }
              type="button"
              className="btn btn-twitter btn-md"
            >
              <i className="fa fa-twitter"></i>
            </button>
          </div>
          <div className="footer__modal">
            <div
              className="btn btn_ok"
              onClick={() => {
                showSuccessModal(!successModal);
              }}
            >
              Ok
            </div>
          </div>
        </div>
      </Modal>
    )
}

export default ShareListingModal;