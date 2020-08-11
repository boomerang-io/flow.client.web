import React from "react";
import Settings from "./Settings";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Response } from "miragejs";
import { startApiServer } from "ApiServer";
import { serviceUrl } from "Config/servicesConfig";
import { queryCaches } from "react-query";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("Settings --- Snapshot", () => {
  test("Capturing Snapshot of Settings", () => {
    const { baseElement } = rtlContextRouterRender(<Settings />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("Settings --- RTL", () => {
  test("Loads and opens section", async () => {
    rtlContextRouterRender(<Settings />);
    expect(screen.getByRole("heading", { name: /^Settings$/i })).toBeInTheDocument();
    const section = await screen.findByRole("heading", { name: "Slack" });
    fireEvent.click(section);
    expect(screen.getByLabelText(/^Platform Users Channel$/i)).toBeInTheDocument();
  });
});
describe("Settings --- RTL", () => {
  beforeEach(() => {
    server.get(serviceUrl.resourceSettings(), () => {
      return new Response(500, {}, {});
    });
  });
  test("Shows error message on request failure", async () => {
    rtlContextRouterRender(<Settings />);
    expect(screen.getByRole("heading", { name: /^Settings$/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Oops, something went wrong.")).toBeInTheDocument();
    });
  });
});
