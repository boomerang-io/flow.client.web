import React from "react";
import { FlowTeam, FlowUser, TaskModel, WorkflowRevision, WorkflowSummary } from "Types";

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

interface ExecutionContext {
  tasks: Array<taskProvider>;
  workflowExecution: workflowExecutionInterface;
  workflowRevision: object;
}
export const [useExecutionContext, ExecutionContextProvider] = createContext<ExecutionContext>();

interface EditorContext {
  revisionDispatch?: Function;
  revisionState: WorkflowRevision;
  summaryData: WorkflowSummary;
  taskTemplatesData: Array<TaskModel>;
}

export const [useEditorContext, EditorContextProvider] = createContext<EditorContext>();
