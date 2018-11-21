/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  GENERATE_WEBHOOK_RESET: "GENERATE_WEBHOOK_RESET",
  GENERATE_WEBHOOK_REQUEST: "GENERATE_WEBHOOK_REQUEST",
  GENERATE_WEBHOOK_SUCCESS: "GENERATE_WEBHOOK_SUCCESS",
  GENERATE_WEBHOOK_FAILURE: "GENERATE_WEBHOOK_FAILURE"
};
Object.freeze(types);

//initial state
export const initialState = {
  isGenerating: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.GENERATE_WEBHOOK_RESET]: () => {
    return { ...initialState };
  },
  [types.GENERATE_WEBHOOK_REQUEST]: state => {
    return { ...state, isGenerating: true };
  },
  [types.GENERATE_WEBHOOK_SUCCESS]: (state, action) => {
    return { ...state, isGenerating: false, status: "success", data: action.data };
  },
  [types.GENERATE_WEBHOOK_FAILURE]: (state, action) => {
    return { ...state, isGenerating: false, status: "failure", error: action.error };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

const reset = () => ({ type: types.GENERATE_WEBHOOK_RESET });
const generateRequest = () => ({ type: types.GENERATE_WEBHOOK_REQUEST });
const generateSuccess = data => ({ type: types.GENERATE_WEBHOOK_SUCCESS, data });
const generateFailure = error => ({ type: types.GENERATE_WEBHOOK_FAILURE, error });

const fetchActionCreators = {
  reset: reset,
  request: generateRequest,
  success: generateSuccess,
  failure: generateFailure
};

const fetchApi = requestGenerator(fetchActionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancel = () => dispatch => dispatch(fetchApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  fetch,
  generateRequest,
  generateFailure,
  generateSuccess,
  cancel,
  reset
};
