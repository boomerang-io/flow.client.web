import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./ExecutionConditionSwitcher.module.scss";

ExecutionConditionSwitcher.propTypes = {
  disabled: PropTypes.bool,
  executionCondition: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

function ExecutionConditionSwitcher({ disabled, executionCondition, kind, onClick }) {
  const { name, Icon } = executionCondition;

  return (
    <button
      className={cx(styles.container, styles[kind], styles[name])}
      disabled={disabled}
      key={name}
      onClick={onClick}
    >
      <Icon key={name} />
    </button>
  );
}

export default ExecutionConditionSwitcher;
