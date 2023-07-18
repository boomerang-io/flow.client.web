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

function TaskTemplateNodeDesigner(props: NodeProps<{ name: string, templateRef: string, templateVersion: number, templateUpgradeAvailable: boolean }>) {
  const reactFlowInstance = useReactFlow();

  const { availableParametersQueryData, revisionDispatch, revisionState, taskTemplatesData } = useEditorContext();
  const nodes = reactFlowInstance.getNodes()


  /**
   * TODO: Pull data off of context
   */
  const inputProperties = availableParametersQueryData;
  const task = taskTemplatesData[props.data.templateRef]?.find((taskTemplate) => taskTemplate.version === props.data.templateVersion)!

  // Get the taskNames names from the nodes on the model
  const taskNames = nodes.map(node => node.data.name)

  console.log({ taskNames, inputProperties, task, nodes })

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

  // TODO: update this to be  shared method
  const handleOnSaveTaskConfig = (inputs: Record<string, string>) => {
    const paramList = inputRecordToParamList(inputs)
    const newNodes = nodes.map(node => {
      if (node.id === props.id) {
        return {
          ...node,
          data: { ...node.data, ...paramList }
        }
      } else {
        return node
      }
    })

    reactFlowInstance.setNodes(newNodes)
    revisionDispatch && revisionDispatch({
      type: RevisionActionTypes.UpdateNodeConfig
    })
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
            node={props.data}
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
          props.data?.templateUpgradeAvailable ? (
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
    <BaseNode title={props.data.name} isConnectable nodeProps={props} subtitle={task.description} icon={task.icon}>
      <UpdateTaskVersion />
      <ConfigureTask />
    </BaseNode>
  );
}

function TaskTemplateNodeExecution() {
  <div>TODO</div>;
}

function inputRecordToParamList(inputRecord: Record<string, string>): { name: string, params: Array<{ name: string; value: string }> } {

  // Pull off taskName from input record to set the new name
  // TODO: think about making this better
  const name = inputRecord["taskName"]
  delete inputRecord["taskName"]

  const params = Object.entries(inputRecord).map(([key, value]) => {
    return { name: key, value }
  })

  return { name, params }
}
