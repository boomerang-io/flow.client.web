import { vi } from "vitest";
import CreateEditPropertiesContent from ".";

const mockfn = vi.fn();
const props = {
  isEdit: true,
  property: { id: "1", key: "test.key", value: "testing" },
  propertyKeys: ["test"],
  handleEditClose: mockfn,
  addPropertyInStore: mockfn,
  updatePropertyInStore: mockfn,
  cancelRequestRef: { current: null },
};

describe("CreateEditPropertiesContent --- Snapshot Test", () => {
  it("Capturing Snapshot of CreateEditPropertiesContent", () => {
    const { baseElement } = global.rtlQueryRender(<CreateEditPropertiesContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
