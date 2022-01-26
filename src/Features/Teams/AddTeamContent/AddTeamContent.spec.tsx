import React from "react";
import AddTeamContent from ".";
import { waitFor } from "@testing-library/react";

const props = {
  teamRecords: [],
  currentQuery: "",
  closeModal: jest.fn(),
  cancelRequestRef: { current: undefined },
};

describe("AddTeamContent --- Snapshot Test", () => {
  it("Capturing Snapshot of AddTeamContent", async () => {
    const { baseElement } = global.rtlRender(<AddTeamContent {...props} />);
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});
