import React from "react";
import ActivityTable from "./index";

const props = {
  activities: [],
  isUpdating: false,
  sort: {}
};

describe("ActivityTable --- Snapshot", () => {
  it("Capturing Snapshot of ActivityTable", () => {
    const { baseElement } = rtlRouterRender(<ActivityTable {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
