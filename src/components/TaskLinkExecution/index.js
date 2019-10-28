import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { connect } from "react-redux";
import WorkflowLink from "Components/WorkflowLink";
import ExecutionConditionSwitcher from "Components/ExecutionConditionSwitcher";
import { CheckmarkOutline16, CloseOutline16, ArrowRight16 } from "@carbon/icons-react";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./TaskLink.module.scss";

export const EXECUTION_STATES = {
  SUCCESS: "success",
  FAILURE: "failure",
  ALWAYS: "always"
};

export const EXECUTION_CONDITIONS = [
  {
    Icon: CheckmarkOutline16,
    name: EXECUTION_STATES.SUCCESS
  },
  {
    Icon: CloseOutline16,
    name: EXECUTION_STATES.FAILURE
  },
  {
    Icon: ArrowRight16,
    name: EXECUTION_STATES.ALWAYS
  }
];

TaskLinkExecution.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

function TaskLinkExecution({ diagramEngine, model, path, workflowExecution }) {
  const targetNodeId = model?.targetPort?.parent?.id;
  const step = workflowExecution.data.steps?.find(step => step.taskId === targetNodeId);

  const targetTaskHasStarted = step?.flowTaskStatus && step?.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED;
  const executionCondition = EXECUTION_CONDITIONS.find(
    executionCondition => executionCondition.name === model.executionCondition
  );

  const isModelLocked = diagramEngine.diagramModel.locked;

  return (
    <WorkflowLink
      className={cx({ [styles.started]: targetTaskHasStarted })}
      diagramEngine={diagramEngine}
      model={model}
      path={path}
    >
      {({ halfwayPoint }) => (
        <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`} xmlns="http://www.w3.org/2000/svg">
          <ExecutionConditionSwitcher
            disabled={isModelLocked}
            executionCondition={executionCondition}
            kind="execution"
          />
          ) }}
        </g>
      )}
    </WorkflowLink>
  );
}

const mapStateToProps = state => {
  return {
    workflowExecution: state.workflowExecution
  };
};

export default connect(mapStateToProps)(TaskLinkExecution);
