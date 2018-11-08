import React, { Component } from "react";
import PropTypes from "prop-types";
import TimeProgressBar from "Components/TimeProgressBar";
import DiagramApplication from "Utilities/DiagramApplication";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import StepSideInfo from "./StepSideInfo";

class Main extends Component {
  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.workflowRevision.dag, modelIsLocked: true });
  }

  render() {
    const data = { steps: [{}] };
    return (
      <div className="c-workflow-execution">
        <TimeProgressBar tasks={data} />
        <StepSideInfo step={data.steps[0]} />
        <div className="c-workflow-diagram-execution">
          <DiagramWidget
            className="c-diagram-canvas"
            diagramEngine={this.diagramApp.getDiagramEngine()}
            maxNumberPointsPerLink={0}
            deleteKeys={[]}
            allowLooseLinks={false}
            allowCanvasTranslation={true}
            allowCanvasZoo={false}
          />
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  workflowRevision: PropTypes.object.isRequired
};

export default Main;
