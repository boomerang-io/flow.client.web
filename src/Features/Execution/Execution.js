import React from "react";
import { Helmet } from "react-helmet";
import { ExecutionContextProvider } from "State/context";
import { Box } from "reflexbox";
import { useQuery } from "Hooks";
import { useParams } from "react-router-dom";
import { Loading, ErrorMessage } from "@boomerang-io/carbon-addons-boomerang-react";
import Main from "./Main";
import { serviceUrl } from "Config/servicesConfig";

const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();

export default function ExecutionContainer() {
  const { workflowId, executionId } = useParams();
  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getExecutionUrl = serviceUrl.getWorkflowExecution({ executionId });

  /**
   * Queries
   */
  const summaryQuery = useQuery(getSummaryUrl);
  const executionQuery = useQuery(getExecutionUrl, {
    refetchInterval: 5000,
  });
  const { data: taskTemplatesData, error: taskTemplatesError, isLoading: taskTempaltesAreLoading } = useQuery(
    getTaskTemplatesUrl
  );

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

function RevisionContainer({ executionQuery, summaryQuery, taskTemplatesData, workflowId }) {
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
