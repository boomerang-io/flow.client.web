import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { actions as appActions } from "State/app";
import { ComposedModal } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import TaskUpdateModal from "Components/TaskUpdateModal";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowWarningButton from "Components/WorkflowWarningButton";
import WorkflowNode from "Components/WorkflowNode";

import styles from "./SwitchNodeDesigner.module.scss";

export class SwitchNode extends Component {
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

  handleOnUpdateTaskVersion = ({ version, inputs }) => {
    this.props.workflowRevisionActions.updateNodeTaskVersion({ nodeId: this.props.node.id, inputs, version });
    this.forceUpdate();
  };

  // Delete the node in state and then remove it from the diagram
  handleOnDelete = () => {
    this.props.workflowRevisionActions.deleteNode({ nodeId: this.props.node.id });
    this.props.node.remove();
  };

  renderDeleteNode() {
    return <WorkflowCloseButton className={styles.deleteButton} onClick={this.handleOnDelete} />;
  }

  renderConfigureNode() {
    return (
      <ComposedModal
        composedModalProps={{
          onAfterOpen: () => this.props.appActions.setIsModalOpen({ isModalOpen: true }),
          shouldCloseOnOverlayClick: false
        }}
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved"
        }}
        modalHeaderProps={{
          title: this.props.task?.name
        }}
        modalTrigger={({ openModal }) => <WorkflowEditButton className={styles.editButton} onClick={openModal} />}
        onCloseModal={() => this.props.appActions.setIsModalOpen({ isModalOpen: false })}
      >
        {({ closeModal }) => (
          <WorkflowTaskForm
            closeModal={closeModal}
            inputProperties={this.props.inputProperties}
            node={this.props.node}
            nodeConfig={this.props.nodeConfig}
            onSave={this.handleOnSave}
            taskNames={this.props.taskNames}
            task={this.props.task}
          />
        )}
      </ComposedModal>
    );
  }

  renderUpdateTaskVersion() {
    if (this.props.nodeDag?.templateUpgradeAvailable) {
      return (
        <ComposedModal
          composedModalProps={{
            containerClassName: styles.updateTaskModalContainer,
            onAfterOpen: () => this.props.appActions.setIsModalOpen({ isModalOpen: true }),
            shouldCloseOnOverlayClick: false
          }}
          modalHeaderProps={{
            title: `New version available`,
            subtitle:
              "The managers of this task have made some changes that were significant enough for a new version. You can still use the current version, but it’s usually a good idea to update when available. The details of the change are outlined below. If you’d like to update, review the changes below and make adjustments if needed. This process will only update the task in this Workflow - not any other workflows where this task appears."
          }}
          modalTrigger={({ openModal }) => (
            <WorkflowWarningButton className={styles.updateButton} onClick={openModal} />
          )}
          onCloseModal={() => this.props.appActions.setIsModalOpen({ isModalOpen: false })}
        >
          {({ closeModal }) => (
            <TaskUpdateModal
              closeModal={closeModal}
              inputProperties={this.props.inputProperties}
              node={this.props.node}
              nodeConfig={this.props.nodeConfig}
              onSave={this.handleOnUpdateTaskVersion}
              taskNames={this.props.taskNames}
              task={this.props.task}
            />
          )}
        </ComposedModal>
      );
    }

    return null;
  }

  render() {
    const { node, task } = this.props;
    return (
      <WorkflowNode
        className={styles.node}
        node={node}
        icon={task?.icon}
        subtitle={node.taskName}
        title={"Switch"}
        rightPortClass={styles.rightPort}
        subtitleClass={styles.subtitle}
      >
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Switch</p>
        </div>
        {this.renderUpdateTaskVersion()}
        {this.renderConfigureNode()}
        {this.renderDeleteNode()}
      </WorkflowNode>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    nodeDag: state.workflowRevision.dag?.nodes?.find(node => node.nodeId === ownProps.node.id) ?? {},
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

export default connect(mapStateToProps, mapDispatchToProps)(SwitchNode);
