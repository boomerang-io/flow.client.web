//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./TaskLinkExecutionConditionSwitcher.module.scss";

const TaskLinkExecutionConditionSwitcher = React.memo(function TaskLinkExecutionConditionSwitcher({
  disabled,
  executionCondition,
  kind,
  onClick,
  status,
}) {
  const { name, Icon } = executionCondition;
  if (disabled) {
    return <Icon className={cx(styles.container, styles[kind], styles[name])} key={name} />;
  } else {
    return (
      <button onClick={onClick} style={{ lineHeight: 1 }}>
        <Icon
          className={cx(styles.container, styles[kind], styles[name])}
          key={name}
        />
      </button>
    );
  }
});

TaskLinkExecutionConditionSwitcher.propTypes = {
  disabled: PropTypes.bool,
  executionCondition: PropTypes.object.isRequired,
  kind: PropTypes.oneOf(["designer", "execution"]),
  onClick: PropTypes.func,
};

export default TaskLinkExecutionConditionSwitcher;
