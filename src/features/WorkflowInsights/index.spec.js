import React from "react";
import { WorkflowInsights } from "./index";

const props = {
  location: {},
  insightsActions: {
    fetch: () => new Promise(resolve => resolve({ test: "test" }))
  },
  teamsActions: {
    fetch: () => new Promise(() => {})
  },
  teams: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  },
  insights: {
    isFetching: false,
    status: "success",
    error: "",
    data: {
      totalActivitiesExecuted: 107,
      medianExecutionTime: 24435,
      executions: [
        {
          creationDate: 1542292277199,
          duration: 20825,
          id: "5bed8335b336a5000103aa2b",
          initiatedByUserId: "5bbcdd38ee763e00011f5b72",
          initiatedByUserName: "Adrienne Hudson",
          status: "completed",
          workflowId: "5bed82f6b336a5000103aa1d",
          workflowRevisionid: "5bed82f7b336a5000103aa20",
          description: "test delete",
          icon: "flow",
          shortDescription: "test",
          workflowName: "Adrienne3",
          teamName: "CAI Offering Team"
        }
      ]
    }
  }
};

describe("WorkflowInsights --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowInsights", () => {
    const { baseElement } = rtlRouterRender(<WorkflowInsights {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
