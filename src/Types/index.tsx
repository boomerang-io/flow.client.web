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
  key: string;
  label: string;
  options?: [{ key: string; value: string }];
  readOnly: boolean;
  required: boolean;
  value: string;
  values: [string] | [{ key: string; value: string }];
  type: string;
}

export interface ModalTriggerProps {
  openModal(): void;
}

export interface ComposedModalChildProps {
  closeModal(): void;
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
  flowTeamId: string;
  templateUpgradesAvailable: boolean;
}

export interface WorkflowRevision {
  changelog: ChangeLogItem;
  config: any;
  dag: any;
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
  id: string;
  icon: string;
  model: string;
  name: string;
  status: string;
}

export interface FlowTeam {
  higherLevelGroupId: string;
  id: string;
  isActive: boolean;
  name: string;
  settings?: any;
  users: FlowUser[];
  workflows: WorkflowSummary[];
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
