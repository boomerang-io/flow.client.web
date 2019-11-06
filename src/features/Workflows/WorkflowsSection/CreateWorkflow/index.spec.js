import React from "react";
import CreateWorkflow from ".";
import { actions as workflowActions, initialState as workflowInitialState } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { initialState } from "State/teams";
import { fireEvent } from "@testing-library/react";

const mockfn = jest.fn();
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
const props = {
  createWorkflow: mockfn,
  fetchTeams: mockfn,
  workflowActions,
  workflowRevisionActions,
  team
};

describe("CreateWorkflow --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateWorkflow", () => {
    const { baseElement, getByText } = rtlReduxRender(<CreateWorkflow {...props} />, {
      initialState: { teams: initialState, workflowInitialState }
    });
    fireEvent.click(getByText(/Create a new workflow/i));
    expect(baseElement).toMatchSnapshot();
  });
});
