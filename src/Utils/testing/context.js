import React from "react";
import { EditorContext } from "State/context";

const revisionDispatch = jest.mock();

export function EditorContextRender({ children, value }) {
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
