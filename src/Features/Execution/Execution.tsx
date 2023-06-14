import { Helmet } from "react-helmet";
import { UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { Box } from "reflexbox";
import { Loading, ErrorMessage } from "@boomerang-io/carbon-addons-boomerang-react";
import { useQuery } from "Hooks";
import { ExecutionContextProvider } from "State/context";
import Main from "./Main";
import { TaskTemplate, WorkflowExecution, WorkflowSummary } from "Types";
import { serviceUrl } from "Config/servicesConfig";

export default function ExecutionContainer() {
  const { workflowId, executionId }: { workflowId: string; executionId: string } = useParams();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({ query: workflowId });
  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getExecutionUrl = serviceUrl.getWorkflowExecution({ executionId });

  /**
   * Queries
   */
  const summaryQuery = useQuery<WorkflowSummary>(getSummaryUrl);
  const executionQuery = useQuery<WorkflowExecution>(getExecutionUrl, {
    refetchInterval: 5000,
  });
  const {
    data: taskTemplatesData,
    error: taskTemplatesError,
    isLoading: taskTempaltesAreLoading,
  } = useQuery<TaskTemplate[]>(getTaskTemplatesUrl);

  if (taskTempaltesAreLoading || summaryQuery.isLoading) {
    return (
      <>
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <Loading />
      </>
    );
  }

  if (summaryQuery.error || taskTemplatesError || executionQuery.error) {
    return (
      <Box mt="5rem">
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <ErrorMessage />
      </Box>
    );
  }

  if (taskTemplatesData && executionQuery.data) {
    return (
      <RevisionContainer
        taskTemplatesData={taskTemplatesData}
        executionQuery={executionQuery}
        summaryQuery={summaryQuery}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

type RevisionProps = {
  executionQuery: UseQueryResult<WorkflowExecution, Error>;
  summaryQuery: UseQueryResult<WorkflowSummary, Error>;
  taskTemplatesData: TaskTemplate[];
  workflowId: string;
};

function RevisionContainer({ executionQuery, summaryQuery, taskTemplatesData, workflowId }: RevisionProps) {
  const getRevisionUrl = serviceUrl.getWorkflowRevision({
    workflowId,
    revisionNumber: executionQuery?.data?.workflowRevisionVersion ?? undefined,
  });

  const { data: revisionData, error: revisionError, isLoading: revisionIsLoading } = useQuery(getRevisionUrl);

  if (revisionIsLoading) {
    return (
      <>
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <Loading />
      </>
    );
  }

  if (revisionError) {
    return (
      <Box mt="5rem">
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <ErrorMessage />
      </Box>
    );
  }

  return (
    <ExecutionContextProvider
      value={{
        tasks: taskTemplatesData,
        workflowExecution: executionQuery.data,
        workflowRevision: revisionData,
      }}
    >
      <Main
        dag={revisionData.dag}
        workflow={summaryQuery}
        workflowExecution={executionQuery}
        version={revisionData.version}
      />
    </ExecutionContextProvider>
  );
}
