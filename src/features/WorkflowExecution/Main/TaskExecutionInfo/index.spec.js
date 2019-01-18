import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import StepSideInfo from "./index";

jest.mock("./TaskExecutionLog", () => "TaskExecutionLog");

const step = {
  taskName: "test",
  flowTaskStatus: "completed",
  startTime: 1540912389131,
  duration: 2178
};
const task = {
  taskName: "test task"
};
const flowActivityId = "1";

describe("StepSideInfo --- Snapshot", () => {
  it("Capturing Snapshot of StepSideInfo", () => {
    const renderedValue = renderer.create(<StepSideInfo step={step} task={task} flowActivityId={flowActivityId} />);
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("StepSideInfo --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<StepSideInfo step={step} task={task} flowActivityId={flowActivityId} />);
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
