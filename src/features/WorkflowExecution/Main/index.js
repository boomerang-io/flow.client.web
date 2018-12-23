import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import NavigateBack from "Components/NavigateBack";
import TimeProgressBar from "Components/TimeProgressBar";
import DiagramApplication from "Utilities/DiagramApplication";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import StepSideInfo from "./StepSideInfo";
import WorkflowSummary from "./WorfklowSummary";
import "./styles.scss";

class Main extends Component {
  static propTypes = {
    dag: PropTypes.object.isRequired,
    taskId: PropTypes.string,
    workflowData: PropTypes.object.isRequired,
    workflowExecutionData: PropTypes.object.isRequired,
    updateActiveNode: PropTypes.func,
    version: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.dag, modelIsLocked: true });
  }

  render() {
    const { workflowExecutionData, taskId, updateActiveNode } = this.props;
    const hasStepExecuting =
      workflowExecutionData.steps && workflowExecutionData.steps.find(step => step.flowTaskStatus !== "notstarted");
    const selectedStep =
      workflowExecutionData.steps && workflowExecutionData.steps.length && taskId
        ? workflowExecutionData.steps.find(step => step.taskId === taskId)
        : undefined;

    return (
      <div className="c-workflow-execution">
        <nav style={{ marginBottom: "1rem", width: "15rem" }}>
          <NavigateBack
            to={this.props.location.state.from || "/activity"}
            text={`Back to ${this.props.location.state.fromText || "Activity"}`}
          />
        </nav>
        <TimeProgressBar updateActiveNode={updateActiveNode} tasks={workflowExecutionData} />
        <WorkflowSummary workflowData={this.props.workflowData} version={this.props.version} />
        {selectedStep && <StepSideInfo step={selectedStep} />}
        <div className="c-workflow-diagram-execution">
          {hasStepExecuting ? (
            <DiagramWidget
              className="c-diagram-canvas"
              diagramEngine={this.diagramApp.getDiagramEngine()}
              maxNumberPointsPerLink={0}
              deleteKeys={[]}
              allowLooseLinks={false}
              allowCanvasTranslation={true}
              allowCanvasZoo={false}
            />
          ) : (
            <LoadingAnimation theme="bmrg-white" message="Your workflow will be with you shortly" />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
