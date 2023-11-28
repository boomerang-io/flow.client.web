declare global {
  interface Window {
    _SERVER_DATA: {
      APP_ROOT: string;
      CORE_ENV_URL: string;
      CORE_SERVICE_ENV_URL: string;
      EMBEDDED_MODE: string;
      PRODUCT_ENV_URL: string;
      PRODUCT_SERVICE_ENV_URL: string;
      PRODUCT_STANDALONE: string;
      [key: string]: string;
    };
  }
}

export enum PlatformRole {
  Admin = "admin",
  User = "user",
  Operator = "operator",
}

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

export interface SimpleApprover {
  approverId: string;
  approverEmail: string;
  approverName: string;
  comments: string;
  actionDate: string;
  actioned: boolean;
}

export interface Action {
  id: string;
  activityId: string;
  taskActivityId: string;
  workflowId: string;
  teamId: string;
  audit: any;
  status: string;
  type: string;
  creationDate: string;
  taskName: string;
  workflowName: string;
  numberOfApprovals: number;
  approvalsRequired: number;
  actioners: SimpleApprover[];
  teamName: string;
  instructions: any;
}

export interface Approver {
  userName: string;
  userId: string;
  userEmail: string;
  teamApprover?: boolean;
}

export interface ApproverGroup {
  groupId: string;
  groupName: string;
  approvers: Array<Approver>;
}

export interface DataDrivenInput {
  id: string;
  defaultValue?: string;
  description?: string;
  helperText?: string;
  language?: string;
  disabled?: boolean;
  key: string;
  label?: string;
  onChange?: (args: any) => void;
  onBlur?: (args: any) => void;
  options?: [{ key: string; value: string }];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  value: string;
  values?: [string] | [{ key: string; value: string }];
  type?: string;
  min?: number;
  max?: number;
}

export interface ResultParameter {
  name: string;
  description: string;
  value?: any;
}

export interface ModalTriggerProps {
  openModal(): void;
}

export interface ComposedModalChildProps {
  closeModal(): void;
  forceCloseModal(): void;
}

export interface FormikSetFieldValue {
  (id: string, value: string | [string] | boolean | undefined): void;
}

export interface CreateWorkflowSummary {
  description: string;
  enableACCIntegration: boolean;
  storage: {
    activity: {
      enabled: boolean;
      size: number;
      mountPath: string;
    };
    workflow: {
      enabled: boolean;
      size: number;
      mountPath: string;
    };
  };
  icon: string;
  name: string;
  revisionCount: number;
  shortDescription: string;
  properties: Array<any>;
  triggers: {
    event: {
      enable: boolean;
      topic: string;
    };
    scheduler: {
      enable: boolean;
      schedule: string;
      timezone: string | boolean;
      advancedCron: boolean;
    };
    webhook: {
      enable: boolean;
      token: string;
    };
  };
}

export interface WorkflowSummary {
  id: string;
  description: string;
  enableACCIntegration: boolean;
  storage: {
    activity: {
      enabled: boolean;
      size: number;
      mountPath: string;
    };
    workflow: {
      enabled: boolean;
      size: number;
      mountPath: string;
    };
  };
  icon: string;
  name: string;
  labels: Array<{ key: string; value: string }>;
  revisionCount: number;
  status?: string;
  scope: "system" | "team" | "user" | "template";
  shortDescription: string;
  properties: [DataDrivenInput];
  triggers: {
    manual: {
      enable: boolean;
    };
    custom: {
      enable: boolean;
      topic: string;
    };
    scheduler: {
      enable: boolean;
      schedule: string;
      timezone: string | boolean;
      advancedCron: boolean;
    };
    webhook: {
      enable: boolean;
      token: string;
    };
  };
  tokens: [
    {
      token: string;
      label: string;
    }
  ];
  flowTeamId: string;
  templateUpgradesAvailable: boolean;
}

export interface WorkflowDag {
  gridSize: number;
  id: string;
  links: Array<{
    color: string;
    curvyness: number;
    executionCondition: string;
    extras: object;
    id: string;
    labels: Array<string>; //i think this type is right?
    linkId: string;
    selected: false;
    source: string;
    sourcePort: string;
    switchCondition: string | null;
    target: string;
    targetPort: string;
    type: string;
    width: number;
  }>;
  nodes: Array<{
    extras: {};
    id: string;
    nodeId: string;
    passedName: string;
    ports: Array<{
      id: string;
      links: Array<string>;
      name: string;
      nodePortId: string;
      position: string;
      selected: boolean;
      type: string;
    }>;
    selected: boolean;
    templateUpgradeAvailable: boolean;
    type: string;
    x: number;
    y: number;
  }>;
  offsetX: number;
  offsetY: number;
  zoom: number;
}
export interface WorkflowRevision {
  changelog: ChangeLogItem;
  config: any;
  dag: WorkflowDag;
  id: string;
  templateUpgradesAvailable: boolean;
  version: number;
  workFlowId: string;
}

