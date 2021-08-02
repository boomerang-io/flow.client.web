import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import TokenComponent from "./index";
import { TOOL_TEMPLATES_MOCK, TOKENS_MOCK } from "../mockData/data.js";

describe("TokenComponent --- Snapshot", () => {
  it("Capturing Snapshot of TokenComponent", () => {
    const { baseElement } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={TOKENS_MOCK} toolTemplates={TOOL_TEMPLATES_MOCK} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TokenComponent --- RTL", () => {
  it("Displays created tokens", async () => {
    const { getByText } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={TOKENS_MOCK} toolTemplates={TOOL_TEMPLATES_MOCK} />
    );
    expect(getByText(/Test User1/i)).toBeInTheDocument();
  });

  it("Open Create Modal", async () => {
    const { getByText, queryByText, findByTestId } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={TOKENS_MOCK} toolTemplates={TOOL_TEMPLATES_MOCK} />
    );
    const button = await findByTestId(/create-token-button/i);
    expect(queryByText(/Create Access Token/i)).not.toBeInTheDocument();
    await act(async () => fireEvent.click(button));
    expect(getByText(/Create Access Token/i)).toBeInTheDocument();
  });
});
