import React from "react";
import ActivityHeader from "./index";
import { queryCaches } from "react-query";

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

const props = {
  failedActivities: 10,
  runActivities: 25,
  succeededActivities: 13,
  inProgressActivities: 0,
  isLoading: false,
};

describe("ActivityHeader --- Snapshot", () => {
  it("Capturing Snapshot of ActivityHeader", () => {
    const { baseElement } = rtlRender(<ActivityHeader {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
