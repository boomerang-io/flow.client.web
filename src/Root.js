import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ReactQueryConfigProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query-devtools";
import { ErrorBoundary } from "@boomerang/carbon-addons-boomerang-react";
import App from "Features/App";
import ErrorDragon from "Components/ErrorDragon";
import { APP_ROOT } from "Config/appConfig";

const Root = props => {
  const { store } = props;
  return (
    <ErrorBoundary errorComponent={() => <ErrorDragon style={{ marginTop: "5rem" }} />}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ReactQueryConfigProvider config={{ throwOnError: true }}>
        <Provider store={store}>
          <BrowserRouter basename={APP_ROOT}>
            <App />
          </BrowserRouter>
        </Provider>
      </ReactQueryConfigProvider>
    </ErrorBoundary>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
