import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ErrorBoundary } from "@boomerang/carbon-addons-boomerang-react";
import App from "Features/App";
import ErrorDragon from "Components/ErrorDragon";
import { APP_ROOT } from "Config/appConfig";
import { hot } from "react-hot-loader/root";

const Root = props => {
  const { store } = props;
  return (
    <ErrorBoundary errorComponent={ErrorDragon}>
      <Provider store={store}>
        <BrowserRouter basename={APP_ROOT}>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default hot(Root);
