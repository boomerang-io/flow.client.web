import { useContext } from "react";
import { WorkflowContext } from "State/context";

function useWorkflowContext() {
  return useContext(WorkflowContext);
}

export default useWorkflowContext;
