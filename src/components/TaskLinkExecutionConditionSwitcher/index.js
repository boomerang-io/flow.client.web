import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
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
      <Icon
        className={cx(styles.container, styles[kind], styles[name])}
        key={name}
        onClick={onClick}
        onKeyDown={(e) => isAccessibleEvent(e) && onClick(e)}
        role="button"
        tabIndex={0}
      />
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
