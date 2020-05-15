import React from "react";
import renderer from "react-test-renderer";
import Enzyme, { shallow, render, mount } from "enzyme";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Adapter from "enzyme-adapter-react-16";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import "@testing-library/jest-dom/extend-expect";
//import "@testing-library/react/cleanup-after-each";

/**
 * Setup store w/ same config we use for the app so things like thunks work
 * The entire store  w/ the root reducer gets created, but its is relatively lightweight if there is no data in it
 * The alternative is passing in the reducer to this function for each test. I prefer this simpler setup.
 */

function rtlReduxRender(ui, { initialState = {} } = {}) {
  const store = configureStore(initialState);
  return {
    ...rtlRender(<Provider store={store}>{ui}</Provider>),
    store,
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

function rtlReduxRouterRender(
  ui,
  { initialState = {}, route = "/", history = createMemoryHistory({ initialEntries: [route] }), ...options } = {}
) {
  let { store } = options;
  if (!store) {
    store = configureStore(initialState);
  }

  return {
    ...rtlRender(
      <Provider store={store}>
        <Router history={history}>{ui}</Router>
      </Provider>,
      options
    ),
    history,
    store,
  };
}

// Fix "react-modal: No elements were found for selector #app." error
beforeEach(() => {
  document.body.setAttribute("id", "app");
});

// RTL globals
// Open question if we want to attach these to the global or required users to import
global.rtlRender = rtlRender;
global.rtlReduxRender = rtlReduxRender;
global.rtlRouterRender = rtlRouterRender;
global.rtlReduxRouterRender = rtlReduxRouterRender;

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
