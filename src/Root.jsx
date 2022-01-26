import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import App from "Features/App";
import ErrorBoundary from "Components/ErrorBoundary";
import { APP_ROOT, isDevEnv, isTestEnv } from "Config/appConfig";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: isDevEnv || isTestEnv ? 0 : 3 },
    mutations: { throwOnError: true },
  },
});

function Root() {
  return (
    <ErrorBoundary>
      {isDevEnv && <ReactQueryDevtools initialIsOpen={false} />}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={APP_ROOT}>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default Root;
