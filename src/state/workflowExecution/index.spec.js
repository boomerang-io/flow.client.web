import { default as workflowExecutionReducer, types, initialState } from "./index";

describe(">>>REDUCER --- workflowExecutionReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(workflowExecutionReducer(undefined, action)).toEqual(expected);
  });
  it("should handle WORKFLOW_EXECUTION_RESET", () => {
    const action = { type: types.WORKFLOW_EXECUTION_RESET };
    const expected = { ...initialState };

    expect(workflowExecutionReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_WORKFLOW_EXECUTION_REQUEST", () => {
    const action = { type: types.FETCH_WORKFLOW_EXECUTION_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(workflowExecutionReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_WORKFLOW_EXECUTION_SUCCESS", () => {
    const action = { type: types.FETCH_WORKFLOW_EXECUTION_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };
    const newState = workflowExecutionReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_WORKFLOW_EXECUTION_FAILURE", () => {
    const action = { type: types.FETCH_WORKFLOW_EXECUTION_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(workflowExecutionReducer(initialState, action)).toEqual(expected);
  });
});
