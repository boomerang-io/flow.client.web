import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "State/tasks";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import { actions as workflowExecutionActiveNodeActions } from "State/workflowExecutionActiveNode";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { PortWidget } from "@boomerang/boomerang-dag";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import Tooltip from "@boomerang/boomerang-components/lib/Tooltip";
import DisplayForm from "./DisplayForm";
import pencilIcon from "./pencil.svg";
import downloadIMG from "Assets/svg/install.svg";
import emailIMG from "Assets/svg/email_icon.svg";
//import documentIMG from "Assets/svg/document_16.svg";
import "./styles.scss";

export class TaskNode extends Component {
  static propTypes = {
    nodeConfig: PropTypes.object.isRequired,
    step: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    taskActions: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired
  };

  static defaultProps = {
    nodeConfig: {}
  };

  state = {};

  handleOnActivityClick = () => {
    this.props.workflowExecutionActiveNodeActions.updateActiveNode({
      workflowId: this.props.diagramEngine.id,
      nodeId: this.props.node.id
    });
  };

  //need to create a save function where we make change to global state
  handleOnSave = inputs => {
    this.props.workflowRevisionActions.updateNode({ nodeId: this.props.node.id, inputs });
    this.forceUpdate();
  };

  handleOnDelete = () => {
    /*
        want to delete the node in state and then remove it from the diagram
    */
    this.props.workflowRevisionActions.deleteNode({ nodeId: this.props.node.id });
    this.props.node.remove();
  };

  /*
      TODO:
        essentially what we want to do is put a switch statement on the task.config.name property
        if it is an empty name then we can display the default name from the pallet
        otherwise if the user has filled something in, then we can populate it with that
        given name 
  */

  //Object.keys(sellers.mergedSellerArray).length === 0

  determineNodeIcon() {
    let nodeIcon;
    if (this.props.task) {
      if (this.props.task.name === "Download File") {
        nodeIcon = downloadIMG;
      } else if (this.props.task.name === "Send Mail") {
        nodeIcon = emailIMG;
      } else if (this.props.task.name === "Ingest CSV") {
        nodeIcon = downloadIMG;
      } else {
        nodeIcon = emailIMG;
      }
    } else {
      nodeIcon = emailIMG;
    }

    return nodeIcon;
  }

  renderDeleteNode() {
    if (!this.props.diagramEngine.diagramModel.locked) {
      return <CloseModalButton className="b-taskNode__delete" onClick={this.handleOnDelete} />;
    }
    return null;
  }

  renderConfigureNode() {
    const { nodeConfig, task } = this.props;
    if (!this.props.diagramEngine.diagramModel.locked) {
      return (
        <Modal
          ModalTrigger={() => <img src={pencilIcon} className="b-taskNode__edit" alt="Task node type" />}
          modalContent={(closeModal, ...rest) => (
            <ModalFlow
              headerTitle={task.name}
              components={[{ step: 0, component: DisplayForm }]}
              closeModal={closeModal}
              confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
              config={this.props.nodeConfig}
              onSave={this.handleOnSave}
              theme={"bmrg-white"}
              task={task}
              nodeConfig={nodeConfig}
              {...rest}
            />
          )}
        />
      );
    }
    return null;
  }

  render() {
    const { flowTaskStatus } = this.props.step;

    return (
      <div className="c-taskNode" onClick={this.handleOnActivityClick}>
        <div className={classnames("b-taskNode", `--${flowTaskStatus}`)}>
          <div className="b-taskNode__progress-bar" />
          <Tooltip className="custom-node-toolTip" place="left" id={this.props.node.id}>
            {this.props.task ? this.props.task.description : "Task description"}
          </Tooltip>
          <div className="b-taskNode__tile" data-tip data-for={this.props.node.id}>
            {this.props.task ? this.props.task.name : "Task"}
          </div>

          <PortWidget className="b-taskNode-port --left" name="left" node={this.props.node} />
          <PortWidget className="b-taskNode-port --right" name="right" node={this.props.node} />
          {this.renderDeleteNode()}
          <img src={this.determineNodeIcon()} className="b-taskNode__img" alt="Task node type" />
          {this.renderConfigureNode()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    step: state.workflowExecution.data.length
      ? state.workflowExecution.data.steps.find(step => step.taskId === ownProps.node.id)
      : ""
  };
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch),
  workflowExecutionActiveNodeActions: bindActionCreators(workflowExecutionActiveNodeActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskNode);
