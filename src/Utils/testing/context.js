import React from "react";
import { EditorContextProvider } from "State/context";
import { summaries, revisions } from "ApiServer/fixtures";

const revisionDispatch = jest.mock();

export function EditorContextRender({ children, value }) {
  return (
    <EditorContextProvider
      value={{
        revisionDispatch,
        revisionState: revisions[0],
        summaryData: summaries[0],
        taskTemplatesData: [],
        ...value,
      }}
    >
      {children}
    </EditorContextProvider>
  );
}
