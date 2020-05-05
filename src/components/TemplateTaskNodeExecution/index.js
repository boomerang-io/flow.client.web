import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import cx from "classnames";
import { actions as appActions } from "State/app";
import WorkflowNode from "Components/WorkflowNode";
//import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import styles from "./TemplateTaskNodeExecution.module.scss";

export class TemplateTaskNodeExecution extends Component {
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
        subtitle={node.taskName}
        title={task.name}
      >
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

export default connect(mapStateToProps, mapDispatchToProps)(TemplateTaskNodeExecution);
