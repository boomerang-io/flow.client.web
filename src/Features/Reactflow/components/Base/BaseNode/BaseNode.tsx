import React from "react";
import cx from "classnames";
import { Handle, Position } from "reactflow";
import styles from "./BaseNode.module.scss";

//About: based on WorkflowNode component that serves as a base for many of the the components
//TODO: add icon
//TODO: look at what props are required

export default function BaseNode(props: {
  isConnectable: boolean;
  className?: string;
  subtitleClass?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const { isConnectable, children, title, subtitle, className, subtitleClass, ...rest } = props;
  return (
    <div className={cx(styles.node, className)} {...rest}>
      <header className={styles.header}>
        <h3 title={title || "Task"} className={styles.title}>
          {title || "Task"}
        </h3>
      </header>
      <p title={subtitle} className={cx(styles.subtitle, subtitleClass)}>
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
