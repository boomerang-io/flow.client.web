import { default as contactJoeReducer, types as actionTypes, actions } from "./index";

describe("REDUCER --- contactJoeReducer", () => {
  const getInitialState = () => {
    return {
      isPosting: false,
      status: "",
      error: "",
      data: []
    };
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(contactJoeReducer(undefined, action)).toEqual(expected);
  });

  it("should handle POST_CONTACT_JOE_REQUEST", () => {
    const action = { type: actionTypes.POST_CONTACT_JOE_REQUEST };
    const expected = Object.assign(getInitialState(), { isPosting: true });

    expect(contactJoeReducer(getInitialState(), action)).toEqual(expected);
  });

  it("should handle POST_CONTACT_JOE_SUCCESS", () => {
    const data = [];
    const action = { type: actionTypes.POST_CONTACT_JOE_SUCCESS, data };
    const expected = Object.assign(getInitialState(), { isPosting: false, status: "success", data });
    const newState = contactJoeReducer(getInitialState(), action);

    expect(newState).toEqual(expected);
  });
});
