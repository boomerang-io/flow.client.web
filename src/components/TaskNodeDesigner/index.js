import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "State/tasks";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { PortWidget } from "@boomerang/boomerang-dag";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import DisplayForm from "./DisplayForm";
import pencilIcon from "./pencil.svg";
import { TASK_KEYS_TO_ICON } from "Constants/taskIcons";
import "./styles.scss";

export class TaskNode extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    taskActions: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired
  };

  static defaultProps = {
    nodeConfig: {}
  };

  state = {};

  handleOnSave = inputs => {
    this.props.workflowRevisionActions.updateNode({ nodeId: this.props.node.id, inputs });
    this.forceUpdate();
  };

  // Delete the node in state and then remove it from the diagram
  handleOnDelete = () => {
    this.props.workflowRevisionActions.deleteNode({ nodeId: this.props.node.id });
    this.props.node.remove();
  };

  renderDeleteNode() {
    return <CloseModalButton className="b-taskNode__delete" onClick={this.handleOnDelete} />;
  }

  renderConfigureNode() {
    const { nodeConfig, task } = this.props;
    return (
      <Modal
        ModalTrigger={() => <img src={pencilIcon} className="b-taskNode__edit" alt="Task node type" />}
        modalContent={(closeModal, ...rest) => (
          <ModalFlow
            headerTitle={`Edit properties for ${task.name}`}
            closeModal={closeModal}
            confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
            theme={"bmrg-white"}
            {...rest}
          >
            <DisplayForm
              node={this.props.node}
              config={this.props.nodeConfig}
              onSave={this.handleOnSave}
              task={task}
              nodeConfig={nodeConfig}
            />
          </ModalFlow>
        )}
      />
    );
  }

  render() {
    return (
      <div className="b-taskNode">
        <Tooltip className="custom-node-toolTip" place="left" id={this.props.node.id}>
          {this.props.task ? this.props.task.description : "Task description"}
        </Tooltip>
        <div className="b-taskNode__tile" data-tip data-for={this.props.node.id}>
          {this.props.task ? this.props.task.name : "Task"}
        </div>

        <PortWidget className="b-taskNode-port --left" name="left" node={this.props.node} />
        <PortWidget className="b-taskNode-port --right" name="right" node={this.props.node} />
        {this.renderDeleteNode()}
        <img src={TASK_KEYS_TO_ICON[this.props.task.key]} className="b-taskNode__img" alt="Task node type" />
        {this.renderConfigureNode()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    nodeTaskNames: state.workflowRevision
  };
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskNode);
