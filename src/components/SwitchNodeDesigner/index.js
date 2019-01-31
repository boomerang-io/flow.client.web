import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { actions as appActions } from "State/app";
import { PortWidget } from "@boomerang/boomerang-dag";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import DisplayForm from "Components/DisplayForm";
import pencilIcon from "./pencil.svg";
import switchSVG from "Assets/svg/parent-relationship_32.svg";
import "./styles.scss";

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
    return <CloseModalButton className="b-switchNode__delete" onClick={this.handleOnDelete} />;
  }

  renderConfigureNode() {
    return (
      <Modal
        ModalTrigger={() => <img src={pencilIcon} className="b-switchNode__edit" alt="Task node type" />}
        modalContent={(closeModal, ...rest) => (
          <ModalFlow
            headerTitle={this.props.task.name}
            closeModal={closeModal}
            confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-white" }}
            theme="bmrg-white"
            {...rest}
          >
            <DisplayForm
              closeModal={closeModal}
              inputProperties={this.props.inputProperties}
              node={this.props.node}
              nodeConfig={this.props.nodeConfig}
              onSave={this.handleOnSave}
              setIsModalOpen={this.props.appActions.setIsModalOpen}
              taskNames={this.props.taskNames}
              task={this.props.task}
            />
          </ModalFlow>
        )}
      />
    );
  }

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
        {this.renderDeleteNode()}
        <img src={switchSVG} className="b-switchNode__img" alt="Task node type" />
        {this.renderConfigureNode()}
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
)(SwitchNode);
