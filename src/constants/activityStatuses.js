import succeededIcon from "Assets/icons/passed.svg";
import failedIcon from "Assets/icons/failed.svg";
import inProgressIcon from "Assets/icons/in-progress.svg";
import pendingIcon from "Assets/icons/pending.svg";
import invalidIcon from "Assets/icons/invalid.svg";

export const ACTIVITY_STATUSES = {
  COMPLETED: "completed",
  FAILURE: "failure",
  IN_PROGRESS: "inProgress",
  NOT_STARTED: "notstarted",
  INVALID: "invalid",
  SKIPPED: "skipped"
};

export const ACTIVITY_STATUSES_TO_TEXT = {
  [ACTIVITY_STATUSES.COMPLETED]: "Succeeded",
  [ACTIVITY_STATUSES.FAILURE]: "Failed",
  [ACTIVITY_STATUSES.IN_PROGRESS]: "In Progress",
  [ACTIVITY_STATUSES.NOT_STARTED]: "Not Started",
  [ACTIVITY_STATUSES.INVALID]: "Invalid",
  [ACTIVITY_STATUSES.SKIPPED]: "Skipped"
};

export const ACTIVITY_STATUSES_TO_ICON = {
  [ACTIVITY_STATUSES.COMPLETED]: succeededIcon,
  [ACTIVITY_STATUSES.FAILURE]: failedIcon,
  [ACTIVITY_STATUSES.IN_PROGRESS]: inProgressIcon,
  [ACTIVITY_STATUSES.NOT_STARTED]: pendingIcon,
  [ACTIVITY_STATUSES.INVALID]: invalidIcon
};
