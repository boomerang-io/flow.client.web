import React from "react";
import { Helmet } from "react-helmet";
import Notes from "./Notes";
import Tasks from "./Tasks";
import { TaskTemplateStatus } from "Constants";
import ReactFlow from "Features/Reactflow";
import { TaskTemplate, WorkflowCanvasState } from "Types";
import type { ReactFlowInstance } from "reactflow";
import styles from "./designer.module.scss";

interface DesignerContainerProps {
  notes?: string;
  updateNotes: ({ markdown }: { markdown: string }) => void;
  workflow: WorkflowCanvasState;
  tasks: Array<TaskTemplate>;
  setWorkflow: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
}

const DesignerContainer: React.FC<DesignerContainerProps> = ({ notes, updateNotes, workflow, setWorkflow, tasks }) => {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{`Workflow - ${workflow.name}`}</title>
      </Helmet>
      <Tasks tasks={tasks.filter((task) => task.status === TaskTemplateStatus.Active)} />
      <>
        <div id="workflow-dag-designer" className={styles.workflowContainer}>
          <ReactFlow mode="editor" nodes={workflow.nodes} edges={workflow.edges} setWorkflow={setWorkflow} />
        </div>
        <Notes markdown={notes} updateNotes={updateNotes} />
      </>
    </div>
  );
};

export default DesignerContainer;
