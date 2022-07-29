import { vi } from "vitest";
import Header from "./index";
import { tasktemplate } from "ApiServer/fixtures";

const mockfn = vi.fn();

const props = {
  editVerifiedTasksEnabled: true,
  formikProps: {},
  selectedTaskTemplate: tasktemplate[0],
  currentRevision: { version: 1 },
  handleSaveTaskTemplate: mockfn,
  handleputRestoreTaskTemplate: mockfn,
  isOldVersion: false,
  isActive: true,
  isLoading: false,
};

describe("Header --- Snapshot", () => {
  it("Capturing Snapshot of Task Templates", async () => {
    const { baseElement } = rtlContextRouterRender(<Header {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
