import React from "react";
import ReactDOM from "react-dom";
// import "roc/scss/style.scss";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "react-apollo";
// import ApolloClient from "apollo-boost";
import { ApolloLink, Observable } from "apollo-link";

import { withClientState } from "apollo-link-state";
import cookie from "react-cookies";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

import { StoreProvider } from "store/store";
import { UserDataProvider } from "store/contexts/UserContext";

// import { InMemoryCache } from "apollo-cache-inmemory";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import "react-tabs/style/react-tabs.css";
import "draft-js/dist/Draft.css";

// want to run locals backend server ?
// change the value of REACT_APP_SERVER in env file
// don't change it from here
const BASE_URL = `${process.env.REACT_APP_SERVER}/graphql`;

// do not change this while resolving the merge conflict
const SOCKET_URL = process.env.REACT_APP_WSSSERVER;

const wsLink = new WebSocketLink({
  uri: SOCKET_URL,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: BASE_URL,
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache({ addTypename: false });
const history = createBrowserHistory();

const localClientStates = withClientState({});

const request = async (operation) => {
  const token = await cookie.load(process.env.REACT_APP_AUTH_TOKEN);
  operation.setContext({
    headers: {
      authorization: token ? `${token}` : "",
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
  mutate: {
    errorPolicy: "all",
  },
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, requestLink, localClientStates, link]),
  cache,
  defaultOptions,
});

const rootElement = document.getElementById("root");

// DOM BEING HYDRATED'
if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <StoreProvider>
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Router history={history}>
          <UserDataProvider>
            <App />
          </UserDataProvider>
        </Router>
      </ApolloHooksProvider>
    </ApolloProvider>
  </StoreProvider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
