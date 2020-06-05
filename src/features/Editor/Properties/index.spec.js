import React from "react";
import Inputs from ".";
import { fireEvent, waitFor } from "@testing-library/react";

const mockfn = jest.fn();

const initialState = {};

const props = {
  summaryData: {
    properties: [
      {
        defaultValue: "pandas",
        description: "Tim property",
        key: "tim.property",
        label: "Tim Property",
        required: true,
        type: "select",
        optiions: ["pandas", "dogs"],
      },
    ],
    id: "123",
  },
};

beforeEach(() => {
  document.body.setAttribute("id", "app");
});

describe("Inputs --- Snapshot Test", () => {
  it("Capturing Snapshot of Inputs", async () => {
    const { baseElement } = rtlContextRouterRender(<Inputs {...props} />, { initialState });
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});

describe("Inputs --- RTL", () => {
  it("Render inputs correctly", async () => {
    const { queryByText } = rtlContextRouterRender(<Inputs {...props} />, { initialState });
    expect(queryByText("tim.property")).toBeInTheDocument();
    await waitFor(() => {});
  });

  it("Opens create new property modal", async () => {
    const { queryByText, getByTestId } = rtlContextRouterRender(<Inputs {...props} />, { initialState });

    //expect(queryByText(/Create a new property/i)).not.toBeInTheDocument();

    //const modalTrigger = getByText(/Create a new property/i);
    const modalTrigger = getByTestId("create-new-workflow-input-button");
    fireEvent.click(modalTrigger);

    expect(queryByText(/Create a new property/i)).toBeInTheDocument();
    await waitFor(() => {});
  });

  it("Opens edit property modal", async () => {
    const { getByLabelText, queryByText } = rtlContextRouterRender(<Inputs {...props} />, { initialState });

    //expect(queryByText(/Let's update it/i)).not.toBeInTheDocument();

    const modalTrigger = getByLabelText(/Edit/i);
    fireEvent.click(modalTrigger);

    expect(queryByText(/Let's change some stuff/i)).toBeInTheDocument();
    await waitFor(() => {});
  });
});
