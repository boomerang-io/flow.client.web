import React from "react";
import { startApiServer } from "ApiServer";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import CreateServiceTokenButton from "./index";

let server: any;

beforeEach(() => {
  document.body.setAttribute("id", "app");
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("CreateServiceTokenButton --- Snapshot", () => {
  it("Capturing Snapshot of CreateServiceTokenButton", async () => {
    const { baseElement } = global.rtlQueryRender(<CreateServiceTokenButton />);
    await screen.findByText(/Create Token/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreateServiceTokenButton --- RTL", () => {
  it("Open token creation modal", async () => {
    global.rtlQueryRender(<CreateServiceTokenButton />);
    const button = screen.getByTestId(/create-token-button/i);
    expect(screen.queryByText(/Create Global Token/i)).not.toBeInTheDocument();
    userEvent.click(button);
    expect(screen.getByText(/Create Global Token/i)).toBeInTheDocument();
  });

  it("Fill out form", async () => {
    global.rtlQueryRender(<CreateServiceTokenButton />);
    const button = screen.getByTestId(/create-token-button/i);
    expect(screen.queryByText(/Create Global Token/i)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(screen.getByText(/Create Global Token/i)).toBeInTheDocument();

    const descriptionInput = screen.getByTestId("token-description");
    userEvent.type(descriptionInput, "Token test description");

    const createButton = screen.getByTestId(/create-token-submit/i);

    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    expect(await screen.findByText(/Global token successfully created/i)).toBeInTheDocument();
  });
});
