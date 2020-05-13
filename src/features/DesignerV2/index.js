import React, { useState, useRef } from "react";
import { WorkflowContext } from "State/context";
import { Prompt, useParams, useRouteMatch } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, queryCache } from "react-query";
import { useImmerReducer } from "use-immer";
import { Loading, Error, notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import Editor from "../Designer/Editor";
import CustomNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import SwitchNodeModel from "Utilities/switchNode/SwitchNodeModel";
import TemplateNodeModel from "Utilities/templateTaskNode/TemplateTaskNodeModel";
import { serviceUrl, resolver } from "Config/servicesConfig";
import capitalize from "lodash/capitalize";
import sortBy from "lodash/sortBy";
import { QueryStatus } from "Constants";
import NODE_TYPES from "Constants/nodeTypes";
import WORKFLOW_PROPERTY_UPDATE_TYPES from "Constants/workflowPropertyUpdateTypes";
import styles from "../Designer/WorkflowManager.module.scss";

/**
 *
 * Container responsible for network requests
 */
export default function WorkflowContainer(props) {
  const [revisionNumber, setRevisionNumber] = useState();

  const { workflowId } = useParams();
  const getSummaryUrl = serviceUrl.getWorkflowSummary({ workflowId });
  const getRevisionUrl = serviceUrl.getWorkflowRevision({ workflowId, revisionNumber });
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates();

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

  /**
   * Mutations
   */
  const [mutateSummary] = useMutation(resolver.putUpdateWorkflowSummary);
  const [mutateRevision] = useMutation(resolver.postCreateWorkflowRevision);
  const [mutateProperties] = useMutation(resolver.patchUpdateWorkflowProperties);

  /**
   * Render Logic
   */
  const summaryIsLoading = summaryQuery.status === QueryStatus.Loading;
  const revisionIsLoading = revisionQuery.status === QueryStatus.Loading;
  const taskTempaltesAreLoading = taskTemplatesQuery.status === QueryStatus.Loading;

  if (summaryIsLoading || revisionIsLoading || taskTempaltesAreLoading) {
    return <Loading />;
  }

  if (summaryQuery.error || revisionQuery.error || taskTemplatesQuery.error) {
    return <Error />;
  }

  if (summaryQuery.data && revisionQuery.data && taskTemplatesQuery.data) {
    return (
      <WorkflowManager
        mutateProperties={mutateProperties}
        mutateRevision={mutateRevision}
        mutateSummary={mutateSummary}
        revisionData={revisionQuery.data}
        summaryData={summaryQuery.data}
        setRevisionNumber={setRevisionNumber}
        taskTemplatesData={taskTemplatesQuery.data}
        workflowId={workflowId}
      />
    );
  }

  return null;
}

/**
 * Reducers for state we neet to locally update
 */
const revisionActionTypes = {
  ADD_NODE: "ADD_NODE",
  DELETE_NODE: "DELETE_NODE",
  RESET: "RESET",
  UPDATE_NODE_CONFIG: "UPDATE_NODE_CONFIG",
  UPDATE_NODE_TASK_VERSION: "UPDATE_NODE_TASK_VERSION"
};

function initRevisionReducerState(revisionData) {
  const { config, ...rest } = revisionData;
  const normalizedNodesObj = {};
  config.nodes.forEach(node => {
    normalizedNodesObj[node.nodeId] = node;
  });

  return { ...rest, config: normalizedNodesObj };
}

function revisionReducer(state, action) {
  switch (action.type) {
    case revisionActionTypes.ADD_NODE: {
      const { data } = action;
      state.hasUnsavedWorkflowRevisionUpdates = true;
      state.config[data.nodeId] = data;
      return state;
    }
    case revisionActionTypes.DELETE_NODE: {
      let { nodeId } = action.data;
      delete state.config[nodeId];
      state.dag.nodes = state.dag?.nodes?.filter(node => node.nodeId !== nodeId) ?? [];
      state.hasUnsavedWorkflowRevisionUpdates = true;
      return state;
    }
    case revisionActionTypes.UPDATE_NODE_CONFIG: {
      const { nodeId, inputs } = action.data;
      state.config[nodeId].inputs = { ...state.config[nodeId].inputs, ...inputs };
      state.hasUnsavedWorkflowRevisionUpdates = true;
      return state;
    }
    case revisionActionTypes.UPDATE_NODE_TASK_VERSION: {
      const { nodeId, inputs, version } = action.data;
      state.dag.nodes.find(node => node.nodeId === nodeId).templateUpgradeAvailable = false;
      state.config[nodeId].taskVersion = version;
      state.config[nodeId].inputs = { ...state.config[nodeId].inputs, ...inputs };
      state.hasUnsavedWorkflowRevisionUpdates = true;
      return state;
    }
    case revisionActionTypes.RESET: {
      return initRevisionReducerState(action.data);
    }
    default:
      throw new Error();
  }
}

/**
 * Utils
 */
function getDiagramSerialization(diagramApp) {
  return diagramApp
    .getDiagramEngine()
    .getDiagramModel()
    .serializeDiagram();
}

function formatWorkflowConfigNodes(workflowRevision) {
  const normilzedConfig = Object.values(workflowRevision.config).map(config => ({
    ...config,
    currentVersion: undefined,
    taskVersion: config.currentVersion || config.taskVersion
  }));
  return { nodes: Object.values(normilzedConfig) };
}

/**
 * Workflow Manager responsible for holding state of summary and revision
 * Make function calls to mutate server data
 */
export function WorkflowManager({
  mutateProperties,
  mutateRevision,
  mutateSummary,
  revisionData,
  summaryData,
  setRevisionNumber,
  taskTemplatesData,
  workflowId,
  ...props
}) {
  const match = useRouteMatch();
  const [isModalOpen, setIsModalOpen] = useState();
  const changeLogReasonRef = useRef("Update workflow");

  const [revisionState, revisionDispatch] = useImmerReducer(revisionReducer, revisionData, initRevisionReducerState);

  /**
   *
   * @param {Object} diagramApp - the DAG
   */
  const createRevision = async diagramApp => {
    const revision = {};
    revision["dag"] = getDiagramSerialization(diagramApp);
    revision["config"] = formatWorkflowConfigNodes(revisionState);
    revision["changelog"] = {
      reason: changeLogReasonRef.current
    };

    try {
      const { data } = await mutateRevision({ workflowId, body: revision });
      notify(
        <ToastNotification kind="success" title="Create Version" subtitle="Successfully created workflow version" />
      );
      revisionDispatch({ type: revisionActionTypes.RESET, data });
    } catch (err) {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to create workflow version" />);
    }
  };

  /**
   *
   * @param {Object} formikValues - key/value pairs for inputs
   */
  const updateSummary = async formikValues => {
    const flowTeamId = formikValues?.selectedTeam?.id;
    const updatedWorkflow = { ...summaryData, ...formikValues, flowTeamId };

    await mutateSummary({ workflowId, body: updatedWorkflow });
  };

  const updateProperties = async ({ property, title, message, type }) => {
    let properties = [...summaryData.properties];
    if (type === WORKFLOW_PROPERTY_UPDATE_TYPES.UPDATE) {
      const propertyToUpdateIndex = properties.findIndex(currentProp => currentProp.key === property.key);
      properties.splice(propertyToUpdateIndex, 1, property);
    }

    if (type === WORKFLOW_PROPERTY_UPDATE_TYPES.DELETE) {
      const propertyToUpdateIndex = properties.findIndex(currentProp => currentProp.key === property.key);
      properties.splice(propertyToUpdateIndex, 1);
    }

    if (type === WORKFLOW_PROPERTY_UPDATE_TYPES.CREATE) {
      properties.push(property);
    }

    try {
      const { data } = await mutateProperties({ workflowId, body: properties });
      notify(
        <ToastNotification
          kind="success"
          title={`${capitalize(type)} property`}
          subtitle={`Successfully performed operation`}
        />
      );
      queryCache.setQueryData(serviceUrl.getWorkflowSummary({ workflowId }), data);
    } catch (e) {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to ${type} property`} />);
    }
  };

  /**
   * Handle the drop event to create a new node from a task template
   * @param {*} diagramApp
   * @param {*} event
   */
  const createNode = (diagramApp, event) => {
    const { taskData } = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));

    // For naming purposes
    const nodesOfSameTypeCount = Object.values(
      diagramApp
        .getDiagramEngine()
        .getDiagramModel()
        .getNodes()
    ).filter(node => node.taskId === taskData.id).length;

    const nodeObj = {
      taskId: taskData.id,
      taskName: `${taskData.name} ${nodesOfSameTypeCount + 1}`,
      taskVersion: taskData.currentVersion
    };

    // Determine the node type
    let node;
    // eslint-disable-next-line default-case
    switch (taskData.nodeType) {
      case NODE_TYPES.DECISION:
        node = new SwitchNodeModel(nodeObj);
        break;
      case NODE_TYPES.TEMPLATE_TASK:
        node = new TemplateNodeModel(nodeObj);
        break;
      case NODE_TYPES.CUSTOM_TASK:
        node = new CustomNodeModel(nodeObj);
        break;
    }

    // If we are creating a node
    if (node) {
      const { id, taskId, currentVersion } = node;
      const currentTaskConfig = taskData.revisions?.find(revision => revision.version === currentVersion) ?? {};

      // Create inputs object with empty string values by default for service to process easily
      const inputs =
        Array.isArray(currentTaskConfig.config) && currentTaskConfig.config.length
          ? currentTaskConfig.config.reduce((accu, item) => {
              accu[item.key] = "";
              return accu;
            }, {})
          : {};
      revisionDispatch({
        type: revisionActionTypes.ADD_NODE,
        data: {
          nodeId: id,
          taskId,
          inputs,
          type: taskData.nodeType,
          taskVersion: currentVersion
        }
      });
      const points = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
      node.x = points.x - 110;
      node.y = points.y - 40;
      diagramApp
        .getDiagramEngine()
        .getDiagramModel()
        .addNode(node);
    }
  };

  /**
   *  Simply update the parent state to use a different revision to fetch it w/ react-query
   * @param {string} revisionNumber
   */
  const changeRevisionNumber = revisionNumber => {
    setRevisionNumber(revisionNumber);
  };

  const handleChangeLogReasonChange = reason => {
    changeLogReasonRef.current = reason;
  };

  return (
    <WorkflowContext.Provider
      value={{
        revisionDispatch,
        revisionState,
        summaryState: summaryData,
        setIsModalOpen,
        taskTemplatesData
      }}
    >
      <>
        <Prompt
          when={revisionState.hasUnsavedWorkflowRevisionUpdates}
          message={location =>
            location.pathname === match.url || location.pathname.includes("editor") //Return true to navigate if going to the same route we are currently on
              ? true
              : "Are you sure? You have unsaved changes to your workflow that will be lost."
          }
        />
        <div className={styles.container}>
          <Formik
            enableReinitialize
            initialValues={{
              description: summaryData?.description ?? "",
              enableACCIntegration: summaryData?.enableACCIntegration ?? false,
              enablePersistentStorage: summaryData?.enablePersistentStorage ?? false,
              icon: summaryData?.icon ?? "",
              name: summaryData?.name ?? "",
              // selectedTeam: teams.data.find((team) => team.id === activeTeamId),
              selectedTeam: null,
              shortDescription: summaryData?.shortDescription ?? "",
              triggers: {
                event: {
                  enable: summaryData?.triggers?.event?.enable ?? false,
                  topic: summaryData?.triggers?.event?.topic ?? ""
                },
                scheduler: {
                  enable: summaryData?.triggers?.scheduler?.enable ?? false,
                  schedule: summaryData?.triggers?.scheduler?.schedule ?? "0 18 * * *",
                  timezone: summaryData?.triggers?.scheduler?.timezone ?? false,
                  advancedCron: summaryData?.triggers?.scheduler?.advancedCron ?? false
                },
                webhook: {
                  enable: summaryData?.triggers?.webhook?.enable ?? false,
                  token: summaryData?.triggers?.webhook?.token ?? false
                }
              }
            }}
            validationSchema={Yup.object().shape({
              description: Yup.string().max(250, "Description must not be greater than 250 characters"),
              enableACCIntegration: Yup.boolean(),
              enablePersistentStorage: Yup.boolean(),
              icon: Yup.string(),
              name: Yup.string()
                .required("Name is required")
                .max(64, "Name must not be greater than 64 characters"),
              selectedTeam: Yup.object().shape({ name: Yup.string().required("Team is required") }),
              shortDescription: Yup.string().max(128, "Summary must not be greater than 128 characters"),
              triggers: Yup.object().shape({
                event: Yup.object().shape({
                  enable: Yup.boolean(),
                  topic: Yup.string()
                }),
                scheduler: Yup.object().shape({
                  enable: Yup.boolean(),
                  schedule: Yup.string(),
                  timezone: Yup.mixed(),
                  advancedCron: Yup.boolean()
                }),
                webhook: Yup.object().shape({
                  enable: Yup.boolean(),
                  token: Yup.mixed()
                })
              })
            })}
          >
            {formikProps => (
              <>
                <Editor
                  createNode={createNode}
                  createWorkflowRevision={createRevision}
                  fetchWorkflowRevisionNumber={changeRevisionNumber}
                  handleChangeLogReasonChange={handleChangeLogReasonChange}
                  isModalOpen={isModalOpen}
                  tasks={taskTemplatesData}
                  teams={[] || sortBy(props.teams.data, "name")}
                  updateWorkflow={updateSummary}
                  updateWorkflowProperties={updateProperties}
                  workflow={summaryData}
                  workflowFormikProps={formikProps}
                  workflowRevision={revisionState}
                />
              </>
            )}
          </Formik>
        </div>
      </>
    </WorkflowContext.Provider>
  );
}
