import React from "react";

const ExecutionContext = React.createContext({
  tasks: [],
  workflowExecution: {},
  workflowRevision: {}
});
export default ExecutionContext;
