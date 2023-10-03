import React, { useCallback, useMemo, useRef, useState } from "react";
import { useFeature } from "flagged";
import { EditorContextProvider } from "State/context";
import { AxiosResponse } from "axios";
import { RevisionActionTypes, revisionReducer, initRevisionReducerState } from "State/reducers/workflowRevision";
import { useAppContext, useTeamContext, useQuery } from "Hooks";
import { useImmerReducer } from "use-immer";
import { useMutation, useQueryClient, UseMutationResult } from "react-query";
import { Prompt, Route, Switch, useLocation, useParams } from "react-router-dom";
import { Loading, Error, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeLog from "./ChangeLog";
import Configure from "./Configure";
import Designer from "./Designer";
import Tokens from "./Tokens";
import Header from "./Header";
import Parameters from "./Parameters";
import Schedule from "./Schedule";
import queryString from "query-string";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { AppPath } from "Config/appConfig";
import { groupTaskTemplatesByName } from "Utils";
import { FeatureFlag } from "Config/appConfig";
import { WorkflowEngineMode, WorkspaceConfigType } from "Constants";
import { WorkflowView } from "Constants";
import {
  ChangeLog as ChangeLogType,
  ConfigureWorkflowFormValues,
  DataDrivenInput,
  PaginatedTaskTemplateResponse,
  PaginatedWorkflowResponse,
  TaskTemplate,
  Workflow,
  WorkflowEditor,
} from "Types";
import { FormikProps } from "formik";
import type { ReactFlowInstance } from "reactflow";
import styles from "./editor.module.scss";

const CREATEABLE_PATHS = ["workflow", "parameters", "configure"];

export default function EditorContainer() {
  const { team } = useTeamContext();
  // Init revision number state is held here so we can easily refect the data on change via react-query

  const [revisionNumber, setRevisionNumber] = useState<string | number>("");
  const { workflowId }: { workflowId: string } = useParams();
  const queryClient = useQueryClient();

  const getWorkflowsUrl = serviceUrl.getWorkflows({ query: `teams=${team?.name}` });
  const getChangelogUrl = serviceUrl.getWorkflowChangelog({ id: workflowId });
  const getWorkflowUrl = serviceUrl.getWorkflowCompose({ id: workflowId, version: revisionNumber });

  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ statuses: "active" }),
  });
  const getTaskTemplatesTeamUrl = serviceUrl.getTaskTemplates({
    query: queryString.stringify({ teams: team?.name, statuses: "active" }),
  });

  const getAvailableParametersUrl = serviceUrl.workflowAvailableParameters({ workflowId });

  /**
   * Queries
   */
  const changeLogQuery = useQuery<ChangeLogType>(getChangelogUrl);
  const workflowQuery = useQuery<WorkflowEditor>(getWorkflowUrl);
  const workflowsQuery = useQuery<PaginatedWorkflowResponse>(getWorkflowsUrl);
  const taskTemplatesQuery = useQuery<PaginatedTaskTemplateResponse>(getTaskTemplatesUrl);
  const taskTemplatesTeamQuery = useQuery<PaginatedTaskTemplateResponse>(getTaskTemplatesTeamUrl);
  const availableParametersQuery = useQuery<Array<string>>(getAvailableParametersUrl, {});

  /**
   * Mutations
   */
  const revisionMutator = useMutation(resolver.putCreateWorkflowRevision);
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
  revisionMutator: UseMutationResult<AxiosResponse<Workflow, any>, unknown, { workflowId: any; body: any }, unknown>;
  parametersMutator: UseMutationResult<AxiosResponse<any, any>, unknown, { workflowId: any; body: any }, unknown>;
  workflowQueryData: WorkflowEditor;
  workflowsQueryData: PaginatedWorkflowResponse;
  setRevisionNumber: React.Dispatch<React.SetStateAction<string | number>>;
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
  setRevisionNumber,
  taskTemplatesList,
  workflowQueryData,
  workflowsQueryData,
  workflowId,
}) => {
  const workflowTokensEnabled = useFeature(FeatureFlag.WorkflowTokensEnabled);
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
  const [availableParameters, setAvailableParameters] = React.useState(availableParametersQueryData);
  const settingsRef = useRef<FormikProps<any> | null>(null);

  const handleCreateRevision = async ({ reason = "Update workflow", callback }: any) => {
    const configureValues = settingsRef?.current?.values ?? {};
    const formattedConfigureValue = formatConfigureValues(configureValues);

    if (workflow) {
      const workfowDagObject = workflow.toObject();
      const revision = {
        ...revisionState,
        ...workfowDagObject,
        ...formattedConfigureValue,
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
        queryClient.invalidateQueries(serviceUrl.workflowAvailableParameters({ workflowId }));
        queryClient.invalidateQueries(serviceUrl.getWorkflowChangelog({ id: workflowId }));
      } catch (err) {
        notify(
          <ToastNotification kind="error" title="Something's Wrong" subtitle={`Failed to create workflow version`} />
        );
      }
    }
  };

  const handleUpdateNotes = useCallback(
    (markdown: string) => {
      revisionDispatch({
        type: RevisionActionTypes.UpdateNotes,
        data: { markdown },
      });
    },
    [revisionDispatch]
  );

  /**
   * Welp this is more complicated than I hoped it would (has?) to be
   * We are making client side updates to the parameters available to a Workflow
   * parameters - defined at the Workflow-level in the Parameters tab
   * deletedParams - parameters that were removed
   * availableParameters - parameters supplied by its relationship to other entities
   *   - team
   *   - global
   *   - context
   *   that get requested and made available to Workflow task configuration
   * Parameters are represented in two ways, "flat" and "layer"
   * e.g. Workflow "api-token" as workflow.params.api-token and param.api-token.
   * e.g. Team "api-token" as team.params.api-token and param.api-token.
   *
   * When a token of value `api-token` gets added we need to add both versions
   * When a token of value `api-token` gets deleted we need to delete the workflow
   * layer version AND check if there is a matching higher layer one. If there
   * IS NOT then we need to delete the flat token as well
   *
   * All of this is bc params are versioned along w/ the Workflow so when we edit things
   * client side we need to propogate those changes within the workflow Editor
   */
  const handleUpdateParams = useCallback(
    (parameters: Array<DataDrivenInput>, deletedParameters: Array<DataDrivenInput>) => {
      revisionDispatch({
        type: RevisionActionTypes.UpdateConfig,
        data: { parameters },
      });

      const newAvailableParameters = [...availableParameters];

      for (let parameter of parameters) {
        newAvailableParameters.push(`workflow.params.${parameter.key}`, `params.${parameter.key}`);
      }

      const availableParameterSet = new Set(newAvailableParameters);
      for (let deletedParameter of deletedParameters) {
        const deletedWorkflowParamKey = `workflow.params.${deletedParameter.key}`;
        const deletedFlatParamKey = `params.${deletedParameter.key}`;
        const higherLayerParamList = [
          `context.params.${deletedParameter.key}`,
          `global.params.${deletedParameter.key}`,
          `team.params.${deletedParameter.key}`,
        ];

        availableParameterSet.delete(deletedWorkflowParamKey);
        const hasHigherLayerParam =
          availableParameterSet.has(higherLayerParamList[0]) ||
          availableParameterSet.has(higherLayerParamList[1]) ||
          availableParameterSet.has(higherLayerParamList[2]);

        if (!hasHigherLayerParam) {
          availableParameterSet.delete(deletedFlatParamKey);
        }
      }

      setAvailableParameters(Array.from(availableParameterSet));
    },
    [revisionDispatch, availableParameters, setAvailableParameters]
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
  const mode = version === revisionCount ? WorkflowEngineMode.Editor : WorkflowEngineMode.Viewer;

  const store = useMemo(() => {
    const taskTemplatesData = groupTaskTemplatesByName(taskTemplatesList);
    return {
      availableParameters,
      mode,
      revisionDispatch,
      revisionState,
      taskTemplatesData,
      workflowsQueryData,
    };
  }, [availableParameters, mode, revisionDispatch, revisionState, taskTemplatesList, workflowsQueryData]);

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
            canCreateNewVersion={CREATEABLE_PATHS.includes(location.pathname.split("/").pop() || "")}
            revisionState={revisionState}
            viewType={WorkflowView.Workflow}
            revisionCount={revisionCount}
            revisionMutator={revisionMutator}
          />
          <Switch>
            <Route path={AppPath.EditorDesigner}></Route>
            <Route path={AppPath.EditorProperties}>
              <Parameters workflow={revisionState} handleUpdateParams={handleUpdateParams} />
            </Route>
            {workflowTokensEnabled && (
              <Route path={AppPath.EditorTokens}>
                <Tokens workflow={revisionState} />
              </Route>
            )}
            <Route path={AppPath.EditorSchedule}>
              <Schedule workflow={revisionState} />
            </Route>
            <Route path={AppPath.EditorChangelog}>
              <ChangeLog changeLogData={changeLogData} />
            </Route>
          </Switch>
          {
            // Always render parent Configure component so state isn't lost when switching tabs
            // It is responsible for rendering its children, but Formik form management is always mounted
            <>
              <Designer
                notes={markdown}
                setWorkflow={setWorkflow}
                tasks={taskTemplatesList}
                updateNotes={handleUpdateNotes}
                workflow={revisionState}
              />
              <Configure quotas={quotas} workflow={revisionState} settingsRef={settingsRef} />
            </>
          }
        </div>
      </>
    </EditorContextProvider>
  );
};

