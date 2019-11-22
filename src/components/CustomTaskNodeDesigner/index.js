import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { actions as appActions } from "State/app";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowNode from "Components/WorkflowNode";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import styles from "./CustomTaskNodeDesigner.module.scss";

export class CustomTaskNodeDesigner extends Component {
  static propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    taskNames: PropTypes.array.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired
  };

  static defaultProps = {
    node: {},
    nodeConfig: {},
    task: {}
  };

  handleOnSave = inputs => {
    this.props.workflowRevisionActions.updateNodeConfig({ nodeId: this.props.node.id, inputs });
    this.forceUpdate();
  };

  // Delete the node in state and then remove it from the diagram
  handleOnDelete = () => {
    this.props.workflowRevisionActions.deleteNode({ nodeId: this.props.node.id });
    this.props.node.remove();
  };

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
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
      >
        <WorkflowTaskForm
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

  render() {
    const { task, node } = this.props;
    return (
      <WorkflowNode
        className={styles.node}
        title={task.name}
        subtitle={node.taskName}
        name={task.name}
        category={task.category}
        node={node}
      >
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Custom</p>
        </div>
        {this.renderConfigureNode()}
        <WorkflowCloseButton className={styles.closeButton} onClick={this.handleOnDelete} />
      </WorkflowNode>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isModalOpen: state.app.isModalOpen,
    inputProperties: state.workflow.data.properties,
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    taskNames: Object.values(ownProps.diagramEngine.getDiagramModel().getNodes()) // get the taskNames names from the nodes on the model
      .map(node => node.taskName)
      .filter(name => !!name)
  };
};

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomTaskNodeDesigner);
