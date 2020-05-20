import React from "react";
import TeamPropertiesTable from "./";
import { fireEvent } from "@testing-library/react";

const mockfn = jest.fn();
const mockReduxTeamConfig = {
  teamProperties: {
    isFetching: false,
    status: "success",
    error: "",
    data: [
      {
        value: "asdas2345",
        id: "5cdc5ad7460edb4a230b579b",
        key: "mail.accdasdount",
        description: "description",
        label: "Mail Accdasdount",
        type: "text",
      },
    ],
  },
};
const props = {
  teams: [
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
  fetchTeamProperties: mockfn,
  addTeamPropertyInStore: mockfn,
  updateTeamProperty: mockfn,
  deleteTeamPropertyInStore: mockfn,
  resetTeamProperties: mockfn,
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

describe("TeamPropertiesTable --- Snapshot Test", () => {
  test("Capturing Snapshot of TeamPropertiesTable", () => {
    const { baseElement } = rtlContextRouterRender(<TeamPropertiesTable {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TeamPropertiesTable --- RTL", () => {
  test("TeamPropertiesTable - ComboBox Functionality correctly", () => {
    const { queryByPlaceholderText, getByText, queryAllByText } = rtlContextRouterRender(
      <TeamPropertiesTable {...props} />
    );
    const comboBoxElement = queryByPlaceholderText(/Select a team/i);
    fireEvent.click(comboBoxElement);

    expect(getByText(/Please select a team to manage properties./i)).toBeInTheDocument();
    expect(queryAllByText(/Looks like there aren't any properties. Create one above!/i)).toHaveLength(0);

    const selection = getByText(/Allianz/i);
    fireEvent.click(selection);

    expect(queryAllByText(/Please select a team to manage properties./i)).toHaveLength(0);
    expect(getByText(/Looks like there aren't any properties. Create one above!/i)).toBeInTheDocument();
    expect(props.fetchTeamProperties).toHaveBeenCalled();
  });

  test("TeamPropertiesTable -  test it renders table with data", async () => {
    const { getByText, container } = rtlContextRouterRender(<TeamPropertiesTable {...props} />, {
      initialState: mockReduxTeamConfig,
    });
    const { data } = mockReduxTeamConfig.teamProperties;
    const unsecuredElement = container.querySelector(".unsecured");

    expect(getByText(data[0].value)).toBeInTheDocument();
    expect(getByText(data[0].label)).toBeInTheDocument();
    expect(getByText(data[0].key)).toBeInTheDocument();
    expect(getByText(data[0].description)).toBeInTheDocument();
    expect(unsecuredElement).toBeInTheDocument();
  });
});
