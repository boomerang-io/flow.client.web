import React from "react";
import queryString from "query-string";
import { createMemoryHistory } from "history";
import { fireEvent } from "@testing-library/react";
import { WorkflowActivity } from "./index";

const mockfn = jest.fn();

const props = {
  activityActions: {
    fetch: () => new Promise(() => {}),
    reset: mockfn
  },
  teamsActions: {
    fetch: () => new Promise(() => {})
  },
  match: {
    params: "testid"
  },
  teamsState: {
    isFetching: false,
    status: "success",
    error: "",
    data: []
  }
};

describe("WorkflowActivity --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowActivity", () => {
    const { baseElement } = rtlRouterRender(<WorkflowActivity {...props} location={{}} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("WorkflowActivity --- RTL", () => {
  const basicQuery = { order: "DESC", page: 0, size: 10, sort: "creationDate" };
  it("Select status tab correctly", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getAllByRole } = rtlRouterRender(<WorkflowActivity {...props} history={history} location={{}} />);

    const statuses = getAllByRole("tab");
    fireEvent.click(statuses[1]);
    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: "inProgress", ...basicQuery }));

    fireEvent.click(statuses[3]);
    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: "failure", ...basicQuery }));

    fireEvent.click(statuses[0]);
    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: undefined, ...basicQuery }));
  });

  it("Filter by trigger", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByLabelText, getByText } = rtlRouterRender(
      <WorkflowActivity {...props} history={history} location={{}} />
    );

    fireEvent.click(getByLabelText("Filter by trigger"));
    fireEvent.click(getByText("cron"));
    expect(history.location.search).toBe("?" + queryString.stringify({ triggers: "cron", ...basicQuery }));
  });
});
