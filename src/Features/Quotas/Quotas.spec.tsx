/* eslint-disable */
import React from "react";
import Quotas from "./Quotas";
import { startApiServer } from "ApiServer";

jest.setTimeout(60000);

let server: any;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("Quotas --- Snapshot", () => {
  test("Capturing Snapshot of Quotas", () => {
    const { baseElement } = global.rtlContextRouterRender(<Quotas />);
    expect(baseElement).toMatchSnapshot();
  });
});
