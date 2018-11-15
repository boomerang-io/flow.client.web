import { default as tasksReducer, types, initialState } from "./index";

describe(">>>REDUCER --- tasksReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(tasksReducer(undefined, action)).toEqual(expected);
  });
  it("should handle RESET_TASKS", () => {
    const action = { type: types.RESET_TASKS };
    const expected = { ...initialState };

    expect(tasksReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_TASKS_REQUEST", () => {
    const action = { type: types.FETCH_TASKS_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(tasksReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_TASKS_SUCCESS", () => {
    const action = { type: types.FETCH_TASKS_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };
    const newState = tasksReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_TASKS_FAILURE", () => {
    const action = { type: types.FETCH_TASKS_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(tasksReducer(initialState, action)).toEqual(expected);
  });
});
