import { default as consentFormReducer, types as actionTypes } from "./index";

describe("REDUCER --- consentFormReducer", () => {
  const getInitialState = () => {
    return {
      isFetching: false,
      data: [],
      status: "",
      error: ""
    };
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(consentFormReducer(undefined, action)).toEqual(expected);
  });

  it("should handle FETCH_CONSENT_FORM_REQUEST", () => {
    const action = { type: actionTypes.FETCH_CONSENT_FORM_REQUEST };
    const expected = Object.assign(getInitialState(), { isFetching: true });

    expect(consentFormReducer(getInitialState(), action)).toEqual(expected);
  });

  it("should handle FETCH_CONSENT_FORM_SUCCESS", () => {
    const action = { type: actionTypes.FETCH_CONSENT_FORM_SUCCESS };
    const expected = Object.assign(getInitialState(), { isFetching: false, data: action.data, status: "success" });

    expect(consentFormReducer(getInitialState(), action)).toEqual(expected);
  });

  it("should handle FETCH_CONSENT_FORM_FAILURE", () => {
    const action = { type: actionTypes.FETCH_CONSENT_FORM_FAILURE };
    const expected = Object.assign(getInitialState(), { isFetching: false, error: action.error });

    expect(consentFormReducer(getInitialState(), action)).toEqual(expected);
  });
});
