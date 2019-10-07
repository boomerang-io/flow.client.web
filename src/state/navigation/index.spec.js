import { default as navigationReducer, types as actionTypes, initialState } from "./index";

describe("REDUCER --- navigationReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(navigationReducer(undefined, action)).toEqual(expected);
  });

  it("should handle RESET_NAVIGATION", () => {
    const action = { type: actionTypes.RESET_NAVIGATION };
    const expected = initialState;

    expect(navigationReducer(initialState, action)).toEqual(expected);
  });

  it("should handle FETCH_NAVIGATION_REQUEST", () => {
    const action = { type: actionTypes.FETCH_NAVIGATION_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(navigationReducer(initialState, action)).toEqual(expected);
  });

  it("should handle FETCH_NAVIGATION_SUCCESS", () => {
    const action = { type: actionTypes.FETCH_NAVIGATION_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      data: action.data,
      error: "",
      status: "success"
    };

    expect(navigationReducer(initialState, action)).toEqual(expected);
  });

  it("should handle FETCH_NAVIGATION_FAILURE", () => {
    const action = { type: actionTypes.FETCH_NAVIGATION_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, error: action.error, status: "failure" };

    expect(navigationReducer(initialState, action)).toEqual(expected);
  });
});
