import React from "react";

export const AppContext = React.createContext({
  isTutorialActive: false,
  setIsTutorialActive: () => {},
  teams: [],
  user: {},
});

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
