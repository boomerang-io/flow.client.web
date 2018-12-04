import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import CustomTooltip from "./index";

const payload = [
  {
    color: "#047cc0",
    dataKey: "total",
    fill: "url(#blueGradient)",
    fillOpacity: 0.6,
    formatter: undefined,
    name: "total",
    payload: { date: 1542160248412, failed: 5, success: 12, total: 17 },
    stroke: "#047cc0",
    unit: undefined,
    value: 17
  }
];

describe("CustomTooltip --- Snapshot", () => {
  it("Capturing Snapshot of CustomTooltip", () => {
    const renderedValue = renderer.create(
      <MemoryRouter>
        <CustomTooltip payload={payload} />
      </MemoryRouter>
    );
    expect(renderedValue).toMatchSnapshot();
  });
});

describe("CustomTooltip --- Shallow render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <MemoryRouter>
        <CustomTooltip payload={payload} />
      </MemoryRouter>
    );
  });

  it("Render the DUMB component", () => {
    expect(wrapper.length).toEqual(1);
  });
});
