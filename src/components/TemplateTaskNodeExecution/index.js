import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import TaskNode from "Components/TaskNode";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import styles from "./TemplateNodeExecution.module.scss";

export class TemplateNodeExecution extends Component {
  static propTypes = {
    appActions: PropTypes.object.isRequired,
    diagramEngine: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    step: PropTypes.object,
    task: PropTypes.object.isRequired
  };

  static defaultProps = {
    node: {},
    nodeConfig: {},
    task: {}
  };

  handleOnActivityClick = () => {
    this.props.appActions.updateActiveNode({
      workflowId: this.props.diagramEngine.id,
      nodeId: this.props.node.id
    });
  };

  render() {
    const flowTaskStatus = this.props.step ? this.props.step.flowTaskStatus : "";
    const { task, node } = this.props;

    return (
      <TaskNode
        category={task.category}
        className={styles[flowTaskStatus]}
        name={task.name}
        node={node}
        onClick={e => isAccessibleEvent(e) && this.handleOnActivityClick()}
        style={{ cursor: "pointer" }}
        subtitle={node.taskName}
        title={task.name}
      >
        <div className={styles.progressBar} />
      </TaskNode>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    step:
      state.workflowExecution.data.steps && state.workflowExecution.data.steps.length
        ? state.workflowExecution.data.steps.find(step => step.taskId === ownProps.node.id)
        : {}
  };
};

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateNodeExecution);
