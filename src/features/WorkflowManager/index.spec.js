import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import { WorkflowManagerContainer as WorkflowManager } from "./index";

jest.mock("Components/NavigateBack", () => "NavigateBack");
jest.mock("./Creator", () => "Creator");
jest.mock("./components/ActionBar", () => "ActionBar");
jest.mock("@boomerang/boomerang-components", () => ({
  NoDisplay: "NoDisplay",
  LoadingAnimation: "LoadingAnimation",
  notify: "notify",
  Notification: "Notification"
}));

const mockfn = jest.fn();

const actions = {
  fetch: () => new Promise(() => {}),
  reset: mockfn
};
const tasks = {
  isFetching: false,
  status: "success",
  error: "",
  data: []
};
const teams = {
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

const workflowRevision = {
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
            teams={teams}
            workflow={workflow}
            tasksActions={actions}
            teamsActions={actions}
            workflowRevisionActions={actions}
            workflowRevision={workflowRevision}
            workflowActions={actions}
            match={{}}
            history={{}}
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
          teams={teams}
          workflow={workflow}
          tasksActions={actions}
          teamsActions={actions}
          workflowActions={actions}
          workflowRevision={workflowRevision}
          workflowRevisionActions={actions}
          match={{}}
          history={{}}
        />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
