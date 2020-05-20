import React from "react";
import { TeamProperties } from ".";
import { waitFor } from "@testing-library/react";

const mockfn = jest.fn();

const props = {
  teamConfiguration: {
    isFetching: false,
    status: "success",
    error: "",
    data: [
      {
        value: "asdas2345",
        id: "5cdc5ad7460edb4a230b579b",
        key: "mail.accdasdount",
        label: "Mail Accdasdount",
        type: "passworasdasdd",
      },
      {
        label: "Boomerang Accounts",
        key: "boomerang.account",
        value: "a long value to test",
        type: "text",
        id: "5cdc5ad7460edb4a230b579d",
      },
    ],
  },
  teams: {
    data: [
      {
        boomerangTeamName: "Allianz PoC",
        boomerangTeamShortname: "allianz-poc",
        id: "5a8b331e262a70306622df72",
        label: "Allianz PoC",
        name: "Allianz",
        value: "allianz-poc",
      },
      {
        boomerangTeamName: "AT&T MIL Mobile@Scale",
        boomerangTeamShortname: "ms-att-mil",
        id: "5a8b331e262a70306622df73",
        label: "AT&T MIL Mobile@Scale",
        name: "ATT",
        value: "ms-att-mil",
      },
    ],
    error: null,
    isFetching: false,
    selectedTeam: null,
    status: "success",
  },
  user: {
    error: "",
    isFetching: false,
    status: "success",
    data: {
      email: "trbula@us.ibm.com",
      id: "59aebd0c7424530fce952fde",
      name: "Timothy Bula",
      type: "admin",
    },
  },
  teamPropertiesActions: {
    fetch: mockfn,
    addTeamPropertyInStore: mockfn,
    updateTeamProperty: mockfn,
    deleteTeamPropertyInStore: mockfn,
  },
  teamsActions: {
    fetchTeams: mockfn,
  },
};

describe("TeamProperties --- Snapshot Test", () => {
  test("Capturing Snapshot of TeamProperties", () => {
    const { baseElement } = rtlContextRouterRender(<TeamProperties {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TeamProperties --- RTL", () => {
  test("renders message when is still fetching", async () => {
    const newProp = { ...props, teams: { ...props.teams, isFetching: true } };
    const { getByLabelText } = rtlContextRouterRender(<TeamProperties {...newProp} />);
    const message = await waitFor(() => getByLabelText("Active loading indicator"));

    expect(message).toBeInTheDocument();
  });

  test("renders error message when fetching pipelines failed", () => {
    const newProp = { ...props, teams: { ...props.teams, status: "failure" } };
    const { getByText } = rtlContextRouterRender(<TeamProperties {...newProp} />);
    const errorMessage = getByText("Don’t lose your daks");

    expect(errorMessage).toBeInTheDocument();
  });
});
