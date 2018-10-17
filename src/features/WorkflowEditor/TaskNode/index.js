import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "State/tasks";
import { actions as nodeActions } from "State/nodes";
import { PortWidget } from "storm-react-diagrams";
import { Tile } from "carbon-components-react";
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
const EditNode = () => <img src={pencilIcon} className="bmrg-pencil" alt="Task node type" />;

export class TaskNode extends Component {
  static defaultProps = {
    stateNode: {}
  };

  state = {};

  //need to create a save function where we make change to global state
  handleOnSave = config => {
    this.props.nodeActions.updateNode({ nodeId: this.props.node.id, config: config });
    this.forceUpdate();
  };

  handleOnDelete = () => {
    /*
        want to delete the node in state and then remove it from the diagram
    */
    this.props.nodeActions.deleteNode({ nodeId: this.props.node.id });
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
    console.log(this.props);
    console.log(this.props.task.description);
    const { stateNode, task } = this.props;

    //grab the name property of config
    let specified_name = "";
    for (var key in this.props.stateNode.config) {
      if (key.includes("Name")) {
        specified_name = key;
      }
    }

    let img_to_render;
    if (this.props.task.name === "Download File") {
      img_to_render = downloadIMG;
    } else if (this.props.task.name === "Send Mail") {
      img_to_render = emailIMG;
    } else if (this.props.task.name === "Ingest CSV") {
      img_to_render = downloadIMG;
    } else {
      img_to_render = emailIMG;
    }

    return (
      <Tile className="ingestcsv-node">
        <Tooltip className="custom-node-toolTip" place="left" id={this.props.node.id}>
          {this.props.task.description}
        </Tooltip>

        {Object.keys(this.props.stateNode.config).length === 0 ? (
          <div className="ingestcsv-tile" data-tip data-for={this.props.node.id}>
            {this.props.task.name}
          </div>
        ) : (
          <div className="ingestcsv-tile" data-tip data-for={this.props.node.id}>
            {this.props.stateNode.config[specified_name]}
          </div>
        )}

        <PortWidget className="srd-custom-port --left" name="left" node={this.props.node} />
        <PortWidget className="srd-custom-port --right" name="right" node={this.props.node} />
        <CloseModalButton
          className="bmrg-deleteNode"
          onClick={this.handleOnDelete}
          //closemodal={() => <div>closemodal</div>}
        />
        <img src={img_to_render} className="ingestcsv-img" alt="Task node type" />
        <Modal
          ModalTrigger={EditNode}
          modalContent={(closeModal, ...rest) => (
            <ModalFlow
              headerTitle={task.name}
              components={[{ step: 0, component: DisplayForm }]}
              closeModal={closeModal}
              confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
              config={this.props.stateNode}
              onSave={this.handleOnSave}
              theme={"bmrg-white"}
              task={task}
              node={stateNode}
              {...rest}
            />
          )}
        />
      </Tile>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    stateNode: state.nodes.entities[ownProps.node.id]
  };
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch),
  nodeActions: bindActionCreators(nodeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskNode);
