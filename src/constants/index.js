export const ExecutionStatus = {
  Completed: "completed",
  Failure: "failure",
  InProgress: "inProgress",
  NotStarted: "notstarted",
  Skipped: "skipped",
  Invalid: "invalid",
};

export const NodeType = {
  CustomTask: "customTask",
  Decision: "decision",
  TemplateTask: "templateTask",
  StartEnd: "startend",
  Task: "task",
};

export const QueryStatus = {
  Idle: "idle",
  Loading: "loading",
  Error: "error",
  Success: "success",
};

export const TaskTemplateStatus = {
  Active: "active",
  Inactive: "inactive",
  Archived: "archived",
};

export const UserType = {
  Admin: "admin",
  Operator: "operator",
  User: "user",
};
