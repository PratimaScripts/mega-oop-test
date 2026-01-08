import React, { useContext, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { withApollo } from "react-apollo";
import { UserDataContext } from "store/contexts/UserContext";

import AppLoader from "components/loaders/AppLoader";
import PrivateDashboardRoute from "./PrivateDashboardRoute";
import NoMatch from "components/Public/NoMatch";
import SettingsTabs from "components/Common/SettingsTabs";

// import LandlordMain from "./components/Private/Landlord";

// FOR DESIGN IGNORE

import landlordRoutes from "./LandlordRoutes";
import adminRoutes from "./AdminRoutes";
import renterRoutes from "./RenterRoutes";
import serviceProRoutes from "./ServiceProRoutes";
import PublicRoute from "./PublicRoutes";
import SettingRoutes from "./SettingRoutes";
import DelegateRoutes from "./DelegateRoutes";
// import SiteAdmin from "./components/Private/MainAdmin";

const Routes = () => {
  const { state } = useContext(UserDataContext);
  const { isAuthenticated = false, userData } = state;
  const role = userData.role;

  const settingProfileRoutes = isAuthenticated ? SettingRoutes(role) : [];

  return (
    <Switch>
      {PublicRoute().map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          children={
            <Suspense fallback={<AppLoader />}>
              <route.component />
            </Suspense>
          }
        />
      ))}
      {DelegateRoutes().map((route, index) => (
        <PrivateDashboardRoute
          key={index + 100}
          path={route.path}
          accessRole={"all"}
          exact={route.exact}
          children={<route.component />}
        />
      ))}
      {landlordRoutes().map((route, index) => (
        <PrivateDashboardRoute
          key={index + 50}
          accessRole="landlord"
          path={route.path}
          exact={route.exact}
          children={<route.component />}
        />
      ))}
      {serviceProRoutes().map((route, index) => (
        <PrivateDashboardRoute
          key={index + 50}
          accessRole="servicepro"
          path={route.path}
          exact={route.exact}
          children={<route.component />}
        />
      ))}
      {renterRoutes().map((route, index) => (
        <PrivateDashboardRoute
          key={index + 50}
          accessRole="renter"
          path={route.path}
          exact={route.exact}
          children={<route.component />}
        />
      ))}
      {adminRoutes().map((route, index) => (
        <PrivateDashboardRoute
          key={index + 50}
          accessRole="admin"
          path={route.path}
          exact={route.exact}
          children={<route.component />}
        />
      ))}
      {settingProfileRoutes.map((route, index) => (
        <PrivateDashboardRoute
          key={index + 100}
          path={route.path}
          accessRole={"all"}
          exact={route.exact}
          children={
            <SettingsTabs>
              <route.component />
            </SettingsTabs>
          }
        />
      ))}
      <Route
        children={(props) => (
          <>{isAuthenticated ? <NoMatch {...props} /> : null}</>
        )}
      />
    </Switch>
  );
};

export default withApollo(Routes);
