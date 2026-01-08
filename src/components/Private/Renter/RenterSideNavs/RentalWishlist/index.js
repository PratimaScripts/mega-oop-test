import React, { useState } from "react";
import { Tab, Tabs, TabList } from "react-tabs";
import { useMutation } from "@apollo/react-hooks";
// import { useLocation, useHistory } from "react-router-dom";
import { message } from "antd";
import NProgress from "nprogress";
import get from "lodash/get";
import showNotification from "config/Notification";
import WishListQuery from "config/queries/wishList";
import AccountQueries from "../../../../../config/queries/account";
import Shortlist from "./Shortlist";
import Wishlist from "./Wishlist";
import "./styles.scss";

const RentalWishlist = (props) => {
  // const [shortlist, setShortlist] = useState([]);
  // const location = useLocation();
  // const history = useHistory();
  // const { search } = location;

  //wishlist,
  const [setWishlist] = useState([]);
  const [wishlistAdd, setWishlistAdd] = useState();
  const [tab, setTab] = useState(0);

  useMutation(WishListQuery.addToShortList, {
    onCompleted: ({ addToShortList }) => {
      if (addToShortList.success) {
        // setShortlist(addToShortList.data)
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

  // useEffect(() => {
  //   if(search){
  //     history.replace({
  //       search: null,
  //     })
  //     let queyString= search.replace('?', '');
  //     if(queyString.includes('propertyId')){
  //       let subArray = queyString.split('=');
  //       addToShortList({ variables: { propertyId: subArray[1] } })
  //     }
  //     else{
  //       let queries = queyString.split('&');
  //       let search_obj = {};
  //       queries.map(str => {
  //         let subArray = str.split('=');
  //         search_obj[`${subArray[0]}`] = subArray[1].replaceAll('%20', ' ')
  //         return;
  //       })
  //       let title = '';
  //       let details = '<p>';

  //       title += search_obj.location ?  search_obj.location + ' ' : '';
  //       title += search_obj.type ? search_obj.type.replaceAll('%20', ' ') : '';

  //       details +=  search_obj.type ? search_obj.type.replaceAll('%20', '&nbsp') + ', ' : '';
  //       details +=  search_obj.location ? search_obj.location + ',&nbsp' : '';
  //       details +=  search_obj.minMile && search_obj.maxMile ? search_obj.minMile + ' to ' + search_obj.maxMile+ ' mile,  <br />' : '';
  //       details +=  search_obj.minRent && search_obj.maxRent ? search_obj.minRent + ' to ' + search_obj.maxRent+ ' rent ' : '';
  //       details +=  search_obj.minBed  ? 'min '+search_obj.minBed + ' bed,&nbsp' : '';
  //       details +=  search_obj.maxBed  ? 'max '+search_obj.maxBed + ' bed,&nbsp' : '';
  //       details +=  search_obj.furnishing ? search_obj.furnishing + ',&nbsp&nbsp' : '';
  //       details +=  search_obj.duration ? 'min duaration ' + search_obj.duration + ', ' : '';
  //       details +=  search_obj.family ?  'family, &nbsp&nbsp' : '';
  //       details +=  search_obj.couple ?  'couple,&nbsp': '';
  //       details +=  search_obj.student ?  'student,<br />' : '';
  //       details +=  search_obj.single ?  'single,&nbsp' : '';
  //       details +=  search_obj.pets ?  'pets,&nbsp' : '';
  //       details +=  search_obj.smoker ?  'smoker,<br />' : '';
  //       details +=  search_obj.garden ?  'garden,&nbsp' : '';
  //       details +=  search_obj.disabledAccessability ?  'disabled accessability,&nbsp&nbsp ' : '';
  //       details +=  search_obj.unsuitedBathroom ?  'unsuited bathroom, <br />' : '';
  //       details +=  search_obj.billsIncluded ?  'bills included, ' : '';
  //       details +=  search_obj.balconyPatio ?  'balcony patio, &nbsp&nbsp' : '';
  //       details +=  search_obj.laundryUtilityRoom ?  'laundry utilityRoom, ' : '';
  //       details += '</p>'
  //       let bodyData = queyString + "##" + title + "##" + details;
  //       setWishlistAdd(bodyData);
  //       // addToWishList({ variables: { type: 'renter', body: bodyData } })
  //     }
  //   }
  // }, [search])

  useMutation(WishListQuery.addToWishList, {
    onCompleted: ({ addToWishList }) => {
      if (addToWishList.success) {
        setWishlist(get(addToWishList, "addToWishList.data"));
        showNotification("success", addToWishList.message, "");
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

  const [deleteListItem] = useMutation(AccountQueries.deleteWishList, {
    onCompleted: (deletedResult) => {
      if (get(deletedResult, "deleteWishList.success")) {
        message.success("Item was deleted from your wishlist!");
        setWishlist(get(deletedResult, "deleteWishList.data"));
      }
    },
  });

  const [deleteShortlistItems] = useMutation(
    AccountQueries.deleteShortListProperty,
    {
      onCompleted: (deletedResult) => {
        if (get(deletedResult, "deleteShortListProperty.success")) {
          message.success("Items were deleted from your shortlist!");
          // setShortlist(get(deletedResult, "deleteShortListProperty.data"));
        }
      },
    }
  );

  const deleteWishlistItem = (item) => {
    deleteListItem({
      variables: { wishlistId: item._id },
    });
  };

  const updataeWishListAlert = (wishlistId, alert) => {
    editWishListAlert({
      variables: { wishlistId: wishlistId, alert: alert },
    });
  };
  const deleteShortlist = (items) => {
    deleteShortlistItems({
      variables: { propertyId: items },
    });
  };

  return (
    <>
      <div className="rental-wishlist__wrapper">
        <Tabs>
          <TabList>
            <Tab onClick={() => setTab(0)}>Wishlist</Tab>
            <Tab onClick={() => setTab(1)}>Shortlist</Tab>
          </TabList>

          {tab === 0 && (
            <Wishlist
              deleteWishlistItem={deleteWishlistItem}
              updataeWishListAlert={updataeWishListAlert}
              setWishlist={setWishlist}
              wishlistAdd={wishlistAdd}
              setWishlistAdd={setWishlistAdd}
            />
          )}
          {tab === 1 && (
            <Shortlist
              deleteShortlist={deleteShortlist}
              // shortlist={shortlist}
            />
          )}
          {/* <TabPanel>
            <Wishlist
              deleteWishlistItem={deleteWishlistItem}
              wishlist={wishlist}
              updataeWishListAlert={updataeWishListAlert}
              setWishlist={setWishlist}
            />
          </TabPanel>
          <TabPanel>
            <Shortlist
              deleteShortlist={deleteShortlist}
              // shortlist={shortlist}
            />
          </TabPanel> */}
        </Tabs>
      </div>
    </>
  );
};

export default RentalWishlist;
