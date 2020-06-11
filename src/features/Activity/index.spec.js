import React from "react";
import queryString from "query-string";
import { createMemoryHistory } from "history";
import { waitFor, fireEvent } from "@testing-library/react";
import WorkflowActivity from "./index";
import { startApiServer } from "../../apiServer";
import { act } from "react-dom/test-utils";

let server;

beforeEach(() => {
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

const mockfn = jest.fn();

const props = {
  match: {
    params: "testid",
  },
  location: {},
  history: {},
  teamsState: {
    isFetching: false,
    status: "success",
    error: "",
    data: [
      {
        id: "1",
        name: "testing-team",
        workflows: [
          {
            id: "2",
            name: "testing-workflow",
          },
        ],
      },
    ],
  },
};

describe("WorkflowActivity --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowActivity", () => {
    const { baseElement } = rtlContextRouterRender(<WorkflowActivity {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("WorkflowActivity --- RTL", () => {
  const basicQuery = { order: "DESC", page: 0, size: 10, sort: "creationDate" };
  it("Select status tab correctly", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getAllByRole } = rtlContextRouterRender(<WorkflowActivity {...props} history={history} />);

    const statuses = getAllByRole("tab");
    act(() => {
      fireEvent.click(statuses[1]);
    });

    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: "inProgress", ...basicQuery }));

    act(() => {
      fireEvent.click(statuses[3]);
    });

    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: "failure", ...basicQuery }));

    act(() => {
      fireEvent.click(statuses[0]);
    });

    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: undefined, ...basicQuery }));
  });

  it("Filter by team", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByLabelText, getByText, getAllByLabelText } = rtlContextRouterRender(
      <WorkflowActivity {...props} history={history} />
    );

    act(() => {
      fireEvent.click(getAllByLabelText("Filter by team")[0]);
    });

    act(() => {
      fireEvent.click(getByText("Boomerang Flow"));
    });
    expect(history.location.search).toBe(
      "?" + queryString.stringify({ teamIds: "5e3a35ad8c222700018ccd39", ...basicQuery })
    );
  });

  it("Filter by workflow", async () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const {
      getByLabelText,
      getByText,
      getAllByLabelText,
      getAllByText,
      getByRole,
      getAllByRole,
    } = rtlContextRouterRender(<WorkflowActivity {...props} history={history} />);

    await waitFor(() => expect(getAllByLabelText("Filter by workflow")));
    act(() => {
      fireEvent.click(getAllByLabelText("Filter by workflow")[0]);
    });

    act(() => {
      fireEvent.click(getAllByText("ML Train – Bot Efficiency [Boomerang Flow]")[0]);
    });

    expect(history.location.search).toBe(
      "?" + queryString.stringify({ workflowIds: "5eb2c4085a92d80001a16d87", ...basicQuery })
    );
  });

  it("Filter by trigger", async () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByLabelText, getByText, getAllByLabelText } = rtlContextRouterRender(
      <WorkflowActivity {...props} history={history} />
    );

    act(() => {
      fireEvent.click(getAllByLabelText("Filter by trigger")[0]);
    });

    act(() => {
      fireEvent.click(getByText("cron"));
    });

    expect(history.location.search).toBe("?" + queryString.stringify({ triggers: "cron", ...basicQuery }));
  });
});
