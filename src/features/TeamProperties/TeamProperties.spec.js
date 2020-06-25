import React from "react";
import TeamProperties from "./index";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { startApiServer } from "ApiServer";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("TeamProperties --- Snapshot Test", () => {
  test("Capturing Snapshot of TeamProperties", () => {
    const { baseElement } = rtlContextRouterRender(<TeamProperties />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TeamProperties --- RTL", () => {
  test("renders message when is still fetching", async () => {
    const { findByLabelText, findByText, getByText } = rtlContextRouterRender(<TeamProperties />);
    const dropDown = await findByLabelText("Teams");
    act(() => {
      fireEvent.click(dropDown);
    });
    act(() => {
      fireEvent.click(getByText("IBM Services Engineering"));
    });
    const rowItem = await findByText("for testing purpose");
    expect(rowItem).toBeTruthy();
  });
});
