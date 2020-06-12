import React from "react";
import { ExecutionContext } from "State/context";
import { EditorContext } from "State/context";

const revisionDispatch = jest.mock();

export function WorkflowContextRender({ children, value }) {
  return (
    <EditorContext.Provider
      value={{
        revisionDispatch,
        revisionState: { config: {} },
        summaryQuery: { data: {} },
        taskTemplatesData: [],
        ...value,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
