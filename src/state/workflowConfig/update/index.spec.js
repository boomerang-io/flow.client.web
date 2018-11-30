import { default as updateReducer, types, initialState } from "./index";

describe(">>>REDUCER --- updateReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(updateReducer(undefined, action)).toEqual(expected);
  });
  it("should handle UPDATE_WORKFLOW_CONFIG_RESET", () => {
    const action = { type: types.UPDATE_WORKFLOW_CONFIG_RESET };
    const expected = { ...initialState };

    expect(updateReducer(initialState, action)).toEqual(expected);
  });
  it("should handle UPDATE_WORKFLOW_CONFIG_REQUEST", () => {
    const action = { type: types.UPDATE_WORKFLOW_CONFIG_REQUEST };
    const expected = { ...initialState, isUpdating: true };

    expect(updateReducer(initialState, action)).toEqual(expected);
  });
  it("should handle UPDATE_WORKFLOW_CONFIG_SUCCESS", () => {
    const action = { type: types.UPDATE_WORKFLOW_CONFIG_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isUpdating: false,
      status: "success",
      data: []
    };
    const newState = updateReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle UPDATE_WORKFLOW_CONFIG_FAILURE", () => {
    const action = { type: types.UPDATE_WORKFLOW_CONFIG_FAILURE, error: "" };
    const expected = { ...initialState, isUpdating: false, status: "failure", error: "" };

    expect(updateReducer(initialState, action)).toEqual(expected);
  });
});
