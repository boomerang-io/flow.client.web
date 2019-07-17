import React from "react";
import PropertiesTable from ".";
import renderer from "react-test-renderer";

jest.mock("./ActionsMenu", () => "ActionsMenu");

const mockfn = jest.fn();
const props = {
  properties: [{ id: "1", key: "test.key", value: "testing" }],
  addPropertyInStore: mockfn,
  deletePropertyInStore: mockfn,
  updatePropertyInStore: mockfn
};

describe("PropertiesTable --- Snapshot Test", () => {
  it("Capturing Snapshot of PropertiesTable", () => {
    const component = renderer.create(<PropertiesTable {...props} />).toJSON();
    expect(component).toMatchSnapshot();
  });
});
