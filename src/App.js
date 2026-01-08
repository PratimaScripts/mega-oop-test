import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DashboardFooter from 'components/layout/footers/DashboardFooter';
import AppLoader from 'components/loaders/AppLoader';
import React, { useContext, useEffect } from "react";
import Routes from 'routes/RootRoutes';
import { InterfaceProvider } from "store/contexts/InterfaceContext";
// import { Redirect } from "react-router-dom";
// import Login from "components/Public/Login";
// import NProgress from "nprogress";
import { UserDataContext } from "store/contexts/UserContext";
import AccountQueries from "./config/queries/account";
import UserQuery from "./config/queries/login";
import ScreeningOrders from "./config/queries/screening";
import ScrollToTop from "./config/ScrollToTop";
import socket from "./SocketIO";


// import { StripeProvider, Elements } from "react-stripe-elements";



const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);



// LAZY LOADED COMPONENTS -------------------------------------------------------

const App = props => {
  const { dispatch, state } = useContext(UserDataContext)
  // console.log("role", state.userData.verifiedStatus)
  localStorage.removeItem('next');


  useQuery(UserQuery.checkAuth, {
    onCompleted: ({ authentication }) => {
      if (authentication.success) {
        dispatch({ type: "SET_USER_DATA", payload: authentication })
        socket.emit("ONLINE_USER", {
          userId: authentication.data._id,
          role: authentication.data.role
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    onError: (error) => {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  });

  const { loading = true, isAuthenticated = false,
    userData = {
      firstName: "", role: "",
      isEmailVerified: false,
      verifiedStatus: "Not Verified"
    } } = state;
  // console.log("state", userData)


  const [fetchProfileAbout] = useLazyQuery(AccountQueries.fetchProfileAbout, {
    onCompleted: ({ getProfileInformation }) => {
      if (getProfileInformation.success) {
        dispatch({ type: "UPDATE_PROFILE_ABOUT", payload: getProfileInformation.data })
      }

    }
  });
  const [fetchProfileConnect] = useLazyQuery(
    AccountQueries.fetchConnectProfile,
    {
      onCompleted: ({ getConnectInformation }) => {
        if (getConnectInformation.success) {
          dispatch({ type: "UPDATE_CONNECT_DETAILS", payload: getConnectInformation.data })
        }
      }
    }
  );
  const [fetchProfileBankData] = useLazyQuery(AccountQueries.getBankDetail, {
    onCompleted: ({ getBankDetail }) => {
      if (getBankDetail.success) {
        dispatch({ type: "UPDATE_BANK_DETAILS", payload: getBankDetail.data })
      }
    }
  });

  const [fetchPendingOrders] = useLazyQuery(
    ScreeningOrders.fetchPendingOrdersSelf
  );



  const [fetchProfileCompleteness] = useLazyQuery(AccountQueries.fetchProfileCompleteness, {
    onCompleted: ({ getProfileCompleteness }) => {
      if (getProfileCompleteness.success) {
        dispatch({
          type: "SET_PROFILE_COMPLETENESS_DATA",
          payload: getProfileCompleteness.data
        })
      }
    }
  })
  useEffect(() => {
    if (isAuthenticated) {
      // fetchAccrediationsList();
      fetchProfileAbout();
      /**invitee role doesnt have this feature */
      fetchProfileConnect();
      fetchProfileBankData();
      fetchPendingOrders();
      fetchProfileCompleteness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated,
    state.userData.role,
    userData.isEmailVerified,
    userData.verifiedStatus
    // data
  ]);

  if (loading) {
    return <AppLoader />
  }

  // if (!loading && !isAuthenticated) {
  //   return <Login {...props}
  //   />

  // }

  // if (isAuthenticated) {
  //   return (
  //     <Elements stripe={stripePromise}>
  //       <>
  //         <div className="App">
  //           <ScrollToTop />
  //           <InterfaceProvider>
  //             <DashboardLayout />
  //           </InterfaceProvider>
  //         </div>
  //         <DashboardFooter />
  //       </>
  //     </Elements>
  //   )
  // }

  return (
    <>
      <Elements stripe={stripePromise}>
        <>
          <div className="App">
            <ScrollToTop />
            <InterfaceProvider>
              <Routes />
            </InterfaceProvider>
          </div>
          <DashboardFooter />
        </>
      </Elements>
    </>
  );
};

export default App;
