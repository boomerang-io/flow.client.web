import React from "react";
import queryString, { StringifyOptions } from "query-string";
import { waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowActivity from "./index";
import { startApiServer } from "ApiServer";

const queryStringOptions:StringifyOptions = { arrayFormat: "comma", skipEmptyString: true };

jest.setTimeout(60000);

let server: any;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("WorkflowActivity --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowActivity", () => {
    const { baseElement } = global.rtlContextRouterRender(<WorkflowActivity />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("WorkflowActivity --- RTL", () => {
  const basicQuery = { order: "DESC", page: 0, size: 10, sort: "creationDate" };
  it("Select status tab correctly", async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const { history } = global.rtlContextRouterRender(<WorkflowActivity />);
    await screen.findByText(/This is all of the/i);

    userEvent.click(screen.getByRole("tab", { name: /in progress/i }));
    await waitFor(() =>
      expect(history.location.search).toBe(
        "?" + queryString.stringify({ statuses: "inProgress", ...basicQuery }, queryStringOptions)
      )
    );

    userEvent.click(screen.getByRole("tab", { name: /failed/i }));
    await waitFor(() =>
      expect(history.location.search).toBe("?" + queryString.stringify({ statuses: "failure", ...basicQuery }))
    );

    userEvent.click(screen.getByRole("tab", { name: /all/i }));
    await waitFor(() =>
      expect(history.location.search).toBe(
        "?" + queryString.stringify({ statuses: undefined, ...basicQuery }, queryStringOptions)
      )
    );
  });

  it("Filter by team", async () => {
    const { history } = global.rtlContextRouterRender(<WorkflowActivity />);
    await screen.findByText(/This is all of the/i);

    userEvent.click(screen.getByRole("button", { name: /Filter by team/i }));
    userEvent.click(screen.getAllByTitle(/IBM Services Engineering/i)[0]);

    await waitFor(() =>
      expect(history.location.search).toBe(
        "?" + queryString.stringify({ teamIds: "5e3a35ad8c222700018ccd39", ...basicQuery }, queryStringOptions)
      )
    );
  });

  it("Filter by workflow", async () => {
    const { history } = global.rtlContextRouterRender(<WorkflowActivity />);
    await screen.findByText(/This is all of the/i);

    userEvent.click(screen.getByRole("button", { name: /Filter by workflow/i }));
    userEvent.click(screen.getAllByText(/ML Train – Bot Efficiency \[IBM Services Engineering\]/i)[0]);

    await waitFor(() =>
      expect(history.location.search).toBe(
        "?" + queryString.stringify({ workflowIds: "5eb2c4085a92d80001a16d87", ...basicQuery }, queryStringOptions)
      )
    );
  });

  it("Filter by trigger", async () => {
    const { history } = global.rtlContextRouterRender(<WorkflowActivity />);
    await screen.findByText(/This is all of the/i);

    userEvent.click(screen.getByRole("button", { name: /Filter by trigger/i }));
    userEvent.click(screen.getAllByText("cron")[0]);

    await waitFor(() =>
      expect(history.location.search).toBe("?" + queryString.stringify({ triggers: "cron", ...basicQuery }))
    );
  });
});
