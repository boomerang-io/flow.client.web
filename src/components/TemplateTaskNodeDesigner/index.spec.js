import React from "react";
import TemplateTaskNodeDesigner from "./index";
import WorkflowDagEngine from "Utilities/dag/WorkflowDagEngine";
import { WorkflowContextRender } from "Utilities/testing/context";
import { revision } from "Utilities/testing/dag";

const diagramEngine = new WorkflowDagEngine({ dag: revision.dag, isLocked: false });
const node = {};

describe("Editor --- Snapshot", () => {
  it("Capturing Snapshot of Editor", () => {
    const { baseElement } = rtlContextRouterRender(
      <WorkflowContextRender>
        <TemplateTaskNodeDesigner diagramEngine={diagramEngine} node={node} />
      </WorkflowContextRender>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
