import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TokenComponent from "./index";
import { tokens, teams } from "ApiServer/fixtures";

describe("TokenComponent --- Snapshot", () => {
  it("Capturing Snapshot of TokenComponent", () => {
    const { baseElement } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={tokens} teams={teams} activeTeam={teams[0]}/>
    );
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TokenComponent --- RTL", () => {
  it("Displays created tokens", async () => {
    const { queryAllByText } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={tokens} teams={teams} activeTeam={teams[0]}/>
    );
    expect(queryAllByText(/Test User/i).length).toBeGreaterThan(0);
  });

  it("Open Create Modal", async () => {
    const { getByText, queryByText, findByTestId, findByText } = rtlContextRouterRender(
      <TokenComponent deleteToken={jest.fn()} tokens={tokens} teams={teams} setActiveTeam={() => jest.fn()} activeTeam={teams[0]}/>
    );
    const teamsInput = await findByTestId("team-tokens-combobox");
    userEvent.click(teamsInput);
    userEvent.click(await findByText(/essentials/i));

    const button = await findByTestId("create-token-button");
    expect(queryByText(/Create Team Token/i)).not.toBeInTheDocument();
    await act(async () => fireEvent.click(button));
    expect(getByText(/Create Team Token/i)).toBeInTheDocument();
  });
});
