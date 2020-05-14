import React from "react";
import Inputs from ".";
import { fireEvent, waitForElement } from "@testing-library/react";

const mockfn = jest.fn();

const props = {
  isEdit: true,
  input: {
    defaultValue: "dogs",
    description: "Tim property",
    key: "tim.property",
    label: "Tim Property",
    required: false,
    type: "text"
  },
  loading: false,
  updateInputs: mockfn,
  setShouldConfirmModalClose: mockfn,
  closeModal: mockfn,
  inputsName: [],
  workflowActions: { updateWorkflowInput: mockfn, createWorkflowInput: mockfn },
  updateWorkflowProperties: mockfn
};

describe("Inputs --- Snapshot Test", () => {
  it("Capturing Snapshot of Inputs", () => {
    const { baseElement } = rtlReduxRender(<Inputs {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("Inputs --- RTL", () => {
  it("Change default value by type correctly", () => {
    const { getByText, getByLabelText, queryByTestId } = rtlReduxRender(<Inputs {...props} />);
    expect(queryByTestId("text-input")).toBeInTheDocument();

    const typeSelect = getByLabelText(/type/i);

    fireEvent.click(typeSelect);
    fireEvent.click(getByText(/boolean/i));

    expect(queryByTestId("text-input")).not.toBeInTheDocument();
    expect(queryByTestId("toggle")).toBeInTheDocument();

    fireEvent.click(typeSelect);
    fireEvent.click(getByText(/text area/i));

    expect(queryByTestId("toggle")).not.toBeInTheDocument();
    expect(queryByTestId("text-area")).toBeInTheDocument();

    fireEvent.click(typeSelect);
    fireEvent.click(getByText(/select/i));

    expect(queryByTestId("text-area")).not.toBeInTheDocument();
    expect(queryByTestId("select")).toBeInTheDocument();
  });

  it("Shouldn't save property without key, label and type defined", async () => {
    const { findByText, getByText, getByPlaceholderText, getByLabelText } = rtlReduxRender(
      <Inputs {...props} isEdit={false} input={undefined} />
    );
    waitForElement(() => expect(findByText(/create/i)).toBeDisabled());

    const keyInput = getByPlaceholderText("key.value");
    const labelInput = getByPlaceholderText(/name/i);
    const typeSelect = getByLabelText(/type/i);

    fireEvent.change(keyInput, { target: { value: "test" } });
    fireEvent.change(labelInput, { target: { value: "test" } });
    fireEvent.click(typeSelect);
    fireEvent.click(getByText(/boolean/i));

    waitForElement(() => expect(findByText(/create/i)).toBeEnabled());
  });
});
