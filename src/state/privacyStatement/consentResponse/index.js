/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

//action types
export const types = {
  RESET_SEND_CONSENT_RESPONSE: "RESET_SEND_CONSENT_RESPONSE",
  SEND_CONSENT_RESPONSE_REQUEST: "SEND_CONSENT_RESPONSE_REQUEST",
  SEND_CONSENT_RESPONSE_SUCCESS: "SEND_CONSENT_RESPONSE_SUCCESS",
  SEND_CONSENT_RESPONSE_FAILURE: "SEND_CONSENT_RESPONSE_FAILURE"
};

//initial state
export const initialState = {
  isSending: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.RESET_SEND_CONSENT_RESPONSE]: () => {
    return { ...initialState };
  },
  [types.SEND_CONSENT_RESPONSE_REQUEST]: state => {
    return { ...state, isSending: true };
  },
  [types.SEND_CONSENT_RESPONSE_SUCCESS]: (state, action) => {
    return { ...initialState, isSending: false, status: "success" };
  },
  [types.SEND_CONSENT_RESPONSE_FAILURE]: (state, action) => {
    return { ...initialState, isSending: false, error: action.error };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the request generator boilerplate
*/
const resetSendConsentResponse = () => ({ type: types.RESET_SEND_CONSENT_RESPONSE });
const sendConsentResponseRequest = () => ({ type: types.SEND_CONSENT_RESPONSE_REQUEST });
const sendConsentResponseSuccess = data => ({ type: types.SEND_CONSENT_RESPONSE_SUCCESS, data });
const sendConsentResponseFailure = error => ({ type: types.SEND_CONSENT_RESPONSE_FAILURE, error });

const sendConsentResponseActionCreators = {
  reset: resetSendConsentResponse,
  request: sendConsentResponseRequest,
  success: sendConsentResponseSuccess,
  failure: sendConsentResponseFailure
};

const sendConsentResponseApi = requestGenerator(sendConsentResponseActionCreators);

const sendConsentResponse = (url, sendConsentResponseData) => dispatch =>
  dispatch(sendConsentResponseApi.request({ method: "put", url, data: sendConsentResponseData }));

const cancelSendConsentResponse = () => dispatch => dispatch(sendConsentResponseApi.cancelRequest());

//actions
export const actions = {
  resetSendConsentResponse,
  sendConsentResponseRequest,
  sendConsentResponseSuccess,
  sendConsentResponseFailure,
  cancelSendConsentResponse,
  sendConsentResponse
};
