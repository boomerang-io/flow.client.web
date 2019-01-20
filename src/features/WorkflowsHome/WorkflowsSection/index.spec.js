import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import WorkflowsSection from "./index";

const mockfn = jest.fn();

const searchQuery = "test";
const setActiveTeamAndRedirect = mockfn;
const updateWorkflows = mockfn;
const setActiveTeam = mockfn;
const executeWorkflow = mockfn;
const deleteWorkflow = mockfn;
const team = {
  id: "1234",
  name: "Lucas' team",
  workflows: [
    {
      id: "hQDkX9v",
      name: "lucas-workflow-1",
      description: "blablabla",
      status: "published",
      icon: "utility"
    },
    {
      id: "456",
      name: "lucas-workflow-2",
      description: "blablabla",
      status: "published",
      icon: "utility"
    },
    {
      id: "789",
      name: "lucas-workflow-3",
      description: "blablabla",
      status: "draft",
      icon: "secure"
    }
  ]
};
const history = {};

describe("WorkflowsSection --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsSection", () => {
    const renderedValue = renderer.create(
      <MemoryRouter>
        <WorkflowsSection
          history={history}
          searchQuery={searchQuery}
          team={team}
          updateWorkflows={updateWorkflows}
          executeWorkflow={executeWorkflow}
          deleteWorkflow={deleteWorkflow}
          setActiveTeam={setActiveTeam}
          setActiveTeamAndRedirect={setActiveTeamAndRedirect}
        />
      </MemoryRouter>
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowsSection --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <WorkflowsSection
          history={history}
          searchQuery={searchQuery}
          team={team}
          updateWorkflows={updateWorkflows}
          executeWorkflow={executeWorkflow}
          deleteWorkflow={deleteWorkflow}
          setActiveTeam={setActiveTeam}
          setActiveTeamAndRedirect={setActiveTeamAndRedirect}
        />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
