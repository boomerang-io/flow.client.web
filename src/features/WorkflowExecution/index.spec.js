import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowExecutionActions } from "State/workflowExecution";
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

// TO DO: To be removed if not used in future development
// const workflowExecutionActiveNode = {
//   activeNode: {}
// };

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

const app = {
  activeNode: {
    dag: {
      id: "3f58d302-2a3c-4765-b606-7573d313a2fa",
      offsetX: -51.15583333333335,
      offsetY: 2.996013020833331,
      zoom: 100.01666666666667,
      gridSize: 0,
      links: [],
      nodes: [
        {
          id: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
          type: "startend",
          selected: false,
          x: 300,
          y: 400,
          extras: {},
          ports: [
            {
              id: "6f1f5e66-9bc1-4675-a654-5f580036a173",
              type: "startend",
              selected: false,
              name: "right",
              parentNode: "cbdc30f0-f8d5-4674-87d3-117787fe8263",
              links: [],
              position: "right",
              nodePortId: "6f1f5e66-9bc1-4675-a654-5f580036a173"
            }
          ],
          passedName: "Start",
          nodeId: "cbdc30f0-f8d5-4674-87d3-117787fe8263"
        }
      ]
    }
  }
};

describe("WorkflowExecutionContainer --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowExecutionContainer", () => {
    const renderedValue = renderer.create(
      <WorkflowExecutionContainer
        app={app}
        match={match}
        tasks={tasks}
        tasksActions={tasksActions}
        workflow={workflow}
        workflowActions={workflowActions}
        workflowExecution={workflowExecution}
        workflowExecutionActions={workflowExecutionActions}
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
        app={app}
        match={match}
        tasks={tasks}
        tasksActions={tasksActions}
        workflow={workflow}
        workflowActions={workflowActions}
        workflowExecution={workflowExecution}
        workflowExecutionActions={workflowExecutionActions}
        workflowRevision={workflowRevision}
        workflowRevisionActions={workflowRevisionActions}
      />
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
