import React from "react";
import renderer from "react-test-renderer";
import SearchFilterBar from "./index";

const props = {
  options: [{ name: "test", workflows: [] }],
  handleSearchFilter: jest.fn(),
  debounceTimeout: 300,
  filterItems: [],
  multiselect: false,
  selectedOption: "test"
};

describe("SearchFilterBar --- Snapshot", () => {
  it("Capturing Snapshot of SearchFilterBar", () => {
    const renderedValue = renderer.create(<SearchFilterBar {...props} />);
    expect(renderedValue).toMatchSnapshot();
  });
});
