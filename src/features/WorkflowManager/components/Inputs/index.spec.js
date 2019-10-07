import React from "react";
import Inputs from ".";
import { fireEvent } from "@testing-library/react";

const mockfn = jest.fn();

const initialState = {
  workflow: {
    data: {
      properties: [
        {
          defaultValue: "pandas",
          description: "Tim property",
          key: "tim.property",
          label: "Tim Property",
          required: true,
          type: "select",
          validValues: ["pandas", "dogs"]
        }
      ]
    }
  }
};

const props = {
  loading: false,
  updateInputs: mockfn,
  workflowActions: { deleteWorkflowInput: mockfn }
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

describe("Inputs --- Snapshot Test", () => {
  it("Capturing Snapshot of Inputs", () => {
    const { baseElement } = rtlReduxRender(<Inputs {...props} />, { initialState });
    expect(baseElement).toMatchSnapshot();
  });
});

describe("Inputs --- RTL", () => {
  it("Render inputs correctly", () => {
    const { queryByText } = rtlReduxRender(<Inputs {...props} />, { initialState });
    expect(queryByText("tim.property")).toBeInTheDocument();
  });

  it("Opens create new property modal", () => {
    const { queryByText, getByTestId } = rtlReduxRender(<Inputs {...props} />, { initialState });

    //expect(queryByText(/Create new input property/i)).not.toBeInTheDocument();

    //const modalTrigger = getByText(/Create new property/i);
    const modalTrigger = getByTestId("create-new-workflow-input-button");
    fireEvent.click(modalTrigger);

    expect(queryByText(/Create new input property/i)).toBeInTheDocument();
  });

  it("Opens edit property modal", () => {
    const { getByText, queryByText } = rtlReduxRender(<Inputs {...props} />, { initialState });

    //expect(queryByText(/Let's update it/i)).not.toBeInTheDocument();

    const modalTrigger = getByText(/Edit/i);
    fireEvent.click(modalTrigger);

    expect(queryByText(/Let's update it/i)).toBeInTheDocument();
  });
});
