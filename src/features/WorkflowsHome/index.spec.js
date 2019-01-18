import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import { WorkflowsHome } from "./index";

const mockfn = jest.fn();

const teamsActions = {
  fetch: mockfn,
  setActiveTeam: mockfn,
  updateWorkflows: mockfn
};
const teams = {
  isFetching: false,
  status: "success",
  error: "",
  data: []
};

describe("WorkflowsHome --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsHome", () => {
    const renderedValue = renderer
      .create(
        <MemoryRouter>
          <WorkflowsHome teams={teams} teamsActions={teamsActions} />
        </MemoryRouter>
      )
      .toJSON();
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowsHome --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <WorkflowsHome teams={teams} teamsActions={teamsActions} />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
