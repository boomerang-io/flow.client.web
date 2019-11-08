import React from "react";
import queryString from "query-string";
import { createMemoryHistory } from "history";
import { fireEvent } from "@testing-library/react";
import { WorkflowActivity } from "./index";

const mockfn = jest.fn();

jest.mock("carbon-components-react/es", () => ({
  __esModule: true,
  DatePicker: () => <div />,
  DatePickerInput: () => <div />
}));

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
  location: {},
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
            name: "testing-workflow"
          }
        ]
      }
    ]
  }
};

describe("WorkflowActivity --- Snapshot", () => {
  it("Capturing Snapshot of WorkflowActivity", () => {
    const { baseElement } = rtlRouterRender(<WorkflowActivity {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("WorkflowActivity --- RTL", () => {
  const basicQuery = { order: "DESC", page: 0, size: 10, sort: "creationDate" };
  it("Select status tab correctly", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getAllByRole } = rtlRouterRender(<WorkflowActivity {...props} history={history} />);

    const statuses = getAllByRole("tab");
    fireEvent.click(statuses[1]);
    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: "inProgress", ...basicQuery }));

    fireEvent.click(statuses[3]);
    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: "failure", ...basicQuery }));

    fireEvent.click(statuses[0]);
    expect(history.location.search).toBe("?" + queryString.stringify({ statuses: undefined, ...basicQuery }));
  });

  it("Filter by team", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByLabelText, getByText } = rtlRouterRender(<WorkflowActivity {...props} history={history} />);

    fireEvent.click(getByLabelText("Filter by team"));
    fireEvent.click(getByText("testing-team"));
    expect(history.location.search).toBe("?" + queryString.stringify({ teamIds: "1", ...basicQuery }));
  });

  it("Filter by workflow", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByLabelText, getByText } = rtlRouterRender(<WorkflowActivity {...props} history={history} />);

    fireEvent.click(getByLabelText("Filter by workflow"));
    fireEvent.click(getByText("testing-workflow"));
    expect(history.location.search).toBe("?" + queryString.stringify({ workflowIds: "2", ...basicQuery }));
  });

  it("Filter by trigger", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const { getByLabelText, getByText } = rtlRouterRender(<WorkflowActivity {...props} history={history} />);

    fireEvent.click(getByLabelText("Filter by trigger"));
    fireEvent.click(getByText("cron"));
    expect(history.location.search).toBe("?" + queryString.stringify({ triggers: "cron", ...basicQuery }));
  });
});
