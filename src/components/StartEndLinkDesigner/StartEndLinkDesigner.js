import React from "react";
import PropTypes from "prop-types";
import WorkflowLink from "Components/WorkflowLink";
import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import styles from "./StartEndLink.module.scss";

// Only created by a start node as an end node doesn't create links by definition
const StartEndLinkDesigner = React.memo(function StartEndLinkDesigner({ diagramEngine, model, path }) {
  return (
    <WorkflowLink diagramEngine={diagramEngine} model={model} path={path}>
      {({ halfwayPoint, handleOnDelete }) => (
        <g transform={`translate(${halfwayPoint.x - 12}, ${halfwayPoint.y - 12})`}>
          <WorkflowCloseButton onClick={handleOnDelete} />
        </g>
      )}
    </WorkflowLink>
  );
});

StartEndLinkDesigner.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default StartEndLinkDesigner;
