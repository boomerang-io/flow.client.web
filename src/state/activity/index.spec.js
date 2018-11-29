import { default as activityReducer, types, initialState } from "./index";

describe(">>>REDUCER --- activityReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(activityReducer(undefined, action)).toEqual(expected);
  });
  it("should handle FETCH_ACTIVITY_RESET", () => {
    const action = { type: types.FETCH_ACTIVITY_RESET };
    const expected = { ...initialState };

    expect(activityReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_ACTIVITY_REQUEST", () => {
    const action = { type: types.FETCH_ACTIVITY_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(activityReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_ACTIVITY_SUCCESS", () => {
    const action = { type: types.FETCH_ACTIVITY_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };
    const newState = activityReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ACTIVITY_FAILURE", () => {
    const action = { type: types.FETCH_ACTIVITY_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(activityReducer(initialState, action)).toEqual(expected);
  });
});
