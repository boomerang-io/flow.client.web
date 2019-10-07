import { default as workflowRevisionReducer, types as actionTypes, initialState } from "./index";

describe("REDUCER --- workflowRevisionReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(workflowRevisionReducer(undefined, action)).toEqual(expected);
  });

  it("should handle WORKFLOW_REVISION_RESET", () => {
    const action = { type: actionTypes.WORKFLOW_REVISION_RESET };
    const expected = initialState;

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle FETCH_WORKFLOW_REVISION_REQUEST", () => {
    const action = { type: actionTypes.FETCH_WORKFLOW_REVISION_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle FETCH_WORKFLOW_REVISION_SUCCESS", () => {
    const action = { type: actionTypes.FETCH_WORKFLOW_REVISION_SUCCESS, data: { dag: {}, version: "" } };
    const expected = {
      ...initialState,
      isFetching: false,
      fetchingStatus: "success",
      dag: action.data.dag,
      config: {},
      version: action.data.version
    };

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle FETCH_WORKFLOW_REVISION_FAILURE", () => {
    const action = { type: actionTypes.FETCH_WORKFLOW_REVISION_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, error: action.error, fetchingStatus: "failure" };

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle CREATE_WORKFLOW_REVISION_REQUEST", () => {
    const action = { type: actionTypes.CREATE_WORKFLOW_REVISION_REQUEST };
    const expected = { ...initialState, isCreating: true };

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle CREATE_WORKFLOW_REVISION_SUCCESS", () => {
    const action = {
      type: actionTypes.CREATE_WORKFLOW_REVISION_SUCCESS,
      data: { dag: {}, version: "", config: { nodes: [] } }
    };
    const expected = {
      ...initialState,
      isCreating: false,
      creatingStatus: "success",
      dag: action.data.dag,
      config: {},
      version: action.data.version,
      hasUnsavedWorkflowRevisionUpdates: false
    };

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle CREATE_WORKFLOW_REVISION_FAILURE", () => {
    const action = { type: actionTypes.CREATE_WORKFLOW_REVISION_FAILURE, error: "" };
    const expected = { ...initialState, isCreating: false, error: action.error, creatingStatus: "failure" };

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle CREATE_NODE", () => {
    const action = { type: actionTypes.CREATE_NODE, data: { nodeId: "1" } };
    const expected = { ...initialState, hasUnsavedWorkflowRevisionUpdates: true, config: { 1: { nodeId: "1" } } };

    expect(workflowRevisionReducer(initialState, action)).toEqual(expected);
  });

  it("should handle UPDATE_NODE_CONFIG", () => {
    const action = { type: actionTypes.UPDATE_NODE_CONFIG, data: { nodeId: "1", inputs: [{ id: "2" }] } };
    const expected = {
      ...initialState,
      hasUnsavedWorkflowRevisionUpdates: true,
      config: { 1: { nodeId: "1", inputs: { 0: { id: "2" } } } }
    };

    expect(workflowRevisionReducer({ ...initialState, config: { 1: { nodeId: "1", inputs: [] } } }, action)).toEqual(
      expected
    );
  });

  it("should handle DELETE_NODE", () => {
    const action = { type: actionTypes.DELETE_NODE, data: { nodeId: "1" } };
    const expected = { ...initialState, hasUnsavedWorkflowRevisionUpdates: true, dag: { nodes: [] }, config: {} };

    expect(
      workflowRevisionReducer(
        { ...initialState, dag: { nodes: [{ nodeId: "1" }] }, config: { 1: { nodeId: "1" } } },
        action
      )
    ).toEqual(expected);
  });
});
