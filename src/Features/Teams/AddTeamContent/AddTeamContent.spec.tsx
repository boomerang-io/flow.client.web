import React from "react";
import AddTeamContent from ".";

const props = {
  teamRecords: [],
  currentQuery: "",
  closeModal: jest.fn(),
  cancelRequestRef: { current: undefined },
};

describe("AddTeamContent --- Snapshot Test", () => {
  it("Capturing Snapshot of AddTeamContent", async () => {
    const { baseElement } = global.rtlQueryRender(<AddTeamContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
