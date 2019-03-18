import { default as activeNodeReducer, types, initialState } from "./index";

describe(">>>REDUCER --- activeNodeReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(activeNodeReducer(undefined, action)).toEqual(expected);
  });

  it("should handle UPDATE_ACTIVE_NODE", () => {
    const action = { type: types.UPDATE_ACTIVE_NODE, data: { workflowId: "testWorkflow", nodeId: "testNode" } };
    const expected = { ...initialState, activeNode: { workflowId: "testWorkflow", nodeId: "testNode" } };

    expect(activeNodeReducer(initialState, action)).toEqual(expected);
  });
  it("should handle RESET_ACTIVE_NODE", () => {
    const action = { type: types.RESET_ACTIVE_NODE };
    const expected = {
      ...initialState,
      activeNode: {
        workflowId: "",
        nodeId: ""
      }
    };
    const newState = activeNodeReducer(initialState, action);

    expect(newState).toEqual(expected);
  });
  it("should handle SET_ACTIVE_TEAM_ID", () => {
    const action = { type: types.SET_ACTIVE_TEAM_ID, data: { teamId: "test" } };
    const expected = {
      ...initialState,
      activeTeamId: "test"
    };
    const newState = activeNodeReducer(initialState, action);

    expect(newState).toEqual(expected);
  });
});
