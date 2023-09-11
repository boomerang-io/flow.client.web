import React, { useCallback, useMemo, useState } from "react";
import { EditorContextProvider } from "State/context";
import { AxiosResponse } from "axios";
import { RevisionActionTypes, revisionReducer, initRevisionReducerState } from "State/reducers/workflowRevision";
import { useAppContext, useTeamContext, useIsModalOpen, useQuery } from "Hooks";
import { useImmerReducer } from "use-immer";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { Prompt, Route, Switch, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { Loading, Error, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeLog from "./ChangeLog";
import Configure from "./Configure";
import Designer from "./Designer";
import Header from "./Header";
import Parameters from "./Parameters";
import Schedule from "./Schedule";
import queryString from "query-string";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { AppPath } from "Config/appConfig";
import { groupTaskTemplatesByName } from "Utils";
import { WorkflowDagEngineMode } from "Constants";
import {
  ChangeLog as ChangeLogType,
  PaginatedWorkflowResponse,
  TaskTemplate,
  WorkflowView,
  WorkflowCanvas,
} from "Types";
import type { ReactFlowInstance } from "reactflow";
import styles from "./editor.module.scss";

export default function EditorContainer() {
  const { team } = useTeamContext();
  // Init revision number state is held here so we can easily refect the data on change via react-query

  const [revisionNumber, setRevisionNumber] = useState<string>("");
  const { workflowId }: { workflowId: string } = useParams();
  const queryClient = useQueryClient();

  const getWorkflowsUrl = serviceUrl.getWorkflows({ query: `teams=${team?.id}` });
  const getChangelogUrl = serviceUrl.getWorkflowChangelog({ id: workflowId });
  const getWorkflowUrl = serviceUrl.getWorkflowCompose({ id: workflowId, version: revisionNumber });

  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ statuses: "active" }),
  });
  const getTaskTemplatesTeamUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ teams: team?.id, statuses: "active" }),
  });

  const getAvailableParametersUrl = serviceUrl.workflowAvailableParameters({ workflowId });

  /**
   * Queries
   */
  const changeLogQuery = useQuery(getChangelogUrl);
  const workflowQuery = useQuery<WorkflowCanvas>(getWorkflowUrl);
  const workflowsQuery = useQuery<PaginatedWorkflowResponse>(getWorkflowsUrl);
  const taskTemplatesQuery = useQuery(getTaskTemplatesUrl);
  const taskTemplatesTeamQuery = useQuery(getTaskTemplatesTeamUrl);
  const availableParametersQuery = useQuery(getAvailableParametersUrl);

  /**
   * Mutations
   */
  const revisionMutator = useMutation(resolver.putCreateWorkflowRevision, {
    onSuccess: () => {
      queryClient.invalidateQueries(getWorkflowUrl);
    },
  });

  const parametersMutator = useMutation(resolver.postWorkflowAvailableParameters, {
    onSuccess: (response) =>
      queryClient.setQueryData(serviceUrl.workflowAvailableParameters({ workflowId }), response.data),
  });

  // Only show loading for the summary and task templates
  // Revision takes longer and we want to show a separate loading animation for it, plus prevent remounting everything
  if (
    workflowQuery.isLoading ||
    workflowsQuery.isLoading ||
    changeLogQuery.isLoading ||
    taskTemplatesQuery.isLoading ||
    taskTemplatesTeamQuery.isLoading ||
    availableParametersQuery.isLoading
  ) {
    return <Loading />;
  }

  if (
    workflowQuery.error ||
    workflowsQuery.error ||
    changeLogQuery.error ||
    taskTemplatesQuery.error ||
    taskTemplatesTeamQuery.error ||
    availableParametersQuery.error
  ) {
    return <Error />;
  }

  // Don't block render if we don't have the revision data. We want to render the header and sidenav regardless
  // prevents unnecessary remounting when creating a new version or navigating to a previous one
  if (
    workflowQuery.data &&
    workflowsQuery.data &&
    changeLogQuery.data &&
    taskTemplatesQuery.data &&
    taskTemplatesTeamQuery.data &&
    availableParametersQuery.data
  ) {
    const taskTemplatesList = [...taskTemplatesQuery.data.content, ...taskTemplatesTeamQuery.data.content];
    return (
      <EditorStateContainer
        availableParametersQueryData={availableParametersQuery.data}
        parametersMutator={parametersMutator}
        changeLogData={changeLogQuery.data}
        revisionMutator={revisionMutator}
        workflowQueryData={workflowQuery.data}
        workflowsQueryData={workflowsQuery.data}
        setRevisionNumber={setRevisionNumber}
        taskTemplatesList={taskTemplatesList}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

interface EditorStateContainerProps {
  availableParametersQueryData: Array<string>;
  changeLogData: ChangeLogType;
  revisionMutator: UseMutationResult<AxiosResponse<any, any>, unknown, { workflowId: any; body: any }, unknown>;
  parametersMutator: UseMutationResult<AxiosResponse<any, any>, unknown, { workflowId: any; body: any }, unknown>;
  workflowQueryData: WorkflowCanvas;
  workflowsQueryData: PaginatedWorkflowResponse;
  setRevisionNumber: (revisionNumber: string) => void;
  taskTemplatesList: Array<TaskTemplate>;
  workflowId: string;
}

/**
 * Workflow Manager responsible for holding state of summary and revision
 * Make function calls to mutate server data
 */
const EditorStateContainer: React.FC<EditorStateContainerProps> = ({
  availableParametersQueryData,
  changeLogData,
  revisionMutator,
  parametersMutator,
  setRevisionNumber,
  taskTemplatesList,
  workflowQueryData,
  workflowsQueryData,
  workflowId,
}) => {
  const location = useLocation();
  //const match: { params: { workflowId: string } } = useRouteMatch();
  const { quotas } = useAppContext();
  //const isModalOpen = useIsModalOpen();
  const queryClient = useQueryClient();

  const [revisionState, revisionDispatch] = useImmerReducer(
    revisionReducer,
    initRevisionReducerState(workflowQueryData)
  );

  const [workflow, setWorkflow] = React.useState<ReactFlowInstance | null>(null);

  // //Triggers the POST request for refresh availableParameters
  // useEffect(() => {
  //   if (JSON.stringify(revisionConfig) !== JSON.stringify(revisionState)) {
  //     const normilzedConfig = Object.values(revisionState.config).map((config: any) => ({
  //       ...config,
  //       currentVersion: undefined,
  //       taskVersion: config.currentVersion || config.taskVersion,
  //     }));
  //     const revisionConfig = { nodes: Object.values(normilzedConfig) };
  //     const revision = {
  //       changelog: revisionState.changelog,
  //       config: revisionConfig,
  //       dag: revisionState.dag,
  //     };
  //     setRevisionConfig(revisionState);
  //     parametersMutator.mutateAsync({ workflowId, body: revision });
  //   }
  // }, [parametersMutator, workflowId, revisionState, revisionConfig]);

  const handleCreateRevision = useCallback(
    async ({ reason = "Update workflow", callback }) => {
      if (workflow) {
        const state = workflow.toObject();
        const revision = {
          ...revisionState,
          ...state,
          changelog: { reason },
        };

        try {
          const { data } = await revisionMutator.mutateAsync({ workflowId, body: revision });
          notify(
            <ToastNotification kind="success" title="Create Version" subtitle="Successfully created workflow version" />
          );
          if (typeof callback === "function") {
            callback();
          }
          revisionDispatch({ type: RevisionActionTypes.Set, data });
          setRevisionNumber(data.version);
          queryClient.removeQueries(serviceUrl.getWorkflowRevision({ workflowId, revisionNumber: null }));
          queryClient.removeQueries(serviceUrl.workflowAvailableParameters({ workflowId }));
        } catch (err) {
          notify(
            <ToastNotification kind="error" title="Something's Wrong" subtitle={`Failed to create workflow version`} />
          );
        }
      }
    },
    [revisionMutator, queryClient, revisionDispatch, setRevisionNumber, workflowId, revisionState, workflow]
  );

  /**
   *
   * @param {Object} formikValues - key/value pairs for inputs
   */
  const updateSummary = useCallback(
    async ({ values: formikValues }) => {
      const flowTeamId = formikValues?.selectedTeam?.id;
      const updatedWorkflow = { ...workflowQueryData, ...formikValues, flowTeamId };

      try {
        const { data } = await revisionMutator.mutateAsync({ workflowId, body: updatedWorkflow });
        queryClient.setQueryData(serviceUrl.getWorkflowSummary({ workflowId }), data);
        notify(
          <ToastNotification kind="success" title="Workflow Updated" subtitle={`Successfully updated workflow`} />
        );
      } catch (err) {
        notify(
          <ToastNotification
            kind="error"
            title="Something's Wrong"
            subtitle={`Failed to update workflow configuration`}
          />
        );
      }
    },
    [revisionMutator, queryClient, workflowQueryData, workflowId]
  );

  const handleUpdateNotes = useCallback(
    ({ markdown }) => {
      revisionDispatch({
        type: RevisionActionTypes.UpdateNotes,
        data: { markdown },
      });
    },
    [revisionDispatch]
  );

  /**
   *  Simply update the parent state to use a different revision to fetch it w/ react-query
   * @param {string} revisionNumber
   */
  const handleChangeRevision = (revisionNumber: string) => {
    return setRevisionNumber(revisionNumber);
  };

  const revisionCount = changeLogData.length;
  const { markdown, version } = revisionState;
  const mode = version === revisionCount ? WorkflowDagEngineMode.Editor : WorkflowDagEngineMode.Viewer;

  const store = useMemo(() => {
    const taskTemplatesData = groupTaskTemplatesByName(taskTemplatesList);
    return {
      availableParametersQueryData,
      mode,
      revisionDispatch,
      revisionState,
      taskTemplatesData,
      workflowsQueryData,
    };
  }, [availableParametersQueryData, mode, revisionDispatch, revisionState, taskTemplatesList, workflowsQueryData]);

  return (
    // Must create context to share state w/ nodes that are created by the DAG engine
    <EditorContextProvider value={store}>
      <>
        <Prompt
          when={Boolean(revisionState.hasUnsavedUpdates)}
          message={(location) =>
            //Return true to navigate if going to the same route we are currently on
            location.pathname.includes(workflowId)
              ? true
              : "Are you sure? You have unsaved changes to your workflow that will be lost."
          }
        />
        <div className={styles.container}>
          <Header
            changeLog={changeLogData}
            changeRevision={handleChangeRevision}
            createRevision={handleCreateRevision}
            isOnDesigner={location.pathname.endsWith("/workflow")}
            revisionState={revisionState}
            viewType={WorkflowView.Workflow}
            revisionCount={revisionCount}
            revisionMutator={revisionMutator}
          />
          <Switch>
            <Route path={AppPath.EditorDesigner}>
              <Designer
                notes={markdown}
                setWorkflow={setWorkflow}
                tasks={taskTemplatesList}
                updateNotes={handleUpdateNotes}
                workflow={revisionState}
              />
            </Route>
            <Route path={AppPath.EditorProperties}>
              <Parameters workflow={revisionState} />
            </Route>
            <Route path={AppPath.EditorSchedule}>
              <Schedule summaryData={revisionState} />
            </Route>
            <Route path={AppPath.EditorChangelog}>
              <ChangeLog summaryData={revisionState} />
            </Route>
          </Switch>
          <Route
            // Always render parent Configure component so state isn't lost when switching tabs
            // It is responsible for rendering its children, but Formik form management is always mounted
            path={AppPath.EditorConfigure}
          >
            <Configure
              quotas={quotas}
              summaryData={revisionState}
              summaryMutation={revisionMutator}
              updateSummary={updateSummary}
            />
          </Route>
        </div>
      </>
    </EditorContextProvider>
  );
};
