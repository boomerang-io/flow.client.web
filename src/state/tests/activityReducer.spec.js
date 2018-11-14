import { default as activityReducer, types, initialState } from "../activity";

describe(">>>REDUCER --- activityReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(activityReducer(undefined, action)).toEqual(expected);
  });
});
