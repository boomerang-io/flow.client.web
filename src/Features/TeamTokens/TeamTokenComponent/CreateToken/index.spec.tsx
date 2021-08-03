import React from "react";
import { startApiServer } from "ApiServer";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { teams } from "ApiServer/fixtures";
import CreateServiceTokenButton from "./index";

let server;

beforeEach(() => {
  document.body.setAttribute("id", "app");
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("CreateServiceTokenButton --- Snapshot", () => {
  it("Capturing Snapshot of CreateServiceTokenButton", async () => {
    const { baseElement, findByText } = rtlRender(<CreateServiceTokenButton activeTeam={teams[0]} />);
    await findByText(/Create Token/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreateServiceTokenButton --- RTL", () => {
  it("Open token creation modal", async () => {
    const { getByTestId, getByText, queryByText } = rtlRender(
      <CreateServiceTokenButton activeTeam={teams[0]} />
    );
    const button = getByTestId(/create-token-button/i);
    expect(queryByText(/Create Team Token/i)).not.toBeInTheDocument();
    userEvent.click(button);
    expect(getByText(/Create Team Token/i)).toBeInTheDocument();
  });

  it("Fill out form", async () => {
    const { findByText, getByTestId, getByText, queryByText } = rtlRender(
      <CreateServiceTokenButton activeTeam={teams[0]} />
    );
    const button = getByTestId(/create-token-button/i);
    expect(queryByText(/Create Team Token/i)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(getByText(/Create Team Token/i)).toBeInTheDocument();

    const descriptionInput = getByTestId("token-description");
    userEvent.type(descriptionInput, "Token test description");

    const createButton = getByTestId(/create-token-submit/i);

    await waitFor(() => {});
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    expect(await findByText(/Team token successfully created/i)).toBeInTheDocument();
  });
});
