import React from "react";
import { WorkflowActivity } from "./index";

const mockfn = jest.fn();

const props = {
  activityActions: {
    fetch: () => new Promise(() => {}),
    reset: mockfn
  },
  teamsActions: {
    fetch: () => new Promise(() => {})
  },
  location: {},
  history: {},
  match: {
    params: "testid"
  },
  teamsState: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  activityState: {
    last: false,
    totalPages: 9,
    totalElements: 90,
    size: 10,
    number: 0,
    numberOfElements: 10,
    first: true,
    sort: [
      {
        direction: "DESC",
        property: "creationDate",
        ignoreCase: false,
        nullHandling: "NATIVE",
        descending: true,
        ascending: false
      }
    ],
    records: [
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
    ]
  }
};

describe("WorkflowActivity --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowActivity", () => {
    const { baseElement } = rtlRouterRender(<WorkflowActivity {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
