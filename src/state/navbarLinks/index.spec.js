import { default as navbarReducer, types, initialState } from "./index";

describe(">>>REDUCER --- activityReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(navbarReducer(undefined, action)).toEqual(expected);
  });
  it("should handle RESET_NAVBAR_LINKS", () => {
    const action = { type: types.RESET_NAVBAR_LINKS };
    const expected = { ...initialState };

    expect(navbarReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_NAVBAR_LINKS_REQUEST", () => {
    const action = { type: types.FETCH_NAVBAR_LINKS_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(navbarReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_NAVBAR_LINKS_SUCCESS", () => {
    const action = { type: types.FETCH_NAVBAR_LINKS_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };
    const newState = navbarReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_NAVBAR_LINKS_FAILURE", () => {
    const action = { type: types.FETCH_NAVBAR_LINKS_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(navbarReducer(initialState, action)).toEqual(expected);
  });
});
