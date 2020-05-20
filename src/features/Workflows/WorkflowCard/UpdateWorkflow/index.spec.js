import React from "react";
import { actions as importWorkflowActions, initialState } from "State/importWorkflow";
import ImportWorkflow from ".";
import { fireEvent } from "@testing-library/react";

const mockfn = jest.fn();

const props = {
  fetchTeams: mockfn,
  handleImportWorkflow: mockfn,
  importWorkflowActions,
  workflowId: "test",
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

describe("ImportWorkflow --- Snapshot Test", () => {
  it("Capturing Snapshot of ImportWorkflow", () => {
    const { baseElement, getByText } = rtlContextRouterRender(<ImportWorkflow {...props} />, {
      initialState: { importWorkflow: initialState },
    });
    fireEvent.click(getByText(/Choose a file or drag one here/i));
    expect(baseElement).toMatchSnapshot();
  });
});
