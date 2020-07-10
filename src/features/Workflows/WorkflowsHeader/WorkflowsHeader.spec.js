import React from "react";
import WorkflowsHeader from "./index";
import { queryCaches } from "react-query";

const mockfn = jest.fn();

const props = {
  workflowsLength: 1,
  handleSearchFilter: mockfn,
  isLoading: false,
  options: [
    {
      name: "test team",
      id: "testid",
    },
  ],
};

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("WorkflowsHeader --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowsHeader", () => {
    const { baseElement } = rtlRender(<WorkflowsHeader {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
