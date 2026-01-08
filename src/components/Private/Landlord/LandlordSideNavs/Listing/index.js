import React, { useState, useRef, useContext } from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import PropertyQuery from "../../../../../config/queries/property";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  Skeleton,
  Input,
  Button,
  Select,
  Modal,
  Tag,
  Space,
  Dropdown,
  Menu,
  Tooltip,
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import showNotification from "config/Notification";
import ListingReview from "./ListingReview";
import { UserDataContext } from "store/contexts/UserContext";
import AdminQueries from "../../../../../config/queries/admin";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ShareListingModal from "./ShareListingModal";
import EmptyListing from "components/layout/emptyviews/EmptyListing";

import "./styles.scss";
import ViewWebpageButton from "components/Private/ServicePro/ServiceProSideNavs/MyServices/ViewWebpageButton";

const ListingDashboard = (props) => {
  const { state: userState } = useContext(UserDataContext);
  const [showShareModal, setShowShareModal] = useState(false);
  const { accountSetting } = userState;
  const [properties, setProperties] = useState([]);
  const [activeListingTab, setActiveListingTab] = useState(0);
  const allProperties = useRef([]);
  const currentProperty = useRef({});
  const [openReview, setOpenReview] = useState(false);
  const [openActivation, setOpenActivation] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  const { loading } = useQuery(PropertyQuery.fetchProperty, {
    onCompleted: (pro) => {
      const data = get(pro, "fetchProperty.data", []);
      setProperties(data);
      allProperties.current = data;
    },
  });

  const handleInput = (e) => {
    setUsernameInput(e.target.value);
    let usernameToCheck = e.target.value;
    let isValid = usernameToCheck.match(
      "^(?=.{5,16}$)(?=.*[a-zA-Z])(?=.*[0-9])([a-zA-Z0-9]+)$"
    );
    if (isValid) {
      setUsernameIsValid(true);
      setUsernameStatus("Looks Good");
    } else {
      setUsernameStatus("Username Not Valid");
    }
  };

  const { data: allusernames } = useQuery(AdminQueries.usernameList);

  const [createUsername] = useMutation(AdminQueries.createUsernameList, {
    onCompleted: (response) => {
      if (response.createUsernameList.success) {
        setUsernameStatus("Successfully Activated");
        setOpenActivation(false);
        showNotification(
          "success",
          "Successfully Activated",
          "Username Successfully Activated"
        );
      } else {
        setUsernameStatus(response.createUsernameList.message);
      }
    },
    onError: (error) => {
      showNotification("error", "Error!", "Oops ! There is some Error");
      // console.log("error", error);
    },
  });

  const activatePortfolio = async () => {
    if (allusernames && usernameIsValid) {
      let usernames = allusernames.usernameList.data;
      let isAvailable = true;
      usernames.forEach((username) => {
        if (username.userName === usernameInput) {
          isAvailable = false;
          setUsernameStatus("Sorry ! Username Is Not Available");
        }
      });

      if (isAvailable) {
        await createUsername({
          variables: {
            userId: props.userData._id,
            userName: usernameInput.toLowerCase(),
            activateLandlord: true,
          },
        });
      } else {
        setUsernameStatus("Username Is Already In Use");
      }
    }
  };

  const confirmModal = ({
    message = "Are you sure?",
    onOKFunction = (f) => f,
    okText = "Ok",
  }) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: okText,
      onOk: onOKFunction,
      cancelText: "Cancel",
    });
  };

  // useEffect(() => {
  //   !isEmpty(get(props, "location.state", [])) &&
  //     setProperties(get(props, "location.state"));
  // }, [properties, props]);

  const [width, setWidth] = useState(0);
  React.useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  let dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat", "DD-MM-YYYY")
    : process.env.REACT_APP_DATE_FORMAT;

  const { Option } = Select;

  const [updatePropertyStatus] = useMutation(
    PropertyQuery.updatePropertyStatus,
    {
      onCompleted: ({ updatePropertyStatus }) => {
        if (updatePropertyStatus.success) {
          setProperties(updatePropertyStatus.data);

          showNotification("success", updatePropertyStatus.message, "");
        } else {
          showNotification("error", updatePropertyStatus.message, "");
        }
      },
      onError: (error) => {
        showNotification("error", `Failed to update status`, "");
      },
    }
  );

  let activeListings = filter(properties, { status: "Listed" });
  let otherListings = filter(properties, (l) => {
    return l.status !== "Listed";
  });

  const filterData = async (filterText) => {
    let filtered;
    // console.log(filterText);
    if (filterText === "") {
      filtered = allProperties.current;
    } else {
      filtered = await allProperties.current.filter((str) => {
        let category = get(str, "title", "sometitle");
        return (
          category && category.toLowerCase().includes(filterText.toLowerCase())
        );
      });
    }
    setProperties(filtered);
  };

  const filterDataByStatus = async (filterText) => {
    let filtered;
    if (filterText === "All") {
      filtered = allProperties.current;
    } else {
      filtered = await allProperties.current.filter((str) => {
        let category = get(str, "status", "sometitle");
        return category && category.toLowerCase() === filterText.toLowerCase();
      });
    }
    setProperties(filtered);
  };

  const getPropertyStatus = (prop, isLower = true) => {
    if (prop.status !== null) {
      const status = prop.archived
        ? "Archived"
        : prop.status !== null && get(prop, "status") !== "Un-Listed"
        ? get(prop, "status", "Sample Title")
        : get(prop, "listing.listingId")
        ? "Incomplete"
        : get(prop, "status", "Sample Title");

      return isLower ? status.toLowerCase() : status;
    }
    return isLower ? "un-listed" : "Un-Listed";
  };

  const getListings = (propertyToList) =>
    !isEmpty(propertyToList) &&
    propertyToList.map((prop, i) => {
      // const propertyTitle = `${get(props, "numberOfBed", "0")} Bed ${get(props, "subType", "")} `
      return (
        <>
          {width > 768 ? (
            <tr key={prop.propertyId}>
              <td
                className={`border__${getPropertyStatus(prop)} display_inline`}
              >
                <span className="profile__default">
                  <img
                    src={get(prop, "photos[0]", "Sample Title")}
                    alt="User Profile Avatar"
                  />
                </span>
                <span className="bold__txt">
                  <Space size="large">
                    <span
                      onClick={() => {
                        setOpenReview(true);
                        currentProperty.current = prop;
                      }}
                    >
                      {!prop.title.includes(get(prop, "subType", ""))
                        ? `${get(prop, "numberOfBed", "0")} Bed ${get(
                            prop,
                            "subType",
                            ""
                          )} ${get(prop, "title", "property title")}`
                        : get(prop, "title", "property title")}{" "}
                      {prop.uniqueId && !prop.title?.includes(prop.uniqueId)
                        ? prop.uniqueId
                        : ""}
                    </span>
                    {getPropertyStatus(prop) === "incomplete" && (
                      <Tag
                        color="yellow"
                        onClick={() => {
                          props.history.push(`property/listing/edit`, {
                            selectedProperty: prop,
                            allProperties: properties,
                          });
                        }}
                      >
                        Pending Action
                      </Tag>
                    )}
                    {prop.isDraft && (
                      <Tag
                        color="green"
                        onClick={() => {
                          props.history.push(`property/listing/edit`, {
                            selectedProperty: prop,
                            allProperties: properties,
                          });
                        }}
                      >
                        Unpublished
                      </Tag>
                    )}
                  </Space>
                  <div className="details">
                    <ul>
                      <li>
                        <p>
                          <i className="fa fa-bed" aria-hidden="true"></i>
                          {get(prop, "numberOfBed", "NA")}
                        </p>
                      </li>
                      <li>
                        <p>
                          <i className="fa fa-bath" aria-hidden="true"></i>
                          {get(prop, "numberOfBath", "NA")}
                        </p>
                      </li>
                      <li>
                        <p>
                          <i className="fas fa-couch" aria-hidden="true"></i>
                          {get(prop, "numberOfReception", "NA")}
                        </p>
                      </li>
                      <li>
                        <p>
                          <i className="fas fa-tape" aria-hidden="true"></i>
                          {get(prop, "sizeInSquareFeet", "NA")} sq. ft.
                        </p>
                      </li>
                      <li>
                        <p>
                          <i className="fa fa-camera" aria-hidden="true"></i>
                          {!isEmpty(get(prop, "listing.photos", []))
                            ? get(prop, "listing.photos", "NA").length
                            : 0}
                        </p>
                      </li>
                      <li>
                        <p>
                          &nbsp; &nbsp; &nbsp; Rent p/m{" "}
                          {/* <i className="fa fa-map-marker" aria-hidden="true"></i> */}
                          £ {get(prop, "listing.monthlyRent", "NA")}
                        </p>
                      </li>
                    </ul>
                  </div>
                </span>
              </td>
              <td className="">
                <p className={`badge_status_${getPropertyStatus(prop)}`}>
                  {getPropertyStatus(prop, false)}
                </p>
              </td>
              <td>
                <span className="fas fa-calendar-check" />
                &nbsp;&nbsp;&nbsp;
                {get(prop, "listing.earliestMoveInDate", new Date())
                  ? moment(
                      get(prop, "listing.earliestMoveInDate", new Date())
                    ).format(dateFormat)
                  : "Not Available"}
              </td>
              <td className="display_center listing--actions_hover">
                <Tooltip title="Edit Listing" aria-label="edit-listing">
                  <i
                    onClick={() => {
                      props.history.push(`property/listing/edit`, {
                        selectedProperty: prop,
                        allProperties: properties,
                      });
                    }}
                    className="fa fa-pencil mx-2"
                    aria-hidden="true"
                  ></i>{" "}
                </Tooltip>
                <Tooltip title="Preview" aria-label="preview">
                  {prop.archived ||
                  get(prop, "status", false) === "Un-Listed" ? (
                    <i
                      style={{ color: "grey" }}
                      className="fa fa-eye mx-2"
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      onClick={() => {
                        setOpenReview(true);
                        currentProperty.current = prop;
                      }}
                      className="fa fa-eye mx-2"
                      aria-hidden="true"
                    ></i>
                  )}
                </Tooltip>
                <Tooltip title="Application" aria-label="application">
                  {get(prop, "status", "Sample Title") === "Occupied" ||
                  prop.archived ||
                  get(prop, "status", false) === "Un-Listed" ? (
                    <i
                      className="fas fa-portrait mx-2"
                      style={{ color: "grey" }}
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      className="fas fa-portrait mx-2"
                      aria-hidden="true"
                      onClick={() => props.history.push("applications")}
                    ></i>
                  )}
                </Tooltip>

                <Tooltip title="Move In" aria-label="move-in">
                  {get(prop, "status", "Sample Title") === "Occupied" ||
                  prop.archived ||
                  get(prop, "status", false) === "Un-Listed" ? (
                    <i
                      className="fas fa-route mx-2"
                      style={{ color: "grey" }}
                    ></i>
                  ) : (
                    <i
                      className="fas fa-route mx-2"
                      onClick={() =>
                        props.history.push(`agreement/add`, {
                          propertyId: prop.propertyId,
                        })
                      }
                    ></i>
                  )}
                </Tooltip>
              </td>
              <td>
                <Dropdown
                  overlay={
                    prop.archived ? (
                      <Menu>
                        <Menu.Item
                          onClick={() =>
                            confirmModal({
                              message:
                                "Are you sure want to unarchive this property?",
                              onOKFunction: () =>
                                updatePropertyStatus({
                                  variables: {
                                    propertyId: prop.propertyId,
                                    status: "Un-Listed",
                                    archived: false,
                                  },
                                }),
                            })
                          }
                        >
                          <i className="fa fa-share" aria-hidden="true"></i>{" "}
                          Unarchive
                        </Menu.Item>
                      </Menu>
                    ) : get(prop, "status", "Sample Title") === "Un-Listed" ? (
                      <Menu>
                        <Menu.Item
                          onClick={() => {
                            props.history.push(`property/listing/edit`, {
                              selectedProperty: prop,
                              allProperties: properties,
                            });
                          }}
                        >
                          <i className="fa fa-play" aria-hidden="true"></i> List
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            confirmModal({
                              message:
                                "Are you sure want to archive this property?",
                              onOKFunction: () =>
                                updatePropertyStatus({
                                  variables: {
                                    propertyId: prop.propertyId,
                                    status: "Archived",
                                    archived: true,
                                  },
                                }),
                            })
                          }
                        >
                          <i className="fa fa-archive" aria-hidden="true"></i>{" "}
                          Archive
                        </Menu.Item>
                      </Menu>
                    ) : (
                      <Menu>
                        <Menu.Item
                          onClick={() => {
                            currentProperty.current = prop;
                            setShowShareModal(true);
                          }}
                        >
                          <i className="fa fa-share" aria-hidden="true"></i>{" "}
                          Share
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            confirmModal({
                              message:
                                "Are you sure want to archive this property?",
                              onOKFunction: () =>
                                updatePropertyStatus({
                                  variables: {
                                    propertyId: prop.propertyId,
                                    status: "Archived",
                                    archived: true,
                                  },
                                }),
                            })
                          }
                        >
                          <i className="fa fa-archive" aria-hidden="true"></i>{" "}
                          Archive
                        </Menu.Item>
                      </Menu>
                    )
                  }
                  trigger={["click"]}
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Dropdown>
              </td>
            </tr>
          ) : (
            <tr
              key={prop.propertyId}
              className={`border__${getPropertyStatus(prop)}`}
            >
              <td
                className={``}
                onClick={() => {
                  setOpenReview(true);
                  currentProperty.current = prop;
                }}
              >
                <div className="row">
                  <div className="col pt-2" style={{ maxWidth: 50 }}>
                    <span className="profile__default mr-0">
                      <img
                        src={get(prop, "photos[0]", "Sample Title")}
                        alt="User Profile Avatar"
                      />
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{ maxWidth: "calc(100% - 50px)" }}
                  >
                    <span
                      className="bold__txt d-block pr-3"
                      // style={{ maxWidth: "100%" }}
                    >
                      {/* <Space size="large"> */}
                      <p
                        className="text-truncate mb-0 mt-2"
                        style={{ maxWidth: "100%" }}
                      >
                        {!prop.title.includes(get(prop, "subType", ""))
                          ? `${get(prop, "numberOfBed", "0")} Bed ${get(
                              prop,
                              "subType",
                              ""
                            )} ${get(prop, "title", "property title")}`
                          : get(prop, "title", "property title")}{" "}
                        {prop.uniqueId && !prop.title?.includes(prop.uniqueId)
                          ? prop.uniqueId
                          : ""}
                      </p>
                      {getPropertyStatus(prop) === "incomplete" && (
                        <Tag
                          color="yellow"
                          onClick={() => {
                            props.history.push(`property/listing/edit`, {
                              selectedProperty: prop,
                              allProperties: properties,
                            });
                          }}
                        >
                          Pending Action
                        </Tag>
                      )}
                      {prop.isDraft && (
                        <Tag
                          color="green"
                          onClick={() => {
                            props.history.push(`property/listing/edit`, {
                              selectedProperty: prop,
                              allProperties: properties,
                            });
                          }}
                        >
                          Unpublished
                        </Tag>
                      )}

                      {/* </Space> */}
                      <p className="mb-0">
                        Rent p/m{" "}
                        {/* <i className="fa fa-map-marker" aria-hidden="true"></i> */}
                        £ {get(prop, "listing.monthlyRent", "NA")}
                      </p>
                    </span>
                  </div>
                </div>
              </td>
              {/* <td className="d-block">
              
            </td> */}
              <td
                className="w-100 d-block px-3 py-2"
                onClick={() => {
                  setOpenReview(true);
                  currentProperty.current = prop;
                }}
              >
                <div
                  className="d-inline-block details w-100"
                  style={{ float: "none" }}
                >
                  <ul>
                    <li>
                      <p>
                        <i className="fa fa-bed" aria-hidden="true"></i>
                        {get(prop, "numberOfBed", "NA")}
                      </p>
                    </li>
                    <li>
                      <p>
                        <i className="fa fa-bath" aria-hidden="true"></i>
                        {get(prop, "numberOfBath", "NA")}
                      </p>
                    </li>
                    <li>
                      <p>
                        <i className="fas fa-couch" aria-hidden="true"></i>
                        {get(prop, "numberOfReception", "NA")}
                      </p>
                    </li>
                    <li>
                      <p>
                        <i className="fas fa-tape" aria-hidden="true"></i>
                        {get(prop, "sizeInSquareFeet", "NA")} sq. ft.
                      </p>
                    </li>
                    <li>
                      <p>
                        <i className="fa fa-camera" aria-hidden="true"></i>
                        {!isEmpty(get(prop, "listing.photos", []))
                          ? get(prop, "listing.photos", "NA").length
                          : 0}
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="d-block mt-2">
                  <span
                    className={`badge_status_${getPropertyStatus(
                      prop
                    )} d-inline-block px-3 mr-3`}
                  >
                    {getPropertyStatus(prop, false)}
                  </span>
                  <span className="fas fa-calendar-check" />
                  &nbsp;&nbsp;&nbsp;
                  {get(prop, "listing.earliestMoveInDate", new Date())
                    ? moment(
                        get(prop, "listing.earliestMoveInDate", new Date())
                      ).format(dateFormat)
                    : "Not Available"}
                </div>
              </td>
              <td className="px-2" style={{ fontSize: 12 }}>
                <Tooltip title="Edit Listing" aria-label="edit-listing">
                  <span
                    onClick={() => {
                      props.history.push(`property/listing/edit`, {
                        selectedProperty: prop,
                        allProperties: properties,
                      });
                    }}
                  >
                    <i className="fa fa-pencil mx-2" aria-hidden="true"></i>{" "}
                    Edit
                  </span>
                </Tooltip>
                <Tooltip title="Preview" aria-label="preview">
                  {prop.archived ||
                  get(prop, "status", false) === "Un-Listed" ? (
                    <span style={{ color: "grey" }}>
                      <i className="fa fa-eye mx-2" aria-hidden="true"></i>{" "}
                      Preview
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        setOpenReview(true);
                        currentProperty.current = prop;
                      }}
                    >
                      {" "}
                      <i className="fa fa-eye mx-2" aria-hidden="true"></i>{" "}
                      Preview
                    </span>
                  )}{" "}
                </Tooltip>
                <Tooltip title="Application" aria-label="application">
                  {get(prop, "status", "Sample Title") === "Occupied" ||
                  prop.archived ||
                  get(prop, "status", false) === "Un-Listed" ? (
                    <span style={{ color: "grey" }}>
                      <i
                        className="fas fa-portrait mx-2"
                        aria-hidden="true"
                      ></i>{" "}
                    </span>
                  ) : (
                    <span onClick={() => props.history.push("applications")}>
                      <i
                        className="fas fa-portrait mx-2"
                        aria-hidden="true"
                      ></i>{" "}
                      Application
                    </span>
                  )}
                </Tooltip>

                <Tooltip title="Move In" aria-label="move-in">
                  {get(prop, "status", "Sample Title") === "Occupied" ||
                  prop.archived ||
                  get(prop, "status", false) === "Un-Listed" ? (
                    <i
                      className="fas fa-route mx-2"
                      style={{ color: "grey" }}
                    ></i>
                  ) : (
                    <i
                      className="fas fa-route mx-2"
                      onClick={() =>
                        props.history.push(`agreement/add`, {
                          propertyId: prop.propertyId,
                        })
                      }
                    ></i>
                  )}{" "}
                  Move In
                </Tooltip>
              </td>
              <td>
                <Dropdown
                  overlay={
                    prop.archived ? (
                      <Menu>
                        <Menu.Item
                          onClick={() =>
                            confirmModal({
                              message:
                                "Are you sure want to unarchive this property?",
                              onOKFunction: () =>
                                updatePropertyStatus({
                                  variables: {
                                    propertyId: prop.propertyId,
                                    status: "Un-Listed",
                                    archived: false,
                                  },
                                }),
                            })
                          }
                        >
                          <i className="fa fa-share" aria-hidden="true"></i>{" "}
                          Unarchive
                        </Menu.Item>
                      </Menu>
                    ) : get(prop, "status", "Sample Title") === "Un-Listed" ? (
                      <Menu>
                        <Menu.Item
                          onClick={() => {
                            props.history.push(`property/listing/edit`, {
                              selectedProperty: prop,
                              allProperties: properties,
                            });
                          }}
                        >
                          <i className="fa fa-play" aria-hidden="true"></i> List
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            confirmModal({
                              message:
                                "Are you sure want to archive this property?",
                              onOKFunction: () =>
                                updatePropertyStatus({
                                  variables: {
                                    propertyId: prop.propertyId,
                                    status: "Archived",
                                    archived: true,
                                  },
                                }),
                            })
                          }
                        >
                          <i className="fa fa-archive" aria-hidden="true"></i>{" "}
                          Archive
                        </Menu.Item>
                      </Menu>
                    ) : (
                      <Menu>
                        <Menu.Item
                          onClick={() => {
                            currentProperty.current = prop;
                            setShowShareModal(true);
                          }}
                        >
                          <i className="fa fa-share" aria-hidden="true"></i>{" "}
                          Share
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            confirmModal({
                              message:
                                "Are you sure want to archive this property?",
                              onOKFunction: () =>
                                updatePropertyStatus({
                                  variables: {
                                    propertyId: prop.propertyId,
                                    status: "Archived",
                                    archived: true,
                                  },
                                }),
                            })
                          }
                        >
                          <i className="fa fa-archive" aria-hidden="true"></i>{" "}
                          Archive
                        </Menu.Item>
                      </Menu>
                    )
                  }
                  trigger={["click"]}
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Dropdown>
              </td>
            </tr>
          )}
        </>
      );
    });

  return (
    <>
      <Tabs
        selectedIndex={activeListingTab}
        className={props.responsiveClasses}
        onSelect={(index) => setActiveListingTab(index)}
      >
        <div className="d-md-flex w-100 align-items-center flex-wrap gap-2 listing_wrap mb-3 m-md-0">
          <div className="d-flex align-items-center flex-grow-1 mt-2 mr-2">
            <TabList>
              <Tab>All ({properties.length})</Tab>
              <Tab>In Market ({activeListings.length})</Tab>
              <Tab>Off Market ({otherListings.length})</Tab>
            </TabList>
          </div>

          <div className="d-flex justify-content-end align-items-center flex-grow-1 flex-wrap flex-md-nowrap listing__fields__right gx-2">
            <div className="select_status d-inline-block mr-2 mt-2">
              <form className="search__wrapper ">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={(e) => filterData(e.target.value)}
                />
                <button className="btn" type="submit">
                  <i className="mdi mdi-magnify" />
                </button>
              </form>
            </div>
            <div className="select_status d-inline-block mx-md-2 ml-2 mt-2">
              <Select
                onChange={(e) => filterDataByStatus(e)}
                placeholder="Filter By Status"
                className="select____property"
              >
                <Option value="All" default>
                  All
                </Option>
                <Option value="Listed">Listed</Option>
                <Option value="Occupied">Occupied</Option>
                <Option value="Archived">Archived</Option>
                <Option value="Rented">Rented</Option>
              </Select>
            </div>

            <ViewWebpageButton />

            <button
              onClick={() =>
                props.history.push("/landlord/listings/add", {
                  allProperties: properties,
                })
              }
              className="btn btn__new--order ml-md-2 mt-2"
            >
              + Add Listing
            </button>
          </div>
        </div>
        <div className="clearfix" />

        <Skeleton tip="Fetching Properties..." active loading={loading}>
          {isEmpty(properties) ? (
            <EmptyListing />
          ) : (
            <div className="active__tables ">
              <div className="row">
                <div className="col-md-12">
                  <TabPanel>
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead className="thead-dark">
                          <tr>
                            <th className="name__style">Property</th>
                            <th>Status</th>
                            <th>Availability</th>
                            <th className="text-center">Action</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>{getListings(properties)}</tbody>
                      </table>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead className="thead-dark">
                          <tr>
                            <th className="name__style">Property</th>
                            <th>Status</th>
                            <th>Availability</th>
                            <th>Action</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>{getListings(activeListings)}</tbody>
                      </table>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead className="thead-dark">
                          <tr>
                            <th className="name__style">Property</th>
                            <th>Status</th>
                            <th>Availability</th>
                            <th>Action</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>{getListings(otherListings)}</tbody>
                      </table>
                    </div>
                  </TabPanel>
                </div>
              </div>
            </div>
          )}
        </Skeleton>
      </Tabs>
      {openActivation && (
        <Modal
          visible={openActivation}
          footer={null}
          title="Activate Business Website"
          centered
          onCancel={() => setOpenActivation(false)}
          onOk={() => setOpenActivation(false)}
          style={{
            top: 10,
            overflow: "auto",
          }}
          className="custom"
        >
          <div className="mx-3 my-4">
            <p className="mb-3" style={{ fontSize: "14px" }}>
              Choose my website listing page name
            </p>

            {/* <Input
              addonBefore="www.rentoncloud.com/servicepro/"
              defaultValue="Enter Website Name"
              className="input-field"
            /> */}

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="prepend-text"
                  style={{ backgroundColor: "#e9ecef;" }}
                  id="basic-addon2"
                >
                  www.rentoncloud.com/landlord/
                </span>
              </div>
              <Input
                type="text"
                className="form-control"
                placeholder="Enter Website Name"
                aria-label="website-url"
                aria-describedby="website-url"
                onChange={handleInput}
              />
            </div>
            <p>{usernameStatus}</p>
            <p className="text-center">
              <Button
                className="btn btn__activate_webpage_modal my-3"
                onClick={activatePortfolio}
              >
                Activate My Webpage
              </Button>
            </p>
          </div>
        </Modal>
      )}
      {openReview && (
        <Modal
          visible={openReview}
          footer={null}
          width={1150}
          onCancel={() => setOpenReview(false)}
          style={{
            top: 10,
            overflow: "auto",
            height: "1400px",
          }}
        >
          <ListingReview
            allProperties={allProperties.current}
            property={currentProperty.current}
            listing={currentProperty.current.listing}
          />
        </Modal>
      )}
      {showShareModal && (
        <ShareListingModal
          successModal={showShareModal}
          showSuccessModal={setShowShareModal}
          propertyData={currentProperty.current}
        />
      )}
    </>
  );
};

export default withRouter(ListingDashboard);
