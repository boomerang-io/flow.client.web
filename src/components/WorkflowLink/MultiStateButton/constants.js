import grayCircle from "./assets/pending.svg";
import redDelete from "./assets/failure.svg";
import greenCheck from "./assets/success.svg";

export const EXECUTION_STATES = {
  SUCCESS: "success",
  FAILURE: "failure",
  ALWAYS: "always"
};

export const EXECUTION_CONDITIONS = [
  {
    text: "Run on success",
    img: greenCheck,
    condition: EXECUTION_STATES.SUCCESS
  },
  {
    text: "Run on failure",
    img: redDelete,
    condition: EXECUTION_STATES.FAILURE
  },
  {
    text: "Always run",
    img: grayCircle,
    condition: EXECUTION_STATES.ALWAYS
  }
];
