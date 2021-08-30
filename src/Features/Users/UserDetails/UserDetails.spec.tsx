import React from "react";
import UserDetails from ".";
import { waitFor } from "@testing-library/react";

describe("UserDetails --- Snapshot Test", () => {
  it("Capturing Snapshot of UserDetails", async () => {
    const { baseElement } = rtlContextRouterRender(<UserDetails />);
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});
