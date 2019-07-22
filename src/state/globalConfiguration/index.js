/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";
import update from "immutability-helper";

//action types
export const types = {
  RESET_GLOBAL_CONFIGURATION: "RESET_GLOBAL_CONFIGURATION",
  FETCH_GLOBAL_CONFIGURATION_REQUEST: "FETCH_GLOBAL_CONFIGURATION_REQUEST",
  FETCH_GLOBAL_CONFIGURATION_SUCCESS: "FETCH_GLOBAL_CONFIGURATION_SUCCESS",
  FETCH_GLOBAL_CONFIGURATION_FAILURE: "FETCH_GLOBAL_CONFIGURATION_FAILURE",
  ADD_GLOBAL_CONFIGURATION_PROPERTY: "ADD_GLOBAL_CONFIGURATION_PROPERTY",
  DELETE_GLOBAL_CONFIGURATION_PROPERTY: "DELETE_GLOBAL_CONFIGURATION_PROPERTY",
  UPDATE_GLOBAL_CONFIGURATION_PROPERTY: "UPDATE_GLOBAL_CONFIGURATION_PROPERTY"
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
  [types.RESET_GLOBAL_CONFIGURATION]: () => {
    return { ...initialState };
  },
  [types.FETCH_GLOBAL_CONFIGURATION_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_GLOBAL_CONFIGURATION_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_GLOBAL_CONFIGURATION_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  },
  [types.ADD_GLOBAL_CONFIGURATION_PROPERTY]: (state, action) => {
    return update(state, { data: { $push: [action.property] } });
  },
  [types.DELETE_GLOBAL_CONFIGURATION_PROPERTY]: (state, action) => {
    let propertyIndex;
    state.data.forEach((property, index) => {
      if (property.id === action.propertyId) {
        propertyIndex = index;
      }
    });
    return update(state, { data: { $splice: [[propertyIndex, 1]] } });
  },
  [types.UPDATE_GLOBAL_CONFIGURATION_PROPERTY]: (state, action) => {
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
const reset = () => ({ type: types.RESET_GLOBAL_CONFIGURATION });
const fetchGlobalConfigurationRequest = () => ({ type: types.FETCH_GLOBAL_CONFIGURATION_REQUEST });
const fetchGlobalConfigurationSuccess = data => ({ type: types.FETCH_GLOBAL_CONFIGURATION_SUCCESS, data });
const fetchGlobalConfigurationFailure = error => ({ type: types.FETCH_GLOBAL_CONFIGURATION_FAILURE, error });

const fetchGlobalConfigurationActionCreators = {
  reset,
  request: fetchGlobalConfigurationRequest,
  success: fetchGlobalConfigurationSuccess,
  failure: fetchGlobalConfigurationFailure
};

// fetchGlobalConfiguration api call
const fetchGlobalConfigurationApi = requestGenerator(fetchGlobalConfigurationActionCreators);

const fetch = url => dispatch => dispatch(fetchGlobalConfigurationApi.request({ method: "get", url }));

const cancelFetchGlobalConfiguration = () => dispatch => dispatch(fetchGlobalConfigurationApi.cancelRequest());

// other actions
const addPropertyInStore = property => ({ type: types.ADD_GLOBAL_CONFIGURATION_PROPERTY, property });
const deletePropertyInStore = propertyId => ({ type: types.DELETE_GLOBAL_CONFIGURATION_PROPERTY, propertyId });
const updatePropertyInStore = property => ({ type: types.UPDATE_GLOBAL_CONFIGURATION_PROPERTY, property });

//actions
export const actions = {
  reset,
  fetchGlobalConfigurationRequest,
  fetchGlobalConfigurationSuccess,
  fetchGlobalConfigurationFailure,
  fetch,
  cancelFetchGlobalConfiguration,
  addPropertyInStore,
  deletePropertyInStore,
  updatePropertyInStore
};
