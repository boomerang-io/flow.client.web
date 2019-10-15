/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";
import { REQUEST_STATUSES } from "Config/servicesConfig";

// Action types
export const types = {
  WORKFLOW_RESET: "WORKFLOW_RESET",
  FETCH_WORKFLOW_REQUEST: "FETCH_WORKFLOW_REQUEST",
  FETCH_WORKFLOW_SUCCESS: "FETCH_WORKFLOW_SUCCESS",
  FETCH_WORKFLOW_FAILURE: "FETCH_WORKFLOW_FAILURE",
  UPDATE_WORKFLOW_SUCCESS: "UPDATE_WORKFLOW_SUCCESS",
  UPDATE_WORKFLOW_FAILURE: "UPDATE_WORKFLOW_FAILURE",
  UPDATE_WORKFLOW_REQUEST: "UPDATE_WORKFLOW_REQUEST",
  CREATE_WORKFLOW_SUCCESS: "CREATE_WORKFLOW_SUCCESS",
  CREATE_WORKFLOW_FAILURE: "CREATE_WORKFLOW_FAILURE",
  CREATE_WORKFLOW_REQUEST: "CREATE_WORKFLOW_REQUEST",
  UPDATE_WORKFLOW_PROPERTY: "UPDATE_WORKFLOW_PROPERTY",
  UPDATE_WORKFLOW_TRIGGERS_WEBHOOK: "UPDATE_WORKFLOW_TRIGGERS_WEBHOOK",
  UPDATE_WORKFLOW_TRIGGERS_EVENT: "UPDATE_WORKFLOW_TRIGGERS_EVENT",
  UPDATE_WORKFLOW_TRIGGERS_SCHEDULER: "UPDATE_WORKFLOW_TRIGGERS_SCHEDULER",
  CREATE_WORKFLOW_INPUT: "CREATE_WORKFLOW_INPUT",
  UPDATE_WORKFLOW_INPUT: "UPDATE_WORKFLOW_INPUT",
  DELETE_WORKFLOW_INPUT: "DELETE_WORKFLOW_INPUT"
};
Object.freeze(types);

//initial state
export const initialState = {
  isFetching: false,
  isUpdating: false,
  isCreating: false,
  fetchingStatus: "",
  updatingStatus: "",
  creatingStatus: "",
  error: "",
  data: {
    triggers: {
      scheduler: {
        enable: false,
        schedule: "",
        timezone: ""
      },
      webhook: {
        enable: false,
        token: ""
      },
      event: {
        enable: false,
        topic: ""
        //enableACCIntegration: false
      }
    },
    enablePersistentStorage: false,
    enableACCIntegration: false,
    properties: []
  }
};

