import React from "react";
import Inputs from ".";
import { fireEvent, waitFor } from "@testing-library/react";
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
  it("Capturing Snapshot of Inputs", async () => {
    const { baseElement } = rtlReduxRender(<Inputs {...props} />);
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {});
  });
});

describe("Inputs --- RTL", () => {
  it("Change default value by type correctly", async () => {
    const { getByText, queryByTestId, getByTestId } = rtlReduxRender(<Inputs {...props} />);
    expect(queryByTestId("text-input")).toBeInTheDocument();

    const typeSelect = getByTestId("input-type");

    fireEvent.change(typeSelect, {target:{value:"b"}});
    fireEvent.click(getByText(/boolean/i));

    expect(queryByTestId("text-input")).not.toBeInTheDocument();
    expect(queryByTestId("toggle")).toBeInTheDocument();

    fireEvent.change(typeSelect, {target:{value:"are"}});
    fireEvent.click(getByText(/text area/i));

    expect(queryByTestId("toggle")).not.toBeInTheDocument();
    expect(queryByTestId("text-area")).toBeInTheDocument();

    fireEvent.change(typeSelect, {target:{value:"sel"}});
    fireEvent.click(getByText(/select/i));

    expect(queryByTestId("text-area")).not.toBeInTheDocument();
    expect(queryByTestId("select")).toBeInTheDocument();

    await waitFor(() => {});
  });

  it("Shouldn't save property without key, label and type defined", () => {
    const { findByText, getByPlaceholderText, getByLabelText, getByTestId } = rtlReduxRender(
      <Inputs {...props} isEdit={false} input={undefined} />
    );
    waitFor(() => expect(findByText(/create/i)).toBeDisabled());

    const keyInput = getByPlaceholderText("key.value");
    const labelInput = getByPlaceholderText(/name/i);
    const typeSelect = getByLabelText(/type/i);

    fireEvent.change(keyInput, { target: { value: "test" } });
    fireEvent.change(labelInput, { target: { value: "test" } });

    fireEvent.change(typeSelect, {target:{value:"b"}});
    fireEvent.click(getByText(/boolean/i));

    waitFor(() => expect(findByText(/create/i)).toBeEnabled());

    await waitFor(() => {});
  });
});
