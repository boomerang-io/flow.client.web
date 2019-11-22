/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";
import update from "immutability-helper";

//action types
export const types = {
  RESET_TEAM_PROPERTIES: "RESET_TEAM_PROPERTIES",
  FETCH_TEAM_PROPERTIES_REQUEST: "FETCH_TEAM_PROPERTIES_REQUEST",
  FETCH_TEAM_PROPERTIES_SUCCESS: "FETCH_TEAM_PROPERTIES_SUCCESS",
  FETCH_TEAM_PROPERTIES_FAILURE: "FETCH_TEAM_PROPERTIES_FAILURE",
  ADD_TEAM_PROPERTIES_PROPERTY: "ADD_TEAM_PROPERTIES_PROPERTY",
  DELETE_TEAM_PROPERTIES_PROPERTY: "DELETE_TEAM_PROPERTIES_PROPERTY",
  UPDATE_TEAM_PROPERTIES_PROPERTY: "UPDATE_TEAM_PROPERTIES_PROPERTY"
};

//initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.RESET_TEAM_PROPERTIES]: () => {
    return { ...initialState };
  },
  [types.FETCH_TEAM_PROPERTIES_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_TEAM_PROPERTIES_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_TEAM_PROPERTIES_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  },
  [types.ADD_TEAM_PROPERTIES_PROPERTY]: (state, action) => {
    return update(state, { data: { $push: [action.property] } });
  },
  [types.DELETE_TEAM_PROPERTIES_PROPERTY]: (state, action) => {
    let propertyIndex;
    state.data.forEach((property, index) => {
      if (property.id === action.propertyId) {
        propertyIndex = index;
      }
    });
    return update(state, { data: { $splice: [[propertyIndex, 1]] } });
  },
  [types.UPDATE_TEAM_PROPERTIES_PROPERTY]: (state, action) => {
    let propertyIndex;
    state.data.forEach((property, index) => {
      if (property.id === action.property.id) {
        propertyIndex = index;
      }
    });
    return update(state, { data: { [propertyIndex]: { $set: action.property } } });
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the request generator boilerplate
*/
const reset = () => ({ type: types.RESET_TEAM_PROPERTIES });
const fetchTeamPropertiesRequest = () => ({ type: types.FETCH_TEAM_PROPERTIES_REQUEST });
const fetchTeamPropertiesSuccess = data => ({ type: types.FETCH_TEAM_PROPERTIES_SUCCESS, data });
const fetchTeamPropertiesFailure = error => ({ type: types.FETCH_TEAM_PROPERTIES_FAILURE, error });

const fetchTeamPropertiesActionCreators = {
  reset,
  request: fetchTeamPropertiesRequest,
  success: fetchTeamPropertiesSuccess,
  failure: fetchTeamPropertiesFailure
};

// fetchTeamProperties api call
const fetchTeamPropertiesApi = requestGenerator(fetchTeamPropertiesActionCreators);

const fetch = url => dispatch => dispatch(fetchTeamPropertiesApi.request({ method: "get", url }));

const cancelFetchTeamProperties = () => dispatch => dispatch(fetchTeamPropertiesApi.cancelRequest());

// other actions
const addTeamProperty = property => ({ type: types.ADD_TEAM_PROPERTIES_PROPERTY, property });
const deleteTeamProperty = propertyId => ({ type: types.DELETE_TEAM_PROPERTIES_PROPERTY, propertyId });
const updateTeamProperty = property => ({ type: types.UPDATE_TEAM_PROPERTIES_PROPERTY, property });

//actions
export const actions = {
  reset,
  fetchTeamPropertiesRequest,
  fetchTeamPropertiesSuccess,
  fetchTeamPropertiesFailure,
  fetch,
  cancelFetchTeamProperties,
  addTeamProperty,
  deleteTeamProperty,
  updateTeamProperty
};
