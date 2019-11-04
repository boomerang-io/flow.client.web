import AlwaysIcon from "Assets/workflowLinkIcons/AlwaysIcon";
import FailureIcon from "Assets/workflowLinkIcons/FailureIcon";
import SuccessIcon from "Assets/workflowLinkIcons/SuccessIcon";

export const EXECUTION_STATES = {
  SUCCESS: "success",
  FAILURE: "failure",
  ALWAYS: "always"
};

export const EXECUTION_CONDITIONS = [
  {
    Icon: SuccessIcon,
    name: EXECUTION_STATES.SUCCESS
  },
  {
    Icon: FailureIcon,
    name: EXECUTION_STATES.FAILURE
  },
  {
    Icon: AlwaysIcon,
    name: EXECUTION_STATES.ALWAYS
  }
];
