import { CloseOutline32, CheckmarkOutline32, Error32, InProgress32, Timer32 } from "@carbon/icons-react";

/**
 * Primitve constants
 */
export const CREATED_DATE_FORMAT = "MMMM DD, YYYY";
export const PROPERTY_KEY_REGEX = /^[a-zA-Z_]([a-zA-Z0-9-_])*$/;

/**
 * Enums
 */
export const HttpMethod = {
  Post: "post",
  Put: "put",
  Patch: "patch",
  Delete: "delete",
  Get: "get",
};

export const ExecutionStatus = {
  Completed: "completed",
  Failure: "failure",
  InProgress: "inProgress",
  Invalid: "invalid",
  NotStarted: "notstarted",
  Skipped: "skipped",
  Waiting: "waiting",
};

export const ExecutionStatusCopy = {
  [ExecutionStatus.Completed]: "Succeeded",
  [ExecutionStatus.Failure]: "Failed",
  [ExecutionStatus.InProgress]: "In Progress",
  [ExecutionStatus.NotStarted]: "Not Started",
  [ExecutionStatus.Invalid]: "Invalid",
  [ExecutionStatus.Skipped]: "Skipped",
  [ExecutionStatus.Waiting]: "Waiting",
};

export const InputProperty = {
  DefaultValue: "defaultValue",
  Description: "description",
  HelperText: "helperText",
  Key: "key",
  Label: "label",
  Options: "options",
  Placeholder: "placeholder",
  ReadOnly: "readOnly",
  Required: "required",
  Type: "type",
  JsonPath: "jsonPath",
};

export const InputType = {
  Boolean: "boolean",
  Email: "email",
  Number: "number",
  Password: "password",
  Select: "select",
  TextArea: "textarea",
  Text: "text",
  TextEditor: "texteditor",
  TextEditorJs: "texteditor::javascript",
  TextEditorText: "texteditor::text",
  TextEditorShell: "texteditor::shell",
  TextEditorYaml: "texteditor::yaml",
  URL: "url",
};

export const InputTypeCopy = {
  [InputType.Boolean]: "Boolean",
  [InputType.Email]: "Email",
  [InputType.Number]: "Number",
  [InputType.Password]: "Password",
  [InputType.Select]: "Select",
  [InputType.TextArea]: "Text Area",
  [InputType.Text]: "Text",
  [InputType.URL]: "URL",
};

export const NodeType = {
  Approval: "approval",
  CustomTask: "customTask",
  Decision: "decision",
  Manual: "manual",
  SetProperty: "setwfproperty",
  StartEnd: "startend",
  Task: "task",
  TemplateTask: "templateTask",
  Wait: "eventwait",
  Acquirelock: "acquirelock",
  Releaselock: "releaselock",
  RunWorkflow: "runworkflow",
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

export const UserTypeCopy = {
  [UserType.Admin]: "Admin",
  [UserType.User]: "User",
};

export const WorkflowDagEngineMode = {
  Editor: "editor",
  Viewer: "viewer",
  Executor: "executor",
};

export const WorkflowPropertyUpdateType = {
  Create: "create",
  Update: "update",
  Delete: "delete",
};

export const SortDirection = {
  Asc: "ASC",
  Desc: "DESC",
};

export const UserRole = {
  Admin: "admin",
  Auditor: "auditor",
  Operator: "operator",
  Author: "author",
  User: "user",
};

export const UserRoleCopy = {
  [UserRole.Admin]: "Admin",
  [UserRole.Auditor]: "Auditor",
  [UserRole.Operator]: "Operator",
  [UserRole.Author]: "Author",
  [UserRole.User]: "User",
};

/**
 * Complex objects
 */
export const daysOfWeekCronList = [
  { labelText: "Monday", value: "monday", id: "monday", cron: "MON", cronNumber: ["1"], key: "monday" },
  { labelText: "Tuesday", value: "tuesday", id: "tuesday", cron: "TUE", cronNumber: ["2"], key: "tuesday" },
  { labelText: "Wednesday", value: "wednesday", id: "wednesday", cron: "WED", cronNumber: ["3"], key: "wednesday" },
  { labelText: "Thursday", value: "thursday", id: "thursday", cron: "THU", cronNumber: ["4"], key: "thursday" },
  { labelText: "Friday", value: "friday", id: "friday", cron: "FRI", cronNumber: ["5"], key: "friday" },
  { labelText: "Saturday", value: "saturday", id: "saturday", cron: "SAT", cronNumber: ["6"], key: "saturday" },
  { labelText: "Sunday", value: "sunday", id: "sunday", cron: "SUN", cronNumber: ["0", "7"], key: "sunday" },
];

export const executionStatusIcon = {
  [ExecutionStatus.Completed]: CheckmarkOutline32,
  [ExecutionStatus.Failure]: CloseOutline32,
  [ExecutionStatus.InProgress]: Timer32,
  [ExecutionStatus.NotStarted]: Timer32,
  [ExecutionStatus.Invalid]: Error32,
  [ExecutionStatus.Skipped]: Error32,
  [ExecutionStatus.Waiting]: InProgress32,
};

export const executionStatusList = [
  ExecutionStatus.InProgress,
  ExecutionStatus.Completed,
  ExecutionStatus.Failure,
  ExecutionStatus.Invalid,
  ExecutionStatus.Waiting,
];

export const ApprovalStatus = {
  Approved: "approved",
  Rejected: "rejected",
  Submitted: "submitted",
};

export const allowedUserRoles = [UserType.Admin, UserType.Operator];
