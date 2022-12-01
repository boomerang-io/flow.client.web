import ScriptNodeDesigner from "./ScriptNodeDesigner";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { EditorContextRender } from "Utils/testing/context";
import { revisions } from "ApiServer/fixtures";
import { WorkflowDagEngineMode } from "Constants";

// const diagramEngine = new WorkflowDagEngine({ dag: revisions[0].dag, mode: WorkflowDagEngineMode.Editor });
// const node = {};

// describe("ScriptNodeDesigner --- Snapshot", () => {
//   it("Capturing Snapshot of ScriptNodeDesigner", () => {
//     const { baseElement } = rtlContextRouterRender(
//       <EditorContextRender>
//         <ScriptNodeDesigner diagramEngine={diagramEngine} node={node} />
//       </EditorContextRender>
//     );
//     expect(baseElement).toMatchSnapshot();
//   });
// });