export interface WorkflowExport extends WorkflowSummary {
  latestRevision: WorkflowRevision;
  flowTeamId: string;
}

export interface WorkflowRevisionState extends WorkflowRevision {
  hasUnsavedUpdates: boolean;
}

export enum ApprovalStatus {
  Approved = "approved",
  Rejected = "rejected",
  Submitted = "submitted",
}

export interface WorkflowExecutionStep {
  activityId: string;
  approval: {
    id: string;
    status: ApprovalStatus;
    instructions: string;
    audit: {
      approverId: string;
      approverName: string;
      approverEmail: string;
      actionDate: number;
      result: boolean;
      comments: string;
    };
  };
  duration: number;
  flowTaskStatus: ExecutionStatus;
  id: string;
  order: number;
  startTime: string;
  taskId: string;
  taskName: string;
  taskType: string;
  preApproved: boolean;
  runWorkflowActivityId: string;
  runWorkflowId: string;
  runWorkflowActivityStatus: ExecutionStatus;
  switchValue: string;
  outputs: {
    [key: string]: string;
  };
  error: {
    code: string;
    message: string;
  };
  results: Array<{
    name: string;
    description: string;
    value: string;
  }>;
}
export interface WorkflowExecution {
  creationDate: string;
  duration: number;
  id: string;
  status: ExecutionStatus;
  workflowId: string;
  workflowRevisionid: string;
  workflowRevisionVersion: string;
  trigger: string;
  properties: (
    | {
        key: string;
        value: string;
      }
    | {
        key: string;
        value: null;
      }
  )[];
  outputProperties: (
    | {
        key: string;
        value: string;
      }
    | {
        key: string;
        value: null;
      }
  )[];
  steps: Array<WorkflowExecutionStep>;
  teamName: string;
  awaitingApproval: boolean;
  error: {
    code: string;
    message: string;
  };
  initiatedByUserName: string;
  scope: string;
}
export interface ChangeLogItem {
  date: string;
  reason: string;
  revisionId: string;
  userId: string;
  userName: string;
  version: number;
  workflowId: string;
}

export type ChangeLog = Array<ChangeLogItem>;

export interface TaskModel {
  category: string;
  currentVersion: number;
  id: string;
  icon: string;
  model: string;
  name: string;
  revisions: any[];
  status: string;
  scope: string; //global or team
  verified: boolean;
}

export interface FlowTeam {
  higherLevelGroupId: string;
  id: string;
  isActive: boolean;
  labels?: { key: string; value: string }[];
  name: string;
  workflowQuotas: FlowTeamQuotas;
  users: FlowUser[];
  workflows: WorkflowSummary[];
  userRoles?: string[];
}

export interface FlowTeamQuotas {
  maxWorkflowCount: number;
  maxWorkflowExecutionMonthly: number;
  currentWorkflowExecutionMonthly: number;
  currentWorkflowCount: number;
  maxWorkflowStorage: number;
  maxConcurrentWorkflows: number;
  maxWorkflowExecutionTime: number;
  monthlyResetDate: string;

  currentConcurrentWorkflows: number;
  currentAverageExecutionTime: number;
  currentWorkflowsPersistentStorage: number;
}

export interface PaginatedSort {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  descending: boolean;
  ascending: boolean;
}

export interface PaginatedResponse<RecordType> {
  totalPages: number;
  totalElements: number;
  last: boolean;
  sort: PaginatedSort[];
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  records: RecordType[];
}

export interface FlowUser {
  id: string;
  email: string;
  name: string;
  ifFirstVisit: boolean;
  type: PlatformRole;
  firstLoginDate: string;
  lastLoginDate: string;
  flowTeams: string[];
  status: UserStatus;
  platformRole: string;
  labels?: { key: string; value: string }[];
  workflows?: WorkflowSummary[];
  userTeams?: FlowTeam[];
}

export interface Property {
  value: string | null;
  readOnly: boolean;
  id: string;
  description: string;
  key: string;
  label: string;
  type: string;
}

export interface PatchProperty {
  value?: string;
  readOnly?: boolean;
  id?: string;
  description?: string;
  key?: string;
  label?: string;
  type?: string;
}

export interface Token {
  id: string;
  creationDate: string;
  expiryDate: string;
  creatorId: string;
  description: string;
  creatorName: string;
}

export interface TokenRequest {
  expiryDate: string | number | null;
  description: string;
}

export interface TeamTokenRequest extends TokenRequest {
  teamId: string;
}

// interface userInterface {
//   email?: string;
//   favoritePackages?: any;
//   firstLoginDate?: string;
//   hasConsented?: boolean;
//   id: string;
//   isFirstVisit?: boolean;
//   isShowHelp?: boolean;
//   lastLoginDate?: string;
//   lowerLevelGroupIds?: any;
//   name?: string;
//   notificationSettings?: any;
//   personalizations?: any;
//   pinnedToolIds?: any;
//   projects?: any;
//   status?: string;
//   teams?: any; //is this used?
//   type: string;
// }

