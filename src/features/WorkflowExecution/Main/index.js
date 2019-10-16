import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { LoadingAnimation } from "@boomerang/carbon-addons-boomerang-react";
import ExecutionHeader from "./ExecutionHeader";
import ExecutionTaskLog from "./ExecutionTaskLog";
import WorkflowActions from "./WorkflowActions";
import DiagramApplication from "Utilities/DiagramApplication";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./main.module.scss";

class Main extends Component {
  static propTypes = {
    dag: PropTypes.object.isRequired,
    workflowData: PropTypes.object.isRequired,
    workflowExecutionData: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.dag, modelIsLocked: true });
  }

  render() {
    const { workflowData, workflowExecutionData, setActiveTeam } = this.props;
    const hasFinished = [EXECUTION_STATUSES.COMPLETED, EXECUTION_STATUSES.INVALID, EXECUTION_STATUSES.FAILURE].includes(
      workflowExecutionData.status
    );

    const hasStarted =
      workflowExecutionData.steps &&
      workflowExecutionData.steps.find(step => step.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED);

    return (
      <div className={styles.container}>
        <ExecutionHeader workflow={workflowData} workflowExecutionData={workflowExecutionData} />
        <div className={styles.executionResultContainer}>
          <ExecutionTaskLog workflow={workflowData} workflowExecutionData={workflowExecutionData} />
          {hasStarted || hasFinished ? (
            <div className={styles.executionDesignerContainer}>
              <WorkflowActions setActiveTeam={setActiveTeam} />
              <DiagramWidget
                allowLooseLinks={false}
                allowCanvasTranslation={true}
                allowCanvasZoom={true}
                className={styles.diagram}
                deleteKeys={[]}
                diagramEngine={this.diagramApp.getDiagramEngine()}
                maxNumberPointsPerLink={0}
              />
            </div>
          ) : (
            <LoadingAnimation message="Your workflow will be with you shortly" />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
