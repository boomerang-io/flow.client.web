import React from "react";
import PropTypes from "prop-types";
import { PortWidget } from "@projectstorm/react-diagrams";
import cx from "classnames";
import styles from "./WorkflowExecutionPort.module.scss";

WorkflowExecutionPort.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string
};

export default function WorkflowExecutionPort({ className, isExecution, name, ...rest }) {
  return (
    <PortWidget
      className={cx(styles.port, className, { [styles[name]]: name, [styles.execution]: isExecution })}
      name={name}
      {...rest}
    />
  );
}
