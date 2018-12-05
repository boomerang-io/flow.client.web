import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowExecutionActions } from "State/workflowExecution";
import { actions as workflowExecutionActiveNodeActions } from "State/workflowExecutionActiveNode";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { WorkflowExecutionContainer } from "./index";

jest.mock("./Main", () => "Main");

const match = { params: {} };

const tasks = {
  isFetching: false,
  status: "",
  error: "",
  data: []
};

const workflow = {
  isFetching: false,
  isUpdating: false,
  isCreating: false,
  fetchingStatus: "",
  updatingStatus: "",
  creatingStatus: "",
  error: "",
  data: {}
};

const workflowExecution = {
  isFetching: false,
  status: "",
  error: "",
  data: {}
};

const workflowExecutionActiveNode = {
  activeNode: {}
};

const workflowRevision = {
  isFetching: false,
  isCreating: false,
  fetchingStatus: "",
  creatingStatus: "",
  error: "",
  dag: undefined,
  version: "",
  config: {}
};

describe("WorkflowExecutionContainer --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowExecutionContainer", () => {
    const renderedValue = renderer.create(
      <WorkflowExecutionContainer
        match={match}
        tasks={tasks}
        tasksActions={tasksActions}
        workflow={workflow}
        workflowActions={workflowActions}
        workflowExecution={workflowExecution}
        workflowExecutionActions={workflowExecutionActions}
        workflowExecutionActiveNode={workflowExecutionActiveNode}
        workflowExecutionActiveNodeActions={workflowExecutionActiveNodeActions}
        workflowRevision={workflowRevision}
        workflowRevisionActions={workflowRevisionActions}
      />
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowExecutionContainer --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <WorkflowExecutionContainer
        match={match}
        tasks={tasks}
        tasksActions={tasksActions}
        workflow={workflow}
        workflowActions={workflowActions}
        workflowExecution={workflowExecution}
        workflowExecutionActions={workflowExecutionActions}
        workflowExecutionActiveNode={workflowExecutionActiveNode}
        workflowExecutionActiveNodeActions={workflowExecutionActiveNodeActions}
        workflowRevision={workflowRevision}
        workflowRevisionActions={workflowRevisionActions}
      />
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
