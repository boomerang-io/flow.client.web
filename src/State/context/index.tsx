import React from "react";
import {
  FlowTeam,
  FlowUser,
  TaskModel,
  UserWorkflow,
  WorkflowExecution,
  WorkflowRevision,
  WorkflowSummary,
} from "Types";

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
  communityUrl: string;
  isTutorialActive: boolean;
  setIsTutorialActive: (isActive: boolean) => void;
  quotas: {
    maxActivityStorageSize: string;
    maxWorkflowStorageSize: string;
  };
  teams: FlowTeam[];
  user: FlowUser;
  userWorkflows: UserWorkflow;
};

interface TaskProvider {
  category: string;
  id: string;
  icon: any;
  name: string;
}

interface ExecutionContext {
  tasks: Array<TaskProvider>;
  workflowExecution?: WorkflowExecution;
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
