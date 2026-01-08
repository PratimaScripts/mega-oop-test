import React, { useState, useEffect, useContext } from "react";
import { Checkbox, Popconfirm, message } from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import isEmpty from "lodash/isEmpty";
import findIndex from "lodash/findIndex";
import get from "lodash/get";
import useForceUpdate from "use-force-update";
import ReactHtmlParser from "react-html-parser";
import AccountQueries from "../../../../../config/queries/account";
import "./styles.scss";
import { UserDataContext } from "store/contexts/UserContext";
const RentalShortlist = (props) => {
  const forceUpdate = useForceUpdate();

  const [listToDelete, setList] = useState([]);
  const [shortlist, setShortlist] = useState([]);

  const {
    state: { userData },
  } = useContext(UserDataContext);

  // Fetch shortlist
  useQuery(AccountQueries.getShortList, {
    onCompleted: (ShortlistData) =>
      setShortlist(get(ShortlistData, "getShortList.data")),
    onError: (error) => console.log(error),
  });

  const updateList = (data, e) => {
    let ar = listToDelete;
    if (e) {
      ar.push(data._id);
    }

    if (!e) {
      if (ar.includes(data._id)) {
        let indexOfOld = findIndex(ar, function (o) {
          return o === data._id;
        });

        ar.splice(indexOfOld, 1);
      }
    }

    setList(ar);
    forceUpdate();
  };

  const [deleteShortlistItems] = useMutation(
    AccountQueries.deleteShortListProperty,
    {
      onCompleted: (deletedResult) => {
        if (get(deletedResult, "deleteShortListProperty.success")) {
          setShortlist(get(deletedResult, "deleteShortListProperty.data"));
          setList([]);
          message.success("Items were deleted from your shortlist!");
        }
      },
    }
  );

  const deleteShortlist = (items) => {
    deleteShortlistItems({
      variables: { propertyId: items },
    });
  };

  useEffect(() => {
    setShortlist(props.shortlist);
    setList([]);

    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="list__view">
        {!isEmpty(listToDelete) && (
          <div className="delete_component">
            <Popconfirm
              title="Are you sure delete these items from your shortlist?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                deleteShortlist(listToDelete);
                setList([]);
              }}
            >
              <button className="btn btn_delete">
                <i className="fa fa-trash"></i> Delete
              </button>
            </Popconfirm>
          </div>
        )}
        <div className="bg">
          {!isEmpty(shortlist) &&
            shortlist.map((data, i) => {
              return (
                <div className="shortlist--center" key={i}>
                  <Checkbox
                    onChange={(e) => updateList(data, e.target.checked)}
                  />
                  <div className="bg_main">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-2">
                          <div className="image_wishlist">
                            <img
                              src={get(
                                data,
                                "property.photos[0]",
                                "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1579693025/property_img_placeholder_thumb.png"
                              )}
                              alt="img"
                            />
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="list">
                            <ul>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-credit-card mr-1"
                                    aria-hidden="true"
                                  ></i>
                                  Rent p/m
                                  <a href>
                                    {" "}
                                    £{data.property?.listing?.monthlyRent}
                                  </a>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-database mr-1"
                                    aria-hidden="true"
                                  ></i>
                                  Deposit p/m
                                  <a href>
                                    {" "}
                                    £{data.property?.listing?.deposit}
                                  </a>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-map-marker mr-1"
                                    aria-hidden="true"
                                  ></i>
                                  Distance<a href> view map</a>
                                </p>
                              </li>
                            </ul>
                          </div>
                          <div className="description">
                            <p>{data.property?.title}</p>
                            <div
                              className="details_wrap des-full"
                              style={{ fontSize: 14 }}
                            >
                              {ReactHtmlParser(
                                data?.property?.listing?.description
                              )}
                            </div>
                            {/* <div dangerouslySetInnerHTML={{__html: data.property.listing.description}} style={{ fontWeight: 'unset', fontSize: '12px' }}></div> */}
                          </div>
                          <div className="listing">
                            <ul>
                              <li>
                                <button className="btn btn_furnished">
                                  {data.property?.listing?.furnishing}
                                </button>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-bed"
                                    aria-hidden="true"
                                  ></i>
                                  {data.property?.numberOfBed}
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-bath"
                                    aria-hidden="true"
                                  ></i>
                                  {data.property?.numberOfBath}
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fas fa-couch"
                                    aria-hidden="true"
                                  ></i>
                                  {data.property?.numberOfReception}
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fas fa-tape"
                                    aria-hidden="true"
                                  ></i>
                                  {data.property?.sizeInSquareFeet} sq. ft.
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-camera"
                                    aria-hidden="true"
                                  ></i>
                                  {data.property.photos &&
                                  data.property.photos.length > 0
                                    ? data.property.photos.length
                                    : 0}
                                </p>
                              </li>
                              <li>
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                  className="mr-3"
                                  alt="img"
                                />
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="btn_rightsection text-right">
                            {userData.role !== "renter" && (
                              <>
                                <a
                                  className="btn btn_rent"
                                  href={
                                    process.env.REACT_APP_PUBLIC_URL +
                                    "/property/" +
                                    data.property.propertyId
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Apply to Rent
                                </a>
                                <a
                                  className="btn btn_offer"
                                  href={
                                    process.env.REACT_APP_PUBLIC_URL +
                                    "/property/" +
                                    data.property.propertyId
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Make an Offer
                                </a>
                              </>
                            )}
                            <a
                              className="btn btn_book"
                              href={
                                process.env.REACT_APP_PUBLIC_URL +
                                "/property/" +
                                data.property.propertyId
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Book Viewing
                            </a>
                            <a
                              className="btn btn_view"
                              href={
                                process.env.REACT_APP_PUBLIC_URL +
                                "/property/" +
                                data.property.propertyId
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default RentalShortlist;
