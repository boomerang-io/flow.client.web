export const EXECUTION_STATES = {
  SUCCESS: "success",
  FAILURE: "failure",
  ALWAYS: "always"
};

export const EXECUTION_CONDITIONS = [
  {
    text: "Run on success",
    img: "success",
    style: { backgroundColor: "green" },
    condition: EXECUTION_STATES.SUCCESS
  },
  {
    text: "Run on failure",
    img: "failure",
    style: { backgroundColor: "red" },
    condition: EXECUTION_STATES.FAILURE
  },
  {
    text: "Always run",
    img: "always",
    style: { backgroundColor: "gray" },
    condition: EXECUTION_STATES.ALWAYS
  }
];
