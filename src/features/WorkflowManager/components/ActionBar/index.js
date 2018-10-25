import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "carbon-components-react";
import NavigateBack from "Components/NavigateBack";
import Button from "@boomerang/boomerang-components/lib/Button";
//import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import "./styles.scss";
//import "carbon-components/scss/components/tabs/_tabs.scss";

let handleZoomIncrease = diagramApp => {
  diagramApp.getDiagramEngine().getDiagramModel().zoom += 10;
  diagramApp.diagramEngine.repaintCanvas();
};

let handleZoomDecrease = diagramApp => {
  diagramApp.getDiagramEngine().getDiagramModel().zoom -= 10;
  diagramApp.diagramEngine.repaintCanvas();
};

ActionBar.propTypes = {
  actionButtonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

/*function to add add/subtract to the zoom level*/

function ActionBar({ onClick, actionButtonText, diagramApp }) {
  return (
    <div className="c-action-bar">
      <NavigateBack to="/viewer" text={"Back to Workflows"} className="c-action-bar--navigate_back" />
      {
        //<TextInput theme="bmrg-blue" />
      }
      <Tabs>
        <Tab label="Overview">
          <div className="some-content" />
        </Tab>
        <Tab label="Design">
          <div className="some-content" />
        </Tab>
        <Tab label="Parameters">
          <div className="some-content" />
        </Tab>
        <Tab label="Change Log">
          <div className="some-content" />
        </Tab>
      </Tabs>
      <Button theme="bmrg-white" onClick={() => handleZoomIncrease(diagramApp)} className="c-action-bar--zoom_increase">
        +
      </Button>
      <Button theme="bmrg-white" onClick={() => handleZoomDecrease(diagramApp)} className="c-action-bar--zoom_decrease">
        -
      </Button>
      <Button theme="bmrg-black" onClick={onClick}>
        {actionButtonText}
      </Button>
    </div>
  );
}

export default ActionBar;
