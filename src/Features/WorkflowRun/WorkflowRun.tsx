import React from "react";
import { ErrorMessage, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import queryString from "query-string";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import type { ReactFlowInstance } from "reactflow";
import { Box } from "reflexbox";
import ReactFlow from "Features/Reactflow";
import { useQuery } from "Hooks";
import { EditorContextProvider } from "State/context";
import { groupTasksByName } from "Utils";
import { WorkflowEngineMode } from "Constants";
import { serviceUrl } from "Config/servicesConfig";
import { PaginatedTaskResponse, RunStatus, Task, WorkflowEditor, WorkflowRun } from "Types";
import RunHeader from "./RunHeader";
import RunTaskLog from "./TaskRunList";
import WorkflowActions from "./WorkflowActions";
import styles from "./WorkflowRun.module.scss";

export default function WorkflowRunContainer() {
  const { team, workflowId, runId }: { team: string; workflowId: string; runId: string } = useParams();
  const getTasksUrl = serviceUrl.task.queryTasks({
    query: queryString.stringify({ statuses: "active" }),
  });
  const getTeamTasksUrl = serviceUrl.team.task.queryTasks({
    query: queryString.stringify({ statuses: "active" }),
    team: team,
  });
  const getExecutionUrl = serviceUrl.team.workflowrun.getWorkflowRun({ team: team, id: runId });

  /**
   * Queries
   */
  const executionQuery = useQuery<WorkflowRun>(getExecutionUrl, {
    refetchInterval: 5000,
  });

  const tasksQuery = useQuery<PaginatedTaskResponse>(getTasksUrl);
  const teamTasksQuery = useQuery<PaginatedTaskResponse>(getTeamTasksUrl);

  if (tasksQuery.isLoading || teamTasksQuery.isLoading || executionQuery.isLoading) {
    return (
      <>
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <Loading />
      </>
    );
  }

  if (tasksQuery.error || teamTasksQuery.error || executionQuery.error) {
    return (
      <Box mt="5rem">
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <ErrorMessage />
      </Box>
    );
  }

  if (tasksQuery.data && teamTasksQuery.data && executionQuery.data) {
    return (
      <RevisionContainer
        team={team}
        workflowRun={executionQuery.data}
        tasksData={[...tasksQuery.data.content, ...teamTasksQuery.data.content]}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

type RevisionProps = {
  team: string;
  tasksData: Task[];
  workflowId: string;
  workflowRun: WorkflowRun;
};

function RevisionContainer({ team, workflowRun, tasksData, workflowId }: RevisionProps) {
  const version = workflowRun.workflowVersion;
  const getWorkflowUrl = serviceUrl.team.workflow.getWorkflowCompose({
    team: team,
    id: workflowId,
    version,
  });

  const groupedTasks = groupTasksByName(tasksData);
  const workflowQuery = useQuery<WorkflowEditor>(getWorkflowUrl);

  if (workflowQuery.isLoading) {
    return (
      <>
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <Loading />
      </>
    );
  }

  if (workflowQuery.isError) {
    return (
      <Box mt="5rem">
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <ErrorMessage />
      </Box>
    );
  }

  if (workflowQuery.data) {
    return (
      <EditorContextProvider
        value={{
          mode: WorkflowEngineMode.Runner,
          tasksData: groupedTasks,
        }}
      >
        <Main workflow={workflowQuery.data} workflowRun={workflowRun} version={version} />
      </EditorContextProvider>
    );
  }

  return null;
}

type MainProps = {
  workflow: WorkflowEditor;
  workflowRun: WorkflowRun;
  version: number;
};

function Main(props: MainProps) {
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
  hasStarted = tasks ? Boolean(tasks.find((step) => step.status !== RunStatus.NotStarted)) : false;

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
          <div className={styles.executionWorkflowActions}>
            <WorkflowActions workflow={workflow} />
          </div>
          <ReactFlow
            mode={WorkflowEngineMode.Runner}
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
