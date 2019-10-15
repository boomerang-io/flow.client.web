import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { actions as appActions } from "State/app";
import { PortWidget } from "@projectstorm/react-diagrams";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
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
      <ModalFlow
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your changes will not be saved"
        }}
        modalHeaderProps={{
          title: this.props.task.name
        }}
        modalTrigger={({ openModal }) => (
          <button className="b-switchNode__edit" onClick={openModal}>
            <img src={pencilIcon} alt="Switch node type" />
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

  render() {
    return (
      <div className="b-switchNode">
        <h1 className="b-switchNode__title">
          {this.props.nodeConfig.inputs && this.props.nodeConfig.inputs.value
            ? this.props.nodeConfig.inputs.value
            : this.props.task.name}
        </h1>
        <PortWidget className="b-switchNode-port --left" name="left" node={this.props.node} />
        <PortWidget className="b-switchNode-port --right" name="right" node={this.props.node} />
        {this.renderDeleteNode()}
        <button>
          <img src={switchSVG} className="b-switchNode__img" alt="Task node type" />
        </button>
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
