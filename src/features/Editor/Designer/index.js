import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { SkeletonPlaceholder, SkeletonText } from "@boomerang/carbon-addons-boomerang-react";
import WorkflowZoom from "Components/WorkflowZoom";
import Tasks from "./Tasks";
import cx from "classnames";
import WorkflowDagEngine from "Utilities/dag/WorkflowDagEngine";
import { QueryStatus } from "Constants";
import { TaskTemplateStatus } from "Constants/taskTemplateStatuses";
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
  revisionState,
  setWorkflowDagEngine,
  summaryData,
  tasks,
  workflowDagEngine,
}) {
  const isRevisionLoading = revisionQuery.status === QueryStatus.Loading;

  const { revisionCount } = summaryData;
  const { version } = revisionState;
  const isLocked = version < revisionCount;

  useEffect(() => {
    const newWorkflowDagEngine = new WorkflowDagEngine({ dag: revisionState.dag, isLocked });
    setWorkflowDagEngine(newWorkflowDagEngine);
    newWorkflowDagEngine.getDiagramEngine().repaintCanvas();

    // really and truly only want to remount this on version change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked, revisionState.version]);

  return (
    <div className={styles.container}>
      <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      {isRevisionLoading || !workflowDagEngine ? (
        <WorkflowSkeleton />
      ) : (
        <Designer
          createNode={createNode}
          isModalOpen={isModalOpen}
          revisionState={revisionState}
          setWorkflowDagEngine={setWorkflowDagEngine}
          summaryData={summaryData}
          workflowDagEngine={workflowDagEngine}
        />
      )}
    </div>
  );
}

function Designer({ createNode, isModalOpen, revisionState, summaryData, workflowDagEngine }) {
  const workflowDagRef = useRef();
  const workflowDagBoundingClientRect = workflowDagRef.current ? workflowDagRef.current.getBoundingClientRect() : {};
  return (
    <div
      id="workflow-dag-designer"
      className={styles.designer}
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
        <SkeletonPlaceholder className={styles.loadingStartNode} />
        <SkeletonText className={styles.loadingEdge} />
        <SkeletonPlaceholder className={styles.loadingTaskNode} />
        <SkeletonText className={styles.loadingEdge} />
        <SkeletonPlaceholder className={styles.loadingStartNode} />
        <SkeletonText className={styles.loadingEdge} />
        <SkeletonPlaceholder className={styles.loadingStartNode} />
      </div>
    </div>
  );
}
