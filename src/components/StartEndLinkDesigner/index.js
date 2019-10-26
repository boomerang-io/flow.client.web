import React from "react";
import PropTypes from "prop-types";
import WorkflowLink from "Components/WorkflowLink";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import styles from "./StartEndLink.module.scss";

StartEndLinkDesigner.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

function StartEndLinkDesigner({ diagramEngine, model, path }) {
  return (
    <WorkflowLink diagramEngine={diagramEngine} model={model} path={path}>
      {({ halfwayPoint, handleOnDelete }) => (
        <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`} xmlns="http://www.w3.org/2000/svg">
          <foreignObject width="24" height="24" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
            <WorkflowCloseButton kind="designer" onClick={handleOnDelete} xmlns="http://www.w3.org/1999/xhtml" />
          </foreignObject>
        </g>
      )}
    </WorkflowLink>
  );
}

export default StartEndLinkDesigner;
