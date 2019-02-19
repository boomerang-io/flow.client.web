import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import { PortWidget } from "@boomerang/boomerang-dag";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import { iconMapping } from "Constants/taskIcons";
import { Icon } from "carbon-components-react";
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

  // TODO: confirm use of Carbon <Icon /> below
  render() {
    const flowTaskStatus = this.props.step ? this.props.step.flowTaskStatus : "";

    return (
      <div className="c-taskNode" onClick={this.handleOnActivityClick}>
        <div
          className={classnames("b-task-node", {
            [`--${flowTaskStatus}`]: flowTaskStatus
          })}
        >
          <div className="b-task-node__progress-bar" />
          <Tooltip place="left" id={this.props.node.id}>
            {this.props.task ? this.props.task.description : "Task description"}
          </Tooltip>
          <div className="b-task-node__tile" data-tip data-for={this.props.node.id}>
            {this.props.task ? this.props.task.name : "Task"}
          </div>

          <PortWidget className="b-task-node-port --left" name="left" node={this.props.node} />
          <PortWidget className="b-task-node-port --right" name="right" node={this.props.node} />
          {iconMapping(this.props.task.name, this.props.task.category) && (
            <Icon
              fill="#40D5BB"
              name={iconMapping(this.props.task.name, this.props.task.category)}
              className="b-task-node__img"
              alt="Task node type"
            />
          )}
        </div>
      </div>
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
