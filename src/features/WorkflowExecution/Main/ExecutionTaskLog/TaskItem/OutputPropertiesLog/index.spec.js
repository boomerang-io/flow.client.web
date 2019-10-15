import React from "react";
import OutputPropertiesLog from "./index";

const props = {
  flowTaskName: "Send Slack Message",
  flowTaskOutputs: {
    args: {
      test: "true"
    }
  }
};

describe("OutputPropertiesLog --- Snapshot", () => {
  it("Capturing Snapshot of OutputPropertiesLog", () => {
    const { baseElement } = rtlRender(<OutputPropertiesLog {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
