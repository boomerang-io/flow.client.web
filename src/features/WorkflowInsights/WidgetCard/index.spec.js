import React from "react";
import WidgetCard from "./index";

const title = "test title";
const children = "test children";

describe("WidgetCard --- Snapshot", () => {
  it("Capturing Snapshot of WidgetCard", () => {
    const { baseElement } = rtlRouterRender(<WidgetCard title={title} children={children} />);
    expect(baseElement).toMatchSnapshot();
  });
});
