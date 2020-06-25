import AlwaysIcon from "Assets/workflowLinkIcons/AlwaysIcon";
import FailureIcon from "Assets/workflowLinkIcons/FailureIcon";
import SuccessIcon from "Assets/workflowLinkIcons/SuccessIcon";

export const ExecutionState = {
  Success: "success",
  Failure: "failure",
  Always: "always",
};

export const EXECUTION_CONDITIONS = [
  {
    Icon: SuccessIcon,
    name: ExecutionState.Success,
  },
  {
    Icon: FailureIcon,
    name: ExecutionState.Failure,
  },
  {
    Icon: AlwaysIcon,
    name: ExecutionState.Always,
  },
];
