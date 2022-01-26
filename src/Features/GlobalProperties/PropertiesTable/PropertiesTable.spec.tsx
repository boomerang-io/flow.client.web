import React from "react";
import PropertiesTable from "./index";
// import config from "../../../apiServer/fixtures/config.js"
import config from "ApiServer/fixtures/config.js";

describe("PropertiesTable --- Snapshot Test", () => {
  it("Capturing Snapshot of PropertiesTable", () => {
    const { baseElement } = global.rtlRender(<PropertiesTable properties={config} />);
    expect(baseElement).toMatchSnapshot();
  });
});
