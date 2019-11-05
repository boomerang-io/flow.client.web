import React from "react";
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
    const { baseElement } = rtlRouterRender(<CustomTooltip payload={payload} />);
    expect(baseElement).toMatchSnapshot();
  });
});
