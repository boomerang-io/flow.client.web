import React from "react";
import { Helmet } from "react-helmet";
import { UseQueryResult } from "react-query";
import { Loading } from "@carbon/react";
import ReactFlow from "Features/Reactflow";
import ExecutionHeader from "./ExecutionHeader";
import WorkflowActions from "./WorkflowActions";
import type { ReactFlowInstance } from "reactflow";
import { RunStatus, WorkflowExecution, WorkflowExecutionStep, WorkflowEditor } from "Types";
import styles from "./main.module.scss";
import { WorkflowEngineMode } from "Constants";

type MainProps = {
  workflow: WorkflowEditor;
  workflowExecution: UseQueryResult<WorkflowExecution, Error>;
  version: string | number;
};

export default function Main(props: MainProps) {
  const { workflow, workflowExecution, version } = props;
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  let hasFinished = false;
  let hasStarted = false;

  if (workflowExecution.data) {
    const { status, steps } = workflowExecution.data;
    hasFinished = [
      RunStatus.Invalid,
      RunStatus.Failed,
      RunStatus.TimedOut,
      RunStatus.Skipped,
      RunStatus.Succeeded,
    ].includes(status);
    hasStarted = steps
      ? Boolean(steps.find((step: WorkflowExecutionStep) => step.flowTaskStatus !== RunStatus.NotStarted))
      : false;
  }

  const isDiagramLoaded = hasStarted || hasFinished;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{workflow ? `${workflow.name} - Activity` : `Activity`}</title>
      </Helmet>
      <ExecutionHeader workflow={workflow} workflowExecution={workflowExecution} version={parseInt(version)} />
      <section aria-label="Executions" className={styles.executionResultContainer}>
        {
          //<ExecutionTaskLog workflowExecution={workflowExecution} />
        }
        <div className={styles.executionDesignerContainer}>
          <div className={styles.executionWorkflowActions}>{workflow && <WorkflowActions workflow={workflow} />}</div>
          <ReactFlow
            mode={WorkflowEngineMode.Executor}
            nodes={workflow.nodes}
            edges={workflow.edges}
            reactFlowInstance={reactFlowInstance}
            setReactFlowInstance={setReactFlowInstance}
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
