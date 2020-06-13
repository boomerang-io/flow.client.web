import React from "react";
import WorkflowsHome from "./index";
import { startApiServer } from "../../apiServer";

const mockfn = jest.fn();
jest.mock("@boomerang/carbon-addons-boomerang-react", () => ({
  ...jest.requireActual("@boomerang/carbon-addons-boomerang-react"),
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
});

describe("WorkflowsHome --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsHome", () => {
    const { baseElement } = rtlContextRouterRender(<WorkflowsHome {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