/**
 * Format the form configure values into something that the API accepts
 * Update the `workspaces` and `labels` to be in the right format
 */
function formatConfigureValues(configureValues: ConfigureWorkflowFormValues): Partial<WorkflowEditor> {
  const optionalConfigureValues: Partial<ConfigureWorkflowFormValues> = configureValues;

  // Format labels
  const labelsKVObject = configureValues.labels.reduce((accum, current) => {
    accum[current.key] = current.value;
    return accum;
  }, {} as Record<string, string>);

  // Format workspaces
  const workflowStorageConfig = configureValues.storage?.workflow?.enabled
    ? {
        name: WorkspaceConfigType.Workflow,
        type: WorkspaceConfigType.Workflow,
        optional: false,
        spec: { size: configureValues.storage.workflow.size, mountPath: configureValues.storage.workflow.mountPath },
      }
    : null;

  const workflowRunStorageConfig = configureValues.storage?.workflowrun?.enabled
    ? {
        name: WorkspaceConfigType.WorflowRun,
        type: WorkspaceConfigType.WorflowRun,
        optional: false,
        spec: { size: configureValues.storage.workflow.size, mountPath: configureValues.storage.workflow.mountPath },
      }
    : null;

  const workspaces = [workflowStorageConfig, workflowRunStorageConfig].filter(Boolean) as WorkflowEditor["workspaces"];

  delete optionalConfigureValues["storage"];

  const formattedWorkflowConfig: Partial<WorkflowEditor> = {
    ...optionalConfigureValues,
    workspaces,
    labels: labelsKVObject,
  };

  return formattedWorkflowConfig;
}
