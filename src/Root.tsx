import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import App from "Features/App";
import ErrorBoundary from "Components/ErrorBoundary";
import { APP_ROOT, isDevEnv, isTestEnv } from "Config/appConfig";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: isDevEnv || isTestEnv ? 0 : 3 }
  },
});

function Root() {
  return (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          {isDevEnv && <ReactQueryDevtools initialIsOpen={false} />}
            <BrowserRouter basename={APP_ROOT}>
              <App />
            </BrowserRouter>
        </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default Root;
