import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import AppLoader from 'components/loaders/AppLoader'
import { UserDataContext } from "store/contexts/UserContext"

const LandlordRoute = ({ component, ...rest }) => {
  const { state: userState } = useContext(UserDataContext)
  const { userData, isAuthenticated, loading } = userState
  const userType = userData.role;


  if (!isEmpty(userData) || !loading) {
    return (
      <Route
        {...rest}
        exact
        render={props =>
          userData && userType === "landlord" && isAuthenticated ? (
            <div>{React.createElement(component, props)}</div>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  return <AppLoader />

};

LandlordRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func]).isRequired,
  location: PropTypes.object
};

// Renter Route
const RenterRoute = ({ component, ...rest }) => {
  const { state: userState } = useContext(UserDataContext)
  const { userData, isAuthenticated, loading } = userState
  const userType = userData.role;

  if (!isEmpty(userData) || !loading) {
    return (
      <Route
        {...rest}
        exact
        render={props =>
          userData && userType === "renter" && isAuthenticated ? (
            <div>{React.createElement(component, props)}</div>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  return <AppLoader />;
};

RenterRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func]).isRequired,
  location: PropTypes.object
};

// Service Pro Route

const ServiceProRoute = ({ component, ...rest }) => {
  const { state: userState } = useContext(UserDataContext)
  const { userData, isAuthenticated, loading } = userState
  const userType = userData.role;


  if (!isEmpty(userData) || !loading) {
    return (
      <Route
        {...rest}
        exact
        render={props =>
          userData && userType === "servicepro" && isAuthenticated ? (
            <div>{React.createElement(component, props)}</div>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  return <AppLoader />
};

ServiceProRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func]).isRequired,
  location: PropTypes.object
};

// Site Admin Route

const SiteAdminRoute = ({ component, ...rest }) => {
  const { state: userState } = useContext(UserDataContext)
  const { userData, isAuthenticated, loading } = userState
  const userType = userData.role;

  if (!isEmpty(userData) || !loading) {
    return (
      <Route
        {...rest}
        exact
        render={props =>
          userData && userType === "admin" && isAuthenticated ? (
            <div>{React.createElement(component, props)}</div>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  return <AppLoader />
};

SiteAdminRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func]).isRequired,
  location: PropTypes.object
};

// Impoersonator Route

const ImpoersonatorRoute = ({ component, ...rest }) => {
  const { state: userState } = useContext(UserDataContext)
  const { userData, isAuthenticated, loading } = userState
  const userType = userData.role;

  if (!isEmpty(userData) || !loading) {
    return (
      <Route
        {...rest}
        exact
        render={props =>
          userData && userType === "invitee" && isAuthenticated ? (
            <div>{React.createElement(component, props)}</div>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
  return <AppLoader />
};

ImpoersonatorRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func]).isRequired,
  location: PropTypes.object
};

export default {
  LandlordRoute,
  RenterRoute,
  ServiceProRoute,
  SiteAdminRoute,
  ImpoersonatorRoute
};
