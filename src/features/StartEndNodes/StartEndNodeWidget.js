import "./styles/styles.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { PortWidget } from "storm-react-diagrams";
import { Tile } from "carbon-components-react";
import classnames from "classnames";

class StartEndNodeWidget extends Component {
  render() {
    console.log("startEnd props");
    console.log(this.props);
    return (
      <div
        className={`${this.props.node.passed_name}-Node`}
        style={{
          position: "relative",
          width: 150,
          height: 100
        }}
      >
        <Tile className="startend-tile"> {this.props.node.passed_name} </Tile>

        {this.props.node.passed_name === "End" ? (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              top: 0
              //left: -8
            }}
          >
            <PortWidget className="srd-startend-port" name="left" node={this.props.node} />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              left: 150 - 15, //15 is width of the port widget
              top: 0
            }}
          >
            <PortWidget className="srd-startend-port" name="right" node={this.props.node} />
          </div>
        )}
      </div>
    );
  }
}

export default StartEndNodeWidget;
