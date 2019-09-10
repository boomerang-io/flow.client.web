import React from "react";
import ActivityList from "./index";

const history = {};
const activities = [
  {
    creationDate: 1541070397344,
    duration: 13886,
    id: "5bdade3d37dc4700011b06c3",
    initiatedBy: "5bc7b126f7856000012cd95d",
    status: "completed",
    workflowId: "5bd9d8ab7eb44d0001772e64",
    workflowRevisionid: "5bd9e1cfa40f5d0001249bfa",
    description: "file ingestion",
    teamName: "Isa's Team",
    icon: "flow",
    shortDescription: "file ingestion",
    workflowName: "Business Process Test"
  }
];

const match = {
  url: "test.url"
};

const mockfn = jest.fn();

const props = {
  activities,
  history,
  match,
  loadMoreActivities: mockfn,
  setMoreActivities: mockfn
};

describe("ActivityList --- Snapshot", () => {
  it("Capturing Snapshot of ActivityList", () => {
    const { baseElement } = rtlRouterRender(<ActivityList {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
