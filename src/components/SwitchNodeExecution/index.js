import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PortWidget } from "@boomerang/boomerang-dag";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import switchSVG from "Assets/svg/parent-relationship_32.svg";
import "./styles.scss";

export class SwitchNodeExecution extends Component {
  static propTypes = {
    nodeConfig: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired
  };

  static defaultProps = {
    nodeConfig: {}
  };

  state = {};

  render() {
    return (
      <div className="b-switchNode">
        <Tooltip place="left" id={this.props.node.id}>
          {this.props.task ? this.props.task.description : "Task description"}
        </Tooltip>
        <div className="b-switchNode__tile" data-tip data-for={this.props.node.id}>
          {this.props.nodeConfig.inputs && this.props.nodeConfig.inputs.value
            ? this.props.nodeConfig.inputs.value
            : this.props.task.name}
        </div>

        <PortWidget className="b-switchNode-port --left" name="left" node={this.props.node} />
        <PortWidget className="b-switchNode-port --right" name="right" node={this.props.node} />
        <img src={switchSVG} className="b-switchNode__img" alt="Task node type" />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id]
  };
};

export default connect(
  mapStateToProps,
  null
)(SwitchNodeExecution);
