import React, { useState, useEffect } from "react";
// import isEmpty from "lodash/isEmpty";
import { useLocation, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Popconfirm } from "antd";
import useForceUpdate from "use-force-update";
import get from "lodash/get";
import {
  //  Menu, Dropdown,
  Select,
} from "antd";
import AccountQueries from "../../../../../config/queries/account";
import { message } from "antd";
import NProgress from "nprogress";
import { UpdateWishlist } from "./UpdateWishlist";
import "./styles.scss";
import showNotification from "config/Notification";
import WishListQuery from "config/queries/wishList";

const { Option } = Select;

const alert_content = ["No email ", "Monthly", "Weekly", "Instant"];

const RentalWishlist = (props) => {
  const forceUpdate = useForceUpdate();

  const location = useLocation();
  const history = useHistory();
  const { search } = location;

  const selectInitialData = (data) => {
    forceUpdate();
    // setInitialData
  };

  const [openDrawer, setOpenDrawer] = useState(false);
  const [list, setList] = useState({});
  const [wishlist, setWishlist] = useState([]);

  useQuery(AccountQueries.getWishList, {
    onCompleted: (WishlistData) =>
      setWishlist(get(WishlistData, "getWishList.data")),
  });

  const { data, loading, error } = useQuery(AccountQueries.getWishList);

  useEffect(() => {
    if (!loading && !error && data) {
      setWishlist(data.getWishList.data);
    }
    //eslint-disable-next-line
  }, [data]);

  const [addToWishList] = useMutation(WishListQuery.addToWishList, {
    onCompleted: ({ addToWishList }) => {
      if (addToWishList.success) {
        // setChanges(true);
        setWishlist([]);
        // console.log(wishlist)
        setWishlist(get(addToWishList, "data"));

        props.setWishlistAdd("");
        showNotification("success", addToWishList.message, "");
        return;
      } else {
        showNotification("error", addToWishList.message, "");
      }
      NProgress.done();
    },
    onError: ({ graphQLErrors, networkError }) => {
      // setLoading(false)
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      NProgress.done();
    },
  });
  const [editWishListAlert] = useMutation(WishListQuery.editWishListAlert, {
    onCompleted: ({ editWishListAlert }) => {
      if (editWishListAlert.success) {
        setWishlist(editWishListAlert.data);
        showNotification("success", editWishListAlert.message, "");
      } else {
        showNotification("error", editWishListAlert.message, "");
      }
      NProgress.done();
    },
    onError: ({ graphQLErrors, networkError }) => {
      // setLoading(false)
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      NProgress.done();
    },
  });
  const [deleteListItem] = useMutation(AccountQueries.deleteWishList, {
    onCompleted: (deletedResult) => {
      if (get(deletedResult, "deleteWishList.success")) {
        message.success("Item was deleted from your wishlist!");
        setWishlist(get(deletedResult, "deleteWishList.data"));
      }
    },
  });

  // const handleVisibleChange = (flag) => {
  //   setVisible(flag);
  // };
  const updataeWishListAlert = (wishlistId, alert) => {
    editWishListAlert({
      variables: { wishlistId: wishlistId, alert: alert },
    });
  };
  const deleteWishlistItem = (item) => {
    deleteListItem({
      variables: { wishlistId: item._id },
    });
  };

  const [addToShortList] = useMutation(WishListQuery.addToShortList, {
    onCompleted: ({ addToShortList }) => {
      if (addToShortList.success) {
        showNotification("success", addToShortList.message, "");
      } else {
        showNotification("error", addToShortList.message, "");
      }
      NProgress.done();
    },
    onError: ({ graphQLErrors, networkError }) => {
      // setLoading(false)
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      NProgress.done();
    },
  });

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (search) {
        history.replace({
          search: null,
        });
        let queyString = search.replace("?", "");
        if (queyString.includes("propertyId")) {
          let subArray = queyString.split("=");
          addToShortList({ variables: { propertyId: subArray[1] } });
        } else {
          let queries = queyString.split("&");
          let search_obj = {};
          queries.map((str) => {
            let subArray = str.split("=");
            search_obj[`${subArray[0]}`] = subArray[1].replaceAll("%2C", ",");
            return null;
          });
          let title = "";
          let details = "<p>";

          title += search_obj.location
            ? search_obj.location.replaceAll("%20", " ") + " "
            : "";
          title += search_obj.type
            ? search_obj.type.replaceAll("%20", " ")
            : "";

          details += search_obj.type
            ? search_obj.type.replaceAll("%20", "&nbsp") + ", "
            : "";
          details += search_obj.location
            ? search_obj.location.replaceAll("%20", " ") + ",&nbsp"
            : "";
          details +=
            search_obj.minMile && search_obj.maxMile
              ? search_obj.minMile +
                " to " +
                search_obj.maxMile +
                " mile,  <br />"
              : "";
          details +=
            search_obj.minRent && search_obj.maxRent
              ? search_obj.minRent + " to " + search_obj.maxRent + " rent "
              : "";
          details += search_obj.minBed
            ? "min " + search_obj.minBed + " bed,&nbsp"
            : "";
          details += search_obj.maxBed
            ? "max " + search_obj.maxBed + " bed,&nbsp"
            : "";
          details += search_obj.furnishing
            ? search_obj.furnishing + ",&nbsp&nbsp"
            : "";
          details += search_obj.duration
            ? "min duaration " + search_obj.duration + ", "
            : "";
          details += search_obj.family ? "family, &nbsp&nbsp" : "";
          details += search_obj.couple ? "couple,&nbsp" : "";
          details += search_obj.student ? "student,<br />" : "";
          details += search_obj.single ? "single,&nbsp" : "";
          details += search_obj.pets ? "pets,&nbsp" : "";
          details += search_obj.smoker ? "smoker,<br />" : "";
          details += search_obj.garden ? "garden,&nbsp" : "";
          details += search_obj.disabledAccessability
            ? "disabled accessability,&nbsp&nbsp "
            : "";
          details += search_obj.unsuitedBathroom
            ? "unsuited bathroom, <br />"
            : "";
          details += search_obj.billsIncluded ? "bills included, " : "";
          details += search_obj.balconyPatio ? "balcony patio, &nbsp&nbsp" : "";
          details += search_obj.laundryUtilityRoom
            ? "laundry utilityRoom, "
            : "";
          details += "</p>";
          let bodyData = queyString + "##" + title + "##" + details;

          addToWishList({ variables: { type: "renter", body: bodyData } });

          let alldata = [...wishlist];
          alldata.push({
            type: "renter",
            body: bodyData,
            alert: "No email",
          });
          setWishlist(alldata);
          return;
        }
      }
    }
    return () => {
      isMounted = false;
    };
    //eslint-disable-next-line
  }, [search]);

  return (
    <>
      <UpdateWishlist
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        list={list}
        setWishlist={setWishlist}
      />

      <div className="wishlist__wrap">
        <div className="container screening__tables">
          <div className="row">
            <div className="col-md-12"></div>
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead className="thead-dark">
                  <tr>
                    <th></th>
                    <th>Saved Searches</th>
                    <th>Alert</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((list, i) => {
                    const dataSearch = list.body.split("##");
                    let title = dataSearch[1];
                    let details = dataSearch[2];
                    let saearchQuyery = dataSearch[0];

                    return (
                      <tr
                        key={list._id}
                        onClick={() => {
                          selectInitialData(list);
                        }}
                        // key={i}
                      >
                        <td className="border__primary">
                          <div className="property__img">
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg"
                              alt="img"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="property__name">
                            <p>{title}</p>
                          </div>
                          <div className="property__info">
                            {/* <div className="details_wrap des-full" style={{fontSize: 14}}>
                                {ReactHtmlParser(details)}
                              </div> */}
                            <div
                              dangerouslySetInnerHTML={{ __html: details }}
                              style={{ fontWeight: "unset", fontSize: "12px" }}
                            ></div>
                          </div>
                        </td>
                        <td>
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select alert type"
                            optionFilterProp="children"
                            onChange={(val) => {
                              updataeWishListAlert(list._id, val);
                            }}
                            value={list.alert}
                            // onFocus={onFocus}
                            // onBlur={onBlur}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {alert_content.map((alert) => {
                              return (
                                <Option value={alert}>
                                  {alert + " "}alert
                                </Option>
                              );
                            })}
                          </Select>
                        </td>
                        <td>
                          <div className="wrapper__action">
                            <ul>
                              <a
                                href={
                                  process.env.REACT_APP_PUBLIC_URL +
                                  "/search/properties/?" +
                                  saearchQuyery
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <li className="text-success">
                                  <i className="fa fa-eye"></i>
                                  View
                                </li>
                              </a>
                              <li
                                className="text-primary"
                                onClick={() => {
                                  setList(list);
                                  setOpenDrawer(true);
                                }}
                              >
                                <i className="fa fa-edit"></i>
                                Edit
                              </li>
                              <Popconfirm
                                title="Are you sure delete this item from your wishlist?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => deleteWishlistItem(list)}
                              >
                                <li className="text-danger">
                                  <i className="fa fa-trash"></i>
                                  Delete
                                </li>
                              </Popconfirm>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalWishlist;
