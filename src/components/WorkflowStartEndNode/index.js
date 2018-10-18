import React, { Component } from "react";
import PropTypes from "prop-types";
import { PortWidget } from "@boomerang/boomerang-dag";
import { Tile } from "carbon-components-react";
import classnames from "classnames";
import "./styles.scss";

class StartEndNodeWidget extends Component {
  render() {
    //console.log("startEnd props");
    //console.log(this.props);
    return (
      <div className={`${this.props.node.passedName}-Node`}>
        <Tile className="startend-tile"> {this.props.node.passedName} </Tile>
        {this.props.node.passedName === "Finish" ? (
          <PortWidget className={classnames("srd-custom-port", "--left")} name="left" node={this.props.node} />
        ) : (
          <PortWidget className={classnames("srd-custom-port", "--right")} name="right" node={this.props.node} />
        )}
      </div>
    );
  }
}

export default StartEndNodeWidget;
