import React from "react";
import PropTypes from "prop-types";
import { useExecutionContext } from "Hooks";
import cx from "classnames";
import WorkflowLink from "Components/WorkflowLink";
import SwitchLinkExecutionConditionButton from "Components/SwitchLinkExecutionConditionButton";
import { NodeType } from "Constants";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./SwitchLink.module.scss";

SwitchLinkExecution.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

export default function SwitchLinkExecution({ diagramEngine, model, path }) {
  const { workflowExecution } = useExecutionContext();

  let seperatedLinkState;
  if (model.switchCondition) {
    seperatedLinkState = model.switchCondition.replace(/\n/g, ",");
  }

  const targetNodeId = model?.targetPort?.parent?.id;
  const sourceNodeId = model?.sourcePort?.parent?.id;

  const targetNodeType = model?.targetPort?.parent?.type;

  const sourceStep = workflowExecution.steps?.find(step => step.taskId === sourceNodeId);
  const targetStep = workflowExecution.steps?.find(step => step.taskId === targetNodeId);

  const targetTaskHasStarted =
    targetStep?.flowTaskStatus &&
    targetStep?.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED &&
    targetStep?.flowTaskStatus !== EXECUTION_STATUSES.SKIPPED;

  const sourceTaskHasFinishedAndIsEndOfWorkflow =
    (sourceStep?.flowTaskStatus === EXECUTION_STATUSES.COMPLETED ||
      sourceStep?.flowTaskStatus === EXECUTION_STATUSES.FAILURE) &&
    targetNodeType === NodeType.START_END;

  return (
    <WorkflowLink
      className={cx({ [styles.traversed]: targetTaskHasStarted || sourceTaskHasFinishedAndIsEndOfWorkflow })}
      diagramEngine={diagramEngine}
      model={model}
      path={path}
    >
      {({ halfwayPoint }) => (
        <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`}>
          <SwitchLinkExecutionConditionButton
            className={styles.executionConditionButton}
            disabled={true}
            kind="execution"
            inputText={seperatedLinkState}
          />
        </g>
      )}
    </WorkflowLink>
  );
}
