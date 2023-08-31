import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { UseQueryResult } from "react-query";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { Loading } from "@carbon/react";
import ExecutionHeader from "./ExecutionHeader";
import ExecutionTaskLog from "./ExecutionTaskLog";
import WorkflowActions from "./WorkflowActions";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { QueryStatus, WorkflowDagEngineMode } from "Constants";
import { RunStatus, WorkflowDag, WorkflowExecution, WorkflowExecutionStep, WorkflowSummary } from "Types";
import styles from "./main.module.scss";

type Props = {
  dag: WorkflowDag;
  workflow: UseQueryResult<WorkflowSummary>;
  workflowExecution: UseQueryResult<WorkflowExecution, Error>;
  version: number;
  history: any;
  location: any;
  match: any;
};

type State = {
  workflowDagBoundingClientRect: any;
};

class Main extends Component<Props, State> {
  workflowDagEngine: any;
  diagramRef: any;

  constructor(props: Props) {
    super(props);
    this.workflowDagEngine = new WorkflowDagEngine({
      dag: props.dag,
      mode: WorkflowDagEngineMode.Executor,
    });
    this.state = {
      workflowDagBoundingClientRect: {},
    };
    this.diagramRef = React.createRef<any>();
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
    let hasFinished = false;
    let hasStarted = false;

    if (workflowExecution.data) {
      const { status, steps } = workflowExecution.data;
      hasFinished = [RunStatus.Completed, RunStatus.Invalid, RunStatus.Failure].includes(status);
      hasStarted = steps
        ? Boolean(steps.find((step: WorkflowExecutionStep) => step.flowTaskStatus !== RunStatus.NotStarted))
        : false;
    }

    const isDiagramLoaded =
      workflow.status === QueryStatus.Success &&
      workflowExecution.status === QueryStatus.Success &&
      (hasStarted || hasFinished);

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{workflow.data ? `${workflow.data.name} - Activity` : `Activity`}</title>
        </Helmet>
        <ExecutionHeader workflow={workflow} workflowExecution={workflowExecution} version={version} />
        <section aria-label="Executions" className={styles.executionResultContainer}>
          <ExecutionTaskLog workflowExecution={workflowExecution} />
          <div className={styles.executionDesignerContainer} ref={this.diagramRef}>
            <div className={styles.executionWorkflowActions}>
              {workflow.data && <WorkflowActions workflow={workflow.data} />}
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
            {!isDiagramLoaded && (
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
