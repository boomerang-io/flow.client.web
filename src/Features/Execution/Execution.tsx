import { Helmet } from "react-helmet";
import { UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { Box } from "reflexbox";
import { Loading, ErrorMessage } from "@boomerang-io/carbon-addons-boomerang-react";
import { useQuery } from "Hooks";
import { EditorContextProvider } from "State/context";
import Main from "./Main";
import { groupTaskTemplatesByName } from "Utils";
import queryString from "query-string";
import { TaskTemplate, WorkflowExecution, WorkflowEditor } from "Types";
import { serviceUrl } from "Config/servicesConfig";
import { WorkflowEngineMode } from "Constants";

export default function ExecutionContainer() {
  const { team, workflowId, executionId }: { team: string; workflowId: string; executionId: string } = useParams();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ statuses: "active" }),
  });
  const getTaskTemplatesTeamUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ teams: team, statuses: "active" }),
  });
  const getExecutionUrl = serviceUrl.getWorkflowExecution({ executionId });

  /**
   * Queries
   */
  const executionQuery = useQuery<WorkflowExecution>(getExecutionUrl, {
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

  if (taskTemplatesQuery.data || taskTemplatesTeamQuery.data || executionQuery.data) {
    return (
      <RevisionContainer
        executionQuery={executionQuery}
        taskTemplatesData={[...taskTemplatesQuery.data.content, ...taskTemplatesTeamQuery.data.content]}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

type RevisionProps = {
  executionQuery: UseQueryResult<WorkflowExecution, Error>;
  taskTemplatesData: TaskTemplate[];
  workflowId: string;
};

function RevisionContainer({ executionQuery, taskTemplatesData, workflowId }: RevisionProps) {
  const version = executionQuery?.data?.workflowRevisionVersion ?? "";
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
          workflowExecution: executionQuery.data,
          workflow: workflowQuery.data,
        }}
      >
        <Main workflow={workflowQuery.data} workflowExecution={executionQuery} version={version} />
      </EditorContextProvider>
    );
  }

  return null;
}
