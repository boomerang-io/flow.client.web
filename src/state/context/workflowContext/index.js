import React from "react";

const WorkflowContext = React.createContext({
  summaryState: {},
  revisionState: {},
  revisionDispatch: () => {},
  summaryDispatch: () => {},
  mutateSummary: () => {},
  mutateRevision: () => {}
});
export default WorkflowContext;
