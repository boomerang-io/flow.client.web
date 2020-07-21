import React, { useEffect, useRef } from "react";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { DelayedRender, Error, SkeletonPlaceholder, SkeletonText } from "@boomerang-io/carbon-addons-boomerang-react";
import WorkflowZoom from "Components/WorkflowZoom";
import Tasks from "./Tasks";
import cx from "classnames";
import { TaskTemplateStatus, QueryStatus } from "Constants";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { TaskModel } from "Types";
import styles from "./designer.module.scss";

interface DesignerContainerProps {
  createNode: (workflowDagEngine: WorkflowDagEngine, event: React.DragEvent<HTMLDivElement>) => void;
  isModalOpen: boolean;
  revisionQuery: { data: {}; status: string; error: Error };
  tasks: Array<TaskModel>;
  workflowDagEngine: WorkflowDagEngine;
}

const DesignerContainer: React.FC<DesignerContainerProps> = ({
  createNode,
  isModalOpen,
  revisionQuery,
  tasks,
  workflowDagEngine,
}) => {
  const isRevisionLoading = revisionQuery.status === QueryStatus.Loading;

  return (
    <div className={styles.container}>
      <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      {isRevisionLoading || !workflowDagEngine ? (
        <WorkflowSkeleton />
      ) : revisionQuery.error ? (
        <Error />
      ) : (
        <Designer createNode={createNode} isModalOpen={isModalOpen} workflowDagEngine={workflowDagEngine} />
      )}
    </div>
  );
};

export default DesignerContainer;

interface DesignerProps {
  createNode: (workflowDagEngine: WorkflowDagEngine, event: React.DragEvent<HTMLDivElement>) => void;
  isModalOpen: boolean;
  workflowDagEngine: WorkflowDagEngine;
}

const Designer: React.FC<DesignerProps> = ({ createNode, isModalOpen, workflowDagEngine }) => {
  const workflowDagRef = useRef<HTMLDivElement | null>(null);
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
};

function WorkflowSkeleton() {
  return (
    <div className={cx(styles.workflowContainer, styles.loading)}>
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