export interface ComboBoxItem {
  name: string;
  label?: string;
  value: string;
}

export interface WorkflowTemplate {
  id: string;
  icon: string;
  name: string;
  description: string;
  parameters: {
    label: string;
    type: string;
  }[];
  revision: WorkflowRevision;
  triggers: { [key: string]: any };
}

export enum ExecutionStatus {
  Cancelled = "cancelled",
  Completed = "completed",
  Failure = "failure",
  InProgress = "inProgress",
  Invalid = "invalid",
  NotStarted = "notstarted",
  Skipped = "skipped",
  Waiting = "waiting",
}

export interface UserQuotas {
  maxWorkflowCount: number;
  maxWorkflowExecutionMonthly: number;
  maxWorkflowStorage: number;
  maxWorkflowExecutionTime: number;
  maxConcurrentWorkflows: number;
  currentWorkflowCount: number;
  currentConcurrentWorkflows: number;
  currentWorkflowExecutionMonthly: number;
  currentAverageExecutionTime: number;
  monthlymonthlyResetDate: string;
}

export interface UserWorkflow {
  userQuotas: UserQuotas;
  workflows: WorkflowSummary[];
}

export interface FlowNavigationItemChild {
  activeClassName?: string;
  element?: React.ReactNode;
  onClick?: (e: React.SyntheticEvent) => any;
  href?: string;
  large: boolean;
  link: string;
  name: string;
  renderIcon: SVGElement;
  to?: string;
}

export interface FlowNavigationItem {
  icon: string;
  name: string;
  link: string;
  type: string;
  childLinks: [FlowNavigationItemChild];
}

export type PlatformFeatureKey =
  | "consent.enabled"
  | "docs.enabled"
  | "metering.enabled"
  | "notifications.enabled"
  | "support.enabled"
  | "welcome.enabled";

export interface PlatformConfig {
  features: {
    [k in PlatformFeatureKey]: boolean;
  };
  navigation: Array<{ name: string; url: string }>;
  platform: {
    appName?: string;
    baseEnvUrl?: string;
    baseServicesUrl?: string;
    communityUrl?: string;
    displayLogo: boolean;
    name: string;
    platformName: string;
    privateTeams: boolean;
    sendMail: boolean;
    signOutUrl: string;
    version: string;
  };
  platformMessage: {
    kind: string;
    message: string;
    title: string;
  };
}

export type FlowFeatureKey =
  | "activity"
  | "enable.verified.tasks.edit"
  | "global.parameters"
  | "insights"
  | "team.management"
  | "team.parameters"
  | "team.tasks"
  | "user.management"
  | "workflow.quotas"
  | "workflow.tokens"
  | "workflow.triggers";

export type FlowQuotaKey = "maxActivityStorageSize" | "maxWorkflowStorageSize";

export interface FlowFeatures {
  features: {
    [k in FlowFeatureKey]: boolean;
  };
  quotas: {
    [k in FlowQuotaKey]: string;
  };
}

//Schedule types

export type ScheduleStatus = "active" | "inactive" | "deleted" | "trigger_disabled" | "error";
export type ScheduleType = "runOnce" | "cron" | "advancedCron";

export interface Schedule {
  id: string;
  name: string;
  description?: string;
  labels?: Array<{ key: string; value: string }>;
  nextScheduleDate: string;
  parameters?: { [k: string]: any };
  status: ScheduleStatus;
  type: ScheduleType;
  timezone: string;
  workflowId: string;
  workflow?: WorkflowSummary;
}

export interface ScheduleDate extends Schedule {
  dateSchedule: string;
  type: "runOnce";
}

export interface ScheduleCron extends Schedule {
  cronSchedule: string;
  type: "cron" | "advancedCron";
}

export type ScheduleUnion = ScheduleDate | ScheduleCron;

export interface CalendarEntry {
  scheduleId: string;
  dates: Array<string>;
}

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  resource: ScheduleUnion;
  onClick?: () => void;
}

export type CalendarDateRange = { start: string | Date; end: string | Date } | Date[];

export interface ScheduleManagerFormInputs {
  advancedCron: boolean;
  cronSchedule: string;
  dateTime: string;
  days: Array<DayOfWeekKey>;
  description: string;
  id: string;
  labels: Array<string>;
  name: string;
  type: ScheduleType;
  timezone: { label: string; value: string };
  time: string;
  workflow: WorkflowSummary;
  [key: string]: any;
}

export type DayOfWeekKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type DayOfWeekCronAbbreviation = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type MultiSelectItem = {
  label: string;
  value: string;
};

export interface MultiSelectItems<Type = MultiSelectItem> {
  selectedItems: Array<Type>;
}
