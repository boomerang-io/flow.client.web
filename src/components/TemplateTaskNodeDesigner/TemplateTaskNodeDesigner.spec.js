import React from "react";
import TemplateTaskNodeDesigner from "./index";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { EditorContextRender } from "Utils/testing/context";
import { revisions } from "ApiServer/fixtures";

const diagramEngine = new WorkflowDagEngine({ dag: revisions[0].dag, isLocked: false });
const node = {};

describe("Editor --- Snapshot", () => {
  it("Capturing Snapshot of Editor", () => {
    const { baseElement } = rtlContextRouterRender(
      <EditorContextRender>
        <TemplateTaskNodeDesigner diagramEngine={diagramEngine} node={node} />
      </EditorContextRender>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
