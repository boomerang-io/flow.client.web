import React from "react";
import PropTypes from "prop-types";
import { hot } from "react-hot-loader/root";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import ErrorBoundary from "@boomerang/boomerang-components/lib/ErrorBoundary";
import App from "Features/App";
import ErrorDragon from "Components/ErrorDragon";

const Root = props => {
  const { store, history } = props;
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ErrorBoundary errorComponent={ErrorDragon}>
          <App />
        </ErrorBoundary>
      </ConnectedRouter>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default hot(Root);
