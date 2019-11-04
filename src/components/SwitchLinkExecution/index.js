import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import WorkflowLink from "Components/WorkflowLink";
import SwitchLinkExecutionConditionButton from "Components/SwitchLinkExecutionConditionButton";
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
    const step = workflowExecution.data.steps?.find(step => step.taskId === targetNodeId);

    const targetTaskHasStarted = step?.flowTaskStatus && step?.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED;

    const isModelLocked = diagramEngine.diagramModel.locked;

    return (
      <WorkflowLink
        className={cx(styles.linkPath, { [styles.started]: targetTaskHasStarted })}
        diagramEngine={diagramEngine}
        model={model}
        path={path}
      >
        {({ halfwayPoint, handleOnDelete }) => (
          <g transform={`translate(${halfwayPoint.x + 20}, ${halfwayPoint.y - 12})`}>
            <SwitchLinkExecutionConditionButton
              className={styles.executionConditionButton}
              disabled={isModelLocked}
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
