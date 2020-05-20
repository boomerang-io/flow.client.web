import React from "react";
import Overview from ".";
import { fireEvent } from "@testing-library/react";

const mockfn = jest.fn();

const initialState = {
  tokenTextType: "password",
  showTokenText: "Show Token",
  copyTokenText: "Copy Token",
  errors: {},
};

const props = {
  formikProps: {
    values: {
      description: "",
      enableACCIntegration: false,
      enablePersistentStorage: false,
      icon: "",
      name: "",
      selectedTeam: {
        id: "9012",
        name: "Ben's Team",
        workflows: [
          {
            id: "444",
            name: "benjamin-workflow-2",
            shortDescription: "Here is a shorter description",
            status: "published",
            icon: "flow",
            flowTeamId: "9012",
            inputs: [],
          },
        ],
      },
      shortDescription: "",
      triggers: {
        event: {
          enable: false,
          topic: "",
        },
        scheduler: {
          enable: true,
          schedule: "0 18 * * *",
          timezone: "Africa/Addis_Ababa",
          advancedCron: false,
        },
        webhook: {
          enable: false,
          token: false,
        },
      },
    },
    dirty: false,
    setFieldValue: mockfn,
    handleChange: mockfn,
    handleBlur: mockfn,
    errors: {},
    touched: {},
  },
  teams: [],
  updateWorkflow: mockfn,
  workflow: {},
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

/*describe("Settings Overview --- Snapshot Test", () => {
    it("Capturing Snapshot of Settings Overview", () => {
        const { baseElement } = rtlContextRouterRender(<Overview {...props} />, { initialState });
        expect(baseElement).toMatchSnapshot();
    });
});*/

describe("Inputs --- RTL", () => {
  it("Main Sections Render", () => {
    const { getByText } = rtlContextRouterRender(<Overview {...props} />, { initialState });
    expect(getByText(/General info/i)).toBeInTheDocument();
    expect(getByText(/Triggers/i)).toBeInTheDocument();
    expect(getByText(/Other Options/i)).toBeInTheDocument();
  });

  it("Open Cron Scheduler Modal", () => {
    const { getByText, getByTestId } = rtlContextRouterRender(<Overview {...props} />, { initialState });
    const schedulerToggle = getByTestId(/triggers.scheduler.enable/i);
    fireEvent.click(schedulerToggle);

    const scheduleModalTrigger = getByTestId(/launchCronModal/i);
    fireEvent.click(scheduleModalTrigger);

    expect(getByText(/Advanced controls/i)).toBeInTheDocument();
  });
});
