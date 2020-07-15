import React from "react";

export const AppContext = React.createContext();

export const ExecutionContext = React.createContext({
  tasks: [],
  workflowExecution: {},
  workflowRevision: {},
});

export const EditorContext = React.createContext({
  revisionDispatch: () => {},
  revisionState: {},
  revisionQuery: {},
  summaryState: {},
  taskTemplatesData: [],
});
