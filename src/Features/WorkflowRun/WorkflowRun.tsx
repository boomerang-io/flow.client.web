import { ErrorMessage, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import type { ReactFlowInstance } from "reactflow";
import { EditorContextProvider } from "State/context";
import queryString from "query-string";
import { Box } from "reflexbox";
import ReactFlow from "Features/Reactflow";
import { useQuery } from "Hooks";
import { groupTaskTemplatesByName } from "Utils";
import RunHeader from "./RunHeader";
import RunTaskLog from "./RunTaskLog";
import WorkflowActions from "./WorkflowActions";
import styles from "./WorkflowRun.module.scss";
import { serviceUrl } from "Config/servicesConfig";
import { WorkflowEngineMode } from "Constants";
import { PaginatedTaskTemplateResponse, RunStatus, TaskTemplate, WorkflowEditor, WorkflowRun } from "Types";

export default function WorkflowRunContainer() {
  const { team, workflowId, runId }: { team: string; workflowId: string; runId: string } = useParams();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ statuses: "active" }),
  });
  const getTaskTemplatesTeamUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ teams: team, statuses: "active" }),
  });
  const getExecutionUrl = serviceUrl.getWorkflowRun({ runId });

  /**
   * Queries
   */
  const executionQuery = useQuery<WorkflowRun>(getExecutionUrl, {
    refetchInterval: 5000,
  });

  const taskTemplatesQuery = useQuery<PaginatedTaskTemplateResponse>(getTaskTemplatesUrl);
  const taskTemplatesTeamQuery = useQuery<PaginatedTaskTemplateResponse>(getTaskTemplatesTeamUrl);

  if (taskTemplatesQuery.isLoading || taskTemplatesTeamQuery.isLoading || executionQuery.isLoading) {
    return (
      <>
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <Loading />
      </>
    );
  }

  if (taskTemplatesQuery.error || taskTemplatesTeamQuery.error || executionQuery.error) {
    return (
      <Box mt="5rem">
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <ErrorMessage />
      </Box>
    );
  }

  if (taskTemplatesQuery.data && taskTemplatesTeamQuery.data && executionQuery.data) {
    return (
      <RevisionContainer
        workflowRun={executionQuery.data}
        taskTemplatesData={[...taskTemplatesQuery.data.content, ...taskTemplatesTeamQuery.data.content]}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

type RevisionProps = {
  taskTemplatesData: TaskTemplate[];
  workflowId: string;
  workflowRun: WorkflowRun;
};

function RevisionContainer({ workflowRun, taskTemplatesData, workflowId }: RevisionProps) {
  const version = workflowRun.workflowVersion;
  const getWorkflowUrl = serviceUrl.getWorkflowCompose({
    id: workflowId,
    version,
  });

  const groupedTaskTemplates = groupTaskTemplatesByName(taskTemplatesData);
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
          mode: WorkflowEngineMode.Executor,
          taskTemplatesData: groupedTaskTemplates,
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
