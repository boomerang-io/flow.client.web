import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import WorkflowCard from "./index";

jest.mock("./WorkflowInputModalContent", () => "WorkflowInputModalContent");

const mockfn = jest.fn();

const history = {};
const teamId = "1";
const updateWorkflows = mockfn;
const executeWorkflow = mockfn;
const deleteWorkflow = mockfn;
const workflow = {
  id: "789",
  name: "lucas-workflow-3",
  description: "blablabla",
  status: "draft",
  icon: "secure"
};

describe("WorkflowCard --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowCard", () => {
    const renderedValue = renderer.create(
      <MemoryRouter>
        <WorkflowCard
          workflow={workflow}
          history={history}
          updateWorkflows={updateWorkflows}
          executeWorkflow={executeWorkflow}
          deleteWorkflow={deleteWorkflow}
          teamId={teamId}
        />
      </MemoryRouter>
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowCard --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <WorkflowCard
          workflow={workflow}
          history={history}
          updateWorkflows={updateWorkflows}
          executeWorkflow={executeWorkflow}
          deleteWorkflow={deleteWorkflow}
          teamId={teamId}
        />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
