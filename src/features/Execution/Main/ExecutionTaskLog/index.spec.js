import React from "react";
import ExecutionTaskLog from "./index";

const mockfn = jest.fn();

const props = {
  setActiveTeam: mockfn,
  workflow: { id: "2", flowTeamId: "3" },
  workflowExecutionData: {
    id: "1",
    duration: 904934,
    status: "completed",
    steps: [
      {
        activityId: "5c36289096052900012cc81d",
        duration: 300190,
        flowTaskStatus: "completed",
        id: "5c36289096052900012cc81e",
        order: 1,
        startTime: "2019-09-03T15:00:00.230+0000",
        taskId: "515c8b05-ceb0-470a-a58e-b8740b332a6a",
        outputs: {
          args: {
            test: "true"
          }
        },
        taskName: "Send Slack Message"
      }
    ]
  }
};

describe("ExecutionTaskLog --- Snapshot", () => {
  it("Capturing Snapshot of ExecutionTaskLog", () => {
    const { baseElement } = rtlRouterRender(<ExecutionTaskLog {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
