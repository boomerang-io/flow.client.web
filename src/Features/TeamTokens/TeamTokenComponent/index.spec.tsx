import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TokenComponent from "./index";
import { tokens } from "ApiServer/fixtures";
import { FlowTeam } from "Types";

const teams: FlowTeam[] = [
  {
    higherLevelGroupId: "5c41596cf32aa30001e9d444",
    id: "5e3a35ad8c222700018ccd39",
    name: "IBM Services Engineering",
    workflows: [
      {
        properties: [
          {
            id: "1",
            required: true,
            placeholder: "",
            language: "",
            disabled: false,
            defaultValue: "",
            value: "",
            values: undefined,
            readOnly: false,
            description: "Tenant ID from the platform.",
            key: "tenant",
            label: "Tenant ID",
            type: "text",
            min: undefined,
            max: undefined,
            options: undefined,
            helperText: "",
          },
        ],
        description: "",
        flowTeamId: "5e3a35ad8c222700018ccd39",
        icon: "bot",
        id: "5eb2c4085a92d80001a16d87",
        name: "ML Train – Bot Efficiency",
        shortDescription: "Train and store ML model for Bot Efficiency.",
        status: "active",
        triggers: {
          scheduler: { enable: false, schedule: "", timezone: "", advancedCron: false },
          webhook: { enable: false, token: "" },
          custom: { enable: false, topic: "" },
          manual: { enable: false },
        },
        enableACCIntegration: false,
        revisionCount: 2,
        templateUpgradesAvailable: false,
        storage: {
          activity: {
            enabled: false,
            size: 0,
            mountPath: "",
          },
          workflow: {
            enabled: false,
            size: 0,
            mountPath: "",
          },
        },
        labels: [],
        scope: "user",
        tokens: [{ token: "1", label: "test" }],
      },
    ],
    workflowQuotas: {
      maxWorkflowCount: 10,
      maxWorkflowExecutionMonthly: 100,
      maxWorkflowStorage: 5,
      maxWorkflowExecutionTime: 30,
      maxConcurrentWorkflows: 4,
      currentWorkflowCount: 1,
      currentConcurrentWorkflows: 0,
      currentWorkflowExecutionMonthly: 10,
      currentAverageExecutionTime: 2,
      monthlyResetDate: "August 1, 2020",
      currentWorkflowsPersistentStorage: 0,
    },
    isActive: true,
    users: [],
  },
];

const props = {
  deleteToken: jest.fn(),
  tokens: tokens,
  teams: teams,
  activeTeam: teams[0],
  isLoading: false,
  hasError: false,
  userType: "admin",
  setActiveTeam: () => jest.fn(),
};

describe("TokenComponent --- Snapshot", () => {
  it("Capturing Snapshot of TokenComponent", () => {
    const { baseElement } = global.rtlContextRouterRender(<TokenComponent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("TokenComponent --- RTL", () => {
  it("Displays created tokens", async () => {
    global.rtlContextRouterRender(<TokenComponent {...props} />);
    expect(screen.queryAllByText(/Test User/i).length).toBeGreaterThan(0);
  });

  it("Open Create Modal", async () => {
    global.rtlContextRouterRender(<TokenComponent {...props} />);
    const teamsInput = await screen.findByTestId("team-tokens-combobox");
    userEvent.click(teamsInput);
    userEvent.click(await screen.findByText(/engineering/i));

    const button = await screen.findByTestId("create-token-button");
    expect(screen.queryByText(/Create Team Token/i)).not.toBeInTheDocument();
    // await waitFor(() => fireEvent.click(button));
    fireEvent.click(button);
    expect(screen.getByText(/Create Team Token/i)).toBeInTheDocument();
  });
});
