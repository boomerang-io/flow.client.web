import React from "react";
import ImportWorkflow from ".";
import { fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";

const mockfn = jest.fn();

const props = {
  fetchTeams: mockfn,
  handleImportWorkflow: mockfn,
  workflowId: "test",
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("ImportWorkflow --- Snapshot Test", () => {
  it("Capturing Snapshot of ImportWorkflow", () => {
    const { baseElement, getByText } = rtlContextRouterRender(<ImportWorkflow {...props} />);
    fireEvent.click(getByText(/Choose a file or drag one here/i));
    expect(baseElement).toMatchSnapshot();
  });
});
