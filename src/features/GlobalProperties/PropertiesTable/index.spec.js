import React from "react";
import PropertiesTable from ".";

const mockfn = jest.fn();
const props = {
  properties: [{ id: "1", key: "test.key", value: "testing" }],
  addPropertyInStore: mockfn,
  deletePropertyInStore: mockfn,
  updatePropertyInStore: mockfn
};

describe("PropertiesTable --- Snapshot Test", () => {
  beforeEach(() => {
    document.body.setAttribute("id", "app");
  });
  it("Capturing Snapshot of PropertiesTable", () => {
    const { baseElement } = rtlRender(<PropertiesTable {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
