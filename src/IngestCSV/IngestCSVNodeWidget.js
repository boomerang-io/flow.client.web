import "../styles/variables.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { PortWidget } from "storm-react-diagrams";

import { Tile } from "carbon-components-react";

export class IngestCSVNodeWidget extends Component {
  state = {};

  static defaultProps = {
    size: 125,
    node: null
    //title: "ingest csv"
  };

  render() {
    return (
      <div
        className={"ingestcsv-node"}
        style={{
          position: "relative",
          width: this.props.size,
          height: this.props.size,
          background: "purple"
        }}
      >
        <Tile> Ingest CSV </Tile>
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
