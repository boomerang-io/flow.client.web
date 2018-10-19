import { default as reportBugReducer, types as actionTypes } from "./index";

describe("REDUCER --- reportBugReducer", () => {
  const getInitialState = () => {
    return {
      error: "",
      isPosting: false,
      isPostingAttachment: false,
      issueData: {},
      status: ""
    };
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reportBugReducer(undefined, action)).toEqual(expected);
  });

  it("should handle POST_REPORT_BUG_SUCCESS", () => {
    const action = { type: actionTypes.POST_REPORT_BUG_SUCCESS };
    const expected = Object.assign(getInitialState(), { isPosting: false, status: "success", issueData: undefined });

    expect(reportBugReducer(getInitialState(), action)).toEqual(expected);
  });
});
