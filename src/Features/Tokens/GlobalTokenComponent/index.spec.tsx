import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { tokens } from "ApiServer/fixtures";
import TokenComponent from "./index";

const props = {
  deleteToken: jest.fn(),
  tokens: tokens,
  hasError: false,
  isLoading: false,
};

describe("TokenComponent --- Snapshot", () => {
  it("Capturing Snapshot of TokenComponent", () => {
    const { baseElement } = global.rtlContextRouterRender(<TokenComponent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TokenComponent --- RTL", () => {
  it("Displays created tokens", async () => {
    global.rtlContextRouterRender(<TokenComponent {...props} />);
    expect(screen.queryAllByText(/Test User/i).length).toBeGreaterThan(0);
  });

  it("Open Create Modal", async () => {
    global.rtlContextRouterRender(<TokenComponent {...props} />);
    const button = await screen.findByTestId(/create-token-button/i);
    expect(screen.queryByText(/Create Global Token/i)).not.toBeInTheDocument();
    // await waitFor(() => fireEvent.click(button));
    fireEvent.click(button);
    expect(screen.getByText(/Create Global Token/i)).toBeInTheDocument();
  });
});
