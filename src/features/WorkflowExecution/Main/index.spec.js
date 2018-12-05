import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Main from "./index";

jest.mock("Components/NavigateBack", () => "NavigateBack");

const mockfn = jest.fn();

const dag = {};
const taskId = "test";
const workflowData = {};
const workflowExecutionData = {};
const version = 1;

describe("Main --- Snapshot", () => {
  it("Capturing Snapshot of Main", () => {
    const renderedValue = renderer.create(
      <Main
        dag={dag}
        taskId={taskId}
        workflowData={workflowData}
        workflowExecutionData={workflowExecutionData}
        updateActiveNode={mockfn}
        version={version}
      />
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("Main --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Main
        dag={dag}
        taskId={taskId}
        workflowData={workflowData}
        workflowExecutionData={workflowExecutionData}
        updateActiveNode={mockfn}
        version={version}
      />
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
