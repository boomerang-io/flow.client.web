import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import { WorkflowActivity } from "./index";

jest.mock("Components/NavigateBack", () => "NavigateBack");

const activityActions = {
  fetch: () => new Promise(() => {})
};
const teamsActions = {
  fetch: () => new Promise(() => {})
};
const match = {
  params: "testid"
};
const teams = {
  isFetching: false,
  status: "success",
  error: "",
  data: []
};
const activity = {
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
};

describe("WorkflowActivity --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowActivity", () => {
    const renderedValue = renderer
      .create(
        <MemoryRouter>
          <WorkflowActivity
            activity={activity}
            teams={teams}
            activityActions={activityActions}
            teamsActions={teamsActions}
            match={match}
            location={{}}
            history={{}}
          />
        </MemoryRouter>
      )
      .toJSON();
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowActivity --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <WorkflowActivity
          activity={activity}
          teams={teams}
          activityActions={activityActions}
          teamsActions={teamsActions}
          match={match}
          location={{}}
          history={{}}
        />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
