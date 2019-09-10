import React from "react";
import WorkflowSummary from "./index";

const props = {
  workflowData: {
    name: "test",
    shortDescription: "test"
  },
  workflowExecutionData: {
    status: "",
    creationDate: "",
    duration: ""
  },
  version: 1
};

describe("WorkflowSummary --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowSummary", () => {
    const renderedValue = rtlRender(<WorkflowSummary {...props} />);
    expect(renderedValue).toMatchSnapshot();
  });
});
