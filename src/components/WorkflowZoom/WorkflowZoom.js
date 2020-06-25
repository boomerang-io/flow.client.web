import React from "react";
import PropTypes from "prop-types";
import { ZoomIn16, ZoomOut16 } from "@carbon/icons-react";
import styles from "./WorkflowZoom.module.scss";

WorkflowZoom.propTypes = {
  workflowDagEngine: PropTypes.object.isRequired,
  workflowDagBoundingClientRect: PropTypes.object.isRequired,
};

export default function WorkflowZoom({ workflowDagEngine, workflowDagBoundingClientRect }) {
  function handleZoomChange(zoomDelta) {
    const diagramModel = workflowDagEngine.getDiagramEngine().getDiagramModel();
    const oldZoomFactor = diagramModel.getZoomLevel() / 100;

    if (diagramModel.getZoomLevel() + zoomDelta > 10) {
      diagramModel.setZoomLevel(diagramModel.getZoomLevel() * zoomDelta);
    }

    const zoomFactor = diagramModel.getZoomLevel() / 100;
    const boundingRect = workflowDagBoundingClientRect;
    const clientWidth = boundingRect.width;
    const clientHeight = boundingRect.height;

    // compute difference between rect before and after
    const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
    const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;

    // compute coords relative to diagram canvas
    const clientX = Math.round(boundingRect.left * 2);
    const clientY = Math.round(boundingRect.top * 2);

    // compute width and height increment factor
    const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
    const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

    diagramModel.setOffset(
      diagramModel.getOffsetX() - widthDiff * xFactor,
      diagramModel.getOffsetY() - heightDiff * yFactor
    );

    workflowDagEngine.getDiagramEngine().enableRepaintEntities([]);
    workflowDagEngine.diagramEngine.repaintCanvas();
  }

  function handleZoomIncrease() {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        handleZoomChange(1.0015);
      }, 0);
    }
  }

  function handleZoomDecrease() {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        handleZoomChange(0.9985);
      }, 0);
    }
  }

  return (
    <div className={styles.zoomIcons}>
      <button className={styles.zoomButton} onClick={handleZoomDecrease}>
        <ZoomOut16 className={styles.zoomIcon} />
      </button>
      <button className={styles.zoomButton} onClick={handleZoomIncrease}>
        <ZoomIn16 className={styles.zoomIcon} />
      </button>
    </div>
  );
}
