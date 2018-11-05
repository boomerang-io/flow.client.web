import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@boomerang/boomerang-components/lib/Button";
import minusIcon from "./assets/minus";
import plusIcon from "./assets/plus";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";

/*function to add add/subtract to the zoom level*/

class ActionBar extends Component {
  static propTypes = {
    actionButtonText: PropTypes.string.isRequired,
    includeZoom: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    includeZoom: false
  };

  constructor(props) {
    super(props);
    this.diagramApp = props.diagramApp;
  }

  handleZoomIncrease = () => {
    this.diagramApp.getDiagramEngine().getDiagramModel().zoom += 10;
    this.diagramApp.diagramEngine.repaintCanvas();
  };

  handleZoomDecrease = () => {
    this.diagramApp.getDiagramEngine().getDiagramModel().zoom -= 10;
    this.diagramApp.diagramEngine.repaintCanvas();
  };

  render() {
    return (
      <div className="c-action-bar">
        <div className="b-action-bar">
          {this.props.includeZoom && [
            <Button className="b-action-bar__zoom" onClick={this.handleZoomDecrease} key="out">
              <img src={minusIcon} alt="Zoom out" />
            </Button>,
            <Button className="b-action-bar__zoom" onClick={this.handleZoomIncrease} key="in">
              <img src={plusIcon} alt="Zoom in" />
            </Button>
          ]}
          <Button theme="bmrg-black" onClick={this.props.onClick} style={{ marginLeft: "2rem" }}>
            {this.props.actionButtonText}
          </Button>
        </div>
      </div>
    );
  }
}

export default ActionBar;
