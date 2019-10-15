import always from "./assets/backChevron.svg";
import failure from "./assets/failure.svg";
import success from "./assets/success.svg";

export const EXECUTION_STATES = {
  SUCCESS: "success",
  FAILURE: "failure",
  ALWAYS: "always"
};

export const EXECUTION_CONDITIONS = [
  {
    text: "Run on success",
    img: success,
    condition: EXECUTION_STATES.SUCCESS
  },
  {
    text: "Run on failure",
    img: failure,
    condition: EXECUTION_STATES.FAILURE
  },
  {
    text: "Always run",
    img: always,
    condition: EXECUTION_STATES.ALWAYS
  }
];
