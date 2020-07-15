import React from "react";

interface userInterface {
  email?: string;
  favoritePackages?: any;
  firstLoginDate?: string;
  hasConsented?: boolean;
  id: string;
  isFirstVisit?: boolean;
  isShowHelp?: boolean;
  lastLoginDate?: string;
  lowerLevelGroupIds?: any;
  name?: string;
  notificationSettings?: any;
  personalizations?: any;
  pinnedToolIds?: any;
  projects?: any;
  status?: string;
  teams?: any; //is this used?
  type: string;
}

interface teamInterface {
  higherLevelGroupId?: string;
  id: string;
  name: string;
  settings?: any; //will nest deeper if we have to
  workflows?: any; //will nest deeper if we have to
}

interface appContextInterface {
  isTutorialActive: boolean;
  setIsTutorialActive: Function;
  user: userInterface;
  teams: Array<teamInterface>;
}

export const AppContext = React.createContext<Partial<appContextInterface>>({});

// export const AppContext = React.createContext({});

interface taskProvider {
  category: string;
  id: string;
  icon: any;
  name: string;
}

interface stepInterface {
  activityId: string;
  duration: number;
  flowTaskStatus: string;
  id: string;
  order: number;
  outputs: any;
  startTime: string;
  taskId: string;
  taskName: string;
}

interface workflowExecutionInterface {
  creationDate: string;
  duration: number;
  id: string;
  properties: any; //array, may need to be changed later
  status: string;
  steps: Array<stepInterface>;
  teamName: string;
  trigger: string;
  workflowId: string;
  workflowRevisionid: string;
}

// export const ExecutionContext = React.createContext({});
interface executionContextInterface {
  tasks?: Array<taskProvider>;
  workflowExecution?: workflowExecutionInterface;
  workflowRevision?: object;
}
// export const ExecutionContext = React.createContext<executionContextInterface>({});
export const ExecutionContext = React.createContext<Partial<executionContextInterface>>({});

export const EditorContext = React.createContext({});
