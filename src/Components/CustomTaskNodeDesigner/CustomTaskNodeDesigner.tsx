import React from "react";
// import PropTypes from "prop-types";
import { useEditorContext } from "Hooks";
import { RevisionActionTypes } from "State/reducers/workflowRevision";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import WorkflowNode from "Components/WorkflowNode";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import styles from "./CustomTaskNodeDesigner.module.scss";
import { DiagramEngine, DiagramModel } from "@projectstorm/react-diagrams";

import CustomTaskNodeModel from "Utils/dag/customTaskNode/CustomTaskNodeModel";

interface nodeInterface extends CustomTaskNodeModel {
  index: number;
  id: string;
  taskId: string;
  taskName: string;
}

interface nodesInterface {
  // [key: string]: nodeInterface;
  [key: string]: CustomTaskNodeModel;
}

interface diagramEngineInterface extends DiagramEngine {
  getDiagramModel: () => diagramModelInterface;
  // getDiagramModel: () => string;
}

interface diagramModelInterface extends DiagramModel {
  getNodes: () => nodesInterface;
}

const CustomTaskNodeDesigner = React.memo(function CustomTaskNodeDesigner({
  diagramEngine,
  node: designerNode,
}: {
  // diagramEngine: diagramEngineInterface;
  // node: nodeInterface;
  diagramEngine: diagramEngineInterface;
  node: CustomTaskNodeModel;
}) {
  // const { revisionDispatch, revisionState, summaryQuery, taskTemplatesData } = useEditorContext();
  const editorContext = useEditorContext();

  /**
   * Pull data off of context
   */
  const inputProperties = editorContext?.summaryQuery?.data?.properties;
  // const nodeDag =
  //   editorContext?.revisionState?.dag?.nodes?.find((revisionNode) => revisionNode.nodeId === designerNode.id) ?? {};
  const nodeDag =
    editorContext?.revisionState?.dag?.nodes?.find((revisionNode) => revisionNode.nodeId === designerNode.id) ?? null;
  const nodeConfig = editorContext?.revisionState?.config ? [designerNode.id] ?? {} : {};
  const task = editorContext?.taskTemplatesData?.find((taskTemplate) => taskTemplate.id === designerNode.taskId);

  console.log("custom task node designer");
  console.log(nodeConfig);
  console.log(nodeDag);
  console.log(task);

  // Get the taskNames names from the nodes on the model
  const taskNames = Object.values(diagramEngine.getDiagramModel().getNodes())
    .map((node) => {
      return node?.taskName;
    })
    .filter((name) => Boolean(name));

  /**
   * Event handlers
   */
  const handleOnUpdateTaskVersion = ({ version, inputs }: { version: number; inputs: object }) => {
    if (editorContext?.revisionDispatch) {
      editorContext?.revisionDispatch({
        type: RevisionActionTypes.UpdateNodeTaskVersion,
        data: { nodeId: designerNode.id, inputs, version },
      });
    }
  };

  const handleOnSaveTaskConfig = (inputs: object) => {
    if (editorContext?.revisionDispatch) {
      editorContext?.revisionDispatch({
        type: RevisionActionTypes.UpdateNodeConfig,
        data: { nodeId: designerNode.id, inputs },
      });
    }
  };

  // Delete the node in state and then remove it from the diagram
  const handleOnDelete = () => {
    //deleteNode
    if (editorContext?.revisionDispatch) {
      editorContext?.revisionDispatch({
        type: RevisionActionTypes.DeleteNode,
        data: { nodeId: designerNode.id },
      });
      designerNode.remove();
    }
  };

  const renderConfigureTask = () => {
    return (
      <ComposedModal
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved",
        }}
        modalHeaderProps={{
          title: `Edit ${task?.name}`,
          subtitle: task?.description || "Configure the inputs",
        }}
        modalTrigger={({ openModal }: { openModal: Function }) => (
          <WorkflowEditButton className={styles.editButton} onClick={openModal} />
        )}
      >
        {({ closeModal }: { closeModal: Function }) => (
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
        modalTrigger={({ openModal }: { openModal: Function }) =>
          nodeDag?.templateUpgradeAvailable ? (
            <WorkflowWarningButton className={styles.updateButton} onClick={openModal} />
          ) : null
        }
      >
        {({ closeModal }: { closeModal: Function }) => (
          <TaskUpdateModal
            closeModal={closeModal}
            inputProperties={inputProperties}
            // node={designerNode}
            nodeConfig={nodeConfig}
            onSave={handleOnUpdateTaskVersion}
            // taskNames={taskNames}
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
        className={styles.node}
        icon={task.icon}
        isExecution={false}
        name={task.name}
        node={designerNode}
        subtitle={designerNode.taskName}
        title={task.name}
      >
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Custom</p>
        </div>
        {renderUpdateTaskVersion()}
        {renderConfigureTask()}
        <WorkflowCloseButton className={styles.closeButton} onClick={handleOnDelete} />
      </WorkflowNode>
    );
  }
  return null;
});

export default CustomTaskNodeDesigner;
