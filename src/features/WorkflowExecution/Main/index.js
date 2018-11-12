import React, { Component } from "react";
import PropTypes from "prop-types";
import NavigateBack from "Components/NavigateBack";
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
    const { workflowExecution, nodeId } = this.props;
    const selectedStep = workflowExecution.steps.find(step => step.taskId === nodeId);

    return (
      <div className="c-workflow-execution">
        <nav style={{ marginBottom: "1rem" }}>
          <NavigateBack to="/activity" text="Back to Activity" />
        </nav>

        <TimeProgressBar tasks={workflowExecution} />
        {selectedStep && <StepSideInfo step={selectedStep} />}
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
  nodeId: PropTypes.string,
  workflowExecution: PropTypes.object.isRequired,
  workflowRevision: PropTypes.object.isRequired
};

export default Main;
