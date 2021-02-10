import React from "react";
import Configure from "./index";
import { fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";
import { teams, profile, summaries } from "ApiServer/fixtures";
import { AppContextProvider } from "State/context";
import { startApiServer } from "ApiServer";
import { appLink } from "Config/appConfig";
import { FlagsProvider } from "flagged";

const mockfn = jest.fn();

const props = {
  history: {},
  params: { workflowId: "5eb2c4085a92d80001a16d87" },
  summaryData: summaries[0],
  summaryMutation: {},
  teams,
  updateSummary: mockfn,
};
let server;

beforeEach(() => {
  server = startApiServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();

  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("Inputs --- RTL", () => {
  it("Main Sections Render", async () => {
    const { findByText, getByText } = rtlContextRouterRender(
      <FlagsProvider
        features={{
          TeamManagementEnabled: true,
          WorkflowQuotasEnabled: true,
          SettingsEnabled: true,
          UserManagementEnabled: true,
          GlobalParametersEnabled: true,
          WorkflowTokensEnabled: true,
          TaskManagerEnabled: true,
          EditVerifiedTasksEnabled: true,
          WorkflowTriggersEnabled: true,
          TeamParametersEnabled: true,

          ActivityEnabled: true,
          InsightsEnabled: true,
        }}
      >
        <AppContextProvider
          value={{
            isTutorialActive: false,
            setIsTutorialActive: () => {},
            user: profile,
            teams,
          }}
        >
          <Configure {...props} />
        </AppContextProvider>
      </FlagsProvider>,
      { route: appLink.editorConfigure({ workflowId: "5eb2c4085a92d80001a16d87" }) }
    );
    await findByText(/General info/i);
    expect(getByText(/General info/i)).toBeInTheDocument();
    expect(getByText(/Other Options/i)).toBeInTheDocument();
  });
});
