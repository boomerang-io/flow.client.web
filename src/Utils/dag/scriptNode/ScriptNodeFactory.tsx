//@ts-nocheck
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import ScriptNodeDesigner from "Components/ScriptNodeDesigner";
import ScriptNodeExecution from "Components/ScriptNodeExecution";
import ScriptNodeModel from "./ScriptNodeModel";
import { WorkflowDagEngineMode } from "Constants";

export default class ScriptNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super("script");
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new ScriptNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      return <ScriptNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <ScriptNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
