import React from "react";
import WorkflowsHeader from "./index";

const mockfn = jest.fn();

const props = {
  workflowsLength: 1,
  handleSearchFilter: mockfn,
  isLoading: false,
  options: [
    {
      name: "test team",
      id: "testid"
    }
  ]
};

describe("WorkflowsHeader --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsHeader", () => {
    const { baseElement } = rtlRender(<WorkflowsHeader {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
