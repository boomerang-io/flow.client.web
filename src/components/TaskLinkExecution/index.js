import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import WorkflowLink from "Components/WorkflowLink";
import { useExecutionContext } from "Hooks";
import TaskLinkExecutionConditionSwitcher from "Components/TaskLinkExecutionConditionSwitcher";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import { NodeType } from "Constants";
import { EXECUTION_CONDITIONS } from "utilities/taskLinkIcons";
import styles from "./TaskLink.module.scss";

TaskLinkExecution.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default function TaskLinkExecution({ diagramEngine, model, path }) {
  const { workflowExecution } = useExecutionContext();
  const targetNodeId = model ?.targetPort ?.parent ?.id;
  const sourceNodeId = model ?.sourcePort ?.parent ?.id;

  const targetNodeType = model ?.targetPort ?.parent ?.type;

  const sourceStep = workflowExecution.steps ?.find(step => step.taskId === sourceNodeId);
  const targetStep = workflowExecution.steps ?.find(step => step.taskId === targetNodeId);

  const targetTaskHasStarted =
    targetStep ?.flowTaskStatus &&
      targetStep ?.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED &&
        targetStep ?.flowTaskStatus !== EXECUTION_STATUSES.SKIPPED;

  const sourceTaskHasFinishedAndIsEndOfWorkflow =
    (sourceStep ?.flowTaskStatus === EXECUTION_STATUSES.COMPLETED ||
      sourceStep ?.flowTaskStatus === EXECUTION_STATUSES.FAILURE) &&
    targetNodeType === NodeType.StartEnd;

  const executionCondition = EXECUTION_CONDITIONS.find(
    (executionCondition) => executionCondition.name === model.executionCondition
  );

  return (
    <WorkflowLink
      className={cx({
        [styles.traversed]: targetTaskHasStarted || sourceTaskHasFinishedAndIsEndOfWorkflow,
      })}
      diagramEngine={diagramEngine}
      model={model}
      path={path}
    >
      {({ halfwayPoint }) => (
        <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`}>
          <TaskLinkExecutionConditionSwitcher
            disabled={true}
            executionCondition={executionCondition}
            kind="execution"
          />
          ) }}
        </g>
      )}
    </WorkflowLink>
  );
}
