import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryConfigProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import App from "Features/App";
import ErrorBoundary from "Components/ErrorBoundary";
import { APP_ROOT, isDevEnv, isTestEnv } from "Config/appConfig";

function Root() {
  return (
    <ErrorBoundary>
      {isDevEnv && <ReactQueryDevtools initialIsOpen={false} />}
      <ReactQueryConfigProvider config={{  queries: { retry: isDevEnv || isTestEnv ? 0 : 3 }, mutations: { throwOnError: true } }}>
        <BrowserRouter basename={APP_ROOT}>
          <App />
        </BrowserRouter>
      </ReactQueryConfigProvider>
    </ErrorBoundary>
  );
}

export default Root;
