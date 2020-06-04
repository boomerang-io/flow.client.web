import React from "react";
import WorkflowCard from "./index";

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

describe("WorkflowCard --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowCard", () => {
    const { baseElement } = rtlRouterRender(<WorkflowCard {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
