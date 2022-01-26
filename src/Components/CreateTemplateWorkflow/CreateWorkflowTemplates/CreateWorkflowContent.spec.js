/* eslint-disable jest/no-commented-out-tests */
import React from "react";
import CreateWorkflowTemplates from ".";
import { tasktemplate, workflowTemplates } from "ApiServer/fixtures";

// import { fireEvent } from "@testing-library/react";

const mockfn = jest.fn();
const props = {
  closeModal: mockfn,
  saveValues: mockfn,
  formData: {},
  isLoading: false,
  requestNextStep: mockfn,
  workflowTemplates: workflowTemplates,
  templatesError: false,
  taskTemplates: tasktemplate, 
};

describe("CreateWorkflowTemplates --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateWorkflowTemplates", () => {
    const { baseElement } = rtlRender(<CreateWorkflowTemplates {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
