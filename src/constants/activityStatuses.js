import succeededIcon from "Assets/icons/passed.svg";
import failedIcon from "Assets/icons/failed.svg";
import inProgressIcon from "Assets/icons/in-progress.svg";
import pendingIcon from "Assets/icons/pending.svg";

export const ACTIVITY_STATUSES = {
  COMPLETED: "completed",
  FAILURE: "failure",
  IN_PROGRESS: "inProgress",
  NOT_STARTED: "notstarted"
};

export const ACTIVITY_STATUSES_TO_TEXT = {
  [ACTIVITY_STATUSES.COMPLETED]: "Succeeded",
  [ACTIVITY_STATUSES.FAILURE]: "Failed",
  [ACTIVITY_STATUSES.IN_PROGRESS]: "In Progress",
  [ACTIVITY_STATUSES.NOT_STARTED]: "Not Started"
};

export const ACTIVITY_STATUSES_TO_ICON = {
  [ACTIVITY_STATUSES.COMPLETED]: succeededIcon,
  [ACTIVITY_STATUSES.FAILURE]: failedIcon,
  [ACTIVITY_STATUSES.IN_PROGRESS]: inProgressIcon,
  [ACTIVITY_STATUSES.NOT_STARTED]: pendingIcon
};
