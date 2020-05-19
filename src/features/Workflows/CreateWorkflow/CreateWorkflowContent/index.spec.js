import React from "react";
import CreateWorkflowContent from "../CreateWorkflowContent";
// import { fireEvent } from "@testing-library/react";

const mockfn = jest.fn();
const props = {
  createWorkflow: mockfn,
  isCreating: false,
  names: [],
  teams: [{ value: "test", label: "Test" }]
};

describe("CreateWorkflowContent --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateWorkflowContent", () => {
    const { baseElement } = rtlRender(<CreateWorkflowContent {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

// describe("CreateWorkflowContent --- RTL Tests", () => {
//   test("CreateWorkflowContent - test if the isActive Toggle appears", () => {
//     const newProps = { ...props, isEdit: false };
//     const { queryByText } = rtlReduxRender(<CreateWorkflowContent {...newProps} />);

//     expect(queryByText(/active/i)).not.toBeInTheDocument();
//   });

//   test("CreateWorkflowContent - test the Submit Button state", () => {
//     const newProps = { ...props, isEdit: false };

//     const { getByLabelText, getByText } = rtlReduxRender(<CreateWorkflowContent {...newProps} />);
//     const valueInputText = getByLabelText(/value/i);
//     const labelInputText = getByLabelText(/label/i);
//     const keyInputText = getByLabelText(/key/i);
//     const saveButton = getByText(/create/i);

//     expect(saveButton).toBeDisabled();
//     fireEvent.change(valueInputText, { target: { value: "Value Test" } });
//     fireEvent.change(labelInputText, { target: { value: "Label Test" } });
//     fireEvent.change(keyInputText, { target: { value: "Key Test" } });
//     expect(saveButton).toBeEnabled();
//   });

//   test("CreateWorkflowContent - test if the form submits", () => {
//     const { getByLabelText, getByText } = rtlReduxRender(<CreateWorkflowContent {...props} />);
//     const valueInputText = getByLabelText(/value/i);
//     const labelInputText = getByLabelText(/label/i);
//     const keyInputText = getByLabelText(/key/i);
//     const saveButton = getByText(/save/i);

//     expect(valueInputText).toBeInTheDocument();
//     expect(labelInputText).toBeInTheDocument();
//     expect(keyInputText).toBeInTheDocument();

//     fireEvent.change(valueInputText, { target: { value: "Value Test" } });
//     fireEvent.change(labelInputText, { target: { value: "Label Test" } });
//     fireEvent.change(keyInputText, { target: { value: "Key Test" } });
//     fireEvent.click(saveButton);

//     expect(valueInputText).not.toBeInTheDocument();
//     expect(labelInputText).not.toBeInTheDocument();
//     expect(keyInputText).not.toBeInTheDocument();
//   });

//   test("CreateWorkflowContent - test form reqired validations", async () => {
//     const { getByLabelText, findByText, queryByText } = rtlReduxRender(
//       <CreateWorkflowContent {...props} />
//     );
//     const valueInputText = getByLabelText(/value/i);
//     const labelInputText = getByLabelText(/label/i);
//     const keyInputText = getByLabelText(/key/i);

//     expect(queryByText(/Enter a value/i)).toBeNull();
//     fireEvent.change(valueInputText, { target: { value: "" } });
//     fireEvent.blur(valueInputText);
//     const mandatoryValueErr = await findByText(/Enter a value/i);
//     expect(mandatoryValueErr).toBeInTheDocument();

//     expect(queryByText(/Enter a label/i)).toBeNull();
//     fireEvent.change(labelInputText, { target: { value: "" } });
//     fireEvent.blur(labelInputText);
//     const mandatoryLabelErr = await findByText(/Enter a label/i);
//     expect(mandatoryLabelErr).toBeInTheDocument();

//     expect(queryByText(/Enter a key/i)).toBeNull();
//     fireEvent.change(keyInputText, { target: { value: "" } });
//     fireEvent.blur(keyInputText);
//     const mandatoryKeyErr = await findByText(/Enter a key/i);
//     expect(mandatoryKeyErr).toBeInTheDocument();
//   });
// });
