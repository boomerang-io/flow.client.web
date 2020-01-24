import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import WorkflowLink from "Components/WorkflowLink";
import SwitchLinkExecutionConditionButton from "Components/SwitchLinkExecutionConditionButton";
import NODE_TYPES from "Constants/nodeTypes";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./SwitchLink.module.scss";

class SwitchLinkExecution extends Component {
  static propTypes = {
    diagramEngine: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired
  };

  render() {
    const { diagramEngine, model, path, workflowExecution } = this.props;
    let seperatedLinkState;
    if (this.props.model.switchCondition) {
      seperatedLinkState = this.props.model.switchCondition.replace(/\n/g, ",");
    }

    const targetNodeId = model?.targetPort?.parent?.id;
    const sourceNodeId = model?.sourcePort?.parent?.id;

    const targetNodeType = model?.targetPort?.parent?.type;

    const sourceStep = workflowExecution.data.steps?.find(step => step.taskId === sourceNodeId);
    const targetStep = workflowExecution.data.steps?.find(step => step.taskId === targetNodeId);

    const targetTaskHasStarted =
      targetStep?.flowTaskStatus &&
      targetStep?.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED &&
      targetStep?.flowTaskStatus !== EXECUTION_STATUSES.SKIPPED;

    const sourceTaskHasFinishedAndIsEndOfWorkflow =
      (sourceStep?.flowTaskStatus === EXECUTION_STATUSES.COMPLETED ||
        sourceStep?.flowTaskStatus === EXECUTION_STATUSES.FAILURE) &&
      targetNodeType === NODE_TYPES.START_END;

    return (
      <WorkflowLink
        className={cx({ [styles.traversed]: targetTaskHasStarted || sourceTaskHasFinishedAndIsEndOfWorkflow })}
        diagramEngine={diagramEngine}
        model={model}
        path={path}
      >
        {({ halfwayPoint, handleOnDelete }) => (
          <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`}>
            <SwitchLinkExecutionConditionButton
              className={styles.executionConditionButton}
              disabled={true}
              kind="execution"
              inputText={seperatedLinkState}
              onClick={this.openModal}
            />
          </g>
        )}
      </WorkflowLink>
    );
  }
}

const mapStateToProps = state => {
  return {
    workflowExecution: state.workflowExecution
  };
};

export default connect(mapStateToProps)(SwitchLinkExecution);
