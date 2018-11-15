import { default as userReducer, types, initialState } from "./index";

describe(">>>REDUCER --- userReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(userReducer(undefined, action)).toEqual(expected);
  });
  it("should handle RESET_USER", () => {
    const action = { type: types.RESET_USER };
    const expected = { ...initialState };

    expect(userReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_USER_REQUEST", () => {
    const action = { type: types.FETCH_USER_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(userReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_USER_SUCCESS", () => {
    const action = { type: types.FETCH_USER_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };
    const newState = userReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_FAILURE", () => {
    const action = { type: types.FETCH_USER_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(userReducer(initialState, action)).toEqual(expected);
  });
});
