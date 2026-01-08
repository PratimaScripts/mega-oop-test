import React, {
  useState,
  useEffect,
  useRef,
  useContext
} from "react";
import { withRouter } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NeighborhoodMap from "../Properties/Maps";
import PropertyQueries from "../../../../../config/queries/property";
import { getDocument } from "../../../../../config/queries/listing";
import { useQuery, useMutation } from "@apollo/react-hooks";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Slider from "react-slick";
import ReactHtmlParser from "react-html-parser";
import Card from "../../../../Common/Card";
import ReactPlayer from "react-player";
import moment from "moment";
import { Modal, Tooltip } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { UserDataContext } from "store/contexts/UserContext";

import "./styles.scss";
import "../Properties/styles.scss";

let amnetiesObj = {
  ElectricOven: {
    name: "Electric Oven",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/voltage.png",
  },
  airConditioner: {
    name: "Air Conditioner",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/air-conditioner.png",
  },
  basement: {
    name: "Basement / Loft",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/basement.png",
  },
  carpetFloors: {
    name: "Carpet Floors",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/carpet.png",
  },
  centralHeating: {
    name: "Central Heating",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/heating-room.png",
  },
  conservatory: {
    name: "Conservatory",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/shield.png",
  },
  dishWasher: {
    name: "Diswasher",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dishwasher.png",
  },
  fireplace: {
    name: "Fireplace",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/fireplace.png",
  },
  gasCooker: {
    name: "Gas Cooker",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/gas-industry.png",
  },
  gatedEntrance: {
    name: "Gated Entrance",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/shield.png",
  },
  gym: {
    name: "Gym",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dumbbell.png",
  },
  intercom: {
    name: "Intercom",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/walkietalkie.png",
  },
  lift: {
    name: "Lift",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/elevator.png",
  },
  park: {
    name: "Park",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/park-bench.png",
  },
  refrigerator: {
    name: "Refrigerator",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/fridge.png",
  },
  swimmingPool: {
    name: "Swimming Pool",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/swimming-filled.png",
  },
  visitorParking: {
    name: "Visitor Parking",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/carpark.png",
  },
  washerDryer: {
    name: "Washer/Dryer",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/washing-machine.png",
  },
  waterfront: {
    name: "Waterfront",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/water-park.png",
  },
  woodFloors: {
    name: "Wood Floors",
    img: "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/wooden-floor.png",
  },
};

