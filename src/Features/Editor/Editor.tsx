// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosResponse } from "axios";
import { History } from "history";
import { MutateOptions, MutationResult } from "react-query";
import { EditorContext } from "State/context";
import { RevisionActionTypes, revisionReducer, initRevisionReducerState } from "State/reducers/workflowRevision";
import { useAppContext, useIsModalOpen, useQuery } from "Hooks";
import { useImmerReducer } from "use-immer";
import { useMutation, queryCache } from "react-query";
import { Prompt, Route, Switch, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { Loading, Error, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import ChangeLog from "./ChangeLog";
import Header from "./Header";
import Configure from "./Configure";
import Designer from "./Designer";
import Properties from "./Properties";
import sortBy from "lodash/sortBy";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import CustomNodeModel from "Utils/dag/customTaskNode/CustomTaskNodeModel";
import SwitchNodeModel from "Utils/dag/switchNode/SwitchNodeModel";
import TemplateNodeModel from "Utils/dag/templateTaskNode/TemplateTaskNodeModel";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appPath } from "Config/appConfig";
import { NodeType } from "Constants";
import { WorkflowSummary } from "Types";
import styles from "./editor.module.scss";

export default function EditorContainer() {
  // Init revision number state is held here so we can easily refect the data on change via react-query

  const [revisionNumber, setRevisionNumber] = useState(0);
  const { workflowId } = useParams();

  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getRevisionUrl = serviceUrl.getWorkflowRevision({ workflowId, revisionNumber });
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();

  /**
   * Queries
   */
  const summaryQuery = useQuery(getSummaryUrl);
  const revisionQuery = useQuery(getRevisionUrl, { refetchOnWindowFocus: false });
  const taskTemplatesQuery = useQuery(getTaskTemplatesUrl);

  /**
   * Mutations
   */
  const [mutateSummary, summaryMutation] = useMutation(resolver.patchUpdateWorkflowSummary, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTeams()),
  });
  const [mutateRevision, revisionMutation] = useMutation(resolver.postCreateWorkflowRevision, {
    onSuccess: () => {
      queryCache.invalidateQueries(serviceUrl.getTeams());
      queryCache.invalidateQueries(getSummaryUrl);
    },
  });

  // Only show loading for the summary and task templates
  // Revision takes longer and we want to show a separate loading animation for it, plus prevent remounting everything
  if (summaryQuery.isLoading || taskTemplatesQuery.isLoading) {
    return <Loading />;
  }

  if (summaryQuery.error || taskTemplatesQuery.error) {
    return <Error />;
  }

  // Don't block render if we don't have the revision data. We want to render the header and sidenav regardless
  // prevents unnecessary remounting when creating a new version or navigating to a previous one
  if (summaryQuery.data && taskTemplatesQuery.data) {
    return (
      <EditorStateContainer
        mutateRevision={mutateRevision}
        mutateSummary={mutateSummary}
        revisionMutation={revisionMutation}
        revisionNumber={revisionNumber}
        revisionQuery={revisionQuery}
        summaryMutation={summaryMutation}
        summaryQuery={summaryQuery}
        setRevisionNumber={setRevisionNumber}
        taskTemplatesData={taskTemplatesQuery.data}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

interface EditorStateContainerProps {
  mutateRevision: (
    variables: { workflowId: any; body: any },
    options?: MutateOptions<AxiosResponse<any>, { workflowId: any; body: any }, Error> | undefined
  ) => Promise<any>;
  mutateSummary: (
    variables: { body: any },
    options?: MutateOptions<AxiosResponse<any>, { body: any }, Error> | undefined
  ) => Promise<any>;
  revisionMutation: MutationResult<AxiosResponse<any>, Error>;
  revisionNumber: number;
  revisionQuery: {
    data: {};
    status: string;
  };
  summaryQuery: {
    data: WorkflowSummary;
    status: string;
  };
  summaryMutation: MutationResult<AxiosResponse<any>, Error>;
  setRevisionNumber: (revisionNumber: number) => void;
  taskTemplatesData: Array<{ id: string }>;
  workflowId: string;
}

/**
 * Workflow Manager responsible for holding state of summary and revision
 * Make function calls to mutate server data
 */
export function EditorStateContainer({
  mutateRevision,
  mutateSummary,
  revisionMutation,
  revisionNumber,
  revisionQuery,
  summaryQuery,
  summaryMutation,
  setRevisionNumber,
  taskTemplatesData,
  workflowId,
  ...props
}: EditorStateContainerProps) {
  const location = useLocation();
  const match: { params: { teamId: string; workflowId: string } } = useRouteMatch();
  const { teams } = useAppContext();
  const isModalOpen = useIsModalOpen();

  const [workflowDagEngine, setWorkflowDagEngine] = useState<WorkflowDagEngine | null>(null);
  const [revisionState, revisionDispatch] = useImmerReducer(
    revisionReducer,
    initRevisionReducerState(revisionQuery.data)
  );

  // Reset the reducer state if there is new data
  useEffect(() => {
    if (revisionQuery.data) {
      revisionDispatch({
        type: RevisionActionTypes.Reset,
        data: revisionQuery.data,
      });
    }
  }, [revisionDispatch, revisionQuery.data]);

  const { data: summaryData } = summaryQuery;

  /**
   *
   * @param {string} reason - changelog reason for new version
   * @param {function} callback - optional callback
   */
  const handleCreateRevision = useCallback(
    async ({ reason = "Update workflow", callback }) => {
      const normilzedConfig = Object.values(revisionState.config).map((config: any) => ({
        ...config,
        currentVersion: undefined,
        taskVersion: config.currentVersion || config.taskVersion,
      }));
      const revisionConfig = { nodes: Object.values(normilzedConfig) };

      const revision = {
        dag: workflowDagEngine?.getDiagramEngine().getDiagramModel().serializeDiagram(),
        config: revisionConfig,
        changelog: { reason },
      };

      try {
        const { data } = await mutateRevision({ workflowId, body: revision });
        notify(
          <ToastNotification kind="success" title="Create Version" subtitle="Successfully created workflow version" />
        );
        if (typeof callback === "function") {
          callback();
        }
        revisionDispatch({ type: RevisionActionTypes.Set, data });
        setRevisionNumber(data.version);
      } catch (err) {
        notify(
          <ToastNotification kind="error" title="Something's Wrong" subtitle={`Failed to create workflow version`} />
        );
      }
    },
    [mutateRevision, revisionDispatch, revisionState.config, setRevisionNumber, workflowDagEngine, workflowId]
  );

  /**
   *
   * @param {Object} formikValues - key/value pairs for inputs
   */
  const updateSummary = useCallback(
    async ({ values: formikValues, callback }) => {
      const flowTeamId = formikValues?.selectedTeam?.id;
      const updatedWorkflow = { ...summaryData, ...formikValues, flowTeamId };

      try {
        const { data } = await mutateSummary({ body: updatedWorkflow });
        queryCache.setQueryData(serviceUrl.getWorkflowSummary({ workflowId }), data);
        notify(
          <ToastNotification kind="success" title="Workflow Updated" subtitle={`Successfully updated workflow`} />
        );
        if (typeof callback === "function") {
          callback();
        }
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
    [mutateSummary, summaryData, workflowId]
  );

  /**
   * Handle the drop event to create a new node from a task template
   * @param {Object} diagramApp - object containing the internal state of the DAG
   * @param {DragEvent} event - dragend event when adding a node to the diagram
   */
  const handleCreateNode = useCallback(
    (diagramApp, event) => {
      const { taskData } = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));

      // For naming purposes
      const nodes: Array<{ id: string; taskId: string }> = Object.values(
        diagramApp.getDiagramEngine().getDiagramModel().getNodes()
      );

      const nodesOfSameTypeCount = nodes.filter((node: any) => node.taskId === taskData.id).length;

      const nodeObj = {
        taskId: taskData.id,
        taskName: `${taskData.name} ${nodesOfSameTypeCount + 1}`,
        taskVersion: taskData.currentVersion,
      };

      // Determine the node type
      let node;
      switch (taskData.nodeType) {
        case NodeType.Decision:
          node = new SwitchNodeModel(nodeObj);
          break;
        case NodeType.TemplateTask:
          node = new TemplateNodeModel(nodeObj);
          break;
        case NodeType.CustomTask:
          node = new CustomNodeModel(nodeObj);
          break;
        default:
        // no-op
      }
      if (node) {
        const { id, taskId, currentVersion } = node;
        const currentTaskConfig =
          taskData.revisions?.find((revision: { version: number }) => revision.version === currentVersion) ?? {};

        // Create inputs object with empty string values by default for service to process easily
        const inputs =
          Array.isArray(currentTaskConfig.config) && currentTaskConfig.config.length
            ? currentTaskConfig.config.reduce((accu: { [index: string]: string }, item: { key: string }) => {
                accu[item.key] = "";
                return accu;
              }, {})
            : {};
        revisionDispatch({
          type: RevisionActionTypes.AddNode,
          data: {
            nodeId: id,
            taskId,
            inputs,
            type: taskData.nodeType,
            taskVersion: currentVersion,
          },
        });

        const points = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
        node.x = points.x - 110;
        node.y = points.y - 40;
        diagramApp.getDiagramEngine().getDiagramModel().addNode(node);
      }
    },
    [revisionDispatch]
  );

  /**
   *  Simply update the parent state to use a different revision to fetch it w/ react-query
   * @param {string} revisionNumber
   */
  const handleChangeRevision = useCallback(
    (revisionNumber) => {
      setRevisionNumber(revisionNumber);
    },
    [setRevisionNumber]
  );

  const { revisionCount } = summaryData;
  const { version } = revisionState;
  const isModelLocked = version < revisionCount;

  useEffect(() => {
    // Initial value of revisionState will be null, so need to check its present or we get two engines created
    if (revisionState.version) {
      const newWorkflowDagEngine = new WorkflowDagEngine({ dag: revisionState.dag, isModelLocked });
      setWorkflowDagEngine(newWorkflowDagEngine);
      newWorkflowDagEngine.getDiagramEngine().repaintCanvas();
    }

    // really and truly only want to rerun this on version change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionState.version]);

  const memoizedEditor = useMemo(() => {
    return (
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
            changeRevision={handleChangeRevision}
            createRevision={handleCreateRevision}
            isOnDesigner={location.pathname.endsWith("/workflow")}
            revisionState={revisionState}
            revisionMutation={revisionMutation}
            revisionQuery={revisionQuery}
            summaryData={summaryData}
          />
          <Switch>
            <Route path={appPath.editorDesigner}>
              <Designer
                createNode={handleCreateNode}
                isModalOpen={isModalOpen}
                revisionQuery={revisionQuery}
                summaryData={summaryData}
                tasks={taskTemplatesData}
                workflowDagEngine={workflowDagEngine}
              />
            </Route>
            <Route path={appPath.editorProperties}>
              <Properties summaryData={summaryData} />
            </Route>

            <Route path={appPath.editorChangelog}>
              <ChangeLog summaryData={summaryData} />
            </Route>
          </Switch>
          <Route
            path={appPath.editorConfigure}
            children={({ history, match: routeMatch }: { history: History; match: match }) => (
              // Always render parent Configure component so state isn't lost when switching tabs
              // It is responsible for rendering its children, but Formik form management is always mounted
              <Configure
                history={history}
                isOnRoute={Boolean(routeMatch)}
                params={match.params}
                summaryData={summaryData}
                summaryMutation={summaryMutation}
                teams={sortBy(teams, "name")}
                updateSummary={updateSummary}
              />
            )}
          />
        </div>
      </>
    );
  }, [
    handleChangeRevision,
    handleCreateNode,
    handleCreateRevision,
    isModalOpen,
    location.pathname,
    match.params,
    revisionMutation,
    revisionQuery,
    revisionState,
    summaryData,
    summaryMutation,
    taskTemplatesData,
    teams,
    updateSummary,
    workflowDagEngine,
    workflowId,
  ]);

  const store = useMemo(() => {
    return {
      revisionDispatch,
      revisionState,
      summaryQuery,
      taskTemplatesData,
    };
  }, [revisionDispatch, revisionState, summaryQuery, taskTemplatesData]);

  return (
    // Must create context to share state w/ nodes that are created by the DAG engine
    <EditorContext.Provider value={store}>{memoizedEditor}</EditorContext.Provider>
  );
}
