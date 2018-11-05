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
import downloadIMG from "Assets/svg/install.svg";
import emailIMG from "Assets/svg/email_icon.svg";
//import documentIMG from "Assets/svg/document_16.svg";
import "./styles.scss";

/**
 * TODO
 *  - clean up naming and folder structure, look at our best practices. Shouldn't have nested reducer
 *  - update css classnames to follow BEM style and have the styles be group together
 *  - define propTypes
 *  - look at the order of imports above - that is the general order that we follow
 */
export class TaskNode extends Component {
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

  render() {
    const { nodeConfig, task } = this.props;

    // //grab the name property of config
    // let specified_name = "";
    // for (var key in this.props.nodeConfig.config) {
    //   if (key.includes("Name")) {
    //     specified_name = key;
    //   }
    // }

    let img_to_render;
    if (this.props.task) {
      if (this.props.task.name === "Download File") {
        img_to_render = downloadIMG;
      } else if (this.props.task.name === "Send Mail") {
        img_to_render = emailIMG;
      } else if (this.props.task.name === "Ingest CSV") {
        img_to_render = downloadIMG;
      } else {
        img_to_render = emailIMG;
      }
    } else {
      img_to_render = emailIMG;
    }

    return (
      <div className="b-taskNode">
        <Tooltip className="custom-node-toolTip" place="left" id={this.props.node.id}>
          {this.props.task ? this.props.task.description : "placeholder"}
        </Tooltip>
        <div className="b-taskNode__tile" data-tip data-for={this.props.node.id}>
          {this.props.task ? this.props.task.name : "placeholder"}
        </div>

        {
          //Object.keys(this.props.nodeConfig.config).length === 0 ? (
          //   <div className="task-node__tile" data-tip data-for={this.props.node.id}>
          //     {this.props.task.name}
          //   </div>
          // ) : (
          //   <div className="task-node__tile" data-tip data-for={this.props.node.id}>
          //     {this.props.nodeConfig.config[specified_name]}
          //   </div>
          // )}
        }

        <PortWidget className="b-taskNode-port --left" name="left" node={this.props.node} />
        <PortWidget className="b-taskNode-port --right" name="right" node={this.props.node} />
        {!this.props.diagramEngine.diagramModel.locked && (
          <CloseModalButton
            className="b-taskNode__delete"
            onClick={this.handleOnDelete}
            //closemodal={() => <div>closemodal</div>}
          />
        )}
        <img src={img_to_render} className="b-taskNode__img" alt="Task node type" />
        {!this.props.diagramEngine.diagramModel.locked && (
          <Modal
            ModalTrigger={() => <img src={pencilIcon} className="b-taskNode__edit" alt="Task node type" />}
            modalContent={(closeModal, ...rest) => (
              <ModalFlow
                headerTitle={task.name}
                components={[{ step: 0, component: DisplayForm }]}
                closeModal={closeModal}
                confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
                onSave={this.handleOnSave}
                theme={"bmrg-white"}
                task={task}
                nodeConfig={nodeConfig}
                {...rest}
              />
            )}
          />
        )}
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
)(TaskNode);
