/* eslint-disable array-callback-return */
import React, { Suspense, lazy, useContext } from "react";

import { Layout } from "antd";

import get from "lodash/get";
import { withApollo } from "react-apollo";

import LockScreen from "../../Public/LockScreen/";
import { UserDataContext } from "store/contexts/UserContext";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import AppLoader from 'components/loaders/AppLoader';
import DashboardHeader from "../../layout/headers/DashboardHeader";
import DashboardSidebar from "components/layout/sidebars/DashboardSidebar"
import DashboardBreadcrums from "components/layout/breadcrums/DashboardBreadcums";

import "../style.scss";
const { Content } = Layout;

// LAZY LOADED COMPONENTS -------------------------------------------------

const LandlordMain = (props) => {
  // const value = useContext(UserDataContext)
  const { state: userState } = useContext(UserDataContext)
  const { state: interfaceState } = useContext(InterfaceContext)

  const { userData, permissions, isImpersonate } = userState;
  const userRole = userData.role;
  const { sidebarCollapsed, sidebarClass, location } = interfaceState
  const { match } = props;

  const allPermAr = [];
  // console.log("landlord location", window.location)

  const Routes = userRole === 'landlord'
    ? lazy(() => import("routes/LandlordRoutes"))
    : (userRole === 'servicepro'
      ? lazy(() => import("routes/ServiceProRoutes"))
      : lazy(() => import("routes/RenterRoutes")));

  // permissions.forEach((p, i) => {
  //   allPermAr.push(p.tab);
  // });

  const isMenuDisabled =
    get(userData, "isProfileUpdate") && get(userData, "isPersonaUpdate")
      ? false
      : true;


  return (
    <>
      {!isImpersonate && (
        <LockScreen userData={userData} {...props} />
      )}

      <div>
        <>
          <DashboardHeader
            isMenuDisabled={isMenuDisabled}
            client={props.client}
          />
          <Layout>
            <DashboardSidebar collapsed={sidebarCollapsed} siderClass={sidebarClass} />
            <Content

              className={
                !sidebarCollapsed
                  ? "right__container--part right__container--padding"
                  : "right__container--part"
              }
            >
              {/* BreadCrumb Data */}

              <DashboardBreadcrums role={userRole}
                location={location} />
              <Suspense
                fallback={<AppLoader />
                }
              >
                <Routes match={match}
                  userData={userData}
                  isImpersonate={isImpersonate}
                  collapsed={sidebarCollapsed}
                />

              </Suspense>
            </Content>
          </Layout>
        </>
      </div>
    </>
  );
}

export default withApollo(LandlordMain);
