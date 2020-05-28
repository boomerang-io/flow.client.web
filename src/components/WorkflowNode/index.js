import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import WorkflowExecutionPort from "Components/WorkflowExecutionPort";
import { taskIcons } from "Utilities/taskIcons";
import { Bee16 } from "@carbon/icons-react";
import styles from "./WorkflowNode.module.scss";

WorkflowNode.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.string,
  iconToRender: PropTypes.node,
  isExecution: PropTypes.bool,
  name: PropTypes.string,
  node: PropTypes.object.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

export default function WorkflowNode({
  category,
  className,
  children,
  icon,
  isExecution,
  name,
  node,
  subtitle,
  subtitleClass,
  rightPortClass,
  title,
  ...rest
}) {
  let Icon = () => <Bee16 alt="Task node type default" style={{ willChange: "auto" }} />;

  if (icon) {
    Icon = taskIcons.find((taskIcon) => taskIcon.name === icon)?.Icon ?? Icon;
  }

  return (
    <div className={cx(styles.node, className)} {...rest}>
      <header className={styles.header}>
        <Icon />
        <h1 title={title || "Task"} className={styles.title}>
          {title || "Task"}
        </h1>
      </header>
      <p title={subtitle} className={cx(styles.subtitle, subtitleClass)}>
        {subtitle || "Task"}
      </p>
      <WorkflowExecutionPort isExecution={isExecution} name="left" node={node} port="left" />
      <WorkflowExecutionPort
        className={rightPortClass}
        isExecution={isExecution}
        name="right"
        node={node}
        port="right"
      />
      {children}
    </div>
  );
}
