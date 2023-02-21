import { vi } from "vitest";
import AddTeamContent from ".";

const props = {
  teamRecords: [],
  currentQuery: "",
  closeModal: vi.fn(),
  cancelRequestRef: { current: undefined },
};

describe("AddTeamContent --- Snapshot Test", () => {
  it("Capturing Snapshot of AddTeamContent", async () => {
    const { baseElement } = global.rtlQueryRender(<AddTeamContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
