import React from "react";
import PropertiesTable from "./index";
// import config from "../../../apiServer/fixtures/config.js"
import config from "ApiServer/fixtures/config.js";
import { queryCaches } from "react-query";

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("PropertiesTable --- Snapshot Test", () => {
  it("Capturing Snapshot of PropertiesTable", () => {
    const { baseElement } = rtlRender(<PropertiesTable properties={config} />);
    expect(baseElement).toMatchSnapshot();
  });
});
