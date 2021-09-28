import React from "react";
import AddTeamContent from ".";
import { waitFor } from "@testing-library/react";

const props = {
  teamRecords: [],
  currentQuery: "",
};

describe("AddTeamContent --- Snapshot Test", () => {
  it("Capturing Snapshot of AddTeamContent", async () => {
    const { baseElement } = rtlRender(<AddTeamContent {...props} />);
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});
