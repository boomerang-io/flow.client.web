import React from "react";
import ActivityHeader from "./index";

const props = {
  failedActivities: 10,
  runActivities: 25,
  succeededActivities: 13
};

describe("ActivityHeader --- Snapshot", () => {
  it("Capturing Snapshot of ActivityHeader", () => {
    const { baseElement } = rtlRender(<ActivityHeader {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
