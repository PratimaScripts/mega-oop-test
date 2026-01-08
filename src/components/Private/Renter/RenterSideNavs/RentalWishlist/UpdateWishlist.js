import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Slider, Drawer, Button } from "antd";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import WishListQuery from "config/queries/wishList";
import showNotification from "config/Notification";
import NProgress from "nprogress";

const miles = {
  0: {
    style: {
      color: "#000000",
    },
    label: <strong>0</strong>,
  },
  100: {
    style: {
      color: "#000000",
    },
    label: <strong>100</strong>,
  },
};
const price = {
  0: {
    style: {
      color: "#000000",
    },
    label: <strong>£0</strong>,
  },
  100: {
    style: {
      color: "#000000",
    },
    label: <strong>£25000</strong>,
  },
};

export const UpdateWishlist = (props) => {
  const {
    // placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: "AIzaSyD6GBMww6rWKXLyNO10rP46jEbJH5kDso0",
    options: {
      types: ["(cities)"],
      componentRestrictions: { country: "uk" },
    },
  });

  const [filter, setFilter] = useState({
    location: undefined,
    type: undefined,
    minMile: 0,
    maxMile: 100,
    minRent: 0,
    maxRent: 100,
    minBed: undefined,
    maxBed: undefined,
    furnishing: undefined,
    duration: undefined,
    family: undefined,
    couple: undefined,
    student: undefined,
    single: undefined,
    pets: undefined,
    smoker: undefined,
    garden: undefined,
    disabledAccessability: undefined,
    unsuitedBathroom: undefined,
    billsIncluded: undefined,
    balconyPatio: undefined,
    laundryUtilityRoom: undefined,
  });
  const [focus, setFocus] = useState({
    location: false,
  });
  const menuFeature = {
    col1: [
      {
        id: "garden",
        name: "Garden",
      },
      {
        id: "disabledAccessability",
        name: "Disabled Acceibility",
      },
      {
        id: "unsuitedBathroom",
        name: "Ensuite Bathroom",
      },
    ],
    col2: [
      {
        id: "billsIncluded",
        name: "Bills Included",
      },
      {
        id: "balconyPatio",
        name: "balcony/Patio",
      },
      {
        id: "laundryUtilityRoom",
        name: "Laundry",
      },
    ],
  };
  const sustainFeature = {
    col1: [
      {
        id: "family",
        name: "Family",
      },
      {
        id: "couple",
        name: "Couple",
      },
      {
        id: "student",
        name: "Student",
      },
    ],
    col2: [
      {
        id: "single",
        name: "Single",
      },
      {
        id: "pets",
        name: "Pets",
      },
      {
        id: "smoker",
        name: "Smoker",
      },
    ],
  };

  const [updateToWishList] = useMutation(WishListQuery.updateToWishList, {
    onCompleted: ({ editWishList }) => {
      if (editWishList.success) {
        showNotification("success", editWishList.message, "");
        props.setOpenDrawer(false);
        props.setWishlist([...editWishList.data]);
      } else {
        showNotification("error", editWishList.message, "");
      }
      NProgress.done();
    },
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors || networkError) {
        showNotification(
          "error",
          "Not able to process your request",
          "Try Again"
        );
      }
      NProgress.done();
    },
  });

  const updateWishlist = () => {
    let wishlistObj = { ...filter };
    Object.keys(wishlistObj).forEach((key) => {
      if (wishlistObj[key] === undefined || wishlistObj[key] === false) {
        delete wishlistObj[key];
      }
    });
    let str = "";
    for (let key in wishlistObj) {
      if (str !== "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(wishlistObj[key]);
    }
    let title = "";
    let details = "<p>";
    title += filter?.location
      ? filter.location.replaceAll("%2C", ",") + " "
      : "";
    title += filter?.type ? filter.type.replaceAll("%2C", ",") : "";

    let type_fil = "";
    let type_filtered;
    if (filter.type) {
      type_fil = filter.type.replaceAll("%20", "");
      type_filtered = type_fil.replaceAll("%2C", ",");
    }

    let location_fil = "";
    let location_filtered;
    if (filter.type) {
      location_fil = filter.location.replaceAll("%20", "");
      location_filtered = location_fil.replaceAll("%2C", ",");
    }
    details += type_filtered ? type_filtered + ", " : "";
    details += location_filtered ? location_filtered + ", " : "";
    details +=
      filter.minMile && filter.maxMile
        ? filter.minMile + " to " + filter.maxMile + " mile,  <br />"
        : "";
    details +=
      filter.minRent && filter.maxRent
        ? filter.minRent + " to " + filter.maxRent + " rent "
        : "";
    details += filter.minBed ? "min " + filter.minBed + " bed,&nbsp" : "";
    details += filter.maxBed ? "max " + filter.maxBed + " bed,&nbsp" : "";
    details += filter.furnishing ? filter.furnishing + ",&nbsp&nbsp" : "";
    details += filter.duration ? "min duaration " + filter.duration + ", " : "";
    details += filter.family ? "family, &nbsp&nbsp" : "";
    details += filter.couple ? "couple,&nbsp" : "";
    details += filter.student ? "student,<br />" : "";
    details += filter.single ? "single,&nbsp" : "";
    details += filter.pets ? "pets,&nbsp" : "";
    details += filter.smoker ? "smoker,<br />" : "";
    details += filter.garden ? "garden,&nbsp" : "";
    details += filter.disabledAccessability
      ? "disabled accessability,&nbsp&nbsp "
      : "";
    details += filter.unsuitedBathroom ? "unsuited bathroom, <br />" : "";
    details += filter.billsIncluded ? "bills included, " : "";
    details += filter.balconyPatio ? "balcony patio, &nbsp&nbsp" : "";
    details += filter.laundryUtilityRoom ? "laundry utilityRoom, " : "";

    details += "</p>";
    let bodyData = str + "##" + title + "##" + details;

    const updatedInput = {
      wishlistId: props.list._id,
      type: props.list.type,
      body: bodyData,
    };
    updateToWishList({ variables: updatedInput });
  };

  useEffect(() => {
    if (props.openDrawer) {
      const dataSearch = props.list.body.split("##");
      let saearchQuyery = dataSearch[0].split("&");
      let queryObj = {
        ...filter,
      };
      saearchQuyery.map((query) => {
        let keyValue = query.split("=");
        if (keyValue[0] !== false || keyValue[0] !== undefined) {
          queryObj[keyValue[0]] = keyValue[1].replaceAll("%20", " ");
        }
        return null;
      });
      setFilter(queryObj);
    }
    //eslint-disable-next-line
  }, [props.openDrawer]);
  return (
    <>
      <Drawer
        title="Update WishList"
        placement="right"
        closable={true}
        width={400}
        onClose={() => props.setOpenDrawer(false)}
        visible={props.openDrawer}
      >
        <div
          className="mb-3 bg-white"
          style={{
            position: "sticky",
          }}
        >
          <div className="row p-3">
            <div className="col-12">
              <p className="m-0">
                <small className="font-weight-bold">Location</small>
              </p>
              <div
                className="input-group my-2"
                style={{ position: "relative" }}
              >
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="basic-addon1"
                    style={{ borderRight: "none", padding: "7px 10px" }}
                  >
                    <i className="fas fa-search text-secondary" />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Eg: Bristol SW07"
                  aria-label="Eg: Bristol SW07"
                  aria-describedby="basic-addon1"
                  style={{ borderLeft: "none", padding: "7px 10px" }}
                  value={filter.location}
                  onChange={(evt) => {
                    setFilter({ ...filter, location: evt.target.value });
                    getPlacePredictions({ input: evt.target.value });
                  }}
                  loading={isPlacePredictionsLoading}
                  onFocus={() => setFocus({ ...focus, location: true })}
                  onBlur={() =>
                    setTimeout(() => {
                      setFocus({ ...focus, location: false });
                    }, 500)
                  }
                />
                {filter?.location?.length > 0 && focus.location && (
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      fontSize: 14,
                      background: "#fff",
                      borderRadius: 5,
                      top: 40,
                      zIndex: 99999,
                      left: 1,
                    }}
                    className="shadow-sm py-2 px-3 border"
                  >
                    {placePredictions &&
                      placePredictions?.map((item) => (
                        <p
                          className="my-1"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setFilter({
                              ...filter,
                              location: item.description.replace(", UK", ""),
                            })
                          }
                        >
                          {item.description.replace(", UK", "")}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12">
              <p className="m-0">
                <small className="font-weight-bold">Milage (mi)</small>
              </p>
              <Slider
                style={{ maxWidth: "95%", margin: "15px auto" }}
                range
                marks={miles}
                value={[filter.minMile, filter.maxMile]}
                onChange={(e) =>
                  setFilter({ ...filter, minMile: e[0], maxMile: e[1] })
                }
                tooltipVisible={false}
                step={10}
              />
            </div>
            <div className="col-12 pt-3">
              <p className="m-0">
                <small className="font-weight-bold">Property Type</small>
              </p>
              <select
                className="custom-select my-2"
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              >
                <option>All</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Shared Property">Shared Property</option>
                <option value="3">Other</option>
              </select>
            </div>
            <div className="col-12">
              <p className="m-0">
                <small className="font-weight-bold">
                  Rent Range (&pound;
                  {filter.minRent === 0 ? 0 : 0 + filter.minRent * 0.25}k -
                  &pound;
                  {filter.maxRent === 0 ? 0 : 0 + filter.maxRent * 0.25}k/pcm)
                </small>
              </p>
              <Slider
                style={{ maxWidth: "95%", margin: "15px auto" }}
                range
                marks={price}
                value={[filter.minRent, filter.maxRent]}
                onChange={(e) =>
                  setFilter({ ...filter, minRent: e[0], maxRent: e[1] })
                }
                tooltipVisible={false}
                step={10}
              />
            </div>
            <div className="col-12 pt-3">
              <p className="m-0">
                <small className="font-weight-bold">No. of Bed room</small>
              </p>
              <div className="row">
                <div className="col">
                  <select
                    className="custom-select my-2"
                    value={filter.minBed}
                    onChange={(e) =>
                      setFilter({ ...filter, minBed: e.target.value })
                    }
                  >
                    <option>Min</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div className="col">
                  <select
                    className="custom-select my-2"
                    value={filter.maxBed}
                    onChange={(e) =>
                      setFilter({ ...filter, maxBed: e.target.value })
                    }
                  >
                    <option>Max</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row m-0">
                <div className="col pl-0">
                  <p className="m-0">
                    <small className="font-weight-bold">Furnishing</small>
                  </p>
                  <select className="custom-select my-2">
                    <option>All</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Partfurbished">Semi Furnished</option>
                    <option value="Unfurnishe">Unfurnished</option>
                  </select>
                </div>
                <div className="col pr-0">
                  <p className="m-0">
                    <small className="font-weight-bold">Minimum Duration</small>
                  </p>
                  <select className="custom-select my-2">
                    <option>Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>

              <p className="m-0 font-weight-bold"> Features</p>
              <div className="row m-0">
                <div className="col pl-0">
                  {menuFeature.col1.map((ft) => (
                    <div
                      className="form-check"
                      style={{ fontSize: 12, fontWeight: 900 }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={ft.id}
                        checked={filter[ft.id]}
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            [ft.id]: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor={ft.id}>
                        {ft.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="col pr-0">
                  {menuFeature.col2.map((ft) => (
                    <div
                      className="form-check"
                      style={{ fontSize: 12, fontWeight: 900 }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={ft.id}
                        checked={filter[ft.id]}
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            [ft.id]: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor={ft.id}>
                        {ft.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <p className="m-0 font-weight-bold">Suitability</p>
              <div className="row m-0">
                <div className="col pl-0">
                  {sustainFeature.col1.map((ft) => (
                    <div
                      className="form-check"
                      style={{ fontSize: 12, fontWeight: 900 }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={ft.id}
                        checked={filter[ft.id]}
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            [ft.id]: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor={ft.id}>
                        {ft.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="col pr-0">
                  {sustainFeature.col2.map((ft) => (
                    <div
                      className="form-check"
                      style={{ fontSize: 12, fontWeight: 900 }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={ft.id}
                        checked={filter[ft.id]}
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            [ft.id]: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor={ft.id}>
                        {ft.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button type="primary" onClick={updateWishlist}>
            Update Wishlist
          </Button>
        </div>
      </Drawer>
    </>
  );
};
