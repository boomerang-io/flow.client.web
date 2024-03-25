import React from "react";
import cx from "classnames";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router-dom";
import type { ReactFlowInstance } from "reactflow";
import ReactFlow from "Features/Reactflow";
import { TaskTemplateStatus, WorkflowEngineMode } from "Constants";
import { appLink } from "Config/appConfig";
import { Task, WorkflowEditorState } from "Types";
import Notes from "./Notes";
import TaskList from "./Tasks";
import styles from "./designer.module.scss";

interface DesignerContainerProps {
  notes?: string;
  reactFlowInstance: ReactFlowInstance | null;
  setReactFlowInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
  tasks: Array<Task>;
  updateNotes: (markdown: string) => void;
  workflow: WorkflowEditorState;
}

const DesignerContainer: React.FC<DesignerContainerProps> = ({
  notes,
  reactFlowInstance,
  setReactFlowInstance,
  tasks,
  updateNotes,
  workflow,
}) => {
  const params = useParams<{ team: string; workflowId: string }>();

  const location = useLocation();
  const isOnDesignerPath =
    appLink.editorCanvas({ team: params.team, workflowId: params.workflowId }) === location.pathname;

  return (
    <div className={cx(styles.container, { [styles.hidden]: !isOnDesignerPath })}>
      <Helmet>
        <title>{`Workflow - ${workflow.name}`}</title>
      </Helmet>
      <TaskList tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      <>
        <div id="workflow-dag-designer" className={styles.workflowContainer}>
          <ReactFlow
            mode={WorkflowEngineMode.Editor}
            nodes={workflow.nodes}
            edges={workflow.edges}
            reactFlowInstance={reactFlowInstance!}
            setReactFlowInstance={setReactFlowInstance}
          />
        </div>
        <Notes markdown={notes} updateNotes={updateNotes} />
      </>
    </div>
  );
};

export default DesignerContainer;
