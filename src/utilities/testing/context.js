import React from "react";
import { ExecutionContext } from "State/context";
import { WorkflowContext } from "State/context";

const revisionDispatch = jest.mock();

export function WorkflowContextRender({ children, value }) {
  return (
    <WorkflowContext.Provider
      value={{
        revisionDispatch,
        revisionState: { config: {} },
        summaryQuery: { data: {} },
        taskTemplatesData: [],
        ...value,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}
