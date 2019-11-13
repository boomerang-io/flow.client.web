import { default as workflowReducer, types, initialState } from "./index";

describe(">>>REDUCER --- workflowReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(workflowReducer(undefined, action)).toEqual(expected);
  });
  it("should handle WORKFLOW_RESET", () => {
    const action = { type: types.WORKFLOW_RESET };
    const expected = { ...initialState };

    expect(workflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_WORKFLOW_REQUEST", () => {
    const action = { type: types.FETCH_WORKFLOW_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(workflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_WORKFLOW_SUCCESS", () => {
    const action = { type: types.FETCH_WORKFLOW_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      fetchingStatus: "success",
      data: []
    };
    const newState = workflowReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_WORKFLOW_FAILURE", () => {
    const action = { type: types.FETCH_WORKFLOW_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, fetchingStatus: "failure", error: "" };

    expect(workflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle UPDATE_WORKFLOW_REQUEST", () => {
    const action = { type: types.UPDATE_WORKFLOW_REQUEST };
    const expected = { ...initialState, isUpdating: true, updatingStatus: "" };

    expect(workflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle UPDATE_WORKFLOW_SUCCESS", () => {
    const updateData = {
      enablePersistentStorage: false,
      enableACCIntegration: false,
      properties: [],
      triggers: {
        scheduler: {
          enable: false,
          schedule: "",
          timezone: ""
        },
        webhook: {
          enable: false,
          token: ""
        },
        event: {
          enable: false,
          topic: ""
        }
      }
    };
    const action = { type: types.UPDATE_WORKFLOW_SUCCESS, data: updateData };
    const expected = {
      ...initialState,
      isFetching: false,
      updatingStatus: "success",
      data: updateData
    };
    const newState = workflowReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle UPDATE_WORKFLOW_FAILURE", () => {
    const action = { type: types.UPDATE_WORKFLOW_FAILURE, error: "" };
    const expected = { ...initialState, isUpdating: false, updatingStatus: "failure", error: "" };

    expect(workflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle CREATE_WORKFLOW_REQUEST", () => {
    const action = { type: types.CREATE_WORKFLOW_REQUEST };
    const expected = { ...initialState, isCreating: true, creatingStatus: "" };

    expect(workflowReducer(initialState, action)).toEqual(expected);
  });
  it("should handle CREATE_WORKFLOW_SUCCESS", () => {
    const action = { type: types.CREATE_WORKFLOW_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isCreating: false,
      updatingStatus: "success",
      data: []
    };
    const newState = workflowReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle CREATE_WORKFLOW_FAILURE", () => {
    const action = { type: types.CREATE_WORKFLOW_FAILURE, error: "" };
    const expected = { ...initialState, isCreating: false, updatingStatus: "failure", error: "" };

    expect(workflowReducer(initialState, action)).toEqual(expected);
  });
});
