import React from "react";
import cx from "classnames";
import TemplateTaskNodeModel from "Utils/dag/templateTaskNode/TemplateTaskNodeModel";
import CustomTaskNodeModel from "Utils/dag/customTaskNode/CustomTaskNodeModel";

import WorkflowExecutionPort from "Components/WorkflowExecutionPort";
import { taskIcons } from "Utils/taskIcons";
import { Bee } from "@carbon/react/icons";
import styles from "./WorkflowNode.module.scss";

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
}: {
  category: string | undefined;
  className?: string;
  children?: React.ReactNode | undefined;
  icon: string;
  isExecution: boolean;
  name: string | undefined;
  node: TemplateTaskNodeModel & CustomTaskNodeModel;
  subtitle: string;
  subtitleClass?: string;
  rightPortClass?: string;
  title?: string;
  onClick?: () => void;
}) {
  let Icon = () => <Bee alt="Task node type default" style={{ willChange: "auto" }} />;

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
      <WorkflowExecutionPort
        isExecution={isExecution}
        name="left"
        node={node}
        // port="left"
      />
      <WorkflowExecutionPort
        className={rightPortClass}
        isExecution={isExecution}
        name="right"
        node={node}
        // port="right"
      />
      {children}
    </div>
  );
}
