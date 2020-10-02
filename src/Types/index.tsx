export enum PlatformRole {
  Admin = "admin",
  User = "user",
  Operator = "operator",
}

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

export interface DataDrivenInput {
  id: string;
  defaultValue?: string;
  description?: string;
  helperText?: string;
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
  enablePersistentStorage: boolean;
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
  enablePersistentStorage: boolean;
  icon: string;
  name: string;
  revisionCount: number;
  shortDescription: string;
  properties: [DataDrivenInput];
  triggers: {
    event: {
      enable: boolean;
      subject: string;
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
  flowTeamId: string;
  templateUpgradesAvailable: boolean;
}

export interface WorkflowRevision {
  changelog: ChangeLogItem;
  config: any;
  dag: {
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
  };
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
  verified: boolean;
}

export interface FlowTeam {
  higherLevelGroupId: string;
  id: string;
  isActive: boolean;
  name: string;
  workflowQuotas: FlowTeamQuotas;
  users: FlowUser[];
  workflows: WorkflowSummary[];
}

export interface FlowTeamQuotas {
  maxWorkflowCount: number;
  maxWorkflowExecutionMonthly: number;
  currentWorkflowExecutionMonthly: number;
  currentWorkflowCount: number;
  maxWorkflowStorage: number;
  maxConcurrentWorkflows: number;
  // maxWorkflowExecutionTime: string;
  monthlyResetDate: string;

  // currentConcurrentWorkflows: number;
  // currentAverageExecutionTime: number;
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
  flowTeams: FlowTeam[];
  status: UserStatus;
}

export interface Property {
  value: string;
  readOnly: boolean;
  id: string;
  description: string;
  key: string;
  label: string;
  type: string;
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
