import React, { useState, useEffect } from "react";
import get from "lodash/get";
import Slider from "react-slick";
import isEmpty from "lodash/isEmpty";
import { withRouter, useHistory } from "react-router-dom";
import {
  Drawer,
  Modal,
  message,
  Tooltip,
  Tag,
  Typography,
  Popconfirm,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ReactHtmlParser from "react-html-parser";

import ListingReview from "../../../Private/Landlord/LandlordSideNavs/Listing/ListingReview";
import PropertyQueries from "config/queries/property";
import { useMutation } from "@apollo/react-hooks";

import "../styles.scss";
import { publishUpdatedListing } from "../../../../config/queries/listing";
import showNotification from "config/Notification";

const { Paragraph, Text, Link } = Typography;

const ReviewListing = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isListingDrawerOpen, toggleListingDrawer] = useState(false);
  const [publish, setActive] = useState(
    props.propertyData?.status === "Listed" ? true : false
  );
  const history = useHistory();
  const [partnerSearchEngine, setPartnerSearchEngine] = useState(
    get(props, "listingData.partnerSearchEngine", false)
  );

  const [agreedToTerms, setAgreeToTerms] = useState(false);

  const [photos, setphotos] = useState([]);

  const [updatePropertyStatus] = useMutation(
    PropertyQueries.updatePropertyStatus
  );

  const [publishDraftedListingById, { loading: publishing }] = useMutation(
    publishUpdatedListing,
    {
      onCompleted: ({ publishUpdatedListing }) => {
        if (publishUpdatedListing._id) {
          showNotification(
            "success",
            "Published",
            "updated recent changes made in listing."
          );
          history.push("/landlord/listings");
        }
      },
    }
  );

  const handleUpdateDraftClick = () => {
    publishDraftedListingById({
      variables: { propertyId: props.propertyData.propertyId },
    });
  };

  const propertyURL = `${process.env.REACT_APP_PUBLIC_URL}/property/${get(
    props,
    "propertyData.propertyId"
  )}`;

  useEffect(() => {
    setphotos(get(props, "listingData.photos", []));
  }, [props]);

  let settings = {
    dots: false,
    infinite: true,
    nextArrow: <b className="next_btn">next</b>,
    prevArrow: <b className="previous_btn">prev</b>,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [publishedModal, togglePublishedModal] = useState(false);

  const changeStatus = () => {
    setConfirmLoading(true);
    if (!agreedToTerms && !publish) {
      message.error("Please Check the Terms and Conditions first!");
    } else if (agreedToTerms && !publish) {
      // e.target.checked && togglePublishedModal(true);

      updatePropertyStatus({
        variables: {
          propertyId: get(props, "propertyData.propertyId"),
          status: "Listed",
        },
      });

      setActive(!publish);
      togglePublishedModal(true);
    } else if (publish) {
      updatePropertyStatus({
        variables: {
          propertyId: get(props, "propertyData.propertyId"),
          status: "Un-Listed",
        },
      });

      setActive(!publish);
    }
    setConfirmLoading(false);
  };

  const publishConfirmTitle = !publish
    ? "Are you sure want to publish this property?"
    : "Are you sure want to unlist this property";

  const getApplyLink = !publish ? (
    <Text type="warning">
      Your property is not currently listed! Switch to yes to list and get the
      apply link
    </Text>
  ) : (
    <Paragraph copyable={{ text: propertyURL }}>
      <Link href={propertyURL} target="_blank">
        {propertyURL}
      </Link>
    </Paragraph>
  );

  const description = `Could this ${props.propertyData.title} ${
    props.propertyData?.uniqueId &&
    !props.propertyData.title?.includes(props.propertyData.uniqueId)
      ? props.propertyData.uniqueId
      : ""
  } be your next rented home to live in? There are ${get(
    props,
    "propertyData.numberOfBed",
    0
  )} bedrooms, and ${get(
    props,
    "propertyData.numberOfBath",
    0
  )} bathrooms. <br />
  Just click “Send Message" if you have queries and the landlord will reply on instant chat messenger if online or get notified to respond as soon as available.<br />`;

  return (
    <>
      <div className="row">
        <div className="col-md-12 schedule__left--wrapper">
          <h3 className="schedule__left--heading">Your Listing Details</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="review__btns--box">
            <div className="row row__mar--zero">
              <div className="col-lg-3">
                <Slider {...settings}>
                  {" "}
                  {!isEmpty(photos) &&
                    photos.map((img, i) => {
                      return (
                        <div className="image_wishlist">
                          <img
                            key={i}
                            src={get(img, "preview", img)}
                            alt={img.name}
                          />
                        </div>
                      );
                    })}
                </Slider>
              </div>
              <div className="col-lg-7">
                <div className="up__listing">
                  <ul>
                    <li>
                      <span className="font-16">
                        <i className="fas fa-money-bill-alt"></i>{" "}
                        {get(props, "listingData.monthlyRent", 0)} p/m{" "}
                        <font>£</font>
                      </span>
                    </li>
                    <li>
                      <span className="font-16">
                        <i className="fas fa-coins"></i>{" "}
                        {get(props, "listingData.deposit", 0)} <font>£</font>
                      </span>
                    </li>
                    <li>
                      <span className="font-16">
                        <i className="fas fa-map-marker-alt"></i> Distance{" "}
                        <font>view map</font>
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="middle__matter">
                  {!props.propertyData?.title?.includes(
                    get(props.propertyData, "subType", "")
                  )
                    ? `${get(props.propertyData, "numberOfBed", "0")} Bed ${get(
                        props.propertyData,
                        "subType",
                        ""
                      )} ${get(props.propertyData, "title", "property title")}`
                    : get(props.propertyData, "title", "property title")}{" "}
                  {props.propertyData?.uniqueId &&
                  !props.propertyData?.title?.includes(
                    props.propertyData?.uniqueId
                  )
                    ? props.propertyData.uniqueId
                    : ""}
                </p>

                <div>
                  {" "}
                  {ReactHtmlParser(
                    get(props, "listingData.description")
                      ? get(props, "listingData.description")
                      : description
                  )}
                </div>

                <br />
                <br />
                <br />
                <div className="down__listing">
                  <ul>
                    <li>
                      <Tag color="green">
                        {get(props, "listingData.furnishing")}
                      </Tag>
                    </li>
                    <li>
                      <i className="fas fa-bed"></i>{" "}
                      {get(props, "propertyData.numberOfBed")}
                    </li>
                    <li>
                      <i className="fas fa-bath"></i>{" "}
                      {get(props, "propertyData.numberOfBath")}
                    </li>
                    <li>
                      <i className="fas fa-couch"></i>{" "}
                      {get(props, "propertyData.numberOfReception")}
                    </li>
                    <li>
                      <i className="fas fa-tape"></i>{" "}
                      {get(props, "propertyData.sizeInSquareFeet")} sq. ft
                    </li>
                    <li>
                      <i className="fas fa-camera"></i>{" "}
                      {photos ? photos.length : 0}
                    </li>
                    {/* <li>
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                        alt="loading..."
                      />
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                        alt="loading..."
                      />
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 review_btns__wrapper">
                <button className="btn btn__apply" disabled>
                  Apply to Rent
                </button>
                <button className="btn btn__offer" disabled>
                  Make an Offer
                </button>
                <button className="btn btn__book" disabled>
                  Book Viewing
                </button>
                <button
                  className="btn btn__details"
                  onClick={
                    () => toggleListingDrawer(!isListingDrawerOpen)
                    // props.history.push("/landlord/property/review", {
                    //   property: props.propertyData,
                    //   listing: props.listingData
                    // })
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 agree__checkbox">
          <input
            disabled={props.isPreviewMode}
            type="checkbox"
            onChange={(e) => {
              setAgreeToTerms(e.target.checked);
            }}
            className="smallCheckbox"
            id="agree"
          />
          <label for="agree">Agree To The RentOnCloud Terms*</label>
        </div>
        <div className="col-lg-12">
          <p>
            I confirm that I charge no{" "}
            <a href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`}>
              admin fees
            </a>{" "}
            to renters, that I am the landlord of this property and have the
            right to offer it for rental, and I agree to the RentOnCloud{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`${process.env.REACT_APP_ROC_PUBLIC}/terms-of-use`}
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`${process.env.REACT_APP_ROC_PUBLIC}/privacy-policy`}
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="review__publish">
            <div className="flex__toggle">
              <h2>Publish on RentOnCloud</h2>
              <Popconfirm
                placement="topLeft"
                title={publishConfirmTitle}
                onConfirm={changeStatus}
                okButtonProps={{ loading: confirmLoading }}
                okText={!publish ? "Yes, Publish" : "Unlist"}
                cancelText={!publish ? "No, Wil do later" : "No!"}
              >
                <label className="switch" for="profilePictureMe">
                  <input
                    onChange={(e) => e.preventDefault()}
                    checked={publish && !props.listingData?.isDraft}
                    defaultChecked={publish && !props.listingData?.isDraft}
                    disabled={props.isPreviewMode}
                    type="checkbox"
                    id="profilePictureMe"
                  />
                  <div className="slider round"></div>
                </label>
              </Popconfirm>
            </div>
            <div className="form-group">
              <label className="labels__global">Apply Link</label>
              <br />
              {getApplyLink}
            </div>
            <ul>
              <li>
                <button
                  onClick={() => {
                    window.open(
                      `mailto:mail@mail.com?&subject=${get(
                        props,
                        "propertyData.title"
                      )}&body=${encodeURI(
                        `Hi I found this property via rent on cloud, check it out! - ${propertyURL}`
                      )}`,
                      "_blank"
                    );
                  }}
                  className="btn btn__mail"
                >
                  <i className="fa fa-envelope"></i>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${propertyURL}&t=${encodeURI(
                        "Check this property out!"
                      )}`,
                      "_blank"
                    )
                  }
                  className="btn btn__facebook"
                >
                  <i className="fa fa-facebook-f"></i>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURI(
                        "Check this property out!"
                      )}&url=${propertyURL}&hashtags=rentoncloud,roc,property,renting`,
                      "_blank"
                    )
                  }
                  className="btn btn__twitter"
                >
                  <i className="fa fa-twitter"></i>
                </button>
              </li>
            </ul>
            {props.listingData?.isDraft ? (
              <div className="review_update">
                <span>
                  for updating recent changes made in listing, click update
                </span>
                <Popconfirm
                  placement="topLeft"
                  title={
                    agreedToTerms
                      ? "Are you sure want to publish this property?"
                      : "Please Check the Terms and Conditions first!"
                  }
                  onConfirm={agreedToTerms ? handleUpdateDraftClick : null}
                  okButtonProps={{ loading: publishing, disabled: publishing }}
                  okText={agreedToTerms ? "Yes, Publish" : "Ok"}
                  cancelText="No, Wil do later"
                  cancelButtonProps={{
                    style: { display: agreedToTerms ? "" : "none" },
                  }}
                >
                  <button className="btn">
                    <span className="mdi mdi-cloud-upload mr-2" />
                    Update
                  </button>
                </Popconfirm>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="review__publish">
            <div className="flex__toggle">
              <h2>
                Partner search engine{" "}
                <Tooltip
                  overlayClassName="tooltip__color"
                  title="Publish your property listing on 3rd party portals such as: Zoopla, Primelocation, Rightmove, Gumtree, etc. This is available to only upgraded plan"
                >
                  <img
                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                    alt="i"
                    className="ml-2 feature_tooltip"
                  />
                </Tooltip>{" "}
                <Tag color="blue">Coming Soon</Tag>
              </h2>
              <label className="switch" for="partnerSearchEngine">
                <input
                  onChange={(e) => {
                    // console.log("ARE THEY?", agreedToTerms);
                    if (!agreedToTerms) {
                      e.preventDefault();
                      setPartnerSearchEngine(!e.target.checked);
                      message.error(
                        "Please Check the Terms and Conditions first!"
                      );
                    }
                    if (agreedToTerms) {
                      setPartnerSearchEngine(e.target.checked);
                    }
                  }}
                  defaultChecked={partnerSearchEngine}
                  checked={partnerSearchEngine}
                  type="checkbox"
                  // disabled={props.isPreviewMode}
                  disabled={true}
                  id="partnerSearchEngine"
                />
                <div className="slider round"></div>
              </label>
            </div>
            <p>
              After enabling, It can take between 6 and 24 hours to syndicate.
              Check back here for updates. Listing deactivates in 21 days,
              review this settings to enable it again if property is not yet
              rented.
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 text-center">
          <space size="large">
            <button
              onClick={() => props.history.push("/landlord/listings")}
              style={{ marginLeft: "10px", marginTop: "10px" }}
              className="btns__warning--schedule"
            >
              Back To Listing
            </button>
          </space>
        </div>
      </div>

      <Drawer
        title="Review"
        placement="right"
        closable={true}
        width={"100%"}
        zIndex={999999999}
        onClose={() => toggleListingDrawer(!isListingDrawerOpen)}
        visible={isListingDrawerOpen}
      >
        <ListingReview
          {...props}
          isDrawer={true}
          property={props.propertyData}
          listing={props.listingData}
        />
      </Drawer>

      <Modal
        title={
          !props.propertyData.title.includes(
            get(props.propertyData, "subType", "")
          )
            ? `${get(props.propertyData, "numberOfBed", "0")} Bed ${get(
                props.propertyData,
                "subType",
                ""
              )} ${get(props.propertyData, "title", "property title")}`
            : get(props.propertyData, "title", "property title") -
              (props.propertyData.uniqueId &&
                !props.propertyData.title?.includes(
                  props.propertyData.uniqueId
                ))
            ? props.propertyData.uniqueId
            : ""
        }
        visible={publishedModal}
        footer={null}
        // onOk={this.handleOk}
        onCancel={() => togglePublishedModal(!publishedModal)}
      >
        <div className="listng_publish_modal" style={{ textAlign: "center" }}>
          <div className="listng_publish_icon">
            {/* <Icon type="check-circle" /> */}
            <CheckCircleOutlined
              style={{ color: "#52c41a", fontSize: "72px" }}
            />
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
            <label>Your Apply Link</label>
            {getApplyLink}
            <small id="emailHelp" className="form-text text-muted">
              Share this link to invite renters to apply
            </small>
          </div>
          <div className="form-inline">
            <button
              onClick={() => {
                window.open(
                  `mailto:mail@mail.com?&subject=${get(
                    props,
                    "propertyData.title"
                  )}&body=${encodeURI(
                    `Hi I found this property via rent on cloud, check it out! - ${propertyURL}`
                  )}`,
                  "_blank"
                );
              }}
              type="button"
              className="btn btn-outline-dark btn-md"
            >
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
          <p className="mt-3" style={{ color: "red" }}>
            This listing will remain active for 21 days.
          </p>
          <div
            className="footer__modal"
            onClick={() => {
              togglePublishedModal(!publishedModal);
              props.history.push("/landlord/listings");
            }}
          >
            <div className="btn btn_ok">Ok</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default withRouter(ReviewListing);
