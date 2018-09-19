/* eslint-disable no-console*/
import axios from 'axios';

// Action types
export const types = {
  RESET_POSTS: 'RESET_POSTS',
  FETCH_POSTS_REQUEST: 'FETCH_POSTS_REQUEST',
  FETCH_POSTS_SUCCESS: 'FETCH_POSTS_SUCCESS',
  FETCH_POSTS_FAILURE: 'FETCH_POSTS_FAILURE',
};
Object.freeze(types);

// Initial state
export const initialState = {
  isFetching: false,
  status: '',
  error: '',
  data: [],
};

// Reducer exported by default
export default (state = initialState, action) => {
  switch (action.type) {
    case types.RESET_POSTS:
      return { ...initialState };
    case types.FETCH_POSTS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_POSTS_SUCCESS:
      return {
        ...initialState,
        status: 'success',
        isFetching: false,
        data: action.data,
      };
    case types.FETCH_POSTS_FAILURE:
      return {
        ...initialState,
        status: 'failure',
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};

// Thunks
// REST api call
// Token to cancel requests
const CancelToken = axios.CancelToken;
let cancel;

//REST api call
const fetchPosts = url => {
  return dispatch => {
    dispatch(actions.fetchPostsRequest());
    return axios
      .get(url, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then(response => {
        // Send the response to the form
        dispatch(actions.fetchPostsSuccess(response.data));
        return;
      })
      .catch(error => {
        console.log('AXIOS erroror :-S', error);
        if (axios.isCancel(error)) {
          console.log(error.message);
          return;
        } else {
          dispatch(actions.fetchPostsFailure(error));
          return;
        }
      });
  };
};

//thunk to cancel outstanding requests
const cancelFetchPosts = () => {
  return dispatch => {
    //cancel is not assigned to a function if only mock requests are made
    if (typeof cancel === 'function') {
      console.log('cancelFetchPosts');
      cancel('Request Cancelled');
    }
    dispatch(actions.resetPosts());
  };
};

// Actions
export const actions = {
  resetPosts: () => ({ type: types.RESET_POSTS }),

  fetchPostsRequest: () => ({ type: types.FETCH_POSTS_REQUEST }),
  fetchPostsSuccess: data => ({ type: types.FETCH_POSTS_SUCCESS, data }),
  fetchPostsFailure: error => ({ type: types.FETCH_POSTS_FAILURE, error }),
  fetchPosts,
  cancelFetchPosts,
};
