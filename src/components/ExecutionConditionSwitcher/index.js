import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import styles from "./ExecutionConditionSwitcher.module.scss";

ExecutionConditionSwitcher.propTypes = {
  disabled: PropTypes.bool,
  executionCondition: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

function ExecutionConditionSwitcher({ disabled, executionCondition, kind, onClick }) {
  const { name, Icon } = executionCondition;

  return (
    <Icon
      className={cx(styles.container, styles[kind], styles[name])}
      disabled={disabled}
      key={name}
      onClick={onClick}
      onKeyDown={e => isAccessibleEvent(e) && onClick(e)}
      role="button"
      tabIndex={0}
    />
  );
}

export default ExecutionConditionSwitcher;
