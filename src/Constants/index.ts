import { CloseOutline, CheckmarkOutline, Error, InProgress, Timer } from "@carbon/react/icons";
import { ExecutionStatus, ScheduleStatus, ScheduleType } from "Types";

export const Envs = Object.freeze({
  Dev: "development",
  Test: "test",
  Prod: "production",
  PortForward: "portforward",
});

/**
 * Primitve constants
 */
export const CREATED_DATE_FORMAT = "MMMM DD, YYYY";
export const PROPERTY_KEY_REGEX = /^[a-zA-Z_]([a-zA-Z0-9-_])*$/;
export const PASSWORD_CONSTANT = "******";

/**
 * Enums
 */
export const HttpMethod = Object.freeze({
  Post: "post",
  Put: "put",
  Patch: "patch",
  Delete: "delete",
  Get: "get",
});

export const ExecutionStatusMap = {
  Cancelled: "cancelled",
  Completed: "completed",
  Failure: "failure",
  InProgress: "inProgress",
  Invalid: "invalid",
  NotStarted: "notstarted",
  Skipped: "skipped",
  Waiting: "waiting",
};

export const ExecutionStatusCopy: Record<ExecutionStatus, string> = Object.freeze({
  [ExecutionStatus.Cancelled]: "Cancelled",
  [ExecutionStatus.Completed]: "Succeeded",
  [ExecutionStatus.Failure]: "Failed",
  [ExecutionStatus.InProgress]: "In Progress",
  [ExecutionStatus.NotStarted]: "Not Started",
  [ExecutionStatus.Invalid]: "Invalid",
  [ExecutionStatus.Skipped]: "Skipped",
  [ExecutionStatus.Waiting]: "Waiting",
});

export const InputProperty = Object.freeze({
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
});

export const InputType = Object.freeze({
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
});

export const InputTypeCopy = Object.freeze({
  [InputType.Boolean]: "Boolean",
  [InputType.Email]: "Email",
  [InputType.Number]: "Number",
  [InputType.Password]: "Password",
  [InputType.Select]: "Select",
  [InputType.TextArea]: "Text Area",
  [InputType.Text]: "Text",
  [InputType.URL]: "URL",
});

export const NodeType = {
  Acquirelock: "acquirelock",
  Approval: "approval",
  CustomTask: "customTask",
  Decision: "decision",
  End: "end",
  Manual: "manual",
  Releaselock: "releaselock",
  RunScheduledWorkflow: "runscheduledworkflow",
  RunWorkflow: "runworkflow",
  Script: "script",
  SetProperty: "setwfproperty",
  SetStatus: "setwfstatus",
  Start: "start",
  StartEnd: "startend",
  Task: "task",
  TemplateTask: "templateTask",
  Wait: "eventwait",
} as const;

export const QueryStatus = Object.freeze({
  Idle: "idle",
  Loading: "loading",
  Error: "error",
  Success: "success",
});

export const scheduleStatusOptions: Array<{ label: string; value: ScheduleStatus }> = [
  { label: "Enabled", value: "active" },
  { label: "Disabled", value: "inactive" },
  { label: "Trigger Disabled", value: "trigger_disabled" },
  { label: "Error", value: "error" },
];

export const scheduleStatusLabelMap: Record<ScheduleStatus, string> = Object.freeze({
  active: "Enabled",
  inactive: "Disabled",
  trigger_disabled: "Trigger Disabled",
  deleted: "Deleted",
  error: "Error",
});

export const scheduleTypeLabelMap: Record<ScheduleType, string> = Object.freeze({
  runOnce: "Run Once",
  cron: "Recurring",
  advancedCron: "Recurring via cron expression",
});

export const TaskTemplateStatus = Object.freeze({
  Active: "active",
  Inactive: "inactive",
  Archived: "archived",
});

export const UserType = Object.freeze({
  Admin: "admin",
  Operator: "operator",
  User: "user",
});

export const UserTypeCopy = Object.freeze({
  [UserType.Admin]: "Admin",
  [UserType.User]: "User",
});

export const WorkflowDagEngineMode = Object.freeze({
  Editor: "editor",
  Viewer: "viewer",
  Executor: "executor",
});

export const WorkflowPropertyUpdateType = Object.freeze({
  Create: "create",
  Update: "update",
  Delete: "delete",
});

export const WorkflowScope = Object.freeze({
  System: "system",
  Team: "team",
  User: "user",
  Template: "template",
});

export const SortDirection = Object.freeze({
  Asc: "ASC",
  Desc: "DESC",
});

export const UserRole = Object.freeze({
  Admin: "admin",
  Auditor: "auditor",
  Operator: "operator",
  Author: "author",
  User: "user",
});

export const UserRoleDisplay = Object.freeze({
  [UserRole.Admin]: "Admin",
  [UserRole.Auditor]: "Auditor",
  [UserRole.Operator]: "Operator",
  [UserRole.Author]: "Author",
  [UserRole.User]: "User",
});

