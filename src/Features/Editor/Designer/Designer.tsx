import React from "react";
import { Helmet } from "react-helmet";
import { UseQueryResult } from "react-query";
import cx from "classnames";
import { SkeletonPlaceholder, SkeletonText } from "@carbon/react";
import { DelayedRender, Error } from "@boomerang-io/carbon-addons-boomerang-react";
import Notes from "./Notes";
import Tasks from "./Tasks";
import { TaskTemplateStatus, QueryStatus } from "Constants";
import { TaskTemplate, WorkflowRevision } from "Types";
import styles from "./designer.module.scss";
import ReactFlow from "Features/Reactflow";

interface DesignerContainerProps {
  isModalOpen: boolean;
  notes: string;
  updateNotes: ({ markdown }: { markdown: string }) => void;
  revisionQuery: UseQueryResult<WorkflowRevision, unknown>;
  tasks: Array<TaskTemplate>;
  workflowName: string;
}

const DesignerContainer: React.FC<DesignerContainerProps> = ({
  isModalOpen,
  notes,
  updateNotes,
  revisionQuery,
  tasks,
  workflowName,
}) => {
  const isRevisionLoading = revisionQuery.status === QueryStatus.Loading;
  console.log({ revisionQuery })
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{`Workflow - ${workflowName}`}</title>
      </Helmet>
      <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      {isRevisionLoading ? (
        <WorkflowSkeleton />
      ) : revisionQuery.error ? (
        <Error />
      ) : (
        <>
          <Designer isModalOpen={isModalOpen} revision={revisionQuery.data} />
          <Notes markdown={notes} updateNotes={updateNotes} />
        </>
      )}
    </div>
  );
};

export default DesignerContainer;

interface DesignerProps {
  isModalOpen: boolean;
  revision?: WorkflowRevision
}

function Designer({ revision, isModalOpen }: DesignerProps) {
  return (
    <div id="workflow-dag-designer" className={styles.workflowContainer}>
      <ReactFlow mode="editor" diagram={{ nodes: revision?.nodes, edges: revision?.edges }} />
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
