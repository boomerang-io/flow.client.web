import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import { PortWidget } from "@projectstorm/react-diagrams";
import mapTaskNametoIcon from "Utilities/taskIcons";
import "./styles.scss";

export class TaskNodeExecution extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    step: PropTypes.object,
    task: PropTypes.object.isRequired,
    diagramEngine: PropTypes.object.isRequired,
    appActions: PropTypes.object.isRequired
  };

  static defaultProps = {
    nodeConfig: {}
  };

  state = {};

  handleOnActivityClick = () => {
    this.props.appActions.updateActiveNode({
      workflowId: this.props.diagramEngine.id,
      nodeId: this.props.node.id
    });
  };

  render() {
    const flowTaskStatus = this.props.step ? this.props.step.flowTaskStatus : "";

    return (
      <button className="c-taskNode" onClick={this.handleOnActivityClick} style={{ cursor: "pointer" }}>
        <div
          className={classnames("b-task-node", {
            [`--${flowTaskStatus}`]: flowTaskStatus
          })}
        >
          <div className="b-task-node__progress-bar" />
          <h1 className="b-task-node__title">{this.props.task ? this.props.task.name : "Task"}</h1>
          <PortWidget className="b-task-node-port --left" name="left" node={this.props.node} />
          <PortWidget className="b-task-node-port --right" name="right" node={this.props.node} />
          {mapTaskNametoIcon(this.props.task.name, this.props.task.category)}
        </div>
      </button>
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
)(TaskNodeExecution);
