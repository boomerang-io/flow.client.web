import React from "react";
import cx from "classnames";
import { WorkflowEngineModeType } from "Types";
import styles from "./TaskLinkExecutionConditionSwitcher.module.scss";
import { WorkflowEngineMode } from "Constants";

interface TaskLinkExecutionConditionSwitcherProps {
  disabled?: boolean;
  executionCondition: {
    name: string;
    Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  };
  kind?: WorkflowEngineModeType;
  onClick: () => void;
}

function TaskLinkExecutionConditionSwitcher({
  disabled = false,
  executionCondition,
  kind = WorkflowEngineMode.Editor,
  onClick,
}: TaskLinkExecutionConditionSwitcherProps) {
  const { name, Icon } = executionCondition;
  if (disabled) {
    return <Icon className={cx(styles.container, styles[kind], styles[name])} key={name} />;
  } else {
    return (
      <button onClick={onClick} style={{ lineHeight: 1 }}>
        <Icon className={cx(styles.container, styles[kind], styles[name])} key={name} />
      </button>
    );
  }
}

export default TaskLinkExecutionConditionSwitcher;
