import React from "react";

const WorkflowContext = React.createContext({
  revisionDispatch: () => {},
  revisionState: {},
  revisionQuery: {},
  summaryState: {},
  setIsModalOpen: () => {},
  taskTemplatesData: [],
});

export default WorkflowContext;