export const UserRoleCopy = Object.freeze({
  [UserRole.Admin]: "Admin",
  [UserRole.Auditor]: "Auditor",
  [UserRole.Operator]: "Operator",
  [UserRole.Author]: "Author",
  [UserRole.User]: "User",
});

export const REQUEST_TYPES = Object.freeze({
  JOIN_TEAM: "joingroup",
  CREATE_TEAM: "creategroup",
  LEAVE_TEAM: "leavegroup",
  REMOVE_TEAM: "removegroup",
});

export const REQUEST_TYPES_TO_DISPLAY = Object.freeze({
  [REQUEST_TYPES.JOIN_TEAM]: "Join a Team",
  [REQUEST_TYPES.CREATE_TEAM]: "Create a Team",
  [REQUEST_TYPES.LEAVE_TEAM]: "Leave a Team",
  [REQUEST_TYPES.REMOVE_TEAM]: "Remove a Team",
});

/**
 * Complex objects
 */
export const executionStatusIcon: Record<ExecutionStatus, React.FC<{ [k: string]: any }>> = Object.freeze({
  [ExecutionStatus.Cancelled]: CloseOutline,
  [ExecutionStatus.Completed]: CheckmarkOutline,
  [ExecutionStatus.Failure]: CloseOutline,
  [ExecutionStatus.InProgress]: Timer,
  [ExecutionStatus.NotStarted]: Timer,
  [ExecutionStatus.Invalid]: Error,
  [ExecutionStatus.Skipped]: Error,
  [ExecutionStatus.Waiting]: InProgress,
});

export const executionStatusList = [
  ExecutionStatus.InProgress,
  ExecutionStatus.Completed,
  ExecutionStatus.Failure,
  ExecutionStatus.Invalid,
  ExecutionStatus.Waiting,
  ExecutionStatus.Cancelled,
];

export const ActionType = Object.freeze({
  Approval: "approval",
  Task: "task",
});

export const ApprovalInputRequired = Object.freeze({
  Optional: "optional",
  Required: "required",
  None: "none",
});

export const elevatedUserRoles = [UserType.Admin, UserType.Operator];

export const yamlInstructions = `  # Getting started with a Task
  Tasks in Boomerang Flow follow the [Tekton Task model](https://tekton.dev/docs/pipelines/tasks/#configuring-a-task) along with Kubernetes standards and allow you to define what you want to happen at the execution of the task as well as parameters that are needed.
  For more information, see [Getting to know Tasks](https://www.useboomerang.io/docs/boomerang-flow/getting-to-know/tasks).
  Defining Tasks using this YAML editor is recommended for non-business users who have experience writing yaml definitions and have a desire for further customization in defining a task.
  ## Creating a Task in YAML
  The YAML specification has three important sections to be aware of: metadata, params, and steps. 
  Its important to note that the full Tekton task specification is not yet fully supported. We cannot run multi step tasks, nor do we allow resources to be specified. For more information, see [Known Issues and Limitations](https://www.useboomerang.io/docs/boomerang-flow/introduction/known-issues-limitations).
  ### Metadata
  This is the area where we store a series of annotations related to the end user experience and are automatically populated when defining a task view the UI. See below section on understanding the Boomerang Flow specific metadata.
  ### Params
  This is where you define Parametes that are needed for the exeuction of the task. These are linked to, or overlayed with, the information for parameters in the annotations.
  ### Steps
  Steps are what define the actions a Task will perform. A task must always have atleast one step and is a reference to a container image that executes on specific input and produces output. The order in which the Steps appear in this list is the order in which they will execute.
  A basic step is made up as follows and is the necessary container contract details to use.
  \`\`\`
    steps:
    - name: Add User To Box Folder
      image: boomerangio/box-service:0.0.10
      command: null
      args:
      - -props
      - box
      - join
      - folderId
      - email
  \`\`\`
  For more information on steps refer to [Boomerang Flow Tasks](https://www.useboomerang.io/docs/boomerang-flow/3.1.0/getting-to-know/tasks).
  ## Understanding the available metadata
  The metadata used by Boomerang Flow is over and above the standard Kubernetes or Tekton metadata and is a way for the information needed for the user experience to be stored.
  ### Icon
  You can define the icon that users see in the Workflow Editor by using the following annotation. The available icons can be found [here](path to boomerang flow documentation)
  \`\`\`
  boomerang.io/icon: Add
  \`\`\`
  ### Params
  The following definition will match the \`key\` element with the \`name\` element in the params specification of the task. Additional parameter types are supported for the experience including texteditor, boolean, and options. For more detailed information on the available parameters please see [Boomerang Flow Tasks](https://www.useboomerang.io/docs/boomerang-flow/3.1.0/getting-to-know/tasks).
  \`\`\`
      boomerang.io/params:
      - required: true
        placeholder: ""
        readOnly: false
        key: folderId
        label: Folder Id
        type: text
        helperText: Box folder id
        defaultValue: "MyFolder"
  \`\`\`
  `;
