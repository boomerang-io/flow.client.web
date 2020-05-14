import React from "react";
import { ExecutionContext } from "State/context";
import { useParams } from "react-router-dom";
import { Loading, Error } from "@boomerang/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { useQuery, queryCache } from "react-query";
import { QueryStatus } from "Constants";
import Main from "../Execution/Main";

export const ActivityIdContext = React.createContext("");

export default function WorkflowExecutionContainer() {
  const { workflowId, executionId } = useParams();
  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getRevisionUrl = serviceUrl.getWorkflowRevision({ workflowId });
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();

  const getExecutionUrl = serviceUrl.getWorkflowExecution({ executionId });

  /**
   * Queries
   */
  const summaryQuery = useQuery({
    queryKey: getSummaryUrl,
    queryFn: resolver.query(getSummaryUrl)
  });
  const revisionQuery = useQuery({
    queryKey: getRevisionUrl,
    queryFn: resolver.query(getRevisionUrl)
  });
  const taskTemplatesQuery = useQuery({
    queryKey: getTaskTemplatesUrl,
    queryFn: resolver.query(getTaskTemplatesUrl)
  });

  const executionQuery = useQuery({
    queryKey: getExecutionUrl,
    queryFn: resolver.query(getExecutionUrl),
    config: {
      refetchInterval: 5000
    }
  });

  const summaryIsLoading = summaryQuery.status === QueryStatus.Loading;
  const revisionIsLoading = revisionQuery.status === QueryStatus.Loading;
  const taskTempaltesAreLoading = taskTemplatesQuery.status === QueryStatus.Loading;
  //   const executionIsLoading = executionQuery.status === QueryStatus.Loading;

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
          workflowRevision: revisionQuery.data
        }}
      >
        <Main dag={revisionQuery?.data?.dag} workflowExecution={executionQuery} workflow={summaryQuery} />
      </ExecutionContext.Provider>
    );
  }

  return null;
}
