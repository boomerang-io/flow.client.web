/* eslint-disable */
import { vi } from "vitest";
import Quotas from "./Quotas";
import { startApiServer } from "ApiServer";

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
