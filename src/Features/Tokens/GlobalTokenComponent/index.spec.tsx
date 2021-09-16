import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import { tokens } from "ApiServer/fixtures";
import TokenComponent from "./index";

describe("TokenComponent --- Snapshot", () => {
  it("Capturing Snapshot of TokenComponent", () => {
    const { baseElement } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={tokens} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TokenComponent --- RTL", () => {
  it("Displays created tokens", async () => {
    const { queryAllByText } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={tokens} />
    );
    expect(queryAllByText(/Test User/i).length).toBeGreaterThan(0);
  });

  it("Open Create Modal", async () => {
    const { getByText, queryByText, findByTestId } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={tokens} />
    );
    const button = await findByTestId(/create-token-button/i);
    expect(queryByText(/Create Global Token/i)).not.toBeInTheDocument();
    await act(async () => fireEvent.click(button));
    expect(getByText(/Create Global Token/i)).toBeInTheDocument();
  });
});
