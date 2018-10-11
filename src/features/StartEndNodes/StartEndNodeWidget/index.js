import "./styles.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { PortWidget } from "storm-react-diagrams";
import { Tile } from "carbon-components-react";
import classnames from "classnames";

class StartEndNodeWidget extends Component {
  render() {
    //console.log("startEnd props");
    //console.log(this.props);
    return (
      <div className={`${this.props.node.passed_name}-Node`}>
        <Tile className="startend-tile"> {this.props.node.passed_name} </Tile>
        {this.props.node.passed_name === "Finish" ? (
          <PortWidget className={classnames("srd-custom-port", "--left")} name="left" node={this.props.node} />
        ) : (
          <PortWidget className={classnames("srd-custom-port", "--right")} name="right" node={this.props.node} />
        )}
      </div>
    );
  }
}

export default StartEndNodeWidget;
