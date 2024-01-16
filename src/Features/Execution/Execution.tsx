import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Box } from "reflexbox";
import { Loading, ErrorMessage } from "@boomerang-io/carbon-addons-boomerang-react";
import { useQuery } from "Hooks";
import { EditorContextProvider } from "State/context";
import Main from "./Main";
import { groupTaskTemplatesByName } from "Utils";
import queryString from "query-string";
import { PaginatedTaskTemplateResponse, TaskTemplate, WorkflowRun, WorkflowEditor } from "Types";
import { serviceUrl } from "Config/servicesConfig";
import { WorkflowEngineMode } from "Constants";

export default function ExecutionContainer() {
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
