import { useContext } from "react";
import { ExecutionContext } from "State/context";

function useExecutionContext() {
  return useContext(ExecutionContext);
}

export default useExecutionContext;
