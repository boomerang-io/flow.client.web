import React from "react";
import PropTypes from "prop-types";
import WorkflowLink from "Components/WorkflowLink";

//import styles from "./StartEndLink.module.scss";

StartEndLinkDesigner.propTypes = {
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

function StartEndLinkDesigner({ diagramEngine, model, path }) {
  return (
    <WorkflowLink diagramEngine={diagramEngine} model={model} path={path}>
      {() => <g />}
    </WorkflowLink>
  );
}

export default StartEndLinkDesigner;
