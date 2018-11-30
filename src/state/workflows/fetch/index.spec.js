import { default as workflowsReducer, types, initialState } from "./index";

describe(">>>REDUCER --- workflowsReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(workflowsReducer(undefined, action)).toEqual(expected);
  });
  it("should handle FETCH_WORKFLOW_RESET", () => {
    const action = { type: types.FETCH_WORKFLOW_RESET };
    const expected = { ...initialState };

    expect(workflowsReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_WORKFLOW_REQUEST", () => {
    const action = { type: types.FETCH_WORKFLOW_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(workflowsReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_WORKFLOW_SUCCESS", () => {
    const action = { type: types.FETCH_WORKFLOW_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };
    const newState = workflowsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_WORKFLOW_FAILURE", () => {
    const action = { type: types.FETCH_WORKFLOW_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(workflowsReducer(initialState, action)).toEqual(expected);
  });
});
