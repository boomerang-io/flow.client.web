import React from "react";
import CustomLegend from "./index";

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
    value: 17,
  },
];
const mockfn = jest.fn();
const toggleItem = mockfn;
const toggledItems = [];

describe("CustomLegend --- Snapshot", () => {
  it("Capturing Snapshot of CustomLegend", () => {
    const { baseElement } = rtlContextRouterRender(
      <CustomLegend payload={payload} toggleItem={toggleItem} toggledItems={toggledItems} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
