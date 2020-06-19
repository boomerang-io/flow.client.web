import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { DelayedRender, Error, SkeletonPlaceholder, SkeletonText } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowZoom from "Components/WorkflowZoom";
import Tasks from "./Tasks";
import cx from "classnames";
import { QueryStatus } from "Constants";
import { TaskTemplateStatus } from "Constants";
import styles from "./designer.module.scss";

DesignerContainer.propTypes = {
  createNode: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  revisionQuery: PropTypes.object.isRequired,
  summaryData: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default function DesignerContainer({
  createNode,
  isModalOpen,
  revisionQuery,
  summaryData,
  tasks,
  workflowDagEngine,
}) {
  const isRevisionLoading = revisionQuery.status === QueryStatus.Loading;

  return (
    <div className={styles.container}>
      <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      {isRevisionLoading || !workflowDagEngine ? (
        <WorkflowSkeleton />
      ) : revisionQuery.error ? (
        <Error />
      ) : (
        <Designer
          createNode={createNode}
          isModalOpen={isModalOpen}
          summaryData={summaryData}
          workflowDagEngine={workflowDagEngine}
        />
      )}
    </div>
  );
}

function Designer({ createNode, isModalOpen, summaryData, workflowDagEngine }) {
  const workflowDagRef = useRef();
  useEffect(() => {
    workflowDagEngine.getDiagramEngine().zoomToFit();
  }, [workflowDagEngine]);

  const workflowDagBoundingClientRect = workflowDagRef.current ? workflowDagRef.current.getBoundingClientRect() : {};
  return (
    <div
      id="workflow-dag-designer"
      className={styles.workflowContainer}
      onDrop={(event) => createNode(workflowDagEngine, event)}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      ref={workflowDagRef}
    >
      <WorkflowZoom
        workflowDagEngine={workflowDagEngine}
        workflowDagBoundingClientRect={workflowDagBoundingClientRect}
      />
      <DiagramWidget
        allowCanvasTranslation={!isModalOpen}
        allowCanvasZoom={!isModalOpen}
        className={styles.diagram}
        deleteKeys={[]}
        diagramEngine={workflowDagEngine.getDiagramEngine()}
        maxNumberPointsPerLink={0}
      />
    </div>
  );
}

function WorkflowSkeleton() {
  return (
    <div className={cx(styles.designer, styles.loading)}>
      <div className={styles.loadingContainer}>
        <DelayedRender>
          <SkeletonPlaceholder className={styles.loadingStartNode} />
          <SkeletonText className={styles.loadingEdge} />
          <SkeletonPlaceholder className={styles.loadingTaskNode} />
          <SkeletonText className={styles.loadingEdge} />
          <SkeletonPlaceholder className={styles.loadingStartNode} />
          <SkeletonText className={styles.loadingEdge} />
          <SkeletonPlaceholder className={styles.loadingStartNode} />
        </DelayedRender>
      </div>
    </div>
  );
}
