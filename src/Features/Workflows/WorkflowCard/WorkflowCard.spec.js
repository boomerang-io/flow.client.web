import React from "react";
import WorkflowCard from "./index";
import { queryCaches } from "react-query";

const mockfn = jest.fn();

const props = {
  history: {},
  teamId: "1",
  updateWorkflows: mockfn,
  executeWorkflow: mockfn,
  deleteWorkflow: mockfn,
  setActiveTeam: mockfn,
  workflow: {
    id: "789",
    name: "lucas-workflow-3",
    description: "blablabla",
    status: "draft",
    icon: "schedule",
  },
};

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("WorkflowCard --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowCard", () => {
    const { baseElement } = rtlRouterRender(<WorkflowCard {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
