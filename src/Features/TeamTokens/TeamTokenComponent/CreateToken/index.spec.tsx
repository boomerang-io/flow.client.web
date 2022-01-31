import React from "react";
import { startApiServer } from "ApiServer";
import userEvent from "@testing-library/user-event";
import { waitFor, screen } from "@testing-library/react";
import { FlowTeam } from "Types";
import CreateServiceTokenButton from "./index";

let server:any;
const activeTeam: FlowTeam = {
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
        manual: { enable: false, },
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
      tokens: [{ token: "1", label: "test", }],
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
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
  server = startApiServer();
});

afterEach(() => {
  server.shutdown();
});

describe("CreateServiceTokenButton --- Snapshot", () => {
  it("Capturing Snapshot of CreateServiceTokenButton", async () => {
    const { baseElement } = global.rtlQueryRender(<CreateServiceTokenButton activeTeam={activeTeam} />);
    await screen.findByText(/Create Token/i);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("CreateServiceTokenButton --- RTL", () => {
  it("Open token creation modal", async () => {
    global.rtlQueryRender(
      <CreateServiceTokenButton activeTeam={activeTeam} />
    );
    const button = screen.getByTestId(/create-token-button/i);
    expect(screen.queryByText(/Create Team Token/i)).not.toBeInTheDocument();
    userEvent.click(button);
    expect(screen.getByText(/Create Team Token/i)).toBeInTheDocument();
  });

  it("Fill out form", async () => {
    global.rtlQueryRender(
      <CreateServiceTokenButton activeTeam={activeTeam} />
    );
    const button = screen.getByTestId(/create-token-button/i);
    expect(screen.queryByText(/Create Team Token/i)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(screen.getByText(/Create Team Token/i)).toBeInTheDocument();

    const descriptionInput = screen.getByTestId("token-description");
    userEvent.type(descriptionInput, "Token test description");

    const createButton = screen.getByTestId(/create-token-submit/i);

    await waitFor(() => {});
    expect(createButton).toBeEnabled();
    userEvent.click(createButton);
    expect(await screen.findByText(/Team token successfully created/i)).toBeInTheDocument();
  });
});
