import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import WorkflowNode from "Components/WorkflowNode";
import { Fork16 } from "@carbon/icons-react";
import "./styles.scss";

export class SwitchNodeExecution extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired
  };

  static defaultProps = {
    node: {},
    nodeConfig: {}
  };

  render() {
    return <WorkflowNode title={"Switch"} icon={<Fork16 alt="Switch icon" />} node={this.props.node} />;
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
