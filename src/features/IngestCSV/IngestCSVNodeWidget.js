import "./styles/styles.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { PortWidget } from "storm-react-diagrams";
import { Tile } from "carbon-components-react";

import Modal from "@boomerang/boomerang-components/lib/Modal";
import pencilIcon from "../../img/pencil.svg";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as taskActions } from "../demo-drag-and-drop/reducer";

const AboutPlatformLI = () => <img src={pencilIcon} />;

export class IngestCSVNodeWidget extends Component {
  state = {};

  static defaultProps = {
    size: 125,
    node: null
    //title: "ingest csv"
  };

  render() {
    console.log(this.props.node.taskId);
    return (
      <div
        className={"ingestcsv-node"}
        style={{
          position: "relative",
          width: this.props.size,
          height: this.props.size
        }}
      >
        <Tile className="ingestcsv-tile"> {this.props.taskName} </Tile>
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: this.props.size / 2 - 8,
            left: -8
          }}
        >
          <PortWidget name="left" node={this.props.node} />
        </div>
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            left: this.props.size - 8,
            top: this.props.size / 2 - 8
          }}
        >
          <PortWidget name="right" node={this.props.node} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { task: state.tasks.filter(task => task.id === ownProps.node.id) };
};

const mapDispatchToProps = dispatch => ({
  taskActions: bindActionCreators(taskActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IngestCSVNodeWidget);
