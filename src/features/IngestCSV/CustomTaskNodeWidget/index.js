import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "../../BodyWidget/reducer";
import { actions as nodeActions } from "../../BodyWidget/BodyWidgetContainer/reducer";
import { PortWidget } from "storm-react-diagrams";
import { Tile } from "carbon-components-react";
import Modal from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import DisplayForm from "../DisplayForm";
import pencilIcon from "./pencil.svg";
import "./styles.scss";

/**
 * TODO
 *  - clean up naming and folder structure, look at our best practices. Shouldn't have nested reducer
 *  - update css classnames to follow BEM style and have the styles be group together
 *  - define propTypes
 *  - look at the order of imports above - that is the general order that we follow
 */
const EditNode = () => <img src={pencilIcon} className="bmrg-pencil" />;

export class CustomTaskNodeWidget extends Component {
  state = {};

  //need to create a save function where we make change to global state
  handleOnSave = requestBody => {
    this.props.nodeActions.updateNode({ nodeId: this.props.node.id, requestBody });
  };

  render() {
    const { node, task } = this.props;
    return (
      <Tile className="ingestcsv-node">
        <div className="ingestcsv-tile">{this.props.node.taskName}</div>

        <PortWidget className="srd-custom-port --left" name="left" node={this.props.node} />
        <PortWidget className="srd-custom-port --right" name="right" node={this.props.node} />

        <Modal
          ModalTrigger={EditNode}
          modalContent={(closeModal, ...rest) => (
            <ModalFlow
              headerTitle="Download File"
              //headerSubtitle="It's not really mutiny..."
              components={[{ step: 0, component: DisplayForm }]}
              closeModal={closeModal}
              confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-black" }}
              config={this.props.state_node}
              onSave={this.handleOnSave}
              theme={"bmrg-white"}
              task={task}
              node={node}
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
    state_node: state.nodes.data.find(n => n.id === ownProps.node.taskId)
  };
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch),
  nodeActions: bindActionCreators(nodeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomTaskNodeWidget);
