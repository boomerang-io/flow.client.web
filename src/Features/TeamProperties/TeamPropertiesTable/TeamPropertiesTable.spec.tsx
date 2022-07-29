import { vi } from "vitest";
import TeamPropertiesTable from ".";
import { screen, fireEvent } from "@testing-library/react";

const mockfn = vi.fn();
const mockReduxTeamConfig = {
  teamProperties: {
    data: [
      {
        value: "asdas2345",
        id: "5cdc5ad7460edb4a230b579b",
        key: "mail.accdasdount",
        description: "description",
        label: "Mail Accdasdount",
        type: "text",
        readOnly: false,
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
      higherLevelGroupId: "",
      isActive: false,
      workflowQuotas: {
        maxWorkflowCount: 3,
        maxWorkflowExecutionMonthly: 3,
        currentWorkflowExecutionMonthly: 3,
        currentWorkflowCount: 3,
        maxWorkflowStorage: 3,
        maxConcurrentWorkflows: 3,
        maxWorkflowExecutionTime: 3,
        monthlyResetDate: "",
        currentConcurrentWorkflows: 3,
        currentAverageExecutionTime: 3,
        currentWorkflowsPersistentStorage: 3,
      },
      users: [],
      workflows: [],
    },
    {
      boomerangTeamName: "AT&T MIL Mobile@Scale",
      boomerangTeamShortname: "ms-att-mil",
      id: "5a8b331e262a70306622df73",
      label: "AT&T MIL Mobile@Scale",
      name: "ATT",
      value: "ms-att-mil",
      higherLevelGroupId: "",
      isActive: false,
      workflowQuotas: {
        maxWorkflowCount: 3,
        maxWorkflowExecutionMonthly: 3,
        currentWorkflowExecutionMonthly: 3,
        currentWorkflowCount: 3,
        maxWorkflowStorage: 3,
        maxConcurrentWorkflows: 3,
        maxWorkflowExecutionTime: 3,
        monthlyResetDate: "",
        currentConcurrentWorkflows: 3,
        currentAverageExecutionTime: 3,
        currentWorkflowsPersistentStorage: 3,
      },
      users: [],
      workflows: [],
    },
  ],
  setActiveTeam: mockfn,
  properties: [],
  propertiesAreLoading: false,
  propertiesError: null,
  activeTeam: {
    boomerangTeamName: "Allianz PoC",
    boomerangTeamShortname: "allianz-poc",
    id: "5a8b331e262a70306622df72",
    label: "Allianz PoC",
    name: "Allianz",
    value: "allianz-poc",
    higherLevelGroupId: "",
    isActive: false,
    workflowQuotas: {
      maxWorkflowCount: 3,
      maxWorkflowExecutionMonthly: 3,
      currentWorkflowExecutionMonthly: 3,
      currentWorkflowCount: 3,
      maxWorkflowStorage: 3,
      maxConcurrentWorkflows: 3,
      maxWorkflowExecutionTime: 3,
      monthlyResetDate: "",
      currentConcurrentWorkflows: 3,
      currentAverageExecutionTime: 3,
      currentWorkflowsPersistentStorage: 3,
    },
    users: [],
    workflows: [],
  },
};

const propsWithProperties = { ...props, properties: mockReduxTeamConfig.teamProperties.data };

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

describe("TeamPropertiesTable --- Snapshot Test", () => {
  test("Capturing Snapshot of TeamPropertiesTable", () => {
    const { baseElement } = global.rtlContextRouterRender(<TeamPropertiesTable {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TeamPropertiesTable --- RTL", () => {
  test("TeamPropertiesTable - ComboBox Functionality correctly", () => {
    global.rtlContextRouterRender(<TeamPropertiesTable {...props} />);
    const comboBoxElement = screen.getByPlaceholderText(/Select a team/i);
    fireEvent.click(comboBoxElement);

    const selection = screen.getByText(/Allianz/i);
    fireEvent.click(selection);

    expect(screen.queryAllByText(/Please select a team to manage properties./i)).toHaveLength(0);
  });

  test("TeamPropertiesTable -  test it renders table with data", async () => {
    const { container } = global.rtlContextRouterRender(<TeamPropertiesTable {...propsWithProperties} />);
    const { data } = mockReduxTeamConfig.teamProperties;
    // eslint-disable-next-line
    const unsecuredElement = container.querySelector(".unsecured");

    expect(screen.getByText(data[0].value)).toBeInTheDocument();
    expect(screen.getByText(data[0].label)).toBeInTheDocument();
    expect(screen.getByText(data[0].key)).toBeInTheDocument();
    expect(screen.getByText(data[0].description)).toBeInTheDocument();
    expect(unsecuredElement).toBeInTheDocument();
  });
});
