import React from "react";
import { ExecutionContext } from "State/context";
import { useQuery } from "Hooks";
import { useParams } from "react-router-dom";
import { Loading, Error } from "@boomerang/carbon-addons-boomerang-react";
import Main from "./Main";
import { serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants";

const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();

export default function ExecutionContainer() {
  const { workflowId, executionId } = useParams();
  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getRevisionUrl = serviceUrl.getWorkflowRevision({ workflowId });
  const getExecutionUrl = serviceUrl.getWorkflowExecution({ executionId });

  /**
   * Queries
   */
  const summaryQuery = useQuery(getSummaryUrl);
  const revisionQuery = useQuery(getRevisionUrl);
  const taskTemplatesQuery = useQuery(getTaskTemplatesUrl);
  const executionQuery = useQuery(getExecutionUrl, {
    refetchInterval: 5000,
  });

  const summaryIsLoading = summaryQuery.status === QueryStatus.Loading;
  const revisionIsLoading = revisionQuery.status === QueryStatus.Loading;
  const taskTempaltesAreLoading = taskTemplatesQuery.status === QueryStatus.Loading;

  if (taskTempaltesAreLoading || revisionIsLoading || summaryIsLoading) {
    return <Loading />;
  }

  if (summaryQuery.error || revisionQuery.error || taskTemplatesQuery.error || executionQuery.error) {
    return <Error />;
  }

  if (revisionQuery.data && taskTemplatesQuery.data && executionQuery.data) {
    return (
      <ExecutionContext.Provider
        value={{
          tasks: taskTemplatesQuery.data,
          workflowExecution: executionQuery.data,
          workflowRevision: revisionQuery.data,
        }}
      >
        <Main dag={revisionQuery.data.dag} workflow={summaryQuery} workflowExecution={executionQuery} />
      </ExecutionContext.Provider>
    );
  }

  return null;
}
