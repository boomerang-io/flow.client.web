import React from "react";
import { FlowTeam, FlowUser } from "Types";

export function createContext<ContextType>() {
  const context = React.createContext<ContextType | undefined>(undefined);
  function useContext() {
    const contextValue = React.useContext(context);
    if (!contextValue) throw new Error("useContext must be inside a Provider with a value");
    return contextValue;
  }
  return [useContext, context.Provider] as const;
}

export const [useAppContext, AppContextProvider] = createContext<AppContext>();

type AppContext = {
  isTutorialActive: boolean;
  setIsTutorialActive: (isActive: boolean) => void;
  user: FlowUser;
  teams: FlowTeam[];
};

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

// export const EditorContext = React.createContext({});

interface revisionInterface {
  changelog: object;
  config: object;
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
  templateUpgradesAvailable: string;
  version: number;
  workFlowId: string;
}

interface summaryInterface {
  data: {
    description: string;
    enableACCIntegration: boolean;
    enablePersistentStorage: boolean;
    flowTeamId: string;
    icon: string;
    id: string;
    name: string;
    properties: Array<object>;
    revisionCount: number;
    shortDescription: string;
    status: string;
    templateUpgradesAvailable: boolean;
    triggers: object;
  };
}

interface taskInterface {
  category: string;
  createdDate: string;
  currentVersion: number;
  description: string;
  icon: string;
  id: string;
  lastModified: string;
  name: string;
  nodeType: string;
  revisions: Array<object>;
  status: string;
}

interface editorContextInterface {
  revisionDispatch?: Function;
  revisionState: revisionInterface;
  summaryQuery: summaryInterface;
  taskTemplatesData: Array<taskInterface>;
}

export const EditorContext = React.createContext<Partial<editorContextInterface>>({});
