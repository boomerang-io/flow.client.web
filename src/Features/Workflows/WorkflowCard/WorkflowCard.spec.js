import React from "react";
import { queryCaches } from "react-query";
import { startApiServer } from "ApiServer";
import { teams } from "ApiServer/fixtures";
import WorkflowCard from "./index";

const props = {
  teamId: teams[0].id,
  quotas: teams[0].quotas,
  workflow: teams[0].workflows,
};

let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
  server.shutdown();
});

describe("WorkflowCard --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowCard", () => {
    const { baseElement } = rtlRouterRender(<WorkflowCard {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
