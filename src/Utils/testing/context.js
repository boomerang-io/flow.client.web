import React from "react";
import { EditorContextProvider } from "State/context";

const revisionDispatch = jest.mock();

export function EditorContextRender({ children, value }) {
  return (
    <EditorContextProvider
      value={{
        revisionDispatch,
        revisionState: { config: {} },
        summaryQuery: { data: {} },
        taskTemplatesData: [],
        ...value,
      }}
    >
      {children}
    </EditorContextProvider>
  );
}
