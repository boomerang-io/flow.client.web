import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "State/tasks";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import { actions as workflowExecutionActiveNodeActions } from "State/workflowExecutionActiveNode";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { PortWidget } from "@boomerang/boomerang-dag";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import downloadIMG from "Assets/svg/install.svg";
import emailIMG from "Assets/svg/email_icon.svg";
import "./styles.scss";

export class TaskNode extends Component {
  static propTypes = {
    nodeConfig: PropTypes.object.isRequired,
    step: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    taskActions: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired
  };

  static defaultProps = {
    nodeConfig: {}
  };

  state = {};

  handleOnActivityClick = () => {
    this.props.workflowExecutionActiveNodeActions.updateActiveNode({
      workflowId: this.props.diagramEngine.id,
      nodeId: this.props.node.id
    });
  };

  determineNodeIcon() {
    let nodeIcon;
    if (this.props.task) {
      if (this.props.task.name === "Download File") {
        nodeIcon = downloadIMG;
      } else if (this.props.task.name === "Send Mail") {
        nodeIcon = emailIMG;
      } else if (this.props.task.name === "Ingest CSV") {
        nodeIcon = downloadIMG;
      } else {
        nodeIcon = emailIMG;
      }
    } else {
      nodeIcon = emailIMG;
    }

    return nodeIcon;
  }

  render() {
    const flowTaskStatus = this.props.step ? this.props.step.flowTaskStatus : "";

    return (
      <div className="c-taskNode" onClick={this.handleOnActivityClick}>
        <div
          className={classnames("b-taskNode", {
            [`--${flowTaskStatus}`]: flowTaskStatus && this.props.diagramEngine.diagramModel.locked
          })}
        >
          <div className="b-taskNode__progress-bar" />
          <Tooltip className="custom-node-toolTip" place="left" id={this.props.node.id}>
            {this.props.task ? this.props.task.description : "Task description"}
          </Tooltip>
          <div className="b-taskNode__tile" data-tip data-for={this.props.node.id}>
            {this.props.task ? this.props.task.name : "Task"}
          </div>

          <PortWidget className="b-taskNode-port --left" name="left" node={this.props.node} />
          <PortWidget className="b-taskNode-port --right" name="right" node={this.props.node} />
          <img src={this.determineNodeIcon()} className="b-taskNode__img" alt="Task node type" />
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
  taskActions: bindActionCreators(taskActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch),
  workflowExecutionActiveNodeActions: bindActionCreators(workflowExecutionActiveNodeActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskNode);
