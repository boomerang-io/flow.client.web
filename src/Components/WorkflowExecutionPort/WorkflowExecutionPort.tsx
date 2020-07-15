import React from "react";
import PropTypes from "prop-types";
import { PortWidget, NodeModel } from "@projectstorm/react-diagrams";
import cx from "classnames";
import styles from "./WorkflowExecutionPort.module.scss";

WorkflowExecutionPort.propTypes = {
  className: PropTypes.string,
  isExecution: PropTypes.bool,
  name: PropTypes.string,
};

export default function WorkflowExecutionPort({
  className,
  isExecution,
  name,
  ...rest
}: {
  className?: string;
  isExecution: boolean;
  name: string;
}) {
  return (
    <PortWidget
      className={cx(styles.port, className, { [styles[name]]: name, [styles.execution]: isExecution })}
      name={name}
      node={new NodeModel()}
      {...rest}
    />
  );
}
