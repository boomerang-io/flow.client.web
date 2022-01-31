import React from "react";
import { startApiServer } from "ApiServer";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import CreateServiceTokenButton from "./index";

let server:any;

beforeEach(() => {
  document.body.setAttribute("id", "app");
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("CreateServiceTokenButton --- Snapshot", () => {
  it("Capturing Snapshot of CreateServiceTokenButton", async () => {
    const { baseElement, findByText } = global.rtlQueryRender(<CreateServiceTokenButton />);
    await findByText(/Create Token/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreateServiceTokenButton --- RTL", () => {
  it("Open token creation modal", async () => {
    const { getByTestId, getByText, queryByText } = global.rtlQueryRender(
      <CreateServiceTokenButton />
    );
    const button = getByTestId(/create-token-button/i);
    expect(queryByText(/Create Global Token/i)).not.toBeInTheDocument();
    userEvent.click(button);
    expect(getByText(/Create Global Token/i)).toBeInTheDocument();
  });

  it("Fill out form", async () => {
    const { findByText, getByTestId, getByText, queryByText } = global.rtlQueryRender(
      <CreateServiceTokenButton />
    );
    const button = getByTestId(/create-token-button/i);
    expect(queryByText(/Create Global Token/i)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(getByText(/Create Global Token/i)).toBeInTheDocument();

    const descriptionInput = getByTestId("token-description");
    userEvent.type(descriptionInput, "Token test description");

    const createButton = getByTestId(/create-token-submit/i);

    await waitFor(() => {});
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    expect(await findByText(/Global token successfully created/i)).toBeInTheDocument();
  });
});
