import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryConfigProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { ErrorBoundary } from "@boomerang/carbon-addons-boomerang-react";
import App from "Features/App";
import ErrorDragon from "Components/ErrorDragon";
import { appPath } from "Config/appConfig";

function Root() {
  return (
    <ErrorBoundary errorComponent={() => <ErrorDragon style={{ marginTop: "5rem" }} />}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ReactQueryConfigProvider config={{ throwOnError: true }}>
        <BrowserRouter basename={appPath.root}>
          <App />
        </BrowserRouter>
      </ReactQueryConfigProvider>
    </ErrorBoundary>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
