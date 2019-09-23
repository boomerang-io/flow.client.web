import { default as globalConfigurationReducer, types, initialState } from "./index";

describe(">>>REDUCER --- globalConfigurationReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(globalConfigurationReducer(undefined, action)).toEqual(expected);
  });
  it("should handle RESET_GLOBAL_CONFIGURATION", () => {
    const action = { type: types.FETCH_GLOBAL_CONFIGURATION_RESET };
    const expected = { ...initialState };

    expect(globalConfigurationReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_GLOBAL_CONFIGURATION_REQUEST", () => {
    const action = { type: types.FETCH_GLOBAL_CONFIGURATION_REQUEST };
    const expected = { ...initialState, isFetching: true };

    expect(globalConfigurationReducer(initialState, action)).toEqual(expected);
  });
  it("should handle FETCH_GLOBAL_CONFIGURATION_SUCCESS", () => {
    const action = { type: types.FETCH_GLOBAL_CONFIGURATION_SUCCESS, data: [] };
    const expected = {
      ...initialState,
      isFetching: false,
      status: "success",
      data: []
    };

    expect(globalConfigurationReducer(initialState, action)).toEqual(expected);
  });

  it("should handle FETCH_GLOBAL_CONFIGURATION_FAILURE", () => {
    const action = { type: types.FETCH_GLOBAL_CONFIGURATION_FAILURE, error: "" };
    const expected = { ...initialState, isFetching: false, status: "failure", error: "" };

    expect(globalConfigurationReducer(initialState, action)).toEqual(expected);
  });

  it("should handle ADD_GLOBAL_CONFIGURATION_PROPERTY", () => {
    const action = { type: types.ADD_GLOBAL_CONFIGURATION_PROPERTY, property: { id: "1" } };
    const expected = { ...initialState, data: [action.property] };

    expect(globalConfigurationReducer(initialState, action)).toEqual(expected);
  });

  it("should handle DELETE_GLOBAL_CONFIGURATION_PROPERTY", () => {
    const action = { type: types.DELETE_GLOBAL_CONFIGURATION_PROPERTY, propertyId: "1" };
    const expected = { ...initialState, data: [] };

    expect(globalConfigurationReducer({ ...initialState, data: [{ id: "1" }] }, action)).toEqual(expected);
  });

  it("should handle UPDATE_GLOBAL_CONFIGURATION_PROPERTY", () => {
    const action = { type: types.UPDATE_GLOBAL_CONFIGURATION_PROPERTY, property: { id: "1", test: "hey" } };
    const expected = { ...initialState, data: [action.property] };

    expect(globalConfigurationReducer({ ...initialState, data: [{ id: "1", test: "hi" }] }, action)).toEqual(expected);
  });
});
