import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { actions as appActions } from "State/app";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowTaskForm from "Components/WorkflowTaskForm";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
import WorkflowEditButton from "Components/WorkflowEditButton";
import WorkflowNode from "Components/WorkflowNode";
import { Fork16 } from "@carbon/icons-react";

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
      <ModalFlow
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved"
        }}
        modalHeaderProps={{
          title: this.props.task.name
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
    const { node } = this.props;
    return (
      <WorkflowNode
        className={styles.node}
        icon={<Fork16 alt="Switch icon" style={{ willChange: "auto" }} />}
        node={node}
        subtitle={node.taskName}
        title={"Switch"}
        rightPortClass={styles.rightPort}
        subtitleClass={styles.subtitle}
      >
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Switch</p>
        </div>
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
)(SwitchNode);
