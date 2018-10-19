/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

//action types
export const types = {
  RESET_FETCH_CONSENT_FORM: "RESET_FETCH_CONSENT_FORM",
  FETCH_CONSENT_FORM_REQUEST: "FETCH_CONSENT_FORM_REQUEST",
  FETCH_CONSENT_FORM_SUCCESS: "FETCH_CONSENT_FORM_SUCCESS",
  FETCH_CONSENT_FORM_FAILURE: "FETCH_CONSENT_FORM_FAILURE"
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
  [types.RESET_FETCH_CONSENT_FORM]: () => {
    return { ...initialState };
  },
  [types.FETCH_CONSENT_FORM_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_CONSENT_FORM_SUCCESS]: (state, action) => {
    return { ...initialState, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_CONSENT_FORM_FAILURE]: (state, action) => {
    return { ...initialState, isFetching: false, error: action.error };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the request generator boilerplate
*/
const resetFetchConsentForm = () => ({ type: types.RESET_FETCH_CONSENT_FORM });
const fetchConsentFormRequest = () => ({ type: types.FETCH_CONSENT_FORM_REQUEST });
const fetchConsentFormSuccess = data => ({ type: types.FETCH_CONSENT_FORM_SUCCESS, data });
const fetchConsentFormFailure = error => ({ type: types.FETCH_CONSENT_FORM_FAILURE, error });

const fetchConsentFormActionCreators = {
  reset: resetFetchConsentForm,
  request: fetchConsentFormRequest,
  success: fetchConsentFormSuccess,
  failure: fetchConsentFormFailure
};

const fetchConsentFormApi = requestGenerator(fetchConsentFormActionCreators);

const fetchConsentForm = url => dispatch => dispatch(fetchConsentFormApi.request({ method: "get", url }));

const cancelFetchConsentForm = () => dispatch => dispatch(fetchConsentFormApi.cancelRequest());

//actions
export const actions = {
  resetFetchConsentForm,
  fetchConsentFormRequest,
  fetchConsentFormSuccess,
  fetchConsentFormFailure,
  fetchConsentForm,
  cancelFetchConsentForm
};
