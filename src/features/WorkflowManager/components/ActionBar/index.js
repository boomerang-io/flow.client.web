import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import NavigateBack from "Components/NavigateBack";
import Button from "@boomerang/boomerang-components/lib/Button";
import minusIcon from "./assets/minus";
import plusIcon from "./assets/plus";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";
//import "carbon-components/scss/components/tabs/_tabs.scss";

/*function to add add/subtract to the zoom level*/

class ActionBar extends Component {
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
      <>
        <div className="c-navigation-bar">
          <NavigateBack to="/viewer" text={"Back to Workflows"} />
        </div>
        <div className="c-action-bar">
          {
            //<TextInput theme="bmrg-blue" />
          }
          <div className="b-action-bar-links">
            <NavLink
              className="b-action-bar-links__link"
              activeClassName="--active"
              to={`${this.props.match.url}/overview`}
            >
              Overview
            </NavLink>
            <NavLink
              className="b-action-bar-links__link"
              activeClassName="--active"
              to={`${this.props.match.url}/designer`}
            >
              Design
            </NavLink>
            <NavLink
              className="b-action-bar-links__link"
              activeClassName="--active"
              to={`${this.props.match.url}/changes`}
            >
              Change Log
            </NavLink>
          </div>
          <div className="b-action-bar-actions">
            <Button className="b-action-bar-actions__zoom" onClick={this.handleZoomDecrease}>
              <img src={minusIcon} />
            </Button>
            <Button className="b-action-bar-actions__zoom" onClick={this.handleZoomIncrease}>
              <img src={plusIcon} />
            </Button>
            <Button theme="bmrg-black" onClick={this.props.onClick} style={{ marginLeft: "2rem" }}>
              {this.props.actionButtonText}
            </Button>
          </div>
        </div>
      </>
    );
  }
}

ActionBar.propTypes = {
  actionButtonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default withRouter(ActionBar);
