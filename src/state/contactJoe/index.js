/* eslint-disable no-console*/
import axios from "axios";

//action types
export const types = {
  RESET_CONTACT_JOE: "RESET_CONTACT_JOE",
  POST_CONTACT_JOE_REQUEST: "POST_CONTACT_JOE_REQUEST",
  POST_CONTACT_JOE_SUCCESS: "POST_CONTACT_JOE_SUCCESS",
  POST_CONTACT_JOE_FAILURE: "POST_CONTACT_JOE_FAILURE"
};

//initial state
export const initialState = {
  isPosting: false,
  status: "",
  error: "",
  data: []
};

//reducer exported by default
export default (state = initialState, action) => {
  // if current state is empty it will default to initialstate defined.
  switch (action.type) {
    case types.RESET_CONTACT_JOE:
      return { ...initialState };
    case types.POST_CONTACT_JOE_REQUEST:
      return { ...state, isPosting: true };
    case types.POST_CONTACT_JOE_SUCCESS:
      return {
        ...state,
        isPosting: false,
        status: "success",
        data: action.data
      };
    case types.POST_CONTACT_JOE_FAILURE:
      return {
        ...state,
        isPosting: false,
        error: action.error,
        status: "failure"
      };

    default:
      return state;
  }
};

//REST api call
const postContactJoe = (url, body) => {
  return dispatch => {
    dispatch(actions.postContactJoeRequest());
    return axios({
      method: "post",
      data: body,
      url,
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      withCredentials: true,
      credentials: "same-origin"
    })
      .then(response => {
        if (response.status !== 200) {
          console.log("Looks like there was a problem. Status Code: " + response.status);
          return dispatch(actions.postContactJoeFailure(response.status));
        }

        // Send the response to the form
        return dispatch(actions.postContactJoeSuccess(response.data));
      })
      .catch(error => {
        console.log("AXIOS error :-S", error);
        if (axios.isCancel(error)) {
          return console.log(error.message);
        } else {
          return dispatch(actions.postContactJoeFailure(error));
        }
      });
  };
};

//actions
export const actions = {
  resetContactJoe: () => ({ type: types.RESET_CONTACT_JOE }),
  postContactJoeRequest: () => ({ type: types.POST_CONTACT_JOE_REQUEST }),
  postContactJoeSuccess: data => ({
    type: types.POST_CONTACT_JOE_SUCCESS,
    data
  }),
  postContactJoeFailure: error => ({
    type: types.POST_CONTACT_JOE_FAILURE,
    error
  }),
  postContactJoe
};
