import React from "react";
import ActivityTable from "./index";
import { queryCaches } from "react-query";

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

const props = {
  activities: [],
  isUpdating: false,
  sort: {},
  tableData: { records: [], pageable: { number: 0, size: 10, sort: "asc", totalElements: 10 } },
  match: {
    params: "testid",
  },
  location: {},
  history: {},
  updateHistorySearch: jest.fn(),
};

describe("ActivityTable --- Snapshot", () => {
  it("Capturing Snapshot of ActivityTable", () => {
    const { baseElement } = rtlRouterRender(<ActivityTable {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
