//@ts-nocheck
import React from "react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import PropTypes from "prop-types";
import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowNode from "Components/WorkflowNode";
import WorkflowTaskForm from "Components/WorkflowTaskResultsForm";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import { useEditorContext } from "Hooks";
import { RevisionActionTypes } from "State/reducers/workflowRevision";
import styles from "./TemplateTaskNodeDesigner.module.scss";

const ScriptNodeDesigner = React.memo(function ScriptNodeDesigner({ diagramEngine, node: designerNode }) {
  const {
    availableParametersQueryData,
    revisionDispatch,
    revisionState,
    // summaryData,
    tasksData,
  } = useEditorContext();

  /**
   * Pull data off of context
   */
  // const inputProperties = summaryData.properties;
  const inputProperties = availableParametersQueryData;

  const nodeDag = revisionState.dag.nodes?.find((revisionNode) => revisionNode.nodeId === designerNode.id) ?? {};
  const nodeConfig = revisionState.config[designerNode?.id] ?? {};
  const task = tasksData.find((taskTemplate) => taskTemplate.id === designerNode.taskId);

  // Get the taskNames names from the nodes on the model
  const taskNames = diagramEngine?.getDiagramModel
    ? Object.values(diagramEngine.getDiagramModel().getNodes())
        .map((node) => node.taskName)
        .filter((name) => Boolean(name))
    : [];

  /**
   * Event handlers
   */
  const handleOnUpdateTaskVersion = ({ version, inputs }) => {
    revisionDispatch({
      type: RevisionActionTypes.UpdateNodeTaskVersion,
      data: { nodeId: designerNode.id, inputs, version },
    });
  };

  const handleOnSaveTaskConfig = ({ inputs, outputs }) => {
    revisionDispatch({
      type: RevisionActionTypes.UpdateNodeConfigWithResult,
      data: { nodeId: designerNode.id, inputs, outputs },
    });
  };

  // Delete the node in state and then remove it from the diagram
  const handleOnDelete = () => {
    //deleteNode
    revisionDispatch({
      type: RevisionActionTypes.DeleteNode,
      data: { nodeId: designerNode.id },
    });
    designerNode.remove();
  };

  const renderConfigureTask = () => {
    return (
      <ComposedModal
        composedModalProps={{}}
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved",
        }}
        modalHeaderProps={{
          title: `Edit ${task.name}`,
          subtitle: task.description || "Configure the inputs",
        }}
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
      >
        {({ closeModal }) => (
          <WorkflowTaskForm
            inputProperties={inputProperties}
            closeModal={closeModal}
            node={designerNode}
            nodeConfig={nodeConfig}
            onSave={handleOnSaveTaskConfig}
            taskNames={taskNames}
            task={task}
          />
        )}
      </ComposedModal>
    );
  };

  const renderUpdateTaskVersion = () => {
    return (
      <ComposedModal
        composedModalProps={{
          containerClassName: styles.updateTaskModalContainer,
          shouldCloseOnOverlayClick: false,
        }}
        modalHeaderProps={{
          title: `New version available`,
          subtitle:
            "The managers of this task have made some changes that were significant enough for a new version. You can still use the current version, but it’s usually a good idea to update when available. The details of the change are outlined below. If you’d like to update, review the changes below and make adjustments if needed. This process will only update the task in this Workflow - not any other workflows where this task appears.",
        }}
        modalTrigger={({ openModal }) =>
          nodeDag?.templateUpgradeAvailable ? (
            <WorkflowWarningButton className={styles.updateButton} onClick={openModal} />
          ) : null
        }
      >
        {({ closeModal }) => (
          <TaskUpdateModal
            closeModal={closeModal}
            inputProperties={inputProperties}
            node={designerNode}
            nodeConfig={nodeConfig}
            onSave={handleOnUpdateTaskVersion}
            taskNames={taskNames}
            task={task}
          />
        )}
      </ComposedModal>
    );
  };
  if (nodeConfig && nodeDag && task) {
    return (
      <WorkflowNode
        category={task.category}
        icon={task.icon}
        isExecution={false}
        name={task.name}
        node={designerNode}
        subtitle={designerNode.taskName}
        title={task.name}
      >
        {renderUpdateTaskVersion()}
        {renderConfigureTask()}
        <WorkflowCloseButton className={styles.closeButton} onClick={handleOnDelete} />
      </WorkflowNode>
    );
  }
  return null;
});

ScriptNodeDesigner.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
};

ScriptNodeDesigner.defaultProps = {
  node: {},
};

export default ScriptNodeDesigner;
