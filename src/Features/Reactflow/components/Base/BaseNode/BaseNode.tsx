import React from "react";
import cx from "classnames";
import { Handle, Position, useReactFlow, NodeProps } from "reactflow";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import { taskIcons } from "Utils/taskIcons";
import { Bee } from "@carbon/react/icons";
import { WorkflowNodeProps } from "Types";
import styles from "./BaseNode.module.scss";

//About: based on WorkflowNode component that serves as a base for many of the the components
//TODO: add icon
//TODO: look at what props are required

interface BaseNodeProps {
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  isConnectable: boolean;
  nodeProps: WorkflowNodeProps;
  subtitle?: string;
  subtitleClass?: string;
  title?: string;
}

export default function BaseNode(props: BaseNodeProps) {
  const { isConnectable, children, title, subtitle, className, icon, subtitleClass, ...rest } = props;
  const reactFlowInstance = useReactFlow();
  let Icon = () => <Bee alt="Task node type default" style={{ willChange: "auto" }} />;

  if (icon) {
    Icon = taskIcons.find((taskIcon) => taskIcon.name === icon)?.Icon ?? Icon;
  }

  return (
    <div className={cx(styles.node, className)} {...rest}>
      <div style={{ position: "absolute", top: "-1rem", right: "-0.875rem", display: "flex", gap: "0.25rem" }}>
        <WorkflowCloseButton
          style={{ height: "1.75rem" }}
          className={""}
          onClick={() => reactFlowInstance.deleteElements({ nodes: [props.nodeProps] })}
        >
          Delete
        </WorkflowCloseButton>
      </div>
      <header className={styles.header}>
        <Icon />
        <h3 title={title || "Task"} className={styles.title}>
          {title || "Task"}
        </h3>
      </header>
      <p title={subtitle} className={styles.subtitle}>
        {subtitle || "Task"}
      </p>
      <Handle
        className="b-startEnd-node__port --right"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        className="b-startEnd-node__port --left"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      {children}
    </div>
  );
}
