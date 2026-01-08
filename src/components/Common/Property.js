import React, { Fragment } from "react";
import Slider from "react-slick";
import { Button, Dropdown, Menu, message, Tag, Spin } from "antd";
import { get, isEmpty } from "lodash";
import { useHistory } from "react-router-dom";
import showNotification from "config/Notification";
import confirmModal from "config/ConfirmModal";
import { useMutation } from "react-apollo";
import PropertyQuery from "../../config/queries/property";
import {
  approveRentPropertyRequest,
  rejectRentPropertyRequest,
} from "config/queries/landlord";
import moment from "moment";

let settings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  adaptiveHeight: true,
  slidesToScroll: 1,
  autoplay: true,
};

const Property = ({
  property,
  initialPropData,
  setOpenReview,
  currentProperty,
  updatePropertyStatus,
  isUnverified,
  hideActions,
  rentalRequested,
}) => {
  const history = useHistory();

  const [updateVerification] = useMutation(
    PropertyQuery.markPropertyAsVerified,
    {
      onCompleted: (data) => {
        if (data) {
          message.success(data.markPropertyAsVerified);
          history.push("/landlord/property");
        }
      },
    }
  );

  const [approveRentPropertyRequestMutation, { loading: approveLoading }] =
    useMutation(approveRentPropertyRequest, {
      onCompleted: (data) => {
        if (data) message.success(data.approveRentPropertyRequest);
      },
    });

  const [rejectRentPropertyRequestMutation, { loading: rejectLoading }] =
    useMutation(rejectRentPropertyRequest, {
      onCompleted: (data) => {
        if (data) message.success(data.rejectRentPropertyRequest);
      },
    });

  const loading = approveLoading || rejectLoading;

  return (
    <div className="col-xl-4 col-lg-4 col-md-4">
      <div className="card">
        <div className="card__img" style={{ position: "relative" }}>
          <Tag
            className="property__tag"
            color={
              get(property, "status") === "Rented"
                ? "#65cd5c"
                : get(property, "status") === "Occupied"
                ? "#712e97"
                : get(property, "status") === "Listed"
                ? "#2ec3d7"
                : get(property, "status") === "Archived"
                ? "default"
                : "#ff5a68"
            }
          >
            {get(property, "status")}
          </Tag>
          <Slider {...settings}>
            {!isEmpty(get(property, "photos", [])) &&
              get(property, "photos").map((img, i) => {
                return (
                  <div key={i} className="img_hover">
                    <img src={img} alt="Property Images" />
                  </div>
                );
              })}
          </Slider>
        </div>
        <div className="card-body pb-3">
          <div className="details">
            <ul>
              <li>
                <p>
                  <i className="fa fa-bed" aria-hidden="true"></i>
                  {get(property, "numberOfBed", [])}
                </p>
              </li>
              <li>
                <p>
                  <i className="fa fa-bath" aria-hidden="true"></i>
                  {get(property, "numberOfBath", [])}
                </p>
              </li>
              <li>
                <p>
                  <i className="fas fa-couch" aria-hidden="true"></i>
                  {get(property, "numberOfReception", [])}
                </p>
              </li>
              <li>
                <p>
                  <i className="fas fa-tape" aria-hidden="true"></i>
                  {get(property, "sizeInSquareFeet", [])} sq. ft.
                </p>
              </li>
              <li>
                <p>
                  <i className="fa fa-camera" aria-hidden="true"></i>
                  {!isEmpty(get(property, "photos", []))
                    ? get(property, "photos", []).length
                    : 0}
                </p>
              </li>
              <li>
                <p>
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  {get(property, "address.city")},{" "}
                  {get(property, "address.CountryIso2")}
                </p>
              </li>
            </ul>
          </div>
          <div className="content">
            <p
              style={{
                cursor: "pointer",
              }}
              className="title"
              onClick={() => {
                setOpenReview(true);
                currentProperty.current = property;
              }}
            >
              {" "}
              {property.privateTitle ? 
              get(property, "privateTitle") : 
              `${property.address?.addressLine1} ${property.address?.addressLine2 ? 
              property.address?.addressLine2 : ""} ${property.address?.city} ${property.address?.zip}`} {(property?.uniqueId && !property.privateTitle?.includes(property.uniqueId)) ? property.uniqueId : "" }
            </p>

            <span className="border property-types">
              {get(property, "propertyType")} &gt; {get(property, "subType")}{" "}
            </span>
          </div>

          {!hideActions ? (
            <Fragment>
              <div className="property-card-row2 row border-top border-bottom actions">
                <div
                  className="col-4 border-right py-2 px-2 action"
                  onClick={() => history.push(`/landlord/listings`, property)}
                >
                  <span>
                    <i className="mdi mdi-briefcase-account mr-2 ml-2" />{" "}
                    Tenancies
                  </span>
                </div>
                <div
                  className="col-4 py-2 px-2 action"
                  onClick={() =>
                    history.push(
                      `/landlord/accounting/rental-invoice`,
                      property
                    )
                  }
                >
                  <span>
                    <i className="mdi mdi-scale-balance mr-2 ml-2" /> Accounting
                  </span>
                </div>
                <div
                  className="col-4 border-left py-2 px-2 action"
                  onClick={() =>
                    history.push(`/landlord/fixit/raisetask`, property)
                  }
                >
                  <span>
                    <i className="mdi mdi-hand-pointing-right mr-2 ml-2" />{" "}
                    Fixit
                  </span>
                </div>
              </div>

              {!isUnverified ? (
                <div className="property-card-row3 pl-0 mt-2 mb-1">
                  {rentalRequested ? (
                    <Spin tip="Saving..." spinning={loading}>
                      <div className="text-left mb-2 font-weight-normal text-dark border rounded px-1 mt-2 d-block">
                        Requested on{" "}
                        <b>
                          {moment(property.createdAt).format("YYYY-MMM-DD")}
                        </b>{" "}
                        by{" "}
                        <b>
                          {`${property.renterData.firstName} ${property.renterData.lastName}`}
                        </b>
                      </div>
                      <div className="d-flex justify-content-around">
                        <Button
                          type="primary"
                          size="small"
                          onClick={async () => {
                            await approveRentPropertyRequestMutation({
                              variables: {
                                propertyId: property._id,
                              },
                            });
                            history.push("/landlord/property");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={async () => {
                            await approveRentPropertyRequestMutation({
                              variables: {
                                propertyId: property._id,
                              },
                            });
                            history.push("/landlord/agreement/add", {
                              propertyId: property._id,
                            });
                          }}
                        >
                          Approve &amp; agreement
                        </Button>
                        <Button
                          type="default"
                          size="small"
                          onClick={async () => {
                            await rejectRentPropertyRequestMutation({
                              variables: {
                                propertyId: property._id,
                              },
                            });
                            history.push("/landlord/property");
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </Spin>
                  ) : (
                    <Fragment>
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
                                history.push(`property/edit`, property)
                              }
                            >
                              Edit
                            </Menu.Item>

                            {property.status !== "Listed" && (
                              <Menu.Item
                                onClick={() => {
                                  if (property.status === "Archived") {
                                    showNotification(
                                      "error",
                                      "This property is Archived! Un-archive first to perform this action",
                                      ""
                                    );
                                  } else if (property.status === "Rented") {
                                    confirmModal({
                                      message:
                                        "You already have active tenancy. To make property listed again, you will have to end the agreement first",
                                      onOKFunction: () =>
                                        showNotification(
                                          "error",
                                          "End Tenency Module is yet to be build",
                                          ""
                                        ),
                                      okText: "End Tenancy",
                                    });
                                  } else {
                                    history.push(`property/listing/edit`, {
                                      selectedProperty: property,
                                      allProperties: initialPropData,
                                    });
                                  }
                                }}
                              >
                                List
                              </Menu.Item>
                            )}
                            {property.status === "Listed" && (
                              <Menu.Item
                                onClick={() =>
                                  confirmModal({
                                    message:
                                      "This action will remove public listing of your property from RentOnCloud market website. It may appear in other places like search engine results. \nAre you sure?",
                                    onOKFunction: () =>
                                      updatePropertyStatus({
                                        propertyId: property.propertyId,
                                        status: "Un-Listed",
                                      }),
                                  })
                                }
                              >
                                Un-List
                              </Menu.Item>
                            )}
                            {property.status !== "Rented" &&
                              property.status !== "Occupied" && (
                                <Menu.Item
                                  onClick={() => {
                                    if (property.status === "Archived") {
                                      showNotification(
                                        "error",
                                        "This property is Archived! Un-archive first to perform this action",
                                        ""
                                      );
                                    } else {
                                      confirmModal({
                                        message:
                                          "This action will change your property status to Rented after completion of rental agreement and remove active listing from public website if any. \nAre you sure?",
                                        onOKFunction: () =>
                                          showNotification(
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
                            {property.status !== "Occupied" && (
                              <Menu.Item
                                onClick={() =>
                                  confirmModal({
                                    message:
                                      "Are you sure want to self occupy this property?",
                                    onOKFunction: () =>
                                      updatePropertyStatus({
                                        propertyId: property.propertyId,
                                        status: "Occupied",
                                      }),
                                  })
                                }
                              >
                                Self-Occupy
                              </Menu.Item>
                            )}

                            {property.status !== "Archived" && (
                              <Menu.Item
                                onClick={() =>
                                  confirmModal({
                                    message:
                                      "Are you sure want to archive this property?",
                                    onOKFunction: () =>
                                      updatePropertyStatus({
                                        propertyId: property.propertyId,
                                        status: "Archived",
                                      }),
                                  })
                                }
                              >
                                Archive
                              </Menu.Item>
                            )}
                            {property.status === "Archived" && (
                              <Menu.Item
                                onClick={() =>
                                  confirmModal({
                                    message:
                                      "Are you sure want to unarchive this property?",
                                    onOKFunction: () =>
                                      updatePropertyStatus({
                                        propertyId: property.propertyId,
                                        status: "Un-Listed",
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
                    </Fragment>
                  )}
                </div>
              ) : (
                <div className="verify-button">
                  <Button
                    onClick={() =>
                      updateVerification({
                        variables: {
                          propertyId: property.propertyId,
                        },
                      })
                    }
                    type="primary"
                  >
                    Mark as verified
                  </Button>
                </div>
              )}
            </Fragment>
          ) : (
            <div>
              {property.isApprovalPending && (
                <div className="border rounded px-1 mt-2 d-block text-info">
                  Waiting for landlord approval!
                </div>
              )}
              {property.approvedOn && (
                <div className="border rounded px-1 mt-2 d-block">
                  Approved by{" "}
                  <b>
                    {`${property.landlordData.firstName} ${
                      property.landlordData.lastName
                        ? String(property.landlordData.lastName).substr(0, 1)
                        : ""
                    }`}
                  </b>{" "}
                  on <b>{moment(property.approvedOn).format("DD-MMM-YYYY")}</b>
                </div>
              )}
              {property.rejectedOn && (
                <div className="border rounded px-1 mt-2 d-block">
                  Rejected by{" "}
                  <b>
                    {`${property.landlordData.firstName} ${
                      property.landlordData.lastName
                        ? String(property.landlordData.lastName).substr(0, 1)
                        : ""
                    }`}
                  </b>{" "}
                  on <b>{moment(property.rejectedOn).format("YYYY-MMM-DD")}</b>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;
