import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryConfigProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { ErrorBoundary } from "@boomerang-io/carbon-addons-boomerang-react";
import App from "Features/App";
import ErrorDragon from "Components/ErrorDragon";
import { AppPath } from "Config/appConfig";

function Root() {
  return (
    <ErrorBoundary errorComponent={() => <ErrorDragon style={{ marginTop: "5rem" }} />}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ReactQueryConfigProvider config={{ queries: { throwOnError: true }, mutations: { throwOnError: true } }}>
        <BrowserRouter basename={AppPath.Root}>
          <App />
        </BrowserRouter>
      </ReactQueryConfigProvider>
    </ErrorBoundary>
  );
}

export default Root;
