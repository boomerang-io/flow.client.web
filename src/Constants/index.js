import { CloseOutline32, CheckmarkOutline32, Error32, InProgress32, Timer32 } from "@carbon/icons-react";

/**
 * Primitve constants
 */
export const CREATED_DATE_FORMAT = "MMMM DD, YYYY";
export const PROPERTY_KEY_REGEX = /^[a-zA-Z_]([a-zA-Z0-9-_])*$/;
export const PASSWORD_CONSTANT = "******";

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
  Cancelled: "cancelled",
  Completed: "completed",
  Failure: "failure",
  InProgress: "inProgress",
  Invalid: "invalid",
  NotStarted: "notstarted",
  Skipped: "skipped",
  Waiting: "waiting",
};

export const ExecutionStatusCopy = {
  [ExecutionStatus.Cancelled]: "Cancelled",
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
  Secured: "secured",
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
  [InputType.Secured]: "Secured",
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
  RunScheduledWorkflow: "runscheduledworkflow",
  RunWorkflow: "runworkflow",
  Script: "script",
  SetStatus: "setwfstatus",
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

export const WorkflowScope = {
  System: "system",
  Team: "team",
  User: "user",
  Template: "template",
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
export const executionStatusIcon = {
  [ExecutionStatus.Cancelled]: CloseOutline32,
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
  ExecutionStatus.Cancelled,
];

export const ActionType = {
  Approval: "approval",
  Task: "task",
};

export const ApprovalInputRequired = {
  Optional: "optional",
  Required: "required",
  None: "none",
};

export const ApprovalStatus = {
  Approved: "approved",
  Rejected: "rejected",
  Submitted: "submitted",
};

export const allowedUserRoles = [UserType.Admin, UserType.Operator];

export const yamlInstructions = `  # Getting started with a Task
  Tasks in Boomerang Flow follow the [Tekton Task model](https://tekton.dev/docs/pipelines/tasks/#configuring-a-task) along with Kubernetes standards and allow you to define what you want to happen at the execution of the task as well as parameters that are needed.
  For more information, see [Getting to know Tasks](https://www.useboomerang.io/docs/boomerang-flow/getting-to-know/tasks).
  Defining Tasks using this YAML editor is recommended for non-business users who have experience writing yaml definitions and have a desire for further customization in defining a task.
  ## Creating a Task in YAML
  The YAML specification has three important sections to be aware of: metadata, params, and steps. 
  Its important to note that the full Tekton task specification is not yet fully supported. We cannot run multi step tasks, nor do we allow resources to be specified. For more information, see [Known Issues and Limitations](https://www.useboomerang.io/docs/boomerang-flow/introduction/known-issues-limitations)
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
  For more information on steps refer to [Boomerang Flow Tasks](https://www.useboomerang.io/docs/boomerang-flow/3.1.0/getting-to-know/tasks)
  ## Understanding the available metadata
  The metadata used by Boomerang Flow is over and above the standard Kubernetes or Tekton metadata and is a way for the information needed for the user experience to be stored.
  ### Icon
  You can define the icon that users see in the Workflow Editor by using the following annotation. The available icons can be found [here](path to boomerang flow documentation)
  \`\`\`
  boomerang.io/icon: Add
  \`\`\`
  ### Params
  The following definition will match the \`key\` element with the \`name\` element in the params specification of the task. Additional parameter types are supported for the experience including texteditor, boolean, and options. For more detailed information on the available parameters please see [Boomerang Flow Tasks](https://www.useboomerang.io/docs/boomerang-flow/3.1.0/getting-to-know/tasks)
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
