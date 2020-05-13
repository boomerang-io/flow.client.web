import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import ExecutionHeader from "./ExecutionHeader";
import ExecutionTaskLog from "./ExecutionTaskLog";
import WorkflowActions from "./WorkflowActions";
import Loading from "Components/Loading";
import WorkflowZoom from "Components/WorkflowZoom";
import { REQUEST_STATUSES } from "Config/servicesConfig";
import DiagramApplication from "Utilities/DiagramApplication";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./main.module.scss";

class Main extends Component {
  static propTypes = {
    dag: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.dag, modelIsLocked: true });
    this.state = {
      diagramBoundingClientRect: {}
    };
    this.diagramRef = React.createRef();
  }

  componentDidMount() {
    if (this.diagramRef.current) {
      this.setState({
        diagramBoundingClientRect: this.diagramRef.current.getBoundingClientRect()
      });
    }
    this.diagramApp.getDiagramEngine().zoomToFit();
  }

  render() {
    const { workflow, workflowExecution } = this.props;
    const { status, steps } = workflowExecution.data;

    const hasFinished = [EXECUTION_STATUSES.COMPLETED, EXECUTION_STATUSES.INVALID, EXECUTION_STATUSES.FAILURE].includes(
      status
    );

    const hasStarted = steps && steps.find(step => step.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED);

    const loadDiagram =
      workflow.fetchingStatus === REQUEST_STATUSES.SUCCESS &&
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
                diagramApp={this.diagramApp}
                diagramBoundingClientRect={this.state.diagramBoundingClientRect}
              />
            </section>
            <DiagramWidget
              allowLooseLinks={false}
              allowCanvasTranslation={true}
              allowCanvasZoom={true}
              className={styles.diagram}
              deleteKeys={[]}
              diagramEngine={this.diagramApp.getDiagramEngine()}
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
