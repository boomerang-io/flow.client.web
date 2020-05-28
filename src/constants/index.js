import { CloseOutline32, CheckmarkOutline32, Error32, Timer32 } from "@carbon/icons-react";

export const daysOfWeekCronList = [
  { labelText: "Monday", value: "monday", id: "monday", cron: "MON", cronNumber: ["1"], key: "monday" },
  { labelText: "Tuesday", value: "tuesday", id: "tuesday", cron: "TUE", cronNumber: ["2"], key: "tuesday" },
  { labelText: "Wednesday", value: "wednesday", id: "wednesday", cron: "WED", cronNumber: ["3"], key: "wednesday" },
  { labelText: "Thursday", value: "thursday", id: "thursday", cron: "THU", cronNumber: ["4"], key: "thursday" },
  { labelText: "Friday", value: "friday", id: "friday", cron: "FRI", cronNumber: ["5"], key: "friday" },
  { labelText: "Saturday", value: "saturday", id: "saturday", cron: "SAT", cronNumber: ["6"], key: "saturday" },
  { labelText: "Sunday", value: "sunday", id: "sunday", cron: "SUN", cronNumber: ["0", "7"], key: "sunday" },
];

export const ExecutionStatus = {
  Completed: "completed",
  Failure: "failure",
  InProgress: "inProgress",
  Invalid: "invalid",
  NotStarted: "notstarted",
  Skipped: "skipped",
};

export const executionStatusList = [
  ExecutionStatus.InProgress,
  ExecutionStatus.Completed,
  ExecutionStatus.Failure,
  ExecutionStatus.Invalid,
];

export const ExecutionStatusCopy = {
  [ExecutionStatus.Completed]: "Succeeded",
  [ExecutionStatus.Failure]: "Failed",
  [ExecutionStatus.InProgress]: "In Progress",
  [ExecutionStatus.NotStarted]: "Not Started",
  [ExecutionStatus.Invalid]: "Invalid",
  [ExecutionStatus.Skipped]: "Skipped",
};

// not using enum casing here bc it doesn't map to a primitive
export const executionStatusIcon = {
  [ExecutionStatus.Completed]: CheckmarkOutline32,
  [ExecutionStatus.Failure]: CloseOutline32,
  [ExecutionStatus.InProgress]: Timer32,
  [ExecutionStatus.NotStarted]: Timer32,
  [ExecutionStatus.Invalid]: Error32,
  [ExecutionStatus.Skipped]: Error32,
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
  TextEditorsJs: "texteditor::javascript",
  TextEditorsText: "texteditor::text",
  TextEditorsShell: "texteditor::shell",
  TextEditorsYaml: "texteditor::yaml",
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

export const WorkflorPropertyUpdateType = {
  Create: "create",
  Update: "update",
  Delete: "delete",
};
