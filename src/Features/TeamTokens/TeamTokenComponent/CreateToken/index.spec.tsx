import React from "react";
import { startApiServer } from "ApiServer";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import CreateServiceTokenButton from "./index";
import { TOOL_TEMPLATES_MOCK } from "../../mockData/data.js";

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
    const { baseElement, findByText } = rtlRender(<CreateServiceTokenButton toolTemplates={TOOL_TEMPLATES_MOCK} />);
    await findByText(/Create Token/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreateServiceTokenButton --- RTL", () => {
  it("Open token creation modal", async () => {
    const { getByTestId, getByText, queryByText } = rtlRender(
      <CreateServiceTokenButton toolTemplates={TOOL_TEMPLATES_MOCK} />
    );
    const button = getByTestId(/create-token-button/i);
    expect(queryByText(/Create Access Token/i)).not.toBeInTheDocument();
    userEvent.click(button);
    expect(getByText(/Create Access Token/i)).toBeInTheDocument();
  });

  it("Fill out form", async () => {
    const { findByText, getByTestId, getByText, queryByText } = rtlRender(
      <CreateServiceTokenButton toolTemplates={TOOL_TEMPLATES_MOCK} />
    );
    const button = getByTestId(/create-token-button/i);
    expect(queryByText(/Create Access Token/i)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(getByText(/Create Access Token/i)).toBeInTheDocument();

    const scopeInput = getByTestId("token-scope");
    userEvent.click(scopeInput);
    userEvent.click(await findByText(/platform/i));

    const serviceInput = getByTestId("token-service");
    userEvent.click(serviceInput);

    userEvent.click(await findByText(/Tim's Tool/i));

    const createButton = getByTestId(/create-token-submit/i);

    await waitFor(() => {});
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    expect(await findByText(/Access token successfully created/i)).toBeInTheDocument();
  });
});
