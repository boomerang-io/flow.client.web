import { default as onBoardReducer, types, initialState } from "./index";

describe(">>>REDUCER --- onBoardReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(onBoardReducer(undefined, action)).toEqual(expected);
  });
  it("should handle RESET_ONBOARD_EXP", () => {
    const action = { type: types.RESET_ONBOARD_EXP };
    const expected = { ...initialState };

    expect(onBoardReducer(initialState, action)).toEqual(expected);
  });
  it("should handle ONBOARD_EXP_SHOW", () => {
    const action = { type: types.ONBOARD_EXP_SHOW };
    const expected = { ...initialState, show: true };

    expect(onBoardReducer(initialState, action)).toEqual(expected);
  });
  it("should handle ONBOARD_EXP_HIDE", () => {
    const action = { type: types.ONBOARD_EXP_HIDE };
    const expected = { ...initialState, show: false };

    expect(onBoardReducer(initialState, action)).toEqual(expected);
  });
});
