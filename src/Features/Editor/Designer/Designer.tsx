import React from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router-dom";
import ReactFlow from "Features/Reactflow";
import Notes from "./Notes";
import Tasks from "./Tasks";
import cx from "classnames";
import { appLink } from "Config/appConfig";
import { TaskTemplateStatus } from "Constants";
import type { ReactFlowInstance } from "reactflow";
import { TaskTemplate, WorkflowEditorState } from "Types";
import styles from "./designer.module.scss";

interface DesignerContainerProps {
  notes?: string;
  reactFlowInstance: ReactFlowInstance;
  setReactFlowInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
  tasks: Array<TaskTemplate>;
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
    appLink.editorDesigner({ team: params.team, workflowId: params.workflowId }) === location.pathname;

  return (
    <div className={cx(styles.container, { [styles.hidden]: !isOnDesignerPath })}>
      <Helmet>
        <title>{`Workflow - ${workflow.name}`}</title>
      </Helmet>
      <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      <>
        <div id="workflow-dag-designer" className={styles.workflowContainer}>
          <ReactFlow
            mode="editor"
            nodes={workflow.nodes}
            edges={workflow.edges}
            reactFlowInstance={reactFlowInstance}
            setReactFlowInstance={setReactFlowInstance}
          />
        </div>
        <Notes markdown={notes} updateNotes={updateNotes} />
      </>
    </div>
  );
};

export default DesignerContainer;
