import React from "react";
import Inputs from ".";
import { fireEvent, waitFor } from "@testing-library/react";
import { queryCaches } from "react-query";

const initialState = {};

const props = {
  summaryData: {
    properties: [
      {
        defaultValue: "pandas",
        description: "Tim parameter",
        key: "tim-parameter",
        label: "Tim parameter",
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

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
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
    expect(queryByText("tim-parameter")).toBeInTheDocument();
    await waitFor(() => {});
  });

  it("Opens create new parameter modal", async () => {
    const { queryByText, getByTestId } = rtlContextRouterRender(<Inputs {...props} />, { initialState });

    //expect(queryByText(/Create a new parameter/i)).not.toBeInTheDocument();

    //const modalTrigger = getByText(/Create a new parameter/i);
    const modalTrigger = getByTestId("create-parameter-button");
    fireEvent.click(modalTrigger);

    expect(queryByText(/Create a new parameter/i)).toBeInTheDocument();
    await waitFor(() => {});
  });

  it("Opens edit parameter modal", async () => {
    const { getByLabelText, queryByText } = rtlContextRouterRender(<Inputs {...props} />, { initialState });

    //expect(queryByText(/Let's update it/i)).not.toBeInTheDocument();

    const modalTrigger = getByLabelText(/Edit/i);
    fireEvent.click(modalTrigger);

    expect(queryByText(/Let's change some stuff/i)).toBeInTheDocument();
    await waitFor(() => {});
  });
});
