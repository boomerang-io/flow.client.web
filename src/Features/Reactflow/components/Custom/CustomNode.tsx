import React from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { useEditorContext } from "Hooks";
//import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../Base/BaseNode";
// import cx from "classnames";
import styles from "./CustomNode.module.scss";

export default function CustomNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <CustomNodeDesigner {...props} />;
}

// TODO: could probably create a "base" Node that this actually renders, lile what we have now to avoid duplicating things like
// WorkflowCloseButton and WorkflowEditButtons, maybe even the ports as well
// I think we can implement everything then optimize though

//TODO: need to figure out how to get the task information from the data, might be the same method as before
// might be able to use a hook got get the workflow state from react flow
const task = {};

function CustomNodeDesigner(props: NodeProps) {
  const { isConnectable } = props;
  const reactFlowInstance = useReactFlow();

  // const {
  //   // availableParametersQueryData,
  //   revisionDispatch,
  //   revisionState,
  //   // summaryData,
  //   taskTemplatesData,
  // } = useEditorContext();

  // const {
  //   availableParametersQueryData,
  //   revisionDispatch,
  //   revisionState,
  //   // summaryData,
  //   taskTemplatesData,
  // } = useEditorContext();

  // /**
  //  * Pull data off of context
  //  */
  // // const inputProperties = summaryData.properties;
  // const inputProperties = availableParametersQueryData;
  // const nodeDag = revisionState.dag?.nodes?.find((revisionNode) => revisionNode.nodeId === designerNode.id) ?? {};
  // const nodeConfig = revisionState.config[designerNode.id] ?? {};
  // const task = taskTemplatesData.find((taskTemplate) => taskTemplate.id === designerNode.taskId);

  // // Get the taskNames names from the nodes on the model
  // const taskNames = Object.values(diagramEngine.getDiagramModel().getNodes())
  //   .map((node) => {
  //     return node?.taskName;
  //   })
  //   .filter((name) => Boolean(name));

  // /**
  //  * Event handlers
  //  */
  // const handleOnUpdateTaskVersion = ({ version, inputs }) => {
  //   revisionDispatch({
  //     type: RevisionActionTypes.UpdateNodeTaskVersion,
  //     data: { nodeId: designerNode.id, inputs, version },
  //   });
  // };

  // const handleOnSaveTaskConfig = (inputs) => {
  //   revisionDispatch({
  //     type: RevisionActionTypes.UpdateNodeConfig,
  //     data: { nodeId: designerNode.id, inputs },
  //   });
  // };

  // Delete the node in state and then remove it from the diagram
  // const handleOnDelete = () => {
  //   //deleteNode
  //   revisionDispatch({
  //     type: RevisionActionTypes.DeleteNode,
  //     data: { nodeId: designerNode.id },
  //   });
  //   designerNode.remove();
  // };

  return (
    <BaseNode title="Run Custom Task" subtitle={"Run Custom Task 1"} isConnectable={isConnectable} nodeProps={props}>
      <div className={styles.badgeContainer}>
        <p className={styles.badgeText}>Custom</p>
      </div>
      <ComposedModal
        composedModalProps={{}}
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved",
        }}
        modalHeaderProps={{
          title: `Edit ${task?.name}`,
          subtitle: task?.description || "Configure the inputs",
        }}
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
      >
        {({ closeModal }) => (
          <WorkflowTaskForm
            closeModal={closeModal}
            inputProperties={[]}
            node={[]}
            nodeConfig={{}}
            onSave={() => console.log("save")}
            taskNames={[]}
            task={{}}
          />
        )}
      </ComposedModal>
    </BaseNode>
  );
}

// function CustomTaskNodeExecution(props) {

//   const { tasks, workflowExecution } = useExecutionContext();
//   const { id, taskId, taskName } = props.node;
//   const task = tasks.find((task) => task.id === taskId);
//   // const { steps } = workflowExecution;
//   const stepTaskStatus = Array.isArray(workflowExecution?.steps)
//     ? workflowExecution?.steps.find((step) => step.taskId === id)?.flowTaskStatus
//     : null;
//   // const flowTaskStatus = stepTaskStatus ?? ExecutionStatus.Skipped;
//   const flowTaskStatus = stepTaskStatus ? stepTaskStatus : ExecutionStatus.Skipped;

//   const scrollToTask = () => {
//     const taskLogItem = document.getElementById(`task-${id}`);
//     if (taskLogItem) {
//       taskLogItem.scrollIntoView();
//       taskLogItem.focus();
//     }
//   };

//   return (
//     <WorkflowNode
//       category={task?.category}
//       className={cx(styles[flowTaskStatus], { [styles.disabled]: flowTaskStatus === ExecutionStatus.NotStarted })}
//       icon={task?.icon}
//       isExecution
//       name={task?.name}
//       node={props.node}
//       subtitle={taskName}
//       title={task?.name}
//       onClick={scrollToTask}
//     >
//       <div className={styles.progressBar} />
//       <div className={styles.badgeContainer}>
//         <p className={styles.badgeText}>Custom</p>
//       </div>
//       <div className={styles.progressBar} />
//     </WorkflowNode>
//   );
// }
