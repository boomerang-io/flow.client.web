import { vi } from "vitest";
import CreateWorkflowTemplates from ".";
import { tasktemplate, workflowTemplates } from "ApiServer/fixtures";

// import { screen, fireEvent } from "@testing-library/react";

const mockfn = vi.fn();
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
    const { baseElement } = global.rtlRender(<CreateWorkflowTemplates {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
