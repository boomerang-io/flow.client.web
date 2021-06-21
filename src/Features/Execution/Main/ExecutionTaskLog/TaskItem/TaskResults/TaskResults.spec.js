import React from "react";
import TaskResults from "./index";
import { queryCaches } from "react-query";

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

const props = {
  flowTaskName: "Send Slack Message",
  flowTaskResults: [
    {
      "name": "test",
      "description": "Test description",
      "value": "Testing value"
    }
  ],
};

describe("TaskResults --- Snapshot", () => {
  it("Capturing Snapshot of TaskResults", () => {
    const { baseElement } = rtlRender(<TaskResults {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
