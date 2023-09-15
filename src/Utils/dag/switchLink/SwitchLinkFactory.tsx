//@ts-nocheck
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import SwitchLinkModel from "./SwitchLinkModel";
import SwitchLinkDesigner from "Components/SwitchLinkDesigner";
import SwitchLinkExecution from "Components/SwitchLinkExecution";
import { NodeType, WorkflowEngineMode } from "Constants";

export default class SwitchLinkFactory extends DefaultLinkFactory {
  constructor(diagramEngine) {
    super();
    this.type = NodeType.Decision;
    this.diagramEngine = diagramEngine;
  }

  getNewInstance = () => {
    return new SwitchLinkModel();
  };

  generateLinkSegment(model, widget, selected, path) {
    if (this.diagramEngine.mode === WorkflowEngineMode.Executor) {
      return (
        <g>
          <SwitchLinkExecution model={model} path={path} diagramEngine={this.diagramEngine} />
        </g>
      );
    } else {
      return (
        <g>
          <SwitchLinkDesigner model={model} path={path} diagramEngine={this.diagramEngine} />
        </g>
      );
    }
  }
}
