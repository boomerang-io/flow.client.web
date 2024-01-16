import React from "react";
import { Helmet } from "react-helmet";
import { Loading } from "@carbon/react";
import ReactFlow from "Features/Reactflow";
import RunHeader from "./RunHeader";
import RunTaskLog from "./RunTaskLog";
import WorkflowActions from "./WorkflowActions";
import type { ReactFlowInstance } from "reactflow";
import { RunStatus, RunTask, WorkflowEditor, WorkflowRun } from "Types";
import styles from "./main.module.scss";
import { WorkflowEngineMode } from "Constants";

type MainProps = {
  workflow: WorkflowEditor;
  workflowRun: WorkflowRun;
  version: number;
};

export default function Main(props: MainProps) {
  const { workflow, workflowRun, version } = props;
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  let hasFinished = false;
  let hasStarted = false;

  const { status, tasks } = workflowRun;
  hasFinished = [
    RunStatus.Invalid,
    RunStatus.Failed,
    RunStatus.TimedOut,
    RunStatus.Skipped,
    RunStatus.Succeeded,
  ].includes(status);
  hasStarted = tasks ? Boolean(tasks.find((step: RunTask) => step.status !== RunStatus.NotStarted)) : false;

  const isDiagramLoaded = hasStarted || hasFinished;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{workflow ? `${workflow.name} - Activity` : `Activity`}</title>
      </Helmet>
      <RunHeader workflow={workflow} workflowRun={workflowRun} version={version} />
      <section aria-label="Executions" className={styles.executionResultContainer}>
        <RunTaskLog workflowRun={workflowRun} />
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
