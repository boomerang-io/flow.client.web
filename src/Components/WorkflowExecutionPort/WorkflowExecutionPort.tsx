import React from "react";
import cx from "classnames";
import { PortWidget } from "@projectstorm/react-diagrams";
import TemplateTaskNodeModel from "Utils/dag/templateTaskNode/TemplateTaskNodeModel";
import styles from "./WorkflowExecutionPort.module.scss";

export default function WorkflowExecutionPort({
  className,
  isExecution,
  name,
  node,
  ...rest
}: {
  className?: string;
  isExecution: boolean;
  name: string;
  node: TemplateTaskNodeModel;
}) {
  return (
    <PortWidget
      className={cx(styles.port, className, { [styles[name]]: name, [styles.execution]: isExecution })}
      name={name}
      node={node}
      {...rest}
    />
  );
}
