import React from "react";
import Inputs from ".";
import { fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { queryCaches } from "react-query";

const mockfn = jest.fn();

const props = {
  isEdit: true,
  property: {
    defaultValue: "dogs",
    description: "Tim property",
    key: "tim.property",
    label: "Tim Property",
    required: false,
    type: "text",
  },
  loading: false,
  updateInputs: mockfn,
  setShouldConfirmModalClose: mockfn,
  closeModal: mockfn,
  inputsName: [],
  workflowActions: { updateWorkflowInput: mockfn, createWorkflowInput: mockfn },
  updateWorkflowProperties: mockfn,
};

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

describe("Inputs --- Snapshot Test", () => {
  it("Capturing Snapshot of Inputs", async () => {
    const { baseElement } = rtlContextRouterRender(<Inputs {...props} />);

    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});

describe("Inputs --- RTL", () => {
  it("Change default value by type correctly", async () => {
    const { getByText, queryByTestId, getByPlaceholderText } = rtlContextRouterRender(<Inputs {...props} />);
    expect(queryByTestId("text-input")).toBeInTheDocument();

    const typeSelect = getByPlaceholderText("Select an item");
    act(() => {
      fireEvent.change(typeSelect, { target: { value: "b" } });
    });

    act(() => {
      fireEvent.click(getByText(/boolean/i));
    });

    expect(queryByTestId("text-input")).not.toBeInTheDocument();
    expect(queryByTestId("toggle")).toBeInTheDocument();

    act(() => {
      fireEvent.change(typeSelect, { target: { value: "are" } });
    });

    act(() => {
      fireEvent.click(getByText(/text area/i));
    });

    expect(queryByTestId("toggle")).not.toBeInTheDocument();
    expect(queryByTestId("text-area")).toBeInTheDocument();

    act(() => {
      fireEvent.change(typeSelect, { target: { value: "sel" } });
    });

    act(() => {
      fireEvent.click(getByText(/select/i));
    });

    expect(queryByTestId("text-area")).not.toBeInTheDocument();
    expect(queryByTestId("select")).toBeInTheDocument();

    await waitFor(() => {});
  });

  it("Shouldn't save property without key, label and type defined", async () => {
    const { findByRole, getByPlaceholderText, getByLabelText, getByText } = rtlContextRouterRender(
      <Inputs {...props} isEdit={false} input={undefined} />
    );
    await waitFor(() => {});

    const keyInput = getByLabelText("Key");
    const labelInput = getByLabelText("Label");
    const typeSelect = getByPlaceholderText("Select an item");

    act(() => {
      fireEvent.change(keyInput, { target: { value: "test" } });
    });

    act(() => {
      fireEvent.change(labelInput, { target: { value: "test" } });
    });

    act(() => {
      fireEvent.change(typeSelect, { target: { value: "b" } });
    });

    act(() => {
      fireEvent.click(getByText(/boolean/i));
    });

    const createButton = await findByRole("button", { name: /create/i });
    expect(createButton).toBeEnabled();

    await waitFor(() => {});
  });
});
