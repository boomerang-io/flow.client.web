import React from "react";
import TemplateTaskNodeDesigner from "./TemplateTaskNodeDesigner";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { EditorContextRender } from "Utils/testing/context";
import { revisions } from "ApiServer/fixtures";
import { WorkflowDagEngineMode } from "Constants";

const diagramEngine = new WorkflowDagEngine({ dag: revisions[0].dag, mode: WorkflowDagEngineMode.Editor });
const node = {};

describe("TemplateTaskNodeDesigner --- Snapshot", () => {
  it("Capturing Snapshot of TemplateTaskNodeDesigner", () => {
    const { baseElement } = rtlContextRouterRender(
      <EditorContextRender>
        <TemplateTaskNodeDesigner diagramEngine={diagramEngine} node={node} />
      </EditorContextRender>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
