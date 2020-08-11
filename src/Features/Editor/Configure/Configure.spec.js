import React from "react";
import Configure from "./index";
import { fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";

const mockfn = jest.fn();

const initialState = {
  tokenTextType: "password",
  showTokenText: "Show Token",
  copyTokenText: "Copy Token",
  errors: {},
};

const workflowSummary = {
  description: "",
  enableACCIntegration: false,
  enablePersistentStorage: true,
  flowTeamId: "5e3a35ad8c222700018ccd39",
  icon: "flow",
  id: "5eb2c4085a92d80001a16d87",
  name: "ML Train – Bot Efficiency",
  revisionCount: 2,
  shortDescription: "Train and store ML model for Bot Efficiency.",
  status: "active",
  templateUpgradesAvailable: false,
  properties: [],
  triggers: {
    event: {
      enable: false,
      topic: "",
    },
    scheduler: {
      enable: false,
      schedule: "0 18 * * *",
      timezone: "Africa/Addis_Ababa",
      advancedCron: false,
    },
    webhook: {
      enable: false,
      token: false,
    },
  },
};

const props = {
  // formikProps: {
  //   values: {
  //     description: "",
  //     enableACCIntegration: false,
  //     enablePersistentStorage: false,
  //     icon: "",
  //     name: "",
  //     selectedTeam: {
  //       id: "9012",
  //       name: "Ben's Team",
  //       workflows: [
  //         {
  //           id: "444",
  //           name: "benjamin-workflow-2",
  //           shortDescription: "Here is a shorter description",
  //           status: "published",
  //           icon: "flow",
  //           flowTeamId: "9012",
  //           inputs: [],
  //         },
  //       ],
  //     },
  //     shortDescription: "",
  //     triggers: {
  //       event: {
  //         enable: false,
  //         topic: "",
  //       },
  //       scheduler: {
  //         enable: true,
  //         schedule: "0 18 * * *",
  //         timezone: "Africa/Addis_Ababa",
  //         advancedCron: false,
  //       },
  //       webhook: {
  //         enable: false,
  //         token: false,
  //       },
  //     },
  //   },
  //   dirty: false,
  //   setFieldValue: mockfn,
  //   handleChange: mockfn,
  //   handleBlur: mockfn,
  //   errors: {},
  //   touched: {},
  // },
  // teams: [],
  // updateWorkflow: mockfn,
  // workflow: {},

  history: {},
  isOnRoute: true,
  params: { teamId: "5e3a35ad8c222700018ccd39", workflowId: "5eb2c4085a92d80001a16d87" },
  summaryData: workflowSummary,
  summaryMutation: {},
  teams: [
    {
      higherLevelGroupId: "5c41596cf32aa30001e9d444",
      id: "5e3a35ad8c222700018ccd39",
      name: "IBM Services Engineering",
      workflows: [workflowSummary],
    },
  ],
  updateSummary: mockfn,
};

// beforeEach(() => {
//   document.body.setAttribute("id", "app");
// });

// eslint-disable-next-line jest/no-commented-out-tests
/*describe("Settings Configure --- Snapshot Test", () => {
    it("Capturing Snapshot of Settings Configure", () => {
        const { baseElement } = rtlContextRouterRender(<Configure {...props} />, { initialState });
        expect(baseElement).toMatchSnapshot();
    });
});*/

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("Inputs --- RTL", () => {
  it("Main Sections Render", () => {
    const { getByText } = rtlContextRouterRender(<Configure {...props} />, { initialState });
    expect(getByText(/General info/i)).toBeInTheDocument();
    expect(getByText(/Triggers/i)).toBeInTheDocument();
    expect(getByText(/Other Options/i)).toBeInTheDocument();
  });

  it("Open Cron Scheduler Modal", async () => {
    const { findByText, getByText, getByTestId } = rtlContextRouterRender(<Configure {...props} />, { initialState });
    const schedulerToggle = getByTestId(/triggers.scheduler.enable/i);
    fireEvent.click(schedulerToggle);

    await findByText("Change schedule");

    const scheduleModalTrigger = getByTestId("launchCronModal");

    fireEvent.click(scheduleModalTrigger);

    expect(getByText(/Advanced controls/i)).toBeInTheDocument();
  });
});
