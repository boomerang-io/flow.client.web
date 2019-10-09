import React from "react";
import PropTypes from "prop-types";
import WorkflowExecutionPort from "Components/WorkflowExecutionPort";
import mapTaskNametoIcon from "Utilities/taskIcons";
import styles from "./WorkflowNode.module.scss";

export default function WorkflowNode({ title, subtitle, name, icon, category, node, children, ...rest }) {
  return (
    <div className={styles.node} {...rest}>
      <header className={styles.header}>
        {icon ? icon : mapTaskNametoIcon(name, category)}
        <h1 className={styles.title}>{title || "Task"}</h1>
      </header>
      <p className={styles.subtitle}>{subtitle || "Task"}</p>
      <WorkflowExecutionPort name="left" node={node} port="left" />
      <WorkflowExecutionPort name="right" node={node} port="right" />
      {children}
    </div>
  );
}
