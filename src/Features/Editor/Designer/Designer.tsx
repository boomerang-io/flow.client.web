import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { UseQueryResult } from "react-query";
import cx from "classnames";
import { DiagramWidget } from "@projectstorm/react-diagrams";
import { SkeletonPlaceholder, SkeletonText } from "@carbon/react";
import { DelayedRender, Error } from "@boomerang-io/carbon-addons-boomerang-react";
import WorkflowZoom from "Components/WorkflowZoom";
import Notes from "./Notes";
import Tasks from "./Tasks";
import { TaskTemplateStatus, QueryStatus } from "Constants";
import WorkflowDagEngine from "Utils/dag/WorkflowDagEngine";
import { TaskModel, WorkflowRevision } from "Types";
import styles from "./designer.module.scss";
import ReactFlow from "Features/Reactflow";

interface DesignerContainerProps {
  createNode: (workflowDagEngine: WorkflowDagEngine, event: React.DragEvent<HTMLDivElement>) => void;
  isModalOpen: boolean;
  notes: string;
  updateNotes: ({ markdown }: { markdown: string }) => void;
  revisionQuery: UseQueryResult<WorkflowRevision, unknown>;
  tasks: Array<TaskModel>;
  workflowDagEngine: WorkflowDagEngine | null;
  workflowName: string;
}

const DesignerContainer: React.FC<DesignerContainerProps> = ({
  createNode,
  isModalOpen,
  notes,
  updateNotes,
  revisionQuery,
  tasks,
  workflowDagEngine,
  workflowName,
}) => {
  const isRevisionLoading = revisionQuery.status === QueryStatus.Loading;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{`Workflow - ${workflowName}`}</title>
      </Helmet>
      <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      {isRevisionLoading || !workflowDagEngine ? (
        <WorkflowSkeleton />
      ) : revisionQuery.error ? (
        <Error />
      ) : (
        <>
          <Designer isModalOpen={isModalOpen} />
          <Notes markdown={notes} updateNotes={updateNotes} />
        </>
      )}
    </div>
  );
};

export default DesignerContainer;

interface DesignerProps {
  isModalOpen: boolean;
}

const Designer: React.FC<DesignerProps> = ({ isModalOpen }) => {
  return (
    <div id="workflow-dag-designer" className={styles.workflowContainer}>
      <ReactFlow mode="editor" diagram={{ nodes: [], edges: [] }} />
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
