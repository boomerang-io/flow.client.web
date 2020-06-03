import React from "react";
import renderer from "react-test-renderer";
import Enzyme, { shallow, render, mount } from "enzyme";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Adapter from "enzyme-adapter-react-16";
import { render as rtlRender } from "@testing-library/react";
import { AppContext } from "./state/context";
// import configureStore from "./store/configureStore";
import "@testing-library/jest-dom/extend-expect";

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
  user: { id: "1", email: "boomrng@us.ibm.com", type: "admin" },
  activeTeam: { id: "1", userRoles: ["operator"] },
  teams: [{
    higherLevelGroupId: "5c41596cf32aa30001e9d444",
    id: "5e3a35ad8c222700018ccd39",
    name: "Boomerang Flow",
    workflows: [
      {
        properties: [
          {
            required: true,
            placeholder: null,
            language: null,
            disabled: null,
            defaultValue: "",
            value: null,
            values: null,
            readOnly: false,
            description: "Tenant ID from the platform.",
            key: "tenant.name",
            label: "Tenant ID",
            type: "text",
            minValueLength: null,
            maxValueLength: null,
            options: null,
            helperText: null,
          },
          {
            required: true,
            placeholder: null,
            language: null,
            disabled: null,
            defaultValue: "iulian.corcoja@ro.ibm.com",
            value: null,
            values: null,
            readOnly: false,
            description: "The username used for Artifactory authentication.",
            key: "artifactory.username",
            label: "Artifactory Username",
            type: "text",
            minValueLength: null,
            maxValueLength: null,
            options: null,
            helperText: null,
          },
          {
            required: true,
            placeholder: null,
            language: null,
            disabled: null,
            defaultValue: "***REMOVED***",
            value: null,
            values: null,
            readOnly: false,
            description: "The API key used for Artifactory authentication",
            key: "artifactory.api_key",
            label: "Artifactory API Key",
            type: "password",
            minValueLength: null,
            maxValueLength: null,
            options: null,
            helperText: null,
          },
          {
            required: false,
            placeholder: null,
            language: null,
            disabled: null,
            defaultValue: "",
            value: null,
            values: null,
            readOnly: false,
            description: "The host of the database to connect.",
            key: "db.host",
            label: "Database Host",
            type: "text",
            minValueLength: null,
            maxValueLength: null,
            options: null,
            helperText: null,
          },
          {
            required: false,
            placeholder: null,
            language: null,
            disabled: null,
            defaultValue: null,
            value: null,
            values: null,
            readOnly: false,
            description: "The port of the database to connect.",
            key: "db.port",
            label: "Database Port",
            type: "number",
            minValueLength: null,
            maxValueLength: null,
            options: null,
            helperText: null,
          },
          {
            required: false,
            placeholder: null,
            language: null,
            disabled: null,
            defaultValue: "",
            value: null,
            values: null,
            readOnly: false,
            description: "The username used for database connection.",
            key: "db.username",
            label: "Database Username",
            type: "text",
            minValueLength: null,
            maxValueLength: null,
            options: null,
            helperText: null,
          },
          {
            required: false,
            placeholder: null,
            language: null,
            disabled: null,
            defaultValue: null,
            value: null,
            values: null,
            readOnly: false,
            description: "The password used for database connection.",
            key: "db.password",
            label: "Database Password",
            type: "password",
            minValueLength: null,
            maxValueLength: null,
            options: null,
            helperText: null,
          },
        ],
        description: "",
        flowTeamId: "5e3a35ad8c222700018ccd39",
        icon: "flow",
        id: "5eb2c4085a92d80001a16d87",
        name: "ML Train – Bot Efficiency",
        shortDescription: "Train and store ML model for Bot Efficiency.",
        status: "active",
        triggers: {
          scheduler: { enable: false, schedule: "", timezone: "", advancedCron: false },
          webhook: { enable: false, token: "" },
          event: { enable: false, topic: "" },
        },
        enablePersistentStorage: true,
        enableACCIntegration: false,
        revisionCount: 2,
        templateUpgradesAvailable: false,
      },
    ],
  }],
  setActiveTeam: () => { },
  refetchTeams: () => { },
};

function rtlContextRouterRender(
  ui,
  {
    contextValue = {},
    initialState = {},
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    ...options
  } = {}
) {
  return {
    ...rtlRender(
      <AppContext.Provider value={{ ...defaultContextValue, ...contextValue }}>
        <Router history={history}>{ui}</Router>
      </AppContext.Provider>,
      options
    ),
  };
}

// Fix "react-modal: No elements were found for selector #app." error
beforeEach(() => {
  document.body.setAttribute("id", "app");
});

// RTL globals
// Open question if we want to attach these to the global or required users to import
global.rtlRender = rtlRender;
global.rtlRouterRender = rtlRouterRender;
global.rtlContextRouterRender = rtlContextRouterRender;

// Make renderer global
global.renderer = renderer;

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;
//Dates
const DATE_TO_USE = new Date("Jan 1 2019 00:00:00 UTC");
const _Date = Date;
global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;
const moment = jest.requireActual("moment-timezone");
jest.doMock("moment", () => {
  moment.tz.setDefault("UTC");
  return moment;
});
