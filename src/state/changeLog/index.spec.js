import { default as changeLogReducer, types, initialState } from "./index";

describe(">>>REDUCER --- activityReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(changeLogReducer(undefined, action)).toEqual(expected);
  });
  it("should handle FETCH_CHANGE_LOG_RESET", () => {
    const action = { type: types.FETCH_CHANGE_LOG_RESET };
    const expected = { ...initialState };

    expect(changeLogReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_CHANGE_LOG_REQUEST", () => {
    const action = { type: types.FETCH_CHANGE_LOG_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(changeLogReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_CHANGE_LOG_SUCCESS", () => {
    const action = { type: types.FETCH_CHANGE_LOG_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };
    const newState = changeLogReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_CHANGE_LOG_FAILURE", () => {
    const action = { type: types.FETCH_CHANGE_LOG_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(changeLogReducer(initialState, action)).toEqual(expected);
  });
});