const ListingReview = (props) => {
  const { state } = useContext(UserDataContext);
  const [propertyData, setPropertyData] = useState(
    get(props, "property", get(props, "location.state.property", {}))
  );
  const [listingData, setListingData] = useState(
    get(props, "listing", get(props, "location.state.listing", {}))
  );

  const [documents, setDocumets] = useState([]);

  useQuery(getDocument, {
    variables: {
      listingId: listingData.listingId
    },
    onCompleted: data => {
      if (data.getDocument.status) setDocumets(data.getDocument.data);
    }
  });

  const accountSetting = state.accountSettings
  let dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat") + " hh:mm a"
    : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;

  let slider1 = useRef();
  let slider2 = useRef();
  const [nav1, setnav1] = useState(null);
  const [nav2, setnav2] = useState(null);

  const [successModal, showSuccessModal] = useState(false);

  const [
    isPublished,
    // setPublishedStatus
  ] = useState(get(listingData, "publish", { publish: false, link: "" }));

  useEffect(() => {
    setPropertyData(
      get(props, "property", get(props, "location.state.property", {}))
    );
    setListingData(
      get(props, "listing", get(props, "location.state.listing", {}))
    );
    setnav1(slider1);
    setnav2(slider2);
  }, [props]);

  const [neighborHoodData, setNeighborhoodData] = useState([]);

  const getPropertyStatus = (property, isLower = true) => {
    if (property.status !== null) {
      const status =
        property.status !== null && get(property, "status") !== "Un-Listed"
          ? get(property, "status", "Sample Title")
          : get(property, "listing.listingId")
            ? "Incomplete"
            : get(property, "status", "Sample Title");
      return isLower ? status.toLowerCase() : status;
    }
    return isLower ? "un-listed" : "Un-Listed";
  };

  let allImages = [];
  !isEmpty(get(listingData, "photos", [])) &&
    allImages.push(...get(listingData, "photos", ...[]));
  !isEmpty(get(listingData, "videoUrl", [])) &&
    allImages.push(...get(listingData, "videoUrl", ...[]));

  // fetchNeighborhoodPlaces
  useQuery(PropertyQueries.fetchNeighborhoodPlaces, {
    variables: {
      lat: get(propertyData, "location.coordinates[1]"),
      lng: get(propertyData, "location.coordinates[0]"),
      type: [
        "atm",
        "amusement_park",
        "bakery",
        "bank",
        "store",
        "supermarket",
        "meal_delivery",
        "meal_takeaway",
        "movie_theater",
        "liquor_store",
        "aquarium",
        "amusement_park",
        "library",
        "accounting",
        "school",
        "park",
        "pharmacy",
        "department_store",
        "grocery_or_supermarket",
      ],
    },
    onCompleted: (data) =>
      setNeighborhoodData(get(data, "nearByPlaces.data", [])),
  });

  const [updatedProperties, setUpdatedProperties] = useState([]);

  useMutation(PropertyQueries.updatePropertyStatus, {
    onCompleted: (updatedData) => {
      showSuccessModal(true);
      setUpdatedProperties(get(updatedData, "updatePropertyStatus.data"));
    },
  });

  useMutation(PropertyQueries.updateListing, {
    onCompleted: (updatedData) => {
      if (isPublished.publish === true) {
        showSuccessModal(true);
      }
    },
  });

  let propertyURL = `${process.env.REACT_APP_PUBLIC_URL}/apply/${get(
    propertyData,
    "propertyId"
  )}`;

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

  let suitabilites = [
    "family",
    "student",
    "couple",
    "single",
    "smoker",
    "pets",
  ];

  let features = {
    garden: "Garden",
    disabledAccessability: "Disabled Accesibility",
    balconyPatio: "Balcony/patio",
    unsuitedBathroom: "Ensuite Bathroom",
    laundryUtilityRoom: "Laundry/Utility room",
    billsIncluded: "Bills Included",
  };

  // console.log(propertyData);
  // console.log("ararararararar", listingData);

  return (
    <>
      <div className="propertydetails__wrapper">
        <div className="row">
          <div className="col-md-12">
            <div
              className={`${get(props, "isDrawer", false)
                ? "property__wrapperdetails--nope"
                : "property__wrapperdetails "
                }`}
            >
              <ul>
                <li>
                  <div className="property_address">
                    <h3>
                      {!propertyData.title.includes(
                        get(propertyData, "subType", "")
                      )
                        ? `${get(propertyData, "numberOfBed", "0")} Bed ${get(
                          propertyData,
                          "subType",
                          ""
                        )} ${get(propertyData, "title", "property title")}`
                        : get(propertyData, "title", "property title")}
                    </h3>
                    <ul>
                      <li>
                        <label className="badge badge-success">
                          {get(listingData, "furnishing", "Not Available")}
                        </label>
                      </li>
                      <li>
                        <i className="fas fa-bed"></i>{" "}
                        {get(propertyData, "numberOfBed", 0)} Bedroom
                      </li>
                      <li>
                        <i className="fas fa-bath"></i>{" "}
                        {get(propertyData, "numberOfBath", 0)} Bathroom
                      </li>
                      <li>
                        <i className="fas fa-couch"></i>{" "}
                        {get(propertyData, "numberOfReception", 0)} Reception
                      </li>
                      <li>
                        <i className="fas fa-tape"></i>{" "}
                        {get(propertyData, "sizeInSquareFeet", 300)} sq. ft.
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <div className="wrapper--rent">
                    <span>£{get(listingData, "monthlyRent")}</span>
                    <p>
                      {" "}
                      <i className="fas fa-money-bill-alt"></i> Rent p/m{" "}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="wrapper--rent">
                    <span>£{get(listingData, "deposit")}</span>
                    <p>
                      {" "}
                      <i className="fas fa-coins"></i> Deposit{" "}
                    </p>
                  </div>
                </li>
                {!get(props, "isDrawer", false) && (
                  <li className="publish_request">
                    <p
                      className={`badge_status_${getPropertyStatus(
                        propertyData
                      )}`}
                    >
                      {getPropertyStatus(propertyData, false)}
                    </p>
                    {/* <div className="publish_wrap">
                      <p>Publish</p>
                      <label className="switch" for="published">
                        <input
                          defaultChecked={get(isPublished, "publish", false)}
                          onChange={(e) => {
                            let p = isPublished
                              ? isPublished
                              : { publish: false, url: "" };
                            p["publish"] = !get(p, "publish", true);
                            setPublishedStatus(p);
                            updatePropertyStatus({
                              variables: {
                                propertyId: propertyData.propertyId,
                                status: "Listed",
                              },
                            });

                            updateListing({
                              variables: {
                                listingId: get(listingData, "listingId"),
                                propertyId: get(propertyData, "propertyId"),
                                publish: {
                                  publish: !get(p, "publish", true),
                                  link: `${
                                    process.env.REACT_APP_PUBLIC_URL
                                  }/apply/${get(propertyData, "propertyId")}`,
                                },
                              },
                            });
                          }}
                          type="checkbox"
                          id="published"
                        />
                        <div className="slider round"></div>
                      </label>
                    </div> */}
                    <p
                      onClick={() => {
                        props.history.push(`/landlord/property/listing/edit`, {
                          selectedProperty: propertyData,
                          allProperties: props.allProperties,
                        });
                      }}
                    >
                      Edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <i className="fas fa-edit"></i>
                    </p>
                  </li>
                )}
              </ul>
            </div>
            <div className="row">
              <div className="col-md-9">
                <Slider
                  asNavFor={nav2}
                  ref={(slider) => (slider1 = slider)}
                  className="imageSlider__upper"
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
                <Slider
                  asNavFor={nav1}
                  ref={(slider) => (slider2 = slider)}
                  arrows={true}
                  nextArrow={
                    <i
                      style={{ fontSize: "35px" }}
                      className="fa fa-arrow-circle-right"
                      aria-hidden="true"
                    ></i>
                  }
                  className="imageSlider__lower"
                  prevArrow={
                    <i
                      style={{ fontSize: "35px" }}
                      className="fa fa-arrow-circle-left"
                      aria-hidden="true"
                    ></i>
                  }
                  swipeToSlide={true}
                  focusOnSelect={true}
                  slidesToShow={
                    allImages && allImages.length < 5 ? allImages.length : 5
                  }
                >
                  {" "}
                  {!isEmpty(allImages) &&
                    allImages.map((img, i) => {
                      let tOf = typeof img;

                      return (
                        <>
                          {/*  img.match((?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\W)[1] */}
                          {img &&
                            (tOf !== "object" && img.includes("youtube.com") ? (
                              // <ReactPlayer
                              //   url={img}
                              //   youtubeConfig={{ playerVars: { showinfo: 1 } }}
                              // />
                              <img
                                alt={img}
                                className="lower_images"
                                src={`http://img.youtube.com/vi/${img.match(
                                  // eslint-disable-next-line no-useless-escape
                                  /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/
                                )[1]
                                  }/1.jpg`}
                              />
                            ) : (
                              <img
                                className="lower_images"
                                alt={img}
                                src={tOf === "object" ? img.preview : img}
                              />
                            ))}
                        </>
                      );
                    })}
                </Slider>
                <div className="tabs__propertydetails">
                  <Tabs>
                    <TabList>
                      <Tab>Description</Tab>
                      <Tab>Amenities</Tab>
                      <Tab>Neighbourhood</Tab>
                    </TabList>

                    <TabPanel>
                      <label>Letting Info</label>
                      <div className="description__wrap">
                        <ul>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/max.png"
                                alt="img"
                              />
                              <p>
                                Max Occupancy :{" "}
                                <span>
                                  {get(listingData, "maxOccupancy", 1)}
                                </span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/cal1.png"
                                alt="img"
                              />
                              <p>
                                Min. Duration in months :{" "}
                                <span>
                                  {get(
                                    listingData,
                                    "minimumDurationInMonth",
                                    1
                                  )}
                                </span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/cal2.png"
                                alt="img"
                              />
                              <p>
                                Move in :{" "}
                                <span>
                                  {moment(
                                    get(
                                      listingData,
                                      "earliestMoveInDate",
                                      new Date()
                                    )
                                  ).format(dateFormat)}
                                </span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/gar.png"
                                alt="img"
                              />
                              <p>
                                Garage :{" "}
                                <span>{get(listingData, "parking", 1)}</span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/clock.png"
                                alt="img"
                              />
                              <p>
                                Viewing :{" "}
                                <span>
                                  {get(listingData, "dayAvailability", 1)}{" "}
                                  {get(listingData, "timeAvailability", 1)}
                                </span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/thun.png"
                                alt="img"
                              />
                              <p>
                                EPC Rating :{" "}
                                <span>{get(listingData, "EPCRating", 1)}</span>{" "}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <hr />
                      <label>Suitability</label>
                      <div className="description__wrap suitibility__wrap">
                        <ul>
                          {suitabilites &&
                            suitabilites.map((pref, i) => {
                              let isSelected = get(
                                listingData,
                                `preference.${pref.toLowerCase()}`,
                                false
                              );
                              return (
                                <li>
                                  <p>
                                    {pref &&
                                      pref.charAt(0).toUpperCase() +
                                      pref.slice(1)}{" "}
                                    &nbsp;&nbsp;
                                    <i
                                      className={`fas fa-${isSelected ? "check" : "times"
                                        }  ${isSelected
                                          ? "text-success"
                                          : "text-danger"
                                        }`}
                                    ></i>
                                  </p>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                      <hr />
                      <label>Detail Description</label>
                      <div className="details_wrap">
                        {ReactHtmlParser(
                          get(
                            listingData,
                            "description",
                            `
                          Beautiful 2 bedroom semi detached house in Faltham,
                          Close to Hanworth park and faltham High street and
                          local amenities. We have 2 school near by and easy
                          acess accessible to public transport. Rooms are
                          recently furnished so they are nice and clean.You will
                          feel like other home, smoking is strictly prohibited
                          inside the house. Most of the white goods are new and
                          under warrenty status. Once tenants move, all those
                          service manual will be handed over`
                          )
                        )}
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <label>Key Feature</label>
                      <div className="description__wrap suitibility__wrap">
                        <ul>
                          {
                            // Object.keys(get(listingData, "features", []))
                            Object.keys(features).map((feature, i) => {
                              return (
                                <li>
                                  <p>
                                    <i
                                      className={`fas fa-${get(listingData, `features.${feature}`)
                                        ? "check"
                                        : "times"
                                        } ${get(listingData, `features.${feature}`)
                                          ? "text-success"
                                          : "text-danger"
                                        }`}
                                    ></i>
                                    &nbsp;&nbsp; {features[feature]}
                                  </p>
                                </li>
                              );
                            })
                          }
                        </ul>
                      </div>
                      <hr />
                      <label>Other Amenities</label>
                      <div className="description__wrap">
                        <ul>
                          {!isEmpty(listingData.amenities) &&
                            Object.keys(amnetiesObj).map((am, i) => {
                              let isSelected = listingData.amenities[am];
                              return (
                                <li>
                                  <div
                                    className={`d-flex ${!isSelected ? "overlay_unselected" : ""
                                      }`}
                                  >
                                    <img
                                      src={amnetiesObj[am].img}
                                      alt={amnetiesObj[am].name}
                                    />
                                    <p>{amnetiesObj[am].name}</p>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div className="neighbourhood_wrap">
                        <ul>
                          {/* <li>
                            <button className="btn btn-secondary">
                              Map View
                            </button>
                            <button className="btn btn-secondary">
                              Street View
                            </button>
                          </li> */}
                          <li>
                            <input type="text" className="form-control" />
                          </li>
                          <li>
                            <button className="btn btn-warning">
                              Get Directions
                            </button>
                          </li>
                        </ul>
                        <NeighborhoodMap
                          neighborHoodData={neighborHoodData}
                          propertyData={propertyData}
                        />
                      </div>
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <Card
                    currentUserData={get(
                      props,
                      "contextData.userData.authentication.data"
                    )}
                    {...props}
                  />
                </div>

                {/* <button
                  onClick={() => setSendMessageStatus(true)}
                  className="form-control btn btn-outline-warning mb-2"
                >
                  Send message
                </button>
                <button
                  onClick={() => setBookViewingStatus(true)}
                  className="form-control btn btn-warning mb-2"
                >
                  Book Viewing
                </button> */}
                <div className="card_icon_test mb-4">
                  {!get(props, "isDrawer", false) && (
                    <div className="card-switch__text">
                      <p>
                        Partner Search Engine
                        <Tooltip
                          overlayClassName="tooltip__color"
                          title="Publish your property listing on 3rd party portals such as: Zoopla, Primelocation, Rightmove, Gumtree, etc. This is available to only upgraded plan"
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                            alt="i"
                            className="ml-2"
                          />
                        </Tooltip>
                      </p>

                      <label className="switch" for="partnerSearchEngine">
                        <input
                          // onChange={e => setPartnerSearchEngine(e.target.checked)}
                          // checked={partnerSearchEngine}
                          type="checkbox"
                          disabled={props.isPreviewMode}
                          id="partnerSearchEngine"
                        />
                        <div className="slider round"></div>
                      </label>
                    </div>
                  )}

                  <p className="sidecard_text">
                    After enabling, it can take between 6 and 24 hours to
                    syndicate. Check back here for updates.
                  </p>

                  <p className="sidecard_text">
                    Listing deactivates in 21 days, review this settings to
                    enable it again if property is not yet rented.
                  </p>
                </div>
                <div className="card__info">
                  <p className="card_info_head">{documents?.filter(item => item).length > 0 ? "View compliance documents" : "No compliance documents available"}</p>
                  {documents?.filter(item => item)?.map(
                    (doc) =>
                      <p>
                        <a download href={doc?.url}>{doc?.description}</a>
                      </p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={"Listing Published!"}
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
            <label>Your Apply Link</label>
            <input
              name={"applyLink"}
              value={`${process.env.REACT_APP_PUBLIC_URL}/property/${get(
                propertyData,
                "propertyId"
              )}`}
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
                props.history.push("/landlord/listings", updatedProperties);
              }}
            >
              Ok
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default withRouter(ListingReview);
