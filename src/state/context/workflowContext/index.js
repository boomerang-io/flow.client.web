import React from "react";

const WorkflowContext = React.createContext({
  revisionDispatch: () => {},
  revisionState: {},
  revisionQuery: {},
  summaryState: {},
  taskTemplatesData: [],
});

export default WorkflowContext;
