import React from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
//import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import cx from "classnames";
import styles from "./DecisionNode.module.scss";

export default function DecisionsNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <DecisionNodeDesigner {...props} />;
}

// TODO: could probably create a "base" Node that this actually renders, lile what we have now to avoid duplicating things like
// WorkflowCloseButton and WorkflowEditButtons, maybe even the ports as well
// I think we can implement everything then optimize though

//TODO: need to figure out how to get the task information from the data, might be the same method as before
// might be able to use a hook got get the workflow state from react flow
const task = {};

function DecisionNodeDesigner(props: NodeProps) {
  const { isConnectable } = props;
  const reactFlowInstance = useReactFlow();
  return (
    <div
      className={styles.node}
      style={{
        position: "relative",
        background: "white",
        color: "black",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        borderColor: "purple",
        borderWidth: "2px",
        borderStyle: "solid",
      }}
    >
      <h2>Decision node</h2>
      <div style={{ position: "absolute", top: "-0.875rem", right: "-0.875rem", display: "flex", gap: "0.25rem" }}>
        <WorkflowCloseButton className={""} onClick={() => reactFlowInstance.deleteElements({ nodes: [props] })}>
          Delete
        </WorkflowCloseButton>
      </div>
      <Handle
        className={cx("b-startEnd-node__port --right", styles.rightPort)}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        className={"b-startEnd-node__port --left"}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <ComposedModal
        composedModalProps={{}}
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved",
        }}
        modalHeaderProps={{
          title: task?.name,
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
    </div>
  );
}

function DesignerNodeExecution() {
  <div>TODO</div>;
}
