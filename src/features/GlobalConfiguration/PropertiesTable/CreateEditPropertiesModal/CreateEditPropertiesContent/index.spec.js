import React from "react";
import CreateEditPropertiesContent from ".";

const mockfn = jest.fn();
const props = {
  isEdit: true,
  property: { id: "1", key: "test.key", value: "testing" },
  propertyKeys: ["test"],
  handleEditClose: mockfn,
  addPropertyInStore: mockfn,
  updatePropertyInStore: mockfn
};

describe("CreateEditPropertiesContent --- Snapshot Test", () => {
  it("Capturing Snapshot of CreateEditPropertiesContent", () => {
    const { baseElement } = rtlRender(<CreateEditPropertiesContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
