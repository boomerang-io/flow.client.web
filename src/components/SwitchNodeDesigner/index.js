import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "State/tasks";
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

export class SwitchNode extends Component {
  static propTypes = {
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
    //this.props.workflowRevisionActions.updateNode({ nodeId: this.props.node.id, inputs });
    this.props.workflowRevisionActions.updateNodeConfig({ nodeId: this.props.node.id, inputs });
    this.forceUpdate();
  };

  // Delete the node in state and then remove it from the diagram
  handleOnDelete = () => {
    this.props.workflowRevisionActions.deleteNode({ nodeId: this.props.node.id });
    this.props.node.remove();
  };

  renderDeleteNode() {
    return <CloseModalButton className="b-switchNode__delete" onClick={this.handleOnDelete} />;
  }

  renderConfigureNode() {
    const { nodeConfig, task } = this.props;
    return (
      <Modal
        ModalTrigger={() => <img src={pencilIcon} className="b-switchNode__edit" alt="Task node type" />}
        modalContent={(closeModal, ...rest) => (
          <ModalFlow
            headerTitle={task.name}
            closeModal={closeModal}
            confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
            theme="bmrg-white"
            {...rest}
          >
            <DisplayForm
              closeModal={closeModal}
              config={this.props.nodeConfig}
              nodeConfig={nodeConfig}
              onSave={this.handleOnSave}
              task={task}
            />
          </ModalFlow>
        )}
      />
    );
  }

  render() {
    console.log(this.props);
    return (
      <div className="b-switchNode">
        <Tooltip className="custom-node-toolTip" place="left" id={this.props.node.id}>
          {this.props.task ? this.props.task.description : "Task description"}
        </Tooltip>
        <div className="b-switchNode__tile" data-tip data-for={this.props.node.id}>
          {this.props.nodeConfig.inputs && this.props.nodeConfig.inputs.value
            ? this.props.nodeConfig.inputs.value
            : this.props.task.name}
        </div>

        <PortWidget className="b-switchNode-port --left" name="left" node={this.props.node} />
        <PortWidget className="b-switchNode-port --right" name="right" node={this.props.node} />
        {this.renderDeleteNode()}
        {this.renderConfigureNode()}
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

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchNode);