//action handlers
const actionHandlers = {
  [types.WORKFLOW_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_WORKFLOW_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_WORKFLOW_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, fetchingStatus: REQUEST_STATUSES.SUCCESS, data: action.data };
  },
  [types.FETCH_WORKFLOW_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, fetchingStatus: REQUEST_STATUSES.FAILURE, error: action.error };
  },
  [types.UPDATE_WORKFLOW_SUCCESS]: state => ({
    ...state,
    isUpdating: false,
    updatingStatus: REQUEST_STATUSES.SUCCESS
  }),
  [types.UPDATE_WORKFLOW_FAILURE]: (state, action) => ({
    ...state,
    isUpdating: false,
    updatingStatus: REQUEST_STATUSES.FAILURE,
    error: action.error
  }),
  [types.UPDATE_WORKFLOW_REQUEST]: state => ({
    ...state,
    isUpdating: true,
    updatingStatus: ""
  }),
  [types.CREATE_WORKFLOW_SUCCESS]: (state, action) => ({
    ...state,
    isCreating: false,
    updatingStatus: REQUEST_STATUSES.SUCCESS,
    data: action.data
  }),
  [types.CREATE_WORKFLOW_FAILURE]: (state, action) => ({
    ...state,
    isCreating: false,
    updatingStatus: REQUEST_STATUSES.FAILURE,
    error: action.error
  }),
  [types.CREATE_WORKFLOW_REQUEST]: state => ({ ...state, isCreating: true, creatingStatus: "" }),
  [types.UPDATE_WORKFLOW_PROPERTY]: (state, action) => {
    return { ...state, data: { ...state.data, [action.data.key]: action.data.value } };
  },
  [types.UPDATE_WORKFLOW_TRIGGERS_WEBHOOK]: (state, action) => {
    let { triggers } = state.data;
    let { webhook } = triggers;
    const newWebhook = { ...webhook, [action.data.key]: action.data.value };
    const newTriggers = { ...triggers, webhook: newWebhook };
    return { ...state, data: { ...state.data, triggers: newTriggers } };
  },
  [types.UPDATE_WORKFLOW_TRIGGERS_EVENT]: (state, action) => {
    let { triggers } = state.data;
    let { event } = triggers;
    const newEvent = { ...event, [action.data.key]: action.data.value };
    const newTriggers = { ...triggers, event: newEvent };
    return { ...state, data: { ...state.data, triggers: newTriggers } };
  },
  [types.UPDATE_WORKFLOW_TRIGGERS_SCHEDULER]: (state, action) => {
    let { triggers } = state.data;
    let { scheduler } = triggers;
    const newScheduler = { ...scheduler, [action.data.key]: action.data.value };
    const newTriggers = { ...triggers, scheduler: newScheduler };
    return { ...state, data: { ...state.data, triggers: newTriggers } };
  },
  [types.CREATE_WORKFLOW_INPUT]: (state, action) => {
    const { properties } = state.data;
    const newProperties = [...properties, action.data];
    return { ...state, data: { ...state.data, properties: newProperties } };
  },
  [types.UPDATE_WORKFLOW_INPUT]: (state, action) => {
    // Replace matching input
    const properties = state.data.properties.map(input => (input.key === action.data.key ? action.data : input));
    const newProperties = [...properties];
    return { ...state, data: { ...state.data, properties: newProperties } };
  },
  [types.DELETE_WORKFLOW_INPUT]: (state, action) => {
    // Remove matching input
    const properties = state.data.properties.filter(input => input.key !== action.data.key);
    const newProperties = [...properties];
    return { ...state, data: { ...state.data, properties: newProperties } };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const reset = () => ({ type: types.WORKFLOW_RESET });
const fetchRequest = () => ({ type: types.FETCH_WORKFLOW_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_WORKFLOW_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_WORKFLOW_FAILURE, error });
const updateRequest = () => ({ type: types.UPDATE_WORKFLOW_REQUEST });
const updateSuccess = () => ({ type: types.UPDATE_WORKFLOW_SUCCESS });
const updateFailure = error => ({ type: types.UPDATE_WORKFLOW_FAILURE, error });
const createRequest = () => ({ type: types.CREATE_WORKFLOW_REQUEST });
const createSuccess = data => ({ type: types.CREATE_WORKFLOW_SUCCESS, data });
const createFailure = error => ({ type: types.CREATE_WORKFLOW_FAILURE, error });
const updateProperty = data => ({ type: types.UPDATE_WORKFLOW_PROPERTY, data });
const updateTriggersWebhook = data => ({ type: types.UPDATE_WORKFLOW_TRIGGERS_WEBHOOK, data });
const updateTriggersEvent = data => ({ type: types.UPDATE_WORKFLOW_TRIGGERS_EVENT, data });
const updateTriggersScheduler = data => ({ type: types.UPDATE_WORKFLOW_TRIGGERS_SCHEDULER, data });
const createWorkflowInput = data => ({ type: types.CREATE_WORKFLOW_INPUT, data });
const updateWorkflowInput = data => ({ type: types.UPDATE_WORKFLOW_INPUT, data });
const deleteWorkflowInput = data => ({ type: types.DELETE_WORKFLOW_INPUT, data });

const fetchActionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

const fetchApi = requestGenerator(fetchActionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancelFetch = () => dispatch => dispatch(fetchApi.cancelRequest());

const updateActionCreators = {
  reset: reset,
  request: updateRequest,
  success: updateSuccess,
  failure: updateFailure
};

const updateApi = requestGenerator(updateActionCreators);
const update = (url, data) => dispatch => dispatch(updateApi.request({ method: "patch", url, data }));
const cancelUpdate = () => dispatch => dispatch(updateApi.cancelRequest());

const createActionCreators = {
  reset: reset,
  request: createRequest,
  success: createSuccess,
  failure: createFailure
};

const createApi = requestGenerator(createActionCreators);
const create = (url, data) => dispatch => dispatch(createApi.request({ method: "post", url, data }));
const cancelCreate = () => dispatch => dispatch(createApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  reset,
  fetch,
  fetchRequest,
  fetchFailure,
  fetchSuccess,
  cancelFetch,
  update,
  updateRequest,
  updateFailure,
  updateSuccess,
  cancelUpdate,
  create,
  createRequest,
  createFailure,
  createSuccess,
  cancelCreate,
  updateProperty,
  updateTriggersWebhook,
  updateTriggersEvent,
  updateTriggersScheduler,
  createWorkflowInput,
  updateWorkflowInput,
  deleteWorkflowInput
};
