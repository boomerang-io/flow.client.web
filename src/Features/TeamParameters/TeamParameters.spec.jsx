import React from "react";
import TeamParameters from "./index";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { startApiServer } from "ApiServer";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("TeamParameters --- Snapshot Test", () => {
  test("Capturing Snapshot of TeamParameters", () => {
    const { baseElement } = rtlContextRouterRender(<TeamParameters />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TeamParameters --- RTL", () => {
  test("Selects team from dropdown and shows table data", async () => {
    rtlContextRouterRender(<TeamParameters />);
    const dropDown = await screen.findByPlaceholderText("Select a team");
    fireEvent.click(dropDown);
    await waitFor(() => {
      screen.getByText("IBM Services Engineering");
    });

    fireEvent.click(screen.getByText("IBM Services Engineering"));
    const rowItem = await screen.findByText("for testing purpose");
    expect(rowItem).toBeInTheDocument();
  });
});
