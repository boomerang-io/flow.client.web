import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import WorkflowSummary from "./index";

const workflowData = {
  name: "test",
  shortDescription: "test"
};

const workflowExecutionData = {
  status: "",
  creationDate: "",
  duration: ""
};

const version = 1;

describe("WorkflowSummary --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowSummary", () => {
    const renderedValue = renderer.create(
      <WorkflowSummary workflowExecutionData={workflowExecutionData} workflowData={workflowData} version={version} />
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("WorkflowSummary --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <WorkflowSummary workflowExecutionData={workflowExecutionData} workflowData={workflowData} version={version} />
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
