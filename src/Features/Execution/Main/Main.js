import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import ExecutionHeader from "./ExecutionHeader";
import ExecutionTaskLog from "./ExecutionTaskLog";
import WorkflowActions from "./WorkflowActions";
import WorkflowZoom from "Components/WorkflowZoom";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { ExecutionStatus, QueryStatus, WorkflowDagEngineMode } from "Constants";
import styles from "./main.module.scss";

class Main extends Component {
  static propTypes = {
    dag: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object.isRequired,
    version: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.workflowDagEngine = new WorkflowDagEngine({
      dag: props.dag,
      mode: WorkflowDagEngineMode.Executor,
    });
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
    const { workflow, workflowExecution, version } = this.props;
    const { status, steps } = workflowExecution.data;

    const hasFinished = [ExecutionStatus.Completed, ExecutionStatus.Invalid, ExecutionStatus.Failure].includes(status);

    const hasStarted = steps && steps.find((step) => step.flowTaskStatus !== ExecutionStatus.NotStarted);

    const isDiagramLoading =
      workflow.status === QueryStatus.Success &&
      workflowExecution.status === QueryStatus.Success &&
      (hasStarted || hasFinished);

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`${workflow.data.name} - Activity`}</title>
        </Helmet>
        <ExecutionHeader workflow={workflow} workflowExecution={workflowExecution} version={version} />
        <section aria-label="Executions" className={styles.executionResultContainer}>
          <ExecutionTaskLog workflowExecution={workflowExecution} />
          <div className={styles.executionDesignerContainer} ref={this.diagramRef}>
            <div className={styles.executionWorkflowActions}>
              <WorkflowActions workflow={workflow.data} />
              <WorkflowZoom
                workflowDagBoundingClientRect={this.state.workflowDagBoundingClientRect}
                workflowDagEngine={this.workflowDagEngine}
              />
            </div>
            <DiagramWidget
              allowLooseLinks={false}
              allowCanvasTranslation={true}
              allowCanvasZoom={true}
              className={styles.diagram}
              deleteKeys={[]}
              diagramEngine={this.workflowDagEngine.getDiagramEngine()}
              maxNumberPointsPerLink={0}
            />
            {!isDiagramLoading && (
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
