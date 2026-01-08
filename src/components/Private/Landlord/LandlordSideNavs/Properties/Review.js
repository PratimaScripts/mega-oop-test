import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import { Modal, Tag, Dropdown, Menu } from "antd";

import "./styles.scss";
const PropertyReview = (props) => {
  const [propertyData, setPropertyData] = useState(
    get(props, "property", get(props, "location.state.property", {}))
  );
  const [listingData, setListingData] = useState(
    get(props, "listing", get(props, "location.state.listing", {}))
  );

  let slider1 = useRef();
  const [nav1, setnav1] = useState(null);

  useEffect(() => {
    setPropertyData(
      get(props, "property", get(props, "location.state.property", {}))
    );
    setListingData(
      get(props, "listing", get(props, "location.state.listing", {}))
    );
    setnav1(slider1);
  }, [props]);

  let allImages = get(propertyData, "photos", []);
  allImages = allImages ? allImages : [];
  !isEmpty(get(listingData, "photos", [])) &&
    allImages.push(...get(listingData, "photos", ...[]));
  !isEmpty(get(listingData, "videoUrl", [])) &&
    allImages.push(...get(listingData, "videoUrl", ...[]));

  const [isApplyToRent, setApplyToRent] = useState(false);
  const [isSendMessage, setSendMessageStatus] = useState(false);
  const [isBookViewing, setBookViewingStatus] = useState(false);

  let settingsImg = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // nextArrow: <button><Icon key="left" type="left" style={{ fontSize: '20px', color: '#000' }} theme="outlined" /></button>,
    // prevArrow: <b className="previous_btn">prev</b>
  };

  let settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
  };

  const settingsTwo = {
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    rows: 2,
    slidesPerRow: 2,
  };

  // console.log(propertyData);
  // console.log(listingData)
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="modal__card">
            <div
              className="row modal__slider px-2"
              style={{ position: "relative" }}
            >
              <Tag
                className="property__tag"
                color={
                  get(propertyData, "status") === "Rented"
                    ? "#65cd5c"
                    : get(propertyData, "status") === "Occupied"
                    ? "#712e97"
                    : get(propertyData, "status") === "Listed"
                    ? "#2ec3d7"
                    : get(propertyData, "status") === "Archived"
                    ? "default"
                    : "#ff5a68"
                }
              >
                {get(propertyData, "status")}
              </Tag>

              <Slider
                asNavFor={nav1}
                ref={(slider) => (slider1 = slider)}
                className="image__slider"
                {...settingsImg}
              >
                {" "}
                {!isEmpty(allImages) &&
                  allImages.map((img, i) => {
                    let tOf = typeof img;
                    return (
                      <>
                        {img &&
                          (tOf !== "object" && img.includes("youtube.com") ? (
                            <ReactPlayer
                              url={img}
                              youtubeConfig={{ playerVars: { showinfo: 1 } }}
                              width="100%"
                              height="100%"
                            />
                          ) : (
                            <img
                              alt={img}
                              className="upper_images"
                              src={tOf === "string" ? img : img.preview}
                            />
                          ))}
                      </>
                    );
                  })}
              </Slider>
            </div>

            <div className="row modal__content">
              <p
                style={{
                  cursor: "pointer",
                }}
                className="property__address d-block my-2 mx-2 px-1"
              >
                {" "}
                {get(propertyData, "address.fullAddress").replace(
                  "UNITED KINGDOM",
                  ""
                )}
              </p>
              <p className="property__types border d-block my-1 mx-2">
                {get(propertyData, "propertyType")} &gt;{" "}
                {get(propertyData, "subType")}{" "}
              </p>
            </div>

            <div className="row modal__details">
              <div className="col-6 row py-1 px-3">
                <div className="col-2 icons">
                  <i className="fas fa-bed"></i>{" "}
                </div>
                <div className="col-4 detail">
                  {get(propertyData, "numberOfBed", 0)} Bedroom
                </div>
              </div>

              <div className="col-6 row py-1 px-3 ml-3">
                <div className="col-2 icons">
                  <i className="fas fa-bath"></i>{" "}
                </div>
                <div className="col-4 detail">
                  {get(propertyData, "numberOfBath", 0)} Bathroom
                </div>
              </div>

              <div className="w-100"></div>
              <div className="col-6 row py-1 px-3">
                <div className="col-2 icons">
                  <i className="fas fa-couch"></i>{" "}
                </div>
                <div className="col-4 detail">
                  {get(propertyData, "numberOfReception", 0)} Reception
                </div>
              </div>

              <div className="col-6 row py-1 px-3 ml-3">
                <div className="col-2 icons">
                  <i className="fas fa-tape"></i>{" "}
                </div>
                <div className="col-4 detail">
                  {get(propertyData, "sizeInSquareFeet", 300)} sq. ft.
                </div>
              </div>
            </div>

            <div className="row mt-2 modal__actions px-1">
              <div
                className="col-6 border py-3 px-3 action"
                onClick={() =>
                  props.history.push(`/landlord/listings`, propertyData)
                }
              >
                View Listings
              </div>
              <div
                className="col-6 border py-3 px-3 action"
                onClick={() =>
                  props.history.push(
                    `/landlord/accounting/rental-invoice`,
                    propertyData
                  )
                }
              >
                Accounting Transactions
              </div>
              <div
                className="col-6 border py-3 px-3 action"
                onClick={() =>
                  props.history.push(`/landlord/fixit/raisetask`, propertyData)
                }
              >
                Manage Tenancies
              </div>
              <div
                className="col-6 border py-3 px-3 action"
                onClick={() =>
                  props.history.push(`/landlord/fixit/raisetask`, propertyData)
                }
              >
                Fixit tasks
              </div>
            </div>

            <div className="mt-2 mb-1 modal__more-actions pl-0 ">
              <Dropdown
                className="d-inline ml-2"
                overlay={
                  <Menu
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Menu.Item
                      onClick={() =>
                        props.history.push(`property/edit`, propertyData)
                      }
                    >
                      {" "}
                      Edit
                    </Menu.Item>
                    {propertyData.status !== "Listed" && (
                      <Menu.Item
                        onClick={() => {
                          if (propertyData.status === "Archived") {
                            props.showNotification(
                              "error",
                              "This property is Archived! Un-archive first to perform this action",
                              ""
                            );
                          } else if (propertyData.status === "Rented") {
                            props.confirmModal({
                              message:
                                "You already have active tenancy. To make property listed again, you will have to end the agreement first",
                              onOKFunction: () =>
                                props.showNotification(
                                  "error",
                                  "End Tenency Module is yet to be build",
                                  ""
                                ),
                              okText: "End Tenancy",
                            });
                          } else {
                            props.history.push(`property/listing/edit`, {
                              selectedProperty: propertyData,
                              allProperties: props.initialPropData,
                            });
                          }
                        }}
                      >
                        List
                      </Menu.Item>
                    )}
                    {propertyData.status === "Listed" && (
                      <Menu.Item
                        onClick={() =>
                          props.confirmModal({
                            message:
                              "This action will remove public listing of your property from RentOnCloud market website. It may appear in other places like search engine results. \nAre you sure?",
                            onOKFunction: () =>
                              props.updatePropertyStatus({
                                variables: {
                                  propertyId: propertyData.propertyId,
                                  status: "Un-Listed",
                                },
                              }),
                          })
                        }
                      >
                        Un-List
                      </Menu.Item>
                    )}
                    {propertyData.status !== "Rented" &&
                      propertyData.status !== "Occupied" && (
                        <Menu.Item
                          onClick={() => {
                            if (propertyData.status === "Archived") {
                              props.showNotification(
                                "error",
                                "This property is Archived! Un-archive first to perform this action",
                                ""
                              );
                            } else {
                              props.confirmModal({
                                message:
                                  "This action will change your property status to Rented after completion of rental agreement and remove active listing from public website if any. \nAre you sure?",
                                onOKFunction: () =>
                                  props.showNotification(
                                    "error",
                                    "Create Tenency Module is yet to be build",
                                    ""
                                  ),
                                okText: "Create Tenancy",
                              });
                            }
                          }}
                        >
                          Move-In
                        </Menu.Item>
                      )}
                    {propertyData.status !== "Occupied" && (
                      <Menu.Item
                        onClick={() =>
                          props.confirmModal({
                            message:
                              "Are you sure want to self occupy this property?",
                            onOKFunction: () =>
                              props.updatePropertyStatus({
                                variables: {
                                  propertyId: propertyData.propertyId,
                                  status: "Occupied",
                                },
                              }),
                          })
                        }
                      >
                        Self-Occupy
                      </Menu.Item>
                    )}

                    {propertyData.status !== "Archived" && (
                      <Menu.Item
                        onClick={() =>
                          props.confirmModal({
                            message:
                              "Are you sure want to archive this property?",
                            onOKFunction: () =>
                              props.updatePropertyStatus({
                                variables: {
                                  propertyId: propertyData.propertyId,
                                  status: "Archived",
                                },
                              }),
                          })
                        }
                      >
                        Archive
                      </Menu.Item>
                    )}
                    {propertyData.status === "Archived" && (
                      <Menu.Item
                        onClick={() =>
                          props.confirmModal({
                            message:
                              "Are you sure want to unarchive this property?",
                            onOKFunction: () =>
                              props.updatePropertyStatus({
                                variables: {
                                  propertyId: propertyData.propertyId,
                                  status: "Un-Listed",
                                },
                              }),
                          })
                        }
                      >
                        Unarchive
                      </Menu.Item>
                    )}
                  </Menu>
                }
              >
                <a
                  className="ant-dropdown-link"
                  href="/#"
                  onClick={(e) => e.preventDefault()}
                >
                  More Actions{" "}
                  <i
                    className="fa fa-ellipsis-v"
                    style={{ marginLeft: "3px" }}
                  ></i>
                </a>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Apply to Rent"
        visible={isApplyToRent}
        footer={null}
        width={700}
        onOk={() => setApplyToRent(false)}
        onCancel={() => setApplyToRent(false)}
      >
        <div className="applyrent__modal">
          <h4>Profile Referencing Request</h4>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <div className="info__inputwrapper"></div>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry.Lorem Ipsum is simply dummy text
            of the printing and typesetting industry.{" "}
            <a href>View example report</a>{" "}
          </p>
          <p className="confirm_order">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <hr />
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-primary">Cancel</button>
            <button className="btn btn-primary">Order Now</button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Send Message"
        footer={null}
        width={700}
        visible={isSendMessage}
        onOk={() => setSendMessageStatus(false)}
        onCancel={() => setSendMessageStatus(false)}
      >
        <div className="applyrent__modal">
          <h4>Message to Landlord: xxxxxxxxxxxxxxxxxxxxxxxxxxx</h4>
          <p className="confirm_order">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <div className="info__inputwrapper">
            <textarea
              className="form-control"
              placeholder="I would like to know about school of this area........"
              name="description"
              spellcheck="false"
            ></textarea>
          </div>
          <p className="text-danger">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <hr />
          <div className="text-right">
            <button className="btn btn-warning">Send</button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Book Viewing"
        footer={null}
        width={700}
        visible={isBookViewing}
        onOk={() => setBookViewingStatus(false)}
        onCancel={() => setBookViewingStatus(false)}
      >
        <div className="applyrent__modal">
          <h4>Arrange a Viewing for 2 bed Semi-detached house, TW13</h4>
          <p className="confirm_order mb-0">
            Lorem Ipsum is simply dummy text.
          </p>
          <p className="select_datetext">Lorem Ipsum is simply dummy text.</p>
          <div className="info__inputwrapper">
            <Slider className="parentClassSlider" {...settings}>
              {" "}
              {Array.from({ length: 21 }).map((img, i) => {
                return (
                  <button key={i} className="btn btn-outline-primary">
                    21 May
                  </button>
                );
              })}
            </Slider>
          </div>

          <div className="info__inputwrapper">
            <Slider className="parentClassSliderTwo" {...settingsTwo}>
              {" "}
              {Array.from({ length: 20 }).map((img, i) => {
                return (
                  <button key={i} className="btn btn-outline-primary">
                    9:00 - 9:30
                  </button>
                );
              })}
            </Slider>
          </div>
          <p className="text-danger">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <hr />
          <div className="text-right">
            <button className="btn btn-warning">Request Slot</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default withRouter(PropertyReview);
