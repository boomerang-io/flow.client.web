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
});
