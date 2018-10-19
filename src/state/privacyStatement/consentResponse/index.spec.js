import { default as consentResponseReducer, types as actionTypes } from "./index";

describe("REDUCER --- consentResponseReducer", () => {
  const getInitialState = () => {
    return {
      isSending: false,
      data: [],
      status: "",
      error: ""
    };
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(consentResponseReducer(undefined, action)).toEqual(expected);
  });

  it("should handle SEND_CONSENT_RESPONSE_REQUEST", () => {
    const action = { type: actionTypes.SEND_CONSENT_RESPONSE_REQUEST };
    const expected = Object.assign(getInitialState(), { isSending: true });

    expect(consentResponseReducer(getInitialState(), action)).toEqual(expected);
  });

  it("should handle SEND_CONSENT_RESPONSE_SUCCESS", () => {
    const action = { type: actionTypes.SEND_CONSENT_RESPONSE_SUCCESS };
    const expected = Object.assign(getInitialState(), { isSending: false, status: "success" });

    expect(consentResponseReducer(getInitialState(), action)).toEqual(expected);
  });

  it("should handle SEND_CONSENT_RESPONSE_FAILURE", () => {
    const action = { type: actionTypes.SEND_CONSENT_RESPONSE_FAILURE };
    const expected = Object.assign(getInitialState(), { isSending: false, error: action.error });

    expect(consentResponseReducer(getInitialState(), action)).toEqual(expected);
  });
});
