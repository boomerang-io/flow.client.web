import React from "react";
import StepSideInfo from "./index";

const props = {
  step: {
    taskName: "test",
    flowTaskStatus: "completed",
    startTime: 1540912389131,
    duration: 2178
  },
  task: {
    taskId: "2",
    taskName: "test task"
  },
  flowActivityId: "1"
};

describe("StepSideInfo --- Snapshot", () => {
  it("Capturing Snapshot of StepSideInfo", () => {
    const { baseElement } = rtlRender(<StepSideInfo {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
