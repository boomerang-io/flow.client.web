import { default as teamPropReducer, types as actionTypes, initialState } from ".";

const data = [
  {
    value: "asdas2345",
    id: "5cdc5ad7460edb4a230b579b",
    key: "mail.accdasdount",
    label: "Mail Accdasdount",
    type: "password"
  },
  {
    label: "Boomerang Accounts",
    key: "boomerang.account",
    value: "a long value to test",
    type: "text",
    id: "5cdc5ad7460edb4a230b579d"
  }
];

const newProp = {
  value: "123",
  key: "random",
  label: "new",
  description: "value",
  type: "password",
  id: "0hGCg2O"
};

const updateProp = {
  label: "Boomerang Accounts test",
  key: "boomerang.account test",
  value: "a long value to test",
  type: "text",
  id: "5cdc5ad7460edb4a230b579d"
};

const propId = "5cdc5ad7460edb4a230b579b";

describe("REDUCER --- teamPropReducer", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(teamPropReducer(undefined, action)).toEqual(expected);
  });

  it("should handle FETCH_TEAM_PROPERTIES_REQUEST", () => {
    const action = { type: actionTypes.FETCH_TEAM_PROPERTIES_REQUEST };
    const expected = { ...initialState, isFetching: true };
    const newState = teamPropReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_TEAM_PROPERTIES_SUCCESS", () => {
    const action = { type: actionTypes.FETCH_TEAM_PROPERTIES_SUCCESS, data };
    const expected = { ...initialState, data: action.data, isFetching: false, status: "success" };
    const newState = teamPropReducer(initialState, action);

    expect(newState).toEqual(expected);
  });
  it("should handle FETCH_TEAM_PROPERTIES_FAILURE", () => {
    const action = { type: actionTypes.FETCH_TEAM_PROPERTIES_FAILURE, data: [], error: "error" };
    const expected = { ...initialState, data: [], error: action.error, status: "failure" };
    const newState = teamPropReducer(initialState, action);

    expect(newState).toEqual(expected);
  });
  it("should handle RESET_TEAM_PROPERTIES", () => {
    const action = { type: actionTypes.RESET_TEAM_PROPERTIES };
    const expected = initialState;
    const newState = teamPropReducer(initialState, action);

    expect(newState).toEqual(expected);
  });
  it("should handle DELETE_TEAM_PROPERTIES_PROPERTY, ", () => {
    const action = { type: actionTypes.DELETE_TEAM_PROPERTIES_PROPERTY, propId };
    const expected = { ...initialState, data: [data[1]] };
    const newState = teamPropReducer({ ...initialState, data }, action);

    expect(newState).toEqual(expected);
  });
  it("should handle UPDATE_TEAM_PROPERTIES_PROPERTY, ", () => {
    const action = { type: actionTypes.UPDATE_TEAM_PROPERTIES_PROPERTY, property: updateProp };
    const expected = { ...initialState, data: [data[0], updateProp] };
    const newState = teamPropReducer({ ...initialState, data }, action);

    expect(newState).toEqual(expected);
  });
  it("should handle ADD_TEAM_PROPERTIES_PROPERTY, ", () => {
    const action = {
      type: actionTypes.ADD_TEAM_PROPERTIES_PROPERTY,
      property: newProp
    };
    const expected = { ...initialState, data: data.concat(newProp) };
    const newState = teamPropReducer({ ...initialState, data }, action);

    expect(newState).toEqual(expected);
  });
});
