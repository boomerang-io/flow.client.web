import React, { Component } from "react";
import PropTypes from "prop-types";
import { PortWidget } from "@projectstorm/react-diagrams";
import classnames from "classnames";
import "./styles.scss";

class StartEndNode extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired
  };
  render() {
    return (
      <div className="b-startEnd-node">
        <div className="b-startEnd-node__title"> {this.props.node.passedName} </div>
        {this.props.node.passedName === "End" ? (
          <PortWidget className={classnames("b-startEnd-node__port", "--left")} name="left" node={this.props.node} />
        ) : (
          <PortWidget className={classnames("b-startEnd-node__port", "--right")} name="right" node={this.props.node} />
        )}
      </div>
    );
  }
}

export default StartEndNode;
