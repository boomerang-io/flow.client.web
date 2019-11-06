import React from "react";
import WorkflowsSection from "./index";

const mockfn = jest.fn();

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

describe("WorkflowsSection --- Snapshot", () => {
  beforeEach(() => {
    document.body.setAttribute("id", "app");
  });
  it("Capturing Snapshot of WorkflowsSection", () => {
    const { baseElement } = rtlReduxRouterRender(
      <WorkflowsSection
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
    );
    expect(baseElement).toMatchSnapshot();
  });
});
