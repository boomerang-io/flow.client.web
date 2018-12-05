import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import StepSideInfo from "./index";

const step = {
  taskName: "test",
  flowTaskStatus: "completed",
  startTime: 1540912389131,
  duration: 2178
};

describe("StepSideInfo --- Snapshot", () => {
  it("Capturing Snapshot of StepSideInfo", () => {
    const renderedValue = renderer.create(<StepSideInfo step={step} />);
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("StepSideInfo --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<StepSideInfo step={step} />);
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
