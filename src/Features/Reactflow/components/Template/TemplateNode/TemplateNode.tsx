import React from "react";
import { NodeProps, useReactFlow } from "reactflow";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import BaseNode from "../../Base/BaseNode";
import { RevisionActionTypes } from "State/reducers/workflowRevision";
import { useEditorContext } from "Hooks";
import styles from "./TemplateNode.module.scss";

export default function TaskTemplateNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <TaskTemplateNodeDesigner {...props} />;
}

// TODO: could probably create a "base" Node that this actually renders, lile what we have now to avoid duplicating things like
// WorkflowCloseButton and WorkflowEditButtons, maybe even the ports as well
// I think we can implement everything then optimize though

//TODO: need to figure out how to get the task information from the data, might be the same method as before
// might be able to use a hook got get the workflow state from react flow

function TaskTemplateNodeDesigner(props: NodeProps) {
  const reactFlowInstance = useReactFlow();

  const { availableParametersQueryData, revisionDispatch, revisionState, taskTemplatesData, mode } = useEditorContext();
  const nodes = reactFlowInstance.getNodes()

  const designerNode: any = {};

  /**
   * TODO: Pull data off of context
   */
  const inputProperties = availableParametersQueryData;

  const nodeDag: any = revisionState.nodes?.find((revisionNode) => revisionNode.type === props.data.templateRef) ?? {};
  const nodeConfig = revisionState.config[designerNode?.id] ?? {};
  const task = taskTemplatesData?.find((taskTemplate) => taskTemplate.name === props.data.templateRef)!

  // Get the taskNames names from the nodes on the model
  const taskNames: any[] = [];

  console.log({ taskNames, inputProperties, task, nodeConfig, nodeDag, nodes })

  /**
   * TODO: Event handlers
   */
  const handleOnUpdateTaskVersion = ({ inputs, version }: any) => {
    revisionDispatch &&
      revisionDispatch({
        type: RevisionActionTypes.UpdateNodeTaskVersion,
        data: { nodeId: designerNode.id, inputs, version },
      });
  };

  const handleOnSaveTaskConfig = (inputs: any) => {
    revisionDispatch &&
      revisionDispatch({
        type: RevisionActionTypes.UpdateNodeConfig,
        data: { nodeId: designerNode.id, inputs },
      });
  };

  // Delete the node in state and then remove it from reactflow
  const handleOnDelete = () => {
    revisionDispatch &&
      revisionDispatch({
        type: RevisionActionTypes.DeleteNode,
        data: { nodeId: designerNode.id },
      });
    reactFlowInstance.deleteElements({ nodes: [props] });
  };

  const ConfigureTask = () => {
    return (
      <ComposedModal
        composedModalProps={{}}
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved",
        }}
        modalHeaderProps={{
          title: `Edit ${task.displayName}`,
          subtitle: task.description || "Configure the inputs",
        }}
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
      >
        {({ closeModal }) => (
          <WorkflowTaskForm
            closeModal={closeModal}
            inputProperties={inputProperties}
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

  const UpdateTaskVersion = () => {
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
            nodeConfig={nodeConfig}
            onSave={handleOnUpdateTaskVersion}
            task={task}
          />
        )}
      </ComposedModal>
    );
  };

  return (
    <BaseNode title={task.displayName} isConnectable nodeProps={props} subtitle={task.description} icon={task.icon}>
      <UpdateTaskVersion />
      <ConfigureTask />
    </BaseNode>
  );
}

function TaskTemplateNodeExecution() {
  <div>TODO</div>;
}
