import React from "react";
import WorkflowsHome from "./index";
import { startApiServer } from "ApiServer";
import { queryCaches } from "react-query";

jest.mock("@boomerang-io/carbon-addons-boomerang-react", () => ({
  ...jest.requireActual("@boomerang-io/carbon-addons-boomerang-react"),
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification",
}));

const props = {
  teamsState: {
    isFetching: false,
    status: "success",
    error: "",
    data: [],
  },
  history: {},
  importWorkflow: {},
  importWorkflowActions: {},
  onBoard: {
    show: false,
  },
};

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("WorkflowsHome --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsHome", () => {
    const { baseElement } = rtlContextRouterRender(<WorkflowsHome {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
