import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { Loading } from "@boomerang/carbon-addons-boomerang-react";
import ExecutionHeader from "./ExecutionHeader";
import ExecutionTaskLog from "./ExecutionTaskLog";
import WorkflowActions from "./WorkflowActions";
import WorkflowZoom from "Components/WorkflowZoom";
import { REQUEST_STATUSES } from "Config/servicesConfig";
import WorkflowDagEngine from "Utilities/dag/WorkflowDagEngine";
import { ExecutionStatus } from "Constants";
import styles from "./main.module.scss";

class Main extends Component {
  static propTypes = {
    dag: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.workflowDagEngine = new WorkflowDagEngine({ dag: props.dag, modelIsLocked: true });
    this.state = {
      workflowDagBoundingClientRect: {},
    };
    this.diagramRef = React.createRef();
  }

  componentDidMount() {
    if (this.diagramRef.current) {
      this.setState({
        workflowDagBoundingClientRect: this.diagramRef.current.getBoundingClientRect(),
      });
    }
    this.workflowDagEngine.getDiagramEngine().zoomToFit();
  }

  render() {
    const { workflow, workflowExecution } = this.props;
    const { status, steps } = workflowExecution.data;

    const hasFinished = [ExecutionStatus.Completed, ExecutionStatus.Invalid, ExecutionStatus.Failure].includes(status);

    const hasStarted = steps && steps.find((step) => step.flowTaskStatus !== ExecutionStatus.NotStarted);

    const loadDiagram =
      workflow.status === REQUEST_STATUSES.SUCCESS &&
      workflowExecution.status === REQUEST_STATUSES.SUCCESS &&
      (hasStarted || hasFinished);

    return (
      <div className={styles.container}>
        <ExecutionHeader workflow={workflow} workflowExecution={workflowExecution} />
        <section aria-label="Executions" className={styles.executionResultContainer}>
          <ExecutionTaskLog workflowExecution={workflowExecution} />
          <div className={styles.executionDesignerContainer} ref={this.diagramRef}>
            <section className={styles.executionWorkflowActions}>
              <WorkflowActions workflow={workflow.data} />
              <WorkflowZoom
                workflowDagBoundingClientRect={this.state.workflowDagBoundingClientRect}
                workflowDagEngine={this.workflowDagEngine}
              />
            </section>
            <DiagramWidget
              allowLooseLinks={false}
              allowCanvasTranslation={true}
              allowCanvasZoom={true}
              className={styles.diagram}
              deleteKeys={[]}
              diagramEngine={this.workflowDagEngine.getDiagramEngine()}
              maxNumberPointsPerLink={0}
            />
            {!loadDiagram && (
              <div className={styles.diagramLoading}>
                <Loading withOverlay={false} />
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(Main);
