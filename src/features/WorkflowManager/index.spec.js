import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import { WorkflowManagerContainer as WorkflowManager } from "./index";

jest.mock("Components/NavigateBack", () => "NavigateBack");
jest.mock("./Creator", () => "Creator");
jest.mock("./components/ActionBar", () => "ActionBar");

const mockfn = jest.fn();

const actions = {
  fetch: mockfn,
  reset: mockfn
};
const tasks = {
  isFetching: false,
  status: "success",
  error: "",
  data: []
};
const workflow = {
  isFetching: false,
  status: "success",
  error: "",
  data: []
};

describe("WorkflowManager --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowManager", () => {
    const renderedValue = renderer
      .create(
        <MemoryRouter>
          <WorkflowManager
            tasks={tasks}
            workflow={workflow}
            tasksActions={actions}
            workflowRevisionActions={actions}
            workflowActions={actions}
          />
        </MemoryRouter>
      )
      .toJSON();
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowManager --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <WorkflowManager
          tasks={tasks}
          workflow={workflow}
          tasksActions={actions}
          workflowActions={actions}
          workflowRevisionActions={actions}
        />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
