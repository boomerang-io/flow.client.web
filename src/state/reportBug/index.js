/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

//action types
export const types = {
  RESET_REPORT_BUG: "RESET_REPORT_BUG",
  POST_REPORT_BUG_REQUEST: "POST_REPORT_BUG_REQUEST",
  POST_REPORT_BUG_SUCCESS: "POST_REPORT_BUG_SUCCESS",
  POST_REPORT_BUG_FAILURE: "POST_REPORT_BUG_FAILURE",
  POST_REPORT_BUG_ATTACHMENT_REQUEST: "POST_REPORT_BUG_ATTACHMENT_REQUEST",
  POST_REPORT_BUG_ATTACHMENT_SUCCESS: "POST_REPORT_BUG_ATTACHMENT_SUCCESS",
  POST_REPORT_BUG_ATTACHMENT_FAILURE: "POST_REPORT_BUG_ATTACHMENT_FAILURE"
};

//initial state
export const initialState = {
  isPosting: false,
  isPostingAttachment: false,
  status: "",
  error: "",
  issueData: {}
};

//reducer action handlers
const actionHandlers = {
  RESET_REPORT_BUG: () => {
    return { ...initialState };
  },
  POST_REPORT_BUG_REQUEST: state => {
    return { ...state, isPosting: true };
  },
  POST_REPORT_BUG_SUCCESS: (state, action) => {
    return { ...state, isPosting: false, status: "success", issueData: action.data };
  },
  POST_REPORT_BUG_FAILURE: (state, action) => {
    return { ...state, isPosting: false, status: "failure", error: action.error };
  },
  POST_REPORT_BUG_ATTACHMENT_REQUEST: state => {
    return { ...state, isPostingAttachment: true };
  },
  POST_REPORT_BUG_ATTACHMENT_SUCCESS: state => {
    return { ...state, isPostingAttachment: false, status: "success" };
  },
  POST_REPORT_BUG_ATTACHMENT_FAILURE: (state, action) => {
    return { ...state, isPostingAttachment: false, status: "failure", error: action.error };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the request generator boilerplate
*/
const resetReportBug = () => ({ type: types.RESET_REPORT_BUG });
const postReportBugRequest = () => ({ type: types.POST_REPORT_BUG_REQUEST });
const postReportBugSuccess = data => ({ type: types.POST_REPORT_BUG_SUCCESS, data });
const postReportBugFailure = error => ({ type: types.POST_REPORT_BUG_FAILURE, error });
const postReportBugAttachmentRequest = () => ({ type: types.POST_REPORT_BUG_ATTACHMENT_REQUEST });
const postReportBugAttachmentSuccess = () => ({ type: types.POST_REPORT_BUG_ATTACHMENT_SUCCESS });
const postReportBugAttachmentFailure = error => ({ type: types.POST_REPORT_BUG_ATTACHMENT_FAILURE, error });

const reportBugActionCreators = {
  reset: resetReportBug,
  request: postReportBugRequest,
  success: postReportBugSuccess,
  failure: postReportBugFailure
};

const reportBugAttachmentActionCreators = {
  reset: resetReportBug,
  request: postReportBugAttachmentRequest,
  success: postReportBugAttachmentSuccess,
  failure: postReportBugAttachmentFailure
};

//Report Bug api call
const postReportBugApi = requestGenerator(reportBugActionCreators);

const postReportBug = (url, body) => dispatch =>
  dispatch(postReportBugApi.request({ method: "post", data: body, url }));

const cancelPostReportBug = () => dispatch => dispatch(postReportBugApi.cancelRequest());

//Report Bug Attachment api call
const postReportBugAttachmentApi = requestGenerator(reportBugAttachmentActionCreators);

const postReportBugAttachment = (url, body) => dispatch =>
  dispatch(
    postReportBugAttachmentApi.request({
      method: "post",
      data: body,
      url,
      headers: { "content-type": "multipart/form-data" }
    })
  );

const cancelPostReportBugAttachment = () => dispatch => dispatch(postReportBugAttachmentApi.cancelRequest());

const createBugAndAttachment = (BASE_SERVICE_URL, BUG_PATH, bugBody, ATTACHMENT_PATH, attachmentBody) => {
  // Thunk injects a second argument called getState() that lets us read the current state.
  return (dispatch, getState) => {
    return dispatch(postReportBug(`${BASE_SERVICE_URL}${BUG_PATH}`, bugBody)).then(() => {
      if (Object.is(attachmentBody.FormData, undefined)) {
        dispatch(actions.postReportBugSuccess(getState().reportBug));
      } else {
        const { key } = getState().reportBug.issueData;
        return dispatch(
          postReportBugAttachment(`${BASE_SERVICE_URL}${ATTACHMENT_PATH}/${key}/attachments`, attachmentBody)
        );
      }
    });
  };
};

//actions
export const actions = {
  resetReportBug,
  postReportBugRequest,
  postReportBugSuccess,
  postReportBugFailure,
  postReportBugAttachmentRequest,
  postReportBugAttachmentSuccess,
  postReportBugAttachmentFailure,
  postReportBug,
  cancelPostReportBug,
  postReportBugAttachment,
  cancelPostReportBugAttachment,
  createBugAndAttachment
};
