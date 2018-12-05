import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import TimeProgressBar from "./index";

const mockfn = jest.fn();

const tasks = {
  creationDate: 1540912389131,
  duration: 7178,
  id: "5bd8750446e4bf790fe60aef",
  status: "completed",
  workflowId: "5bd6fdf65a5df954ad47bdbe",
  workflowRevisionid: "5bd85a2146e4bf444d97417d",
  steps: [
    {
      activityId: "5bd8750446e4bf790fe60aef",
      duration: 2178,
      flowTaskStatus: "inProgress",
      id: "5bd8750546e4bf790fe60af0",
      order: 0,
      startTime: 1540912389131,
      taskId: "5006c70f-c7f0-4679-940c-82ba89755599",
      taskName: "task1"
    },
    {
      activityId: "5bd8750446e4bf790fe60aef",
      duration: 3000,
      flowTaskStatus: "notstarted",
      id: "5bd8750546e4bf790fe60af1",
      order: 1,
      startTime: 1540912391309,
      taskId: "d64fb25d-932a-4894-9087-ded1b63eb672",
      taskName: "task2"
    }
  ]
};

describe("TimeProgressBar --- Snapshot", () => {
  it("Capturing Snapshot of TimeProgressBar", () => {
    const renderedValue = renderer.create(<TimeProgressBar tasks={tasks} updateActiveNode={mockfn} />);
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("TimeProgressBar --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TimeProgressBar tasks={tasks} updateActiveNode={mockfn} />);
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
