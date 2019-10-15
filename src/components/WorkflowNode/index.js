import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import WorkflowExecutionPort from "Components/WorkflowExecutionPort";
import mapTaskNametoIcon from "Utilities/taskIcons";
import styles from "./WorkflowNode.module.scss";

WorkflowNode.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.node,
  name: PropTypes.string,
  node: PropTypes.object.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string
};

export default function WorkflowNode({ category, className, children, icon, name, node, subtitle, title, ...rest }) {
  return (
    <div className={cx(styles.node, className)} {...rest}>
      <header className={styles.header}>
        {icon ? icon : mapTaskNametoIcon(name, category).iconImg}
        <h1 className={styles.title}>{title || "Task"}</h1>
      </header>
      <p className={styles.subtitle}>{subtitle || "Task"}</p>
      <WorkflowExecutionPort name="left" node={node} port="left" />
      <WorkflowExecutionPort name="right" node={node} port="right" />
      {children}
    </div>
  );
}
