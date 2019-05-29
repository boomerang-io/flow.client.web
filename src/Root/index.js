import React from "react";
import PropTypes from "prop-types";
import { hot } from "react-hot-loader/root";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ErrorBoundary from "@boomerang/boomerang-components/lib/ErrorBoundary";
import App from "Features/App";
import ErrorDragon from "Components/ErrorDragon";

const Root = props => {
  const { store } = props;
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary errorComponent={ErrorDragon}>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default hot(Root);
