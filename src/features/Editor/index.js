import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EditorContext } from "State/context";
import { RevisionActionTypes, revisionReducer, initRevisionReducerState } from "State/reducers/workflowRevision";
import { useAppContext, useIsModalOpen, useQuery } from "Hooks";
import { useImmerReducer } from "use-immer";
import { useMutation, queryCache } from "react-query";
import { Prompt, Route, Switch, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { Loading, Error, notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import ChangeLog from "./ChangeLog";
import Header from "./Header";
import Configure from "./Configure";
import Designer from "./Designer";
import Properties from "./Properties";
import sortBy from "lodash/sortBy";
import WorkflowDagEngine from "Utilities/dag/WorkflowDagEngine";
import CustomNodeModel from "Utilities/dag/customTaskNode/CustomTaskNodeModel";
import SwitchNodeModel from "Utilities/dag/switchNode/SwitchNodeModel";
import TemplateNodeModel from "Utilities/dag/templateTaskNode/TemplateTaskNodeModel";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appPath } from "Config/appConfig";
import { QueryStatus } from "Constants";
import { NodeType } from "Constants";
import styles from "./editor.module.scss";

/**
 *
 * Container responsible for making requests and managing some state
 */
export default function EditorContainer() {
  // Init revision number here so we can easily refect the data on change via rq
  const [revisionNumber, setRevisionNumber] = useState();
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
    onSuccess: () => queryCache.refetchQueries(serviceUrl.getTeams()),
  });
  const [mutateRevision, revisionMutation] = useMutation(resolver.postCreateWorkflowRevision, {
    onSuccess: () => {
      queryCache.refetchQueries(serviceUrl.getTeams());
      queryCache.refetchQueries(getSummaryUrl);
    },
  });

  /**
   * Render Logic
   */
  const isSummaryLoading = summaryQuery.status === QueryStatus.Loading;
  const isTaskTemplatesLoading = taskTemplatesQuery.status === QueryStatus.Loading;

  // Only show loading for the summary and task templates
  // Revision takes longer and we want to show a separate loading animation for it, plus prevent remounting everything
  if (isSummaryLoading || isTaskTemplatesLoading) {
    return <Loading />;
  }

  if (summaryQuery.error || taskTemplatesQuery.error) {
    return <Error />;
  }

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
}) {
  const location = useLocation();
  const match = useRouteMatch();
  const { teams } = useAppContext();
  const isModalOpen = useIsModalOpen();

  const [workflowDagEngine, setWorkflowDagEngine] = useState();
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
  }, [revisionNumber, revisionDispatch, revisionQuery.data]);

  const { data: summaryData } = summaryQuery;

  /**
   *
   * @param {string} reason - changelog reason for new version
   * @param {function} callback - optional callback
   */
  const handleCreateRevision = useCallback(
    async ({ reason = "Update workflow", callback }) => {
      const normilzedConfig = Object.values(revisionState.config).map((config) => ({
        ...config,
        currentVersion: undefined,
        taskVersion: config.currentVersion || config.taskVersion,
      }));
      const revisionConfig = { nodes: Object.values(normilzedConfig) };

      const revision = {
        dag: workflowDagEngine.getDiagramEngine().getDiagramModel().serializeDiagram(),
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
        //no-op
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
          <ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to update workflow settings`} />
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
      const nodesOfSameTypeCount = Object.values(diagramApp.getDiagramEngine().getDiagramModel().getNodes()).filter(
        (node) => node.taskId === taskData.id
      ).length;

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
          new Error("Node type not recognized");
      }

      const { id, taskId, currentVersion } = node;
      const currentTaskConfig = taskData.revisions?.find((revision) => revision.version === currentVersion) ?? {};

      // Create inputs object with empty string values by default for service to process easily
      const inputs =
        Array.isArray(currentTaskConfig.config) && currentTaskConfig.config.length
          ? currentTaskConfig.config.reduce((accu, item) => {
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
  const isLocked = version < revisionCount;

  useEffect(() => {
    const newWorkflowDagEngine = new WorkflowDagEngine({ dag: revisionState.dag, isLocked });
    setWorkflowDagEngine(newWorkflowDagEngine);
    newWorkflowDagEngine.getDiagramEngine().repaintCanvas();

    // really and truly only want to remount this on version change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked, revisionState.version]);

  const memoizedEditor = useMemo(() => {
    return (
      <>
        <Prompt
          when={Boolean(revisionState.hasUnsavedWorkflowRevisionUpdates)}
          message={(location) =>
            //Return true to navigate if going to the same route we are currently on
            location.pathname === match.url || location.pathname.includes("workflow")
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
                revisionState={revisionState}
                revisionQuery={revisionQuery}
                setWorkflowDagEngine={setWorkflowDagEngine}
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
            children={({ history, match: routeMatch }) => (
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
    match.url,
    revisionMutation,
    revisionQuery,
    revisionState,
    summaryData,
    summaryMutation,
    taskTemplatesData,
    teams,
    updateSummary,
    workflowDagEngine,
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
