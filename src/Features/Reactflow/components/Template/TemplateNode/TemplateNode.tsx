import React from "react";
import { useEditorContext } from "Hooks";
import { useReactFlow, Node } from "reactflow";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import { TaskForm as DefaultTaskForm } from "./TaskForm";
import BaseNode from "../../Base/BaseNode";
import { WorkflowEngineMode } from "Constants";
import type { DataDrivenInput, TaskTemplate, WorkflowNode, WorkflowNodeProps } from "Types";
import styles from "./TemplateNode.module.scss";

interface TaskTemplateNodeProps extends WorkflowNodeProps {
  additionalFormInputs?: Array<Partial<DataDrivenInput>>;
  className?: string;
  TaskForm?: React.FC<any>; //TODO
}

export default function TaskTemplateNode(props: TaskTemplateNodeProps) {
  const { mode, taskTemplatesData } = useEditorContext();
  // Find the matching task template based on the name and version
  const taskTemplateList = taskTemplatesData[props.data.templateRef];
  const task =
    taskTemplateList?.find((taskTemplate) => taskTemplate.version === props.data.templateVersion) ??
    taskTemplatesData[props.data.templateRef]?.[0] ??
    {};

  if (mode === WorkflowEngineMode.Executor) {
    return <TaskTemplateNodeExecution {...props} task={task} />;
  }

  return <TaskTemplateNodeDesigner {...props} task={task} />;
}

interface TaskTemplateNodeInstanceProps extends TaskTemplateNodeProps {
  task: TaskTemplate;
}

function TaskTemplateNodeDesigner(props: TaskTemplateNodeInstanceProps) {
  const { TaskForm = DefaultTaskForm } = props;
  const reactFlowInstance = useReactFlow();

  const { availableParameters, taskTemplatesData } = useEditorContext();
  const nodes = reactFlowInstance.getNodes() as Array<WorkflowNode>;

  // Find the matching task template based on the name and version
  const taskTemplateList = taskTemplatesData[props.data.templateRef];
  const task =
    taskTemplateList?.find((taskTemplate) => taskTemplate.version === props.data.templateVersion) ??
    taskTemplatesData[props.data.templateRef]?.[0] ??
    {};

  // Get the taskNames names from the nodes on the model
  const otherTaskNames = nodes.map((node) => node.data.name).filter((name) => name !== props.data.name);

  const handleOnUpdateTaskVersion = ({ inputs, version }: { inputs: Record<string, string>; version: number }) => {
    const nameAndParamListRecord = inputRecordToNameAndParamListRecord(inputs);
    const newNodes = nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: { ...node.data, ...nameAndParamListRecord, templateVersion: version, templateUpgradesAvailable: false },
        };
      } else {
        return node;
      }
    }) as Array<WorkflowNode>;

    reactFlowInstance.setNodes(newNodes);
  };

  const handleOnSaveTaskConfig = (
    inputs: Record<string, string>,
    results: Array<{ name: string; description: string }> = [],
  ) => {
    const nameAndParamListRecord = inputRecordToNameAndParamListRecord(inputs);
    const newNodes = nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: { ...node.data, ...nameAndParamListRecord, results },
        };
      } else {
        return node;
      }
    }) as unknown as Node<any>[];

    reactFlowInstance.setNodes(newNodes);
  };

  const ConfigureTask = () => {
    return (
      <ComposedModal
        modalHeaderProps={{
          title: `Edit ${task.displayName}`,
          subtitle: task.description || "Configure the task",
        }}
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
      >
        {({ closeModal }) => (
          <TaskForm
            availableParameters={availableParameters}
            additionalFormInputs={props.additionalFormInputs}
            closeModal={closeModal}
            node={props.data}
            onSave={handleOnSaveTaskConfig}
            otherTaskNames={otherTaskNames}
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
          props.data?.templateUpgradesAvailable ? (
            <WorkflowWarningButton className={styles.updateButton} onClick={openModal} />
          ) : null
        }
      >
        {({ closeModal }) => (
          <TaskUpdateModal
            availableParameters={availableParameters}
            closeModal={closeModal}
            node={props.data}
            onSave={handleOnUpdateTaskVersion}
            currentTaskTemplateVersion={task}
            latestTaskTemplateVersion={taskTemplatesData[props.data.templateRef][0]}
          />
        )}
      </ComposedModal>
    );
  };

  return (
    <BaseNode
      isConnectable
      className={props.className}
      icon={task.icon}
      kind={WorkflowEngineMode.Editor}
      nodeProps={props}
      title={props.data.name}
      subtitle={task.description}
    >
      <ConfigureTask />
      <UpdateTaskVersion />
    </BaseNode>
  );
}

function TaskTemplateNodeExecution(props: TaskTemplateNodeInstanceProps) {
  return (
    <BaseNode
      className={props.className}
      icon={props.task.icon}
      isConnectable={false}
      kind={WorkflowEngineMode.Executor}
      nodeProps={props}
      subtitle={props.task.description}
      title={props.data.name}
    />
  );
}

function inputRecordToNameAndParamListRecord(inputRecord: Record<string, string>): {
  name: string;
  params: Array<{ name: string; value: string }>;
} {
  // Pull off taskName from input record to set the new name
  // TODO: think about making this better
  const name = inputRecord["taskName"];
  delete inputRecord["taskName"];

  const params = Object.entries(inputRecord).map(([key, value]) => {
    return { name: key, value };
  });

  return { name, params };
}
