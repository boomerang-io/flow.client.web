import React from "react";
import ActivityTable from "./index";

const props = {
  activities: [],
  isUpdating: false,
  sort: {},
  tableData: { records: [], pageable: { number: 0, size: 10, sort: "asc", totalElements: 10 } }
};

describe("ActivityTable --- Snapshot", () => {
  it("Capturing Snapshot of ActivityTable", () => {
    const { baseElement } = rtlRouterRender(<ActivityTable {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
