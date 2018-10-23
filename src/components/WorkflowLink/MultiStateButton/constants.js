import grayCircle from "./assets/gray-circle.svg";
import redDelete from "./assets/red-delete.svg";
import greenCheck from "./assets/green-check.svg";

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
