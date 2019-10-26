import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./WorkflowLink.module.scss";

WorkflowLink.propTypes = {
  children: () => {},
  diagramEngine: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

function WorkflowLink({ diagramEngine, model, children, className, path }) {
  let halfwayPoint = "";
  const pathRef = React.useRef();

  React.useEffect(() => {
    diagramEngine.repaintCanvas();
  }, [diagramEngine]);

  function handleOnDelete() {
    model.remove();
    diagramEngine.repaintCanvas();
  }

  const isModelLocked = diagramEngine.diagramModel.locked;

  if (pathRef.current) {
    halfwayPoint = pathRef.current.getPointAtLength(pathRef.current.getTotalLength() * 0.5);
  }

  return (
    <svg className={cx({ [styles.locked]: isModelLocked })}>
      {pathRef.current && model.targetPort && <>{children({ halfwayPoint, handleOnDelete })}</>}
      <path
        className={cx(styles.path, { [styles.locked]: isModelLocked }, className)}
        ref={pathRef}
        strokeWidth={model.width}
        d={path}
      />
    </svg>
  );
}

export default WorkflowLink;
