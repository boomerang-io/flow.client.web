import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { actions as appActions } from "State/app";
import { PortWidget } from "@projectstorm/react-diagrams";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import DisplayForm from "Components/DisplayForm";
import { Close16, Edit16 } from "@carbon/icons-react";
import mapTaskNametoIcon from "Utilities/taskIcons";
import "./styles.scss";

export class TaskNode extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    taskNames: PropTypes.array.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired,
    isModalOpen: PropTypes.bool.isRequired
  };

  static defaultProps = {
    nodeConfig: {}
  };

  state = {};

  handleOnSave = inputs => {
    this.props.workflowRevisionActions.updateNodeConfig({ nodeId: this.props.node.id, inputs });
    this.forceUpdate();
  };

  // Delete the node in state and then remove it from the diagram
  handleOnDelete = () => {
    this.props.workflowRevisionActions.deleteNode({ nodeId: this.props.node.id });
    this.props.node.remove();
  };

  renderDeleteNode() {
    return (
      <button className="b-task-node__delete">
        <Close16 onClick={this.handleOnDelete} />
      </button>
    );
  }

  renderConfigureNode() {
    return (
      <ModalFlow
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved"
        }}
        modalHeaderProps={{
          title: `Edit ${this.props.task.name}`,
          subtitle: "Configure the inputs"
        }}
        modalTrigger={({ openModal }) => (
          <button className="b-task-node__edit" onClick={openModal}>
            <Edit16 alt="Task node type" />
          </button>
        )}
      >
        <DisplayForm
          inputProperties={this.props.inputProperties}
          node={this.props.node}
          nodeConfig={this.props.nodeConfig}
          onSave={this.handleOnSave}
          setIsModalOpen={this.props.appActions.setIsModalOpen}
          taskNames={this.props.taskNames}
          task={this.props.task}
        />
      </ModalFlow>
    );
  }

  // TODO: confirm use of Carbon <Icon /> below
  render() {
    return (
      <div className="b-task-node">
        {mapTaskNametoIcon(this.props.task.name, this.props.task.category)}
        <h1 className="b-task-node__title">{this.props.task ? this.props.task.name : "Task"}</h1>
        <PortWidget className="b-task-node-port --left" name="left" node={this.props.node} port="left" />
        <PortWidget className="b-task-node-port --right" name="right" node={this.props.node} port="right" />
        {this.renderConfigureNode()}
        {this.renderDeleteNode()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    taskNames: Object.values(ownProps.diagramEngine.getDiagramModel().getNodes()) //Get the taskNames names from the nodes on the model
      .map(node => node.taskName)
      .filter(name => !!name),
    isModalOpen: state.app.isModalOpen,
    inputProperties: state.workflow.data.properties
  };
};

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskNode);
