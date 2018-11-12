import React, { Component } from "react";
import PropTypes from "prop-types";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import ErrorBoundary from "@boomerang/boomerang-components/lib/ErrorBoundary";
import App from "Features/App";
import ErrorDragon from "Components/ErrorDragon";

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ErrorBoundary component={ErrorDragon}>
            <App />
          </ErrorBoundary>
        </ConnectedRouter>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
