import React from "react";
import TemplateTaskNodeDesigner from "./index";
import WorkflowDagEngine from "Utilities/dag/WorkflowDagEngine";
import revisions from "ApiServer/fixtures/revisions.js"

const diagramEngine = new WorkflowDagEngine({ dag: revisions[0].dag, isLocked: false });
const node = {};

describe("TemplateTaskNode --- Snapshot", () => {
  it("Capturing Snapshot of TemplateTaskNode", () => {
    const { baseElement } = rtlContextRouterRender(
      <TemplateTaskNodeDesigner diagramEngine={diagramEngine} node={node} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
