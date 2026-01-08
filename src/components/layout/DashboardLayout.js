/* eslint-disable array-callback-return */
import React, { Suspense, useContext, useEffect, useRef } from "react";
import cookie from "react-cookies";

import { Layout } from "antd";

import get from "lodash/get";
import { useHistory } from "react-router-dom";
import NProgress from "nprogress";

import LockScreen from "components/Public/LockScreen/";
import { UserDataContext } from "store/contexts/UserContext";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import AppLoader from 'components/loaders/AppLoader';
import DashboardHeader from "components/layout/headers/DashboardHeader";
import DashboardSidebar from "components/layout/sidebars/DashboardSidebar"
import DashboardBreadcrums from "components/layout/breadcrums/DashboardBreadcums";
import UserQuery from "config/queries/login";


import "./style.scss";
import { useLazyQuery } from "react-apollo";
import showNotification from "config/Notification";
const { Content } = Layout;


// LAZY LOADED COMPONENTS -------------------------------------------------

const DashboardLayout = (props) => {
  // const value = useContext(UserDataContext)
  const token = useRef(cookie.load(process.env.REACT_APP_AUTH_TOKEN));
  const isAuth = useRef()


  const history = useHistory()
  const { state: userState, dispatch: userDispatch } = useContext(UserDataContext)
  const { state: interfaceState, dispatch: interfaceDispatch } = useContext(InterfaceContext)

  const { userData } = userState;
  const userRole = userData.role;
  const { sidebarCollapsed, sidebarClass, showLinearProgress } = interfaceState

  // const allPermAr = [];


  // permissions.forEach((p, i) => {
  //     allPermAr.push(p.tab);
  // });
  const [checkAuthQuery] = useLazyQuery(UserQuery.checkAuth, {
    onCompleted: ({ authentication }) => {
      // console.log("Authentication", authentication)
      isAuth.current = authentication.success
      if (authentication.success) {
        localStorage.setItem("currentRole", get(authentication, "data.role"));
        userDispatch({ type: "SET_USER_DATA", payload: authentication })
      } else {
        userDispatch({ type: "SET_LOADING", payload: false })
      }
    },
    onError: (error) => {
      // console.log("error")
      showNotification("error", "An error occurred!")
      userDispatch({ type: "LOGOUT" })
    }
  });

  function handleResize() {
    interfaceDispatch({ type: 'SET_WINDOW_SIZE', payload: getWindowDimensions() })
  }
  useEffect(() => {
    const timer = setInterval(async () => {
      await localStorageUpdated()
    }, 5000);

    showLinearProgress ? NProgress.start() : NProgress.done()
    window.addEventListener('resize', handleResize);
    const unlisten = history.listen((location, action) => {
      interfaceDispatch({ type: 'SET_LOCATION', payload: location })
    });
    return () => {
      unlisten()
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerHeight, window.innerWidth, history]);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const localStorageUpdated = async () => {
    const newToken = await cookie.load(process.env.REACT_APP_AUTH_TOKEN)
    // console.log("old token : ", token, "newToken :", newToken)
    if (newToken !== token.current && newToken === undefined) {
      //   console.log("in first block")
      token.current = newToken
      userDispatch({ type: "LOGOUT" })
      history.push('/login')
    }
    else if (newToken !== token.current) {
      token.current = newToken
      checkAuthQuery();
      //   console.log("I am here to perform query")
    }
  }

  const isMenuDisabled =
    get(userData, "isProfileUpdate") && get(userData, "isPersonaUpdate")
      ? false
      : true;

  return (
    <>

      <LockScreen userData={userData} {...props} />

      <div>
          <DashboardHeader
            isMenuDisabled={isMenuDisabled}
            client={props.client} />
          <Layout>
            {history.location.pathname !== "/workspace" && <DashboardSidebar collapsed={sidebarCollapsed} siderClass={sidebarClass} />}
            <Content
              className={!sidebarCollapsed && history.location.pathname !== "/workspace"
                ? "right__container--part right__container--padding"
                : "right__container--part"}>
              {/* BreadCrumb Data */}
              <DashboardBreadcrums role={userRole} />
              <Suspense
                fallback={<AppLoader />
                }>
                {props.children}

              </Suspense>
            </Content>
          </Layout>
      </div>
    </>
  );
}

export default DashboardLayout;
