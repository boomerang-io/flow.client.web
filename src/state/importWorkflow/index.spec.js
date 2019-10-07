import { default as importWorkflowReducer, types, initialState } from "./index";

describe(">>>REDUCER --- importWorkflowReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(importWorkflowReducer(undefined, action)).toEqual(expected);
  });
  it("should handle IMPORT_WORKFLOW_RESET", () => {
    const action = { type: types.IMPORT_WORKFLOW_RESET };
    const expected = { ...initialState };

    expect(importWorkflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle IMPORT_WORKFLOW_REQUEST", () => {
    const action = { type: types.IMPORT_WORKFLOW_REQUEST };
    const expected = { ...initialState, isPosting: true };

    expect(importWorkflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle IMPORT_WORKFLOW_SUCCESS", () => {
    const action = { type: types.IMPORT_WORKFLOW_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isPosting: false,
      status: "success",
      data: []
    };

    expect(importWorkflowReducer(initialState, action)).toEqual(expected);
  });

  it("should handle IMPORT_WORKFLOW_FAILURE", () => {
    const action = { type: types.IMPORT_WORKFLOW_FAILURE, error: "" };
    const expected = { ...initialState, isPosting: false, status: "failure", error: "" };

    expect(importWorkflowReducer(initialState, action)).toEqual(expected);
  });
});
