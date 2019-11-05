import React from "react";
// import { shallow } from "enzyme";
// import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import WorkflowsSection from "./index";

const mockfn = jest.fn();
jest.mock("@boomerang/boomerang-components", () => ({
  Button: "Button",
  Tooltip: "Tooltip"
}));

const searchQuery = "test";
const setActiveTeamAndRedirect = mockfn;
const updateWorkflows = mockfn;
const setActiveTeam = mockfn;
const executeWorkflow = mockfn;
const deleteWorkflow = mockfn;
const fetchTeams = mockfn;
const handleImportWorkflow = mockfn;
const closeModal = mockfn;
const team = {
  id: "1234",
  name: "Lucas' team",
  workflows: [
    {
      id: "hQDkX9v",
      name: "lucas-workflow-1",
      description: "blablabla",
      status: "published",
      icon: "utility"
    },
    {
      id: "456",
      name: "lucas-workflow-2",
      description: "blablabla",
      status: "published",
      icon: "utility"
    },
    {
      id: "789",
      name: "lucas-workflow-3",
      description: "blablabla",
      status: "draft",
      icon: "secure"
    }
  ]
};
const history = {};

describe("WorkflowsSection --- Snapshot", () => {
  beforeEach(() => {
    document.body.setAttribute("id", "app");
  });
  it("Capturing Snapshot of WorkflowsSection", () => {
    const { baseElement } = global.rtlReduxRouterRender(
      <MemoryRouter>
        <WorkflowsSection
          history={history}
          searchQuery={searchQuery}
          team={team}
          updateWorkflows={updateWorkflows}
          executeWorkflow={executeWorkflow}
          deleteWorkflow={deleteWorkflow}
          setActiveTeam={setActiveTeam}
          setActiveTeamAndRedirect={setActiveTeamAndRedirect}
          importWorkflow={{}}
          fetchTeams={fetchTeams}
          handleImportWorkflow={handleImportWorkflow}
          closeModal={closeModal}
        />
      </MemoryRouter>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
