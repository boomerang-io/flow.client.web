//@ts-nocheck
import React from "react";
import { Router } from "react-router-dom";
import { FlagsProvider } from "flagged";
import { createMemoryHistory } from "history";
import { render as rtlRender } from "@testing-library/react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { AppContextProvider } from "State/context";
import { featureFlags as featureFlagsFixture, teams as teamsFixture, profile as userFixture } from "ApiServer/fixtures";
import "@testing-library/jest-dom/extend-expect";

setLogger({
  log: () => {},
  warn: () => {},
  error: () => {},
});

declare global {
  namespace NodeJS {
    interface Global {
      rtlContextRouterRender: any;
      rtlRouterRender: any;
      rtlRender: any;
      rtlQueryRender: any;
    }
  }
}

function rtlQueryRender(
  ui,
  { queryConfig = {}} = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 0 },
      mutations: { throwOnError: true },
      ...queryConfig,
    },
  });
  return {
    ...rtlRender(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>),
  };
}

function rtlRouterRender(
  ui,
  { route = "/", history = createMemoryHistory({ initialEntries: [route] }), ...options } = {}
) {
  return {
    ...rtlRender(<Router history={history}>{ui}</Router>, options),
    history,
  };
}

const defaultContextValue = {
  user: userFixture,
  teams: teamsFixture,
};

const feature = featureFlagsFixture.features;

const defaultFeatures = {
  ActivityEnabled: feature["activity"],
  EditVerifiedTasksEnabled: feature["enable.verified.tasks.edit"],
  GlobalParametersEnabled: feature["global.parameters"],
  InsightsEnabled: feature["insights"],
  TeamManagementEnabled: feature["team.management"],
  TeamParametersEnabled: feature["team.parameters"],
  TeamTasksEnabled: feature["team.tasks"],
  UserManagementEnabled: feature["user.management"],
  WorkflowQuotasEnabled: feature["workflow.quotas"],
  WorkflowTokensEnabled: feature["workflow.tokens"],
  WorkflowTriggersEnabled: feature["workflow.triggers"],
};

function rtlContextRouterRender(
  ui,
  {
    contextValue = {},
    initialState = {},
    route = "/",
    queryConfig = {},
    history = createMemoryHistory({ initialEntries: [route] }),
    ...options
  } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 0 },
      mutations: { throwOnError: true },
      ...queryConfig,
    },
  }); 
  return {
    ...rtlRender(
      <FlagsProvider features={defaultFeatures}>
        <AppContextProvider value={{ ...defaultContextValue, ...contextValue }}>
          <QueryClientProvider client={queryClient}>
            <Router history={history}>{ui}</Router>
          </QueryClientProvider>
        </AppContextProvider>
      </FlagsProvider>,
      options
    ),
    history,
  };
}

// Fix "react-modal: No elements were found for selector #app." error
beforeEach(() => {
  document.body.setAttribute("id", "app");
});

const originalConsoleError = console.error;
console.error = (message, ...rest) => {
  if (
    typeof message === "string" &&
    !message.includes("react-modal: App element is not defined") &&
    !message.includes("MultiSelectComboBox uses getDerivedStateFromProps()")
  ) {
    originalConsoleError(message, ...rest);
  }
};

const originalConsoleWarn = console.warn;
console.warn = (message, ...rest) => {
  if (typeof message === "string" && !message.includes("Invalid date provided")) {
    originalConsoleWarn(message, ...rest);
  }
};

// RTL globals
// Open question if we want to attach these to the global or required users to import
global.rtlRender = rtlRender;
global.rtlRouterRender = rtlRouterRender;
global.rtlContextRouterRender = rtlContextRouterRender;
global.rtlQueryRender = rtlQueryRender;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
  removeItem: jest.fn(),
};
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;

// Dates
const moment = jest.requireActual("moment-timezone");
jest.doMock("moment", () => {
  moment.tz.setDefault("UTC");
  moment.tz.guess(false);
  const DATE_TO_USE = new Date("Jan 1 2020 00:00:00 UTC");
  const mom = () => jest.requireActual("moment")(DATE_TO_USE);
  mom.utc = jest.requireActual("moment").utc;
  mom.fromNow = jest.requireActual("moment").fromNow;
  return mom;
});
