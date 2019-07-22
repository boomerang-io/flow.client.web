import React from "react";
import Inputs from ".";
import { fireEvent } from "react-testing-library";

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
  shouldConfirmExit: mockfn,
  closeModal: mockfn,
  inputsName: [],
  workflowActions: { updateWorkflowInput: mockfn, createWorkflowInput: mockfn }
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

    fireEvent.mouseDown(typeSelect);
    fireEvent.mouseDown(getByText(/boolean/i));

    expect(queryByTestId("text-input")).not.toBeInTheDocument();
    expect(queryByTestId("toggle")).toBeInTheDocument();

    fireEvent.mouseDown(typeSelect);
    fireEvent.mouseDown(getByText(/text area/i));

    expect(queryByTestId("toggle")).not.toBeInTheDocument();
    expect(queryByTestId("text-area")).toBeInTheDocument();

    fireEvent.mouseDown(typeSelect);
    fireEvent.mouseDown(getByText(/select/i));

    expect(queryByTestId("text-area")).not.toBeInTheDocument();
    expect(queryByTestId("select")).toBeInTheDocument();
  });

  it("Shouldn't save property without key, label and type defined", async () => {
    const { getByText, getByPlaceholderText } = rtlReduxRender(<Inputs {...props} isEdit={false} input={{}} />);
    expect(getByText("CREATE")).toBeDisabled();

    const keyInput = getByPlaceholderText("key.value");
    const labelInput = getByPlaceholderText(/Label/i);
    const typeSelect = getByText(/select an item/i);

    fireEvent.change(keyInput, { target: { value: "test" } });
    fireEvent.change(labelInput, { target: { value: "test" } });
    fireEvent.mouseDown(typeSelect);
    fireEvent.click(getByText(/boolean/i));

    expect(getByText("CREATE")).toBeEnabled();
  });
});
