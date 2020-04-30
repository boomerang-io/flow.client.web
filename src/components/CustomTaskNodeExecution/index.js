import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import cx from "classnames";
import WorkflowNode from "Components/WorkflowNode";
//import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./CustomTaskNodeExecution.module.scss";

export class CustomTaskNodeExecution extends Component {
  static propTypes = {
    appActions: PropTypes.object.isRequired,
    diagramEngine: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object,
    task: PropTypes.object.isRequired,
  };

  static defaultProps = {
    node: {},
    nodeConfig: {},
    task: {},
  };

  // handleOnActivityClick = () => {
  //   this.props.appActions.updateActiveNode({
  //     workflowId: this.props.diagramEngine.id,
  //     nodeId: this.props.node.id
  //   });
  // };

  render() {
    const { task, node } = this.props;
    const { steps } = this.props.workflowExecution.data;
    const step = Array.isArray(steps) ? steps.find((step) => step.taskId === node.id) : {};
    const flowTaskStatus = step?.flowTaskStatus ?? EXECUTION_STATUSES.SKIPPED;

    return (
      <WorkflowNode
        isExecution
        category={task.category}
        className={cx(styles[flowTaskStatus], { [styles.disabled]: flowTaskStatus === ACTIVITY_STATUSES.NOT_STARTED })}
        icon={task.icon}
        name={task.name}
        node={node}
        //onClick={e => isAccessibleEvent(e) && this.handleOnActivityClick()}
        subtitle={node.taskName}
        title={task.name}
      >
        <div className={styles.progressBar} />
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Custom</p>
        </div>
        <div className={styles.progressBar} />
      </WorkflowNode>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    task: state.tasks.data.find((task) => task.id === ownProps.node.taskId),
    workflowExecution: state.workflowExecution,
  };
};

const mapDispatchToProps = (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTaskNodeExecution);
